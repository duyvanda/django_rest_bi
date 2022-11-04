FROM bi_rest:v1

# ENV APP_HOME /app
# WORKDIR $APP_HOME

# Removes output stream buffering, allowing for more efficient logging
# ENV PYTHONUNBUFFERED 1

# ENV DEBUG 1

# ENV GOOGLE_APPLICATION_CREDENTIALS = $APP_HOME/django_bucket_biteam.json

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to the container image.
# COPY . .

# EXPOSE 8000

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
# CMD exec gunicorn --bind 0.0.0.0:8000 --workers 2 --threads 8 --timeout 0 backend.wsgi:application
