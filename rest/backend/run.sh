#! /bin/bash
echo Hello World!
# git clone https://github.com/duyvantest/ecommerce-django-react.git

docker build -t bi_rest:v3 .

docker tag bi_rest:v3 asia.gcr.io/spatial-vision-343005/bi_rest:v3

docker push asia.gcr.io/spatial-vision-343005/bi_rest:v3

echo Done