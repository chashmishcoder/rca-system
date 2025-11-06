FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p models data logs

# Expose port (Render.com will use $PORT)
EXPOSE 8000

# Health check (will use the dynamic PORT)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; import os; requests.get(f'http://localhost:{os.getenv(\"PORT\", 8000)}/api/health')"

# Run FastAPI server (use $PORT from environment or default to 8000)
CMD ["sh", "-c", "uvicorn rca_api:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
