FROM python:3.13-slim

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy entrypoint and make it executable
COPY entrypoint.sh /backend/entrypoint.sh
RUN chmod +x /backend/entrypoint.sh

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/backend
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /backend

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# RUN python manage.py migrate

EXPOSE 8000

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

CMD ["/backend/entrypoint.sh"]