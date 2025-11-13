#!/bin/bash
# Quick fix to populate your live Heroku database

echo "🚀 Populating Heroku database for medley-sesh..."
echo ""
echo "This will reset your database and add seed data."
echo "⚠️  WARNING: This will delete all existing data!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    echo ""
    echo "📊 Resetting database and seeding data..."
    heroku run flask db reset -a medley-sesh
    
    echo ""
    echo "✅ Database populated successfully!"
    echo ""
    echo "🌐 Your site should now show musicians and songs."
    echo "Visit: https://medleystorage.com"
else
    echo ""
    echo "❌ Operation cancelled."
    echo ""
    echo "If you just want to add seed data without deleting existing data, run:"
    echo "  heroku run flask seed all -a medley-sesh"
fi
