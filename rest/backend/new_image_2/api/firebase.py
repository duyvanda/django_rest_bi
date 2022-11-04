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
class UploadJsonFileToFirestore:
    def __init__(self, json_data, method, collectionname) -> None:
        # Get class running time
        self.start = timeit.default_timer()
        self.json_data = json_data
        self.method = method
        self.collectionname = collectionname
    
    def __str__(self) -> str:
        return (f'Uploading ****{self.file}***** JSON items to firestore!')
    
    # Firestore upload method getter method
    @property
    def method(self):
        return self._method
    
    # Firestore upload method setter method
    @method.setter
    def method(self, val):
        if val == 'set' or val == 'add':
            self._method = val
        else:
            print(f'Wrong method {val}, use set or add')
    
    # Get Json file path property
    @property
    def json_data(self):
        return self._json_data
    
    # Set and process Json file path property
    @json_data.setter
    def json_data(self, val):
        if val:
            try:
                # Opening JSON file
                f = open(val, encoding='utf8')
                
                # returns JSON object as a dictionary
                data = json.load(f)
                
                # make sure to close file
                f.close()
                self._json_data = data
            except Exception as e:
                print(f'FILE EXCEPTION: {str(e)}')
        else:
            print(f'Wrong file path {val}')

    # Main class method to populate firestore 
    # With the said data
    def upload(self):
        if  self.json_data and self.method:
           
            # Iterating through the json list
            for idx, item in enumerate(self.json_data):
                '''
                 START FOR JUST FOR DEMO REASONS
                '''
                from pygments import highlight
                from pygments.lexers import JsonLexer
                from pygments.formatters import TerminalFormatter
              
                json_str = json.dumps(item, indent=4, sort_keys=True)
                print(highlight(json_str, JsonLexer(), TerminalFormatter()))
                '''
                 END FOR JUST FOR DEMO REASONS
                '''
             
                if self.method == 'set':
                    self.set(item)
                else:
                    self.add(item)
                # Successfully got to end of data;
                # print success message
                if idx == len(self.json_data)-1:
                    # All the program statements
                    stop = timeit.default_timer()
                    print('**************************\n****SUCCESS UPLOAD*****\n**************************')
                    print("Time taken "+str(stop - self.start))
    
    # Collection Add method
    # Adds all data under a collection
    # With firebase firestore auto generated IDS
    def add(self, item):
        return db.collection(self.collectionname).add(item)
    
    # Collection document set method
    # Adds all data under a collection
    # With custom document IDS 
    def set(self, item):
        return db.collection(self.collectionname).document(str(item['id'])).set(item)
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

