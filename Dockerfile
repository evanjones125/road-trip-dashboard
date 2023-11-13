# use official python image as the base
FROM python:3.8-slim-buster

# establish working directory
WORKDIR /app

# copy the requirements into the container
COPY requirements.txt requirements.txt

# install build dependencies and packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    && \
    pip3 install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove \
    build-essential \
    libffi-dev \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# copy the application code into the container
COPY backend/ .

# expose the desired port
EXPOSE 8000

# run the application
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
