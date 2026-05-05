"""MongoDB Atlas connection and collection helpers for RCA Dashboard.

Collections:
  - equipment        : equipment registry (eq-001 … eq-004 seeded at startup)
  - sensor_readings  : per-reading documents; TTL index expires after 24 hours
  - alerts           : anomaly alerts generated from sensor ingest
  - rca_results      : completed RCA workflow results
  - maintenance_tasks: open maintenance tasks derived from recommendations
  - maintenance_history: closed/completed maintenance records
"""

import os
import logging
from datetime import datetime, timezone
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, IndexModel
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Module-level singletons
# ---------------------------------------------------------------------------
_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


def get_db() -> AsyncIOMotorDatabase:
    """Return the cached database handle (must call init_db() first)."""
    if _db is None:
        raise RuntimeError("Database not initialised – call init_db() at startup.")
    return _db


async def init_db() -> AsyncIOMotorDatabase:
    """Connect to Atlas, create indexes, seed equipment, return db handle."""
    global _client, _db

    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise RuntimeError("MONGODB_URI not set in environment / .env file.")

    _client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=10_000)
    # Verify connectivity
    await _client.admin.command("ping")
    logger.info("MongoDB Atlas connected successfully.")

    db_name = os.getenv("MONGODB_DB", "rca_dashboard")
    _db = _client[db_name]

    await _create_indexes(_db)
    await _seed_equipment(_db)
    await seed_cost_config(_db)

    return _db


async def close_db() -> None:
    """Close the Atlas connection gracefully."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed.")


# ---------------------------------------------------------------------------
# Index setup
# ---------------------------------------------------------------------------

async def _create_indexes(db: AsyncIOMotorDatabase) -> None:
    # sensor_readings – TTL 24 hours
    await db.sensor_readings.create_indexes([
        IndexModel([("timestamp", ASCENDING)], expireAfterSeconds=86_400, name="ttl_24h"),
        IndexModel([("equipment_id", ASCENDING)], name="idx_sr_equipment"),
    ])

    # equipment
    await db.equipment.create_indexes([
        IndexModel([("equipment_id", ASCENDING)], unique=True, name="idx_eq_id"),
        IndexModel([("status", ASCENDING)], name="idx_eq_status"),
    ])

    # alerts
    await db.alerts.create_indexes([
        IndexModel([("equipment_id", ASCENDING)], name="idx_al_equipment"),
        IndexModel([("timestamp", DESCENDING)], name="idx_al_time"),
        IndexModel([("acknowledged", ASCENDING)], name="idx_al_ack"),
    ])

    # rca_results
    await db.rca_results.create_indexes([
        IndexModel([("workflow_id", ASCENDING)], unique=True, name="idx_rca_wf"),
        IndexModel([("equipment_id", ASCENDING)], name="idx_rca_equipment"),
        IndexModel([("created_at", DESCENDING)], name="idx_rca_time"),
    ])

    # maintenance_tasks
    await db.maintenance_tasks.create_indexes([
        IndexModel([("equipment_id", ASCENDING)], name="idx_mt_equipment"),
        IndexModel([("status", ASCENDING)], name="idx_mt_status"),
        IndexModel([("due_date", ASCENDING)], name="idx_mt_due"),
    ])

    # maintenance_history
    await db.maintenance_history.create_indexes([
        IndexModel([("equipment_id", ASCENDING)], name="idx_mh_equipment"),
        IndexModel([("completed_at", DESCENDING)], name="idx_mh_time"),
    ])

    # settings (cost config, etc.)
    await db.settings.create_indexes([
        IndexModel([("config_id", ASCENDING)], unique=True, name="idx_cfg_id"),
    ])

    logger.info("MongoDB indexes created / verified.")


# ---------------------------------------------------------------------------
# Equipment seed data
# ---------------------------------------------------------------------------

_DEFAULT_EQUIPMENT = [
    {
        "equipment_id": "eq-001",
        "name": "Pump A",
        "type": "pump",
        "location": "Zone 1 – Fluid Handling",
        "status": "operational",
        "health_score": 100.0,
        "last_maintenance": None,
        "installed_at": datetime(2022, 1, 15, tzinfo=timezone.utc).isoformat(),
    },
    {
        "equipment_id": "eq-002",
        "name": "Motor B",
        "type": "motor",
        "location": "Zone 2 – Drive Systems",
        "status": "operational",
        "health_score": 100.0,
        "last_maintenance": None,
        "installed_at": datetime(2021, 6, 20, tzinfo=timezone.utc).isoformat(),
    },
    {
        "equipment_id": "eq-003",
        "name": "Compressor C",
        "type": "compressor",
        "location": "Zone 3 – Pneumatics",
        "status": "operational",
        "health_score": 100.0,
        "last_maintenance": None,
        "installed_at": datetime(2023, 3, 10, tzinfo=timezone.utc).isoformat(),
    },
    {
        "equipment_id": "eq-004",
        "name": "Filter D",
        "type": "filter",
        "location": "Zone 1 – Fluid Handling",
        "status": "operational",
        "health_score": 100.0,
        "last_maintenance": None,
        "installed_at": datetime(2022, 9, 5, tzinfo=timezone.utc).isoformat(),
    },
]


async def _seed_equipment(db: AsyncIOMotorDatabase) -> None:
    """Insert default equipment records if they don't already exist."""
    for eq in _DEFAULT_EQUIPMENT:
        existing = await db.equipment.find_one({"equipment_id": eq["equipment_id"]})
        if not existing:
            await db.equipment.insert_one({**eq, "created_at": datetime.now(timezone.utc)})
            logger.info("Seeded equipment: %s", eq["equipment_id"])
        else:
            logger.debug("Equipment already exists: %s", eq["equipment_id"])


# ---------------------------------------------------------------------------
# Maintenance cost config seed
# ---------------------------------------------------------------------------

_DEFAULT_COST_CONFIG = {
    "config_id": "maintenance_costs",
    "costs": {
        "critical": 890,
        "high": 650,
        "medium": 320,
        "low": 180,
    },
    "currency": "USD",
}


async def seed_cost_config(db: AsyncIOMotorDatabase) -> dict:
    """Insert default maintenance cost config if not present; return current config."""
    existing = await db.settings.find_one({"config_id": "maintenance_costs"})
    if not existing:
        doc = {**_DEFAULT_COST_CONFIG, "created_at": datetime.now(timezone.utc)}
        await db.settings.insert_one(doc)
        logger.info("Seeded maintenance cost config.")
        return _DEFAULT_COST_CONFIG["costs"]
    return existing["costs"]


# ---------------------------------------------------------------------------
# Health score helper used by sensor ingest
# ---------------------------------------------------------------------------

def compute_health_score(ensemble_score: float, current_health: float) -> float:
    """Decay health score based on ensemble anomaly score (0–1).

    A score of 0 means no anomaly (health unchanged); 1.0 means critical
    (health decays by up to 10 points). Health is floored at 0.
    """
    decay = ensemble_score * 10.0
    return max(0.0, round(current_health - decay, 2))
