#! /bin/bash
echo Hello World!
# git clone https://github.com/duyvantest/ecommerce-django-react.git

docker build -t bi_rest:v5_slim .

docker tag bi_rest:v5_slim asia-southeast1-docker.pkg.dev/spatial-vision-343005/bi-merap-repo/bi_rest:v5_slim

docker push asia-southeast1-docker.pkg.dev/spatial-vision-343005/bi-merap-repo/bi_rest:v5_slim

echo Done