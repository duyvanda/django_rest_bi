
from django.shortcuts import render
from django.contrib.auth.models import User, AnonymousUser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json, sys, os
from requests.structures import CaseInsensitiveDict
import requests
from utils.df_handle import check_exist_ms
from firebase_admin import firestore
from django.conf import settings
# import json
from . import firebase
from . import TinhThanh,PhuongXa,QuanHuyen
# print(path)
# list_dict = []
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def getUrlRequest(request):
    # query_params = request.query_params
    # print("query_params ",query_params)
    # print("full path  ",request.get_full_path())
    # print("header  ",request.headers)
    # print("data  ",request.data)
    # global list_dict
    dict_data = request.query_params.dict()
    dict_data['fullpath'] = request.get_full_path()
    # list_dict.append(request.query_params.dict())
    # list_dict.append(request.get_full_path())
    dict_data['headers'] = dict(request.headers)
    dict_data['data'] = request.data
    # my_dict = [{"MaTinhThanh": "10", "TenTinhThanh": "Hà Nội"},{"MaTinhThanh": "16","TenTinhThanh": "Hưng Yên"}]
    # matinhthanh_mapping = {mtt['MaTinhThanh']: mtt for mtt in my_dict}
    # print(matinhthanh_mapping)
    # print(dict_data)
    return Response(dict_data)

# Create your views here.
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getTinhThanh(request):
    # db=firebase.get_db()
    # res = db.collection('tinhthanh').get()
        # for i in res:
    #     lst.append(i.to_dict())
    data = []
    lst = TinhThanh.tinhthanh
    for i in lst:
        data.append(i['TenTinhThanh']+'-'+ i['MaTinhThanh'])
    return Response({'sucess':data})


@api_view(['GET'])
def getQuanHuyen(request, pk):
    data = []
    lst = QuanHuyen.quanhuyen
    for i in lst:
        if i['MaTinhThanh'] == pk:
            data.append(i['TenQuanHuyen']+'-'+ i['MaQuanHuyen'])
    return Response({'sucess':data})



@api_view(['GET'])
def getPhuongXa(request, pk):
    # pk= "1240"
    data = []
    lst = PhuongXa.phuongxa
    for i in lst:
        if i['MaQuanHuyen'] == pk:
            data.append(i['TenPhuongXa']+'-'+ i['MaPhuongXa'])
    return Response({'sucess':data})


@api_view(['POST'])
def CreateOrder(request):

    default_dict = {
        "SenderTel": "02437868020",
        "SenderFullname": "Cty Dược phẩm Pha Nam - CN Hà Nội",
        "SenderAddress": "12H1 Khu Đô Thị Yên Hòa, Cầu Giấy HN",
        "SenderWardId": "12260",
        "SenderDistrictId": "1220",
        "SenderProvinceId": "10",
        "ReceiverTel": "02437868020",
        # "ReceiverFullname": "BV ĐK KV Mường La - Sơn La",
        # "ReceiverAddress": "Tiểu khu IV, Thị trấn Ít Ong, Huyện Mường La, Sơn La, Việt Nam",
        # "ReceiverWardId": "36470",
        # "ReceiverDistrictId": "3647",
        # "ReceiverProvinceId": "36",
        "ReceiverAddressType": 1,
        "ServiceName": "BK",
        # "OrderCode": "MR0001PBNH09202200511",
        "PackageContent": "",
        "WeightEvaluation": 0.1,
        "WidthEvaluation": 0.1,
        "LengthEvaluation": 0.1,
        "HeightEvaluation": 0.1,
        "IsPackageViewable": False,
        "CustomerNote": "Thu Hoi Bien Ban Giao Hang cho nguoi gui",
        "PickupType": 1,
        "CodAmountEvaluation": 0.1,
        "IsReceiverPayFreight": False,
        "OrderAmountEvaluation": 0.1,
        "UseBaoPhat": True,
        "UseHoaDon": True,
        # "CustomerCode": "0843211234C333345",
        "PickupPoscode": "0"
    }

    data =  request.data
    # print(data)
    try:
        default_dict['ReceiverFullname'] = data['tenNT']
        default_dict['ReceiverAddress'] = data['diaChi']
        default_dict['ReceiverWardId'] = data['maPhuongXa']
        default_dict['ReceiverDistrictId'] = data['maQuanHuyen']
        default_dict['ReceiverProvinceId'] = data['maTinhThanh']
        default_dict['OrderCode'] = data['bbnh']
        default_dict['CustomerCode'] = data['maChiNhanh']

        sql = f"""select count(*) from OM_Receipt where BranchID+ReportID = '{data['bbnh']}' """
        if check_exist_ms(sql):
            #handle post VNPOST
            url_createorder = f"{settings.UAT_URL}/doitac/createorder"
            headers = CaseInsensitiveDict()
            headers['Content-Type'] = 'application/json'
            headers['h-token'] = settings.H_TOKEN
            res = requests.post(url=url_createorder, headers=headers, data=json.dumps(default_dict))
            if res.ok :
                vnp_data = res.json()
                vnp_data['SERVER_TIMESTAMP'] = firestore.SERVER_TIMESTAMP
                vnp_data.pop('AdditionalDatas', None)
                vnp_data.pop('ValueAddedServiceList', None)
                db=firebase.get_db()
                db.collection('test').document(data['bbnh']).set(vnp_data)
                return Response({"message":"Order Created"}, status.HTTP_201_CREATED)
            else: 
                return Response({"message": f"{res.text}"}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "BBNH Khong Tim Duoc, Vui Long Nhap Dung"}, status.HTTP_400_BAD_REQUEST)
    except BaseException as e:
        return Response({"message":" Data Nhap Khong Du Vui Long Nhap Lai"}, status.HTTP_400_BAD_REQUEST)



    

@api_view(['POST'])
def CreateToken(request):
    user=User(id=1, username='bimerap', email='bimerap.main@gmail.com')
    # user=AnonymousUser()
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    })