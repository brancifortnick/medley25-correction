FROM node:16 as build-stage


WORKDIR /react-app
COPY react-app/. .

ENV REACT_APP_BASE_URL=https://medley-8b6a473284eb.herokuapp.com/

# Add this to fix the OpenSSL error:


RUN npm install
RUN npm run build


# --- Stage 2: Run Flask App ---


# Install system dependencies (Debian uses apt)
FROM ubuntu:22.04

# Flask environment setup
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True

WORKDIR /var/www

# Copy backend and frontend code
COPY . .
COPY --from=build-stage /react-app/build /var/www/app/static


# Install Python dependencies
RUN pip install -r dev-requirements.txt
RUN pip install -r requirements.txt

EXPOSE 8000

CMD gunicorn app:app
