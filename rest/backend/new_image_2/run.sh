#! /bin/bash
echo Hello World!
# git clone https://github.com/duyvantest/ecommerce-django-react.git

docker build -t bi_rest:v1 .

docker tag bi_rest:v1 asia.gcr.io/spatial-vision-343005/bi_rest

docker push asia.gcr.io/spatial-vision-343005/bi_rest

echo Done