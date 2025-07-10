#! /bin/bash
echo Hello World!
# git clone https://github.com/duyvantest/ecommerce-django-react.git
# 10:30:PM 06062024
# admin/admin
# bi_odoo/meraplion@123

docker build -t bi_local_rest:v5 .

docker tag bi_local_rest:v5 duyvanda/bi_rest_local:v5

docker push duyvanda/bi_rest_local:v5

echo Done