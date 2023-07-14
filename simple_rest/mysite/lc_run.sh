#! /bin/bash
echo Hello World!
# git clone https://github.com/duyvantest/ecommerce-django-react.git

docker build -t bi_local_rest:v1 .

docker tag bi_local_rest:v1 duyvanda/bi_rest_local:v1

docker push duyvanda/bi_rest_local:v1

echo Done