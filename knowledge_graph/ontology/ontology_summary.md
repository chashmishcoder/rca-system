# Predictive Maintenance Ontology

## Overview
Cross-domain ontology for predictive maintenance covering manufacturing (AI4I) and transportation (MetroPT) domains.

## Statistics
- **Total Classes**: 35
- **Object Properties**: 17
- **Data Properties**: 25

## Core Class Hierarchy
```
Thing
├── Equipment
│   ├── ManufacturingEquipment
│   └── TransportationEquipment
├── Component
│   ├── Sensor
│   │   ├── TemperatureSensor
│   │   ├── PressureSensor
│   │   ├── CurrentSensor
│   │   ├── FlowSensor
│   │   └── PositionSensor
│   ├── Tool
│   ├── Compressor
│   ├── ElectricValve
│   └── Tower
├── Failure
│   ├── ToolWearFailure
│   ├── HeatDissipationFailure
│   ├── PowerFailure
│   ├── OverstrainFailure
│   └── RandomFailure
├── MaintenanceAction
│   ├── PreventiveMaintenance
│   ├── CorrectiveMaintenance
│   └── PredictiveMaintenance
└── Anomaly
    ├── StatisticalAnomaly
    ├── ThresholdAnomaly
    └── PatternAnomaly
```

## Key Relationships
- `hasComponent`: Equipment has components
- `hasSensor`: Equipment/Component has sensors
- `hasFailure`: Equipment experiences failure
- `causedBy`: Failure caused by component/anomaly
- `requiresMaintenance`: Failure requires maintenance
- `hasAnomaly`: Equipment has anomaly
- `precedes`: Anomaly precedes failure

## Domain-Specific Extensions
### Manufacturing Domain (AI4I)
- Quality types (Low, Medium, High)
- Tool wear monitoring
- Manufacturing process parameters

### Transportation Domain (MetroPT)
- Station and route management
- Operational modes
- GPS positioning
