FROM bi_rest:v1
ENV DEBUG 0
ENV LOCAL 0
ENV PORT 8000
EXPOSE $PORT
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 backend.wsgi:application
