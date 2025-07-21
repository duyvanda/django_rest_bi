FROM py3:3.8.14_v0

ENV APP_HOME /app
WORKDIR $APP_HOME

ENV PYTHONUNBUFFERED 1

ENV DEBUG 0

ENV LOCAL 0

ENV PORT 8000

RUN pip install --no-cache-dir --upgrade pip==24.0
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# COPY ./db.sqlite3 /app/thumuc/db.sqlite3
COPY . .
# Thêm biến môi trường để tắt file_cache của googleapiclient
ENV GOOGLE_API_PYTHON_CLIENT_NO_FILE_CACHE=1
EXPOSE $PORT
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 backend.wsgi:application

# CMD exec daphne -b 0.0.0.0 -p ${PORT} backend.asgi:application
