# Deploying to Heroku with the Container Registry

These steps show how to build the Docker image locally, push it to Heroku's Container Registry, and release it.

1. Log in to Heroku and the container registry:

```bash
heroku login
heroku container:login
```

2. Build and push the web image (run from the repository root). Replace <app-name> with your Heroku app name:

```bash
docker build -t registry.heroku.com/<app-name>/web .
docker push registry.heroku.com/<app-name>/web
heroku container:release web -a <app-name>
```

3. Set required config vars (DATABASE_URL, SECRET_KEY, AWS credentials, etc.):

```bash
heroku config:set DATABASE_URL="postgres://..." -a <app-name>
heroku config:set SECRET_KEY="..." -a <app-name>
```

4. Heroku provides the $PORT environment variable automatically when running container-based apps. The Dockerfile uses the `$PORT` at runtime (falls back to 8000).

Local testing:

```bash
docker build -t medley-app .
docker run -p 8000:8000 --env FLASK_ENV=production medley-app
```

Notes and recommendations:

- The Dockerfile installs `psycopg2-binary` to avoid compiling from source in the image. If you prefer to pin `psycopg2` in `requirements.txt`, update the file and remove the separate `pip install psycopg2-binary` step.
- Consider upgrading front-end dependencies (`react-scripts`) to remove OpenSSL legacy workarounds in the Node build stage.
- For smaller images, we can further optimize by removing build tools after package installation or using a multi-stage build for Python wheels.

Important production env vars:

- `DATABASE_URL` - required in production. The app will raise an error at startup if this is missing when `FLASK_ENV=production`.
- `SECRET_KEY` - your Flask secret key used for signing sessions and CSRF tokens.

Locally, if `DATABASE_URL` is not set the app will fall back to a local sqlite database (`sqlite:///dev.db`).
