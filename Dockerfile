FROM node:18 AS build-stage
WORKDIR /react-app
COPY react-app/. .
# You have to set this because it should be set during build time.
# Build our React App
RUN npm ci
ENV REACT_BASE_APP_URL=http://localhost:5000
# Workaround for OpenSSL error with older react-scripts on Node 17+
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build
FROM python:3.9-slim

# Setup Flask environment
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True
ENV PORT=8000
EXPOSE 8000

WORKDIR /var/www

# Install OS packages required to build native extensions (and libpq for psycopg2)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   build-essential \
	   libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

COPY . .

# Ensure static folder exists and copy React build contents into Flask static
RUN mkdir -p app/static
COPY --from=build-stage /react-app/build/ app/static/

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# Use the binary psycopg2 wheel to avoid compiling from source in most cases
RUN pip install psycopg2-binary

# Run with Gunicorn binding to all interfaces and port 8000
ENV PORT=8000
# Use shell form so $PORT is expanded at container start (Heroku sets PORT automatically)
CMD gunicorn --bind 0.0.0.0:${PORT} app:app --workers 3