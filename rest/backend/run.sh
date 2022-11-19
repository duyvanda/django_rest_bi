#! /bin/bash
echo Hello World!
# git clone https://github.com/duyvantest/ecommerce-django-react.git

docker build -t bi_rest:v4 .

# docker tag bi_rest:v4 asia.gcr.io/spatial-vision-343005/bi_rest:v4

# docker push asia.gcr.io/spatial-vision-343005/bi_rest:v4

echo Done