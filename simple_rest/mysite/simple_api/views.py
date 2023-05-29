from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt import tokens
import os
import json
import pickle

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def getQueryParams(request):
    try:
        if request.headers['Authorization'] == "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY0NTUxMTQ4LCJpYXQiOjE2NjQ1NTA4NDgsImp0aSI6IjUyYzRjYTExZmVhNTQwZGM5YmI4NzAyZjFkM2Q5ZGEwIiwidXNlcl9pZCI6MX0.1O8Z7iouC-YNG7ybfX_3849gHmHTjHDLDeizCqgzrBk":
            query_params = request.query_params
            print("query_params ",query_params)
            print("full path  ",request.get_full_path())
            with open('test_index.json', 'r', encoding='utf-8') as f:
                data = json.loads(f.read())
            return Response(data[f"{query_params.get('manhathuoc')}"])
        else:
            return Response("You are NOT authorized")
    except KeyError as e:
        return Response("You are NOT authorized")

print(os.path)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getAllVipPlus(request):
    pk_file = open("/app/thumuc/data_list.pk", "rb")
    lst = pickle.load(pk_file)
    return Response(lst)