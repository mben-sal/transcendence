FROM python:3.10-slim

WORKDIR /app

COPY requirement.txt .

RUN apt update -y
RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirement.txt
RUN pip install djangorestframework
RUN pip install django-cors-headers


COPY ./Django/ .

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]