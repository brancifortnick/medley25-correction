#!/bin/bash
# This script runs database setup and starts the app

# Only create tables if they don't exist (safe for production)
# The migrate command will run migrations
flask db migrate

# Start the application
exec gunicorn app:app
