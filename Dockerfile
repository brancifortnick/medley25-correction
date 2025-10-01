FROM node:18-alpine AS build-stage
WORKDIR /react-app
COPY react-app/package*.json ./
COPY react-app/. .
RUN npm install
# RUN npm run build
ENV REACT_APP_BASE_URL=https://steaklocate-app-2025-375d8b40dba2.herokuapp.com

FROM python:3.9

# Setup Flask environment
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True

WORKDIR /var/www
COPY requirements.txt .
RUN pip install -r requirements.txt


COPY . .
COPY --from=build-stage /react-app/build/* app/static/

# Install Python Dependencies
RUN pip install -r requirements.txt
RUN pip install psycopg2
RUN ['flask', 'run', '--host=0.0.0.0']
# Run flask environment
CMD gunicorn app:app