FROM py3:3.8.14_slim_v0

ENV APP_HOME /app
WORKDIR $APP_HOME

ENV PYTHONUNBUFFERED 1

ENV DEBUG 0

ENV LOCAL 0

ENV PORT 80

RUN pip install --no-cache-dir --upgrade pip==24.0
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# COPY ./db.sqlite3 /app/thumuc/db.sqlite3
COPY . .

EXPOSE $PORT
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 backend.wsgi:application
