# Production Database Setup

## Initial Database Setup (First Time Only)

When you first deploy to production, you need to manually populate the database.

### For Heroku:

```bash
# Replace <app-name> with your Heroku app name

# Option 1: Reset database (creates tables and seeds data)
heroku run flask db reset -a <app-name>

# Option 2: Just seed data (if tables already exist)
heroku run flask seed all -a <app-name>
```

### For Render:

1. Go to your Render dashboard
2. Navigate to your web service
3. Click on "Shell" tab
4. Run one of these commands:

```bash
# Option 1: Reset database (creates tables and seeds data)
flask db reset

# Option 2: Just seed data (if tables already exist)
flask seed all
```

### For other platforms (SSH access required):

```bash
# SSH into your production server
ssh user@your-server.com

# Navigate to your app directory
cd /path/to/app

# Run database reset
flask db reset
```

## Important Notes:

- **`flask db reset`**: Drops all tables, recreates them, and seeds data (USE WITH CAUTION - deletes all data!)
- **`flask seed all`**: Only adds seed data without dropping tables (safe if you have existing data)
- **`flask db migrate`**: Runs database migrations (creates/updates tables based on models)

## Environment Variables Required:

Make sure these are set in your production environment:

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Flask secret key
- `AWS_ACCESS_KEY_ID` - For S3 file uploads
- `AWS_SECRET_ACCESS_KEY` - For S3 file uploads
- `S3_BUCKET` - Your S3 bucket name
- `S3_LOCATION` - S3 region location

## Automatic Database Setup on Deploy:

The Dockerfile now includes a startup script that runs migrations automatically when the container starts. However, seeding must be done manually to prevent data loss on restarts.

If you want to seed on first deploy only, you can add a one-time job in your deployment platform:

**Heroku Release Phase** (add to Procfile):
```
release: flask db reset
```

**Render Build Command:**
```bash
pip install -r requirements.txt && flask db reset
```

⚠️ **WARNING**: Only use automatic seeding on FIRST deployment. Remove it after initial setup to prevent data loss!
