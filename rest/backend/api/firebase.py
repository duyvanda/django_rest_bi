from heapq import merge
from http.client import responses
from operator import index
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json, sys, os
import timeit
from pathlib import Path
from django.conf import settings

# print("env", env('LOCAL'))
cred = credentials.Certificate("serviceAccountKey.json") if settings.LOCAL == "1" else credentials.Certificate('/app/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# db=firestore.client()
# firestore.SERVER_TIMESTAMP
def get_db():
    return firestore.client()
# data = {'name':'Duy', 'age':40}
# db.collection('persons').add({'name':'Duy', 'age':40})

# db.collection('persons').document('notautoid').set(data)

# for auto generate id
# db.collection('persons').document().set(data)

# MERGING
# merge_data = {'job': 'IT'}
# db.collection('persons').document('notautoid').set(merge_data, merge=True)

# data={'movie':'Avenger'}
# db.collection('persons').document('notautoid').collection('movies').add(data)


# res = db.collection('persons').document('notautoid').get()
# print(res.to_dict())


# responses = db.collection('quanhuyen').where('MaTinhThanh','==',"10").get()
# for res in responses:
#     print(res.to_dict())


# responses = db.collection('phuongxa').get()
# print(len(responses))

# for i in responses:
#     print(i.to_dict())
# for el, index in enumerate(responses):
#     print(el, index)

# print("len ",len(responses))
# res_lst= []
# for res in responses:
#     phuongxa = res.to_dict()['TenPhuongXa']
#     res_lst.append(phuongxa)

# print(res_lst)


# import os

# print(os.getcwd()+'//TinhThanh.json')

# upfile = UploadJsonFileToFirestore('D:\python_firebase_admin\PhuongXa.json', 'add', 'phuongxa')

# upfile.upload()

# print(db.collection('phuongxa').getsize())

# import json

# json_data = json.dumps()

# with open('PhuongXa.json', 'r', encoding='utf-8') as f:
#     data = json.loads(f.read())

# for index, el in enumerate(data):
#     if index >= 10700:
#         db.collection('phuongxa').add(el)

# print("Process Done")

# https://firebase.google.com/docs/firestore/query-data/queries#python_28

