FROM node:20 AS build-stage
WORKDIR /react-app
COPY react-app/ ./


# You have to set this because it should be set during build time.
# Build our React App
ENV REACT_APP_BASE_URL=https://medley-sesh-12ff9a74e2af.herokuapp.com/

RUN npm install
RUN npm run build

# Workaround for OpenSSL error with older react-scripts on Node 17+


FROM python:3.9

# Setup Flask environment
ENV FLASK_APP=app
# ENV FLASK_ENV=production

EXPOSE 8000

WORKDIR /var/www
COPY . .
COPY --from=build-stage /react-app/build/* app/static/


RUN pip install -r requirements.txt
RUN pip install psycopg2



# Run flask environment


CMD gunicorn app:app