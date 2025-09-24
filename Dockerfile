FROM node:16-alpine as build-stage


WORKDIR /react-app
COPY react-app/. .

ENV REACT_APP_BASE_URL=https://medley-8b6a473284eb.herokuapp.com/

# Add this to fix the OpenSSL error:


RUN npm install
RUN npm run build


# --- Stage 2: Run Flask App ---
FROM python:3.9-slim

# Install system dependencies (Debian uses apt)
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Flask environment setup
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True

WORKDIR /var/www

# Copy backend and frontend code
COPY . .
COPY --from=build-stage /react-app/build /var/www/app/static
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir psycopg2-binary

EXPOSE 8000

CMD gunicorn app:app
