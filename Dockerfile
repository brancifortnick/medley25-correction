FROM node:18-alpine AS build-stage
WORKDIR /react-app
COPY react-app/package*.json ./
# You have to set this because it should be set during build time.
# Build our React App
RUN npm install
COPY react-app/ ./
ENV REACT_APP_BASE_URL=http://localhost:5000
# Workaround for OpenSSL error with older react-scripts on Node 17+

RUN npm run build
FROM python:3.9

# Setup Flask environment
ENV FLASK_APP=app
ENV FLASK_ENV=production

EXPOSE 8000

WORKDIR /var/www
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir psycopg2-binary

COPY . .
COPY --from=build-stage /react-app/build/* app/static/

# Install Python Dependencies
RUN pip install -r requirements.txt
RUN pip install psycopg2

# Run flask environment
CMD gunicorn app:app