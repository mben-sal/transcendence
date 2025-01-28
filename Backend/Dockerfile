FROM python:3.12

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install Pillow==10.1.0
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    libpq-dev \
    libjpeg-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install Pillow
RUN pip install python-dotenv

# Créer les répertoires nécessaires

COPY backend/ .

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]