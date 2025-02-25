FROM python:3.13-slim

# Install dependencies (netcat for database wait script)
RUN apt-get update && apt-get install -y netcat-openbsd

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/backend
ENV PYTHONDONTWRITEBYTECODE=1

# Set working directory inside container
WORKDIR /backend

# Copy only the requirements file first (helps with caching layers)
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files separately
COPY backend /backend

# Ensure entrypoint script is executable
COPY entrypoint.sh /backend/entrypoint.sh
RUN chmod +x /backend/entrypoint.sh

# Expose Django's default port
EXPOSE 8000

# Start Django application
CMD ["/backend/entrypoint.sh"]
