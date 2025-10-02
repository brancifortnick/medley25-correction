import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY and os.environ.get('FLASK_ENV') != 'production':
        SECRET_KEY = 'dev-secret-change-me'
    if not SECRET_KEY and os.environ.get('FLASK_ENV') == 'production':
        raise RuntimeError('SECRET_KEY is required in production')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here
    _database_url = os.environ.get('DATABASE_URL')
    if _database_url:
        # SQLAlchemy 1.4 prefers 'postgresql://' scheme
        SQLALCHEMY_DATABASE_URI = _database_url.replace(
            'postgres://', 'postgresql://')
    else:
        # Fallback to a local sqlite database for development/testing
        # In production (FLASK_ENV=production) we expect DATABASE_URL to be set
        if os.environ.get('FLASK_ENV') == 'production':
            raise RuntimeError(
                'DATABASE_URL environment variable is required in production')
        SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    SQLALCHEMY_ECHO = True
