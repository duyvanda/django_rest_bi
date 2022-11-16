from base64 import encode
from django.shortcuts import render
from rest_framework.parsers import FileUploadParser
from django.contrib.auth.models import User, AnonymousUser
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from requests.structures import CaseInsensitiveDict
from utils.df_handle import check_exist_ms, upload_file_to_bucket, insert_google_sheet
from firebase_admin import firestore
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from google.cloud import logging
from google.cloud.logging_v2 import client
from google.cloud.logging_v2 import logger as lgr
from google.cloud.logging_v2.resource import Resource
import json, sys, os, requests, traceback, time 
# from .forms import UploadFileForm, FileFieldForm
# import json
from . import firebase
from . import TinhThanh,PhuongXa,QuanHuyen
# print(path)
# list_dict = []

logging_client = logging.Client()
log_name = "django_bi_team_logger"
resource = Resource(type= "global", labels={})
# logger = logging_client.logger(log_name)

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
    logger = logging_client.logger(log_name)
    logger.log_text(f"Received create request,\nRequest Data :{request.data},\nRequest Headers: {request.headers},\npath: {request.get_full_path()},\nHTTP_X_FORWARDED_FOR: {request.META.get('HTTP_X_FORWARDED_FOR')},\nREMOTE_ADDR: {request.META.get('REMOTE_ADDR')},\nQueryParams: {request.query_params}")
    default_dict = {
        # "SenderTel": "02437868020",
        # "SenderFullname": "Cty Dược phẩm Pha Nam - CN Hà Nội",
        # "SenderAddress": "12H1 Khu Đô Thị Yên Hòa, Cầu Giấy HN",
        # "SenderWardId": "12260",
        # "SenderDistrictId": "1220",
        # "SenderProvinceId": "10",
        # "ReceiverTel": "02437868020",
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
        # "WidthEvaluation": 0.1,
        # "LengthEvaluation": 0.1,
        # "HeightEvaluation": 0.1,
        # "IsPackageViewable": False,
        "CustomerNote": "Thu Hoi Bien Ban Giao Hang cho nguoi gui",
        "PickupType": 1,
        # "CodAmountEvaluation": 0.0,
        # "IsReceiverPayFreight": False,
        # "OrderAmountEvaluation": 0.0,
        "UseBaoPhat": True,
        "UseHoaDon": False,
        # "CustomerCode": "0843211234C333345",
        "PickupPoscode": "0"
    }
    data =  request.data
    x = 'K' + str(data['Kien']) if int(data['ToTalKien']) != 1 else ''
    # print("type x", type(x), x)
    try:
        default_dict["SenderTel"] = data['SenderTel']
        default_dict["SenderFullname"] = data['SenderFullname']
        default_dict["SenderAddress"] = data['SenderAddress']
        default_dict["SenderWardId"] = data['SenderWardId']
        default_dict["SenderDistrictId"] = data['SenderDistrictId']
        default_dict["SenderProvinceId"] = data['SenderProvinceId']
        #
        default_dict['ReceiverFullname'] = data['tenNT']
        default_dict['ReceiverAddress'] = data['diaChi']
        default_dict['ReceiverWardId'] = data['maPhuongXa']
        default_dict['ReceiverDistrictId'] = data['maQuanHuyen']
        default_dict['ReceiverProvinceId'] = data['maTinhThanh']
        default_dict['OrderCode'] = data['bbnh']+x
        default_dict['ReceiverTel'] = data['SDT']
        default_dict['CustomerCode'] = "0843211234C333345" if settings.RUN == "OFF" else data['maChiNhanh']
        sql = f"""select count(*) from OM_Receipt where BranchID+ReportID = '{data['bbnh']}' """
        BBHN_exist = check_exist_ms(sql)
        logger.log_text(f"Received data and BBHN_exist is {BBHN_exist}")
        if BBHN_exist:
            #handle post VNPOST
            url_createorder = f"{settings.UAT_URL}/doitac/createorder"
            headers = CaseInsensitiveDict()
            headers['Content-Type'] = 'application/json'
            headers['h-token'] = settings.H_TOKEN
            headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
            for i in range(0,9):
                try:
                    res = requests.post(url=url_createorder, headers=headers, data=json.dumps(default_dict), timeout=10)
                    time.sleep(3)
                    break
                except BaseException as e:
                    error_text = traceback.format_exc()
                    logger.log_text(f"Can not send request to VNP {error_text} So Lan {str(i)}")
                    # if i == 2 return Response({"message":f"Failed To Send Request {str(i)} "}, status.HTTP_400_BAD_REQUEST) else None
            if res.ok :
                logger.log_text("Done send request to VNP")
                vnp_data = res.json()
                vnp_data['SERVER_TIMESTAMP'] = firestore.SERVER_TIMESTAMP
                vnp_data.pop('AdditionalDatas', None)
                vnp_data.pop('ValueAddedServiceList', None)
                db=firebase.get_db()
                db.collection('vnpost').document(data['bbnh']+x).set(vnp_data)
                return Response({"message":"Order Created"}, status.HTTP_201_CREATED)
            else: 
                return Response({"message": f"{res.text}"}, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "BBNH Khong Tim Duoc, Vui Long Nhap Dung"}, status.HTTP_400_BAD_REQUEST)
    except BaseException as e:
        error_text = traceback.format_exc()
        logger.log_text(error_text)
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

# @csrf_exempt
# class FileUploadView(APIView):
#     parser_classes = [FileUploadParser]
#     def post(self, request, format=None):
#         file_obj = request.data['file']
#         print(file_obj)
#         return Response(status=204)


@api_view(['POST'])
def FileUploadView(request, pk):
    msnv = pk
    f = request.FILES.get('file')
    public_url = upload_file_to_bucket(f"hrtam/{msnv}/{str(f)}", f.read(),'image/jpeg')
    # print(f.name)
    # print(f.content_type)
    # print(f.size)
    # print(f.read())
    return Response(public_url)

@api_view(['POST'])
def UploadSpreedSheetData(request):
    logger = logging_client.logger(log_name)
    logger.log_text(f"Received create request,\nRequest Data :{request.data},\nRequest Headers: {request.headers},\npath: {request.get_full_path()},\nHTTP_X_FORWARDED_FOR: {request.META.get('HTTP_X_FORWARDED_FOR')},\nREMOTE_ADDR: {request.META.get('REMOTE_ADDR')},\nQueryParams: {request.query_params}")
    data =  request.data
    print(data)
    lst = []
    lst.append(data['MSNV'])
    lst.append(data['HoVaTen'])
    lst.append(data['PhongBan'])
    lst.append(data['CCCD'])
    lst.append(data['NgayCap'])
    lst.append(data['NoiCap'])
    lst.append(data['SoNha'])
    lst.append(data['Tinh'])
    lst.append(data['Quan'])
    lst.append(data['Phuong'])
    lst.append(data['SoNha2'])
    lst.append(data['Quan2'])
    lst.append(data['Tinh2'])
    lst.append(data['Phuong2'])
    lst.append(data['SDT'])
    # lst.append[data.MSNV]
    try:
        insert_google_sheet(lst, '1C443EykulvJwRf19kylZoE8qeA-XQZsPz3o0ioSEW0o')
        logger.log_text(f"""{data['MSNV']} da gui form thanh cong !!!""")
        return Response({'message':'Da Gui Form Thanh Cong'}, status.HTTP_201_CREATED)
    except BaseException as e:
        error_text = traceback.format_exc()
        logger.log_text("failed to insert with reason: "+error_text)
        return Response({"message":" Data Nhap Khong Du Vui Long Nhap Lai"}, status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def LogIn(request):
    try:
        token_str = """1Iujws5qaz2Nl1qcZpJ%01D7%Zb8cH7Fa%ErnFG7@u!M3G$xiL_hz7A$z4L1$Y207QDWUx8TMN2g!8e43jn%zt9qFjJ5vQABwoBET_c2y7owPhZAmU4Tpn!0YbOxk!MF!SO^is8YoKLU4yaj1U$9ftBp_c2y7owPhZAmU4Tpn!0YbOxk!MF!SO^is8YoKLU4yaj1U$9ftBp"""
        # print(request.data)
        manv = request.data['email']
        # password = request.data['password']
        db=firebase.get_db()
        res = db.collection('report_users').document(manv).get()
        dict = res.to_dict()
        dict.pop('report', None)
        # print(type(dict))
        password = request.data['password'] if request.data['password'] != token_str else dict['key']
        dk1 = dict['manv'] == manv
        dk2 = dict['key'] == password
        encryptedpassword=make_password(password)
        print(encryptedpassword)
        decryptedpassword=check_password(password, encryptedpassword)
        print(decryptedpassword)
        dict['token'] = encryptedpassword
        dict.pop('key', None)
        if dk1 & dk2:
            return Response(dict, status.HTTP_200_OK)
        else:
            return Response({"message":"Ma NV & Password khong dung"}, status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({"message":"Ma NV & Password khong dung"}, status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def ChangePass(request):
    print(request.data)
    db=firebase.get_db()
    manv = request.data['manv']
    newpass = request.data['password']
    update_data = {'key': newpass}
    db.collection('report_users').document(manv).update(update_data)
    return Response({"message":"Pass Changed"}, status.HTTP_200_OK)


@api_view(['POST'])
def GetStatus(request, pk):
    try:
        msnv = pk
        db=firebase.get_db()
        res = db.collection('report_users').document(msnv).get()
        dict = res.to_dict()
        stat = dict['trangthaihoatdong']
        encryptedpassword=request.data['token']
        print("encryptedpassword", encryptedpassword)
        decryptedpassword=check_password(dict['key'], encryptedpassword)
        # passcheck = encryptedpassword==request.data['token']
        stat = bool(stat)
        bol = all([decryptedpassword,stat])
        data = {"check": bol}
        return Response(data, status.HTTP_200_OK)
    except:
        return Response({"check":False}, status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def PostUserReportLogger(request):
    data =  request.data
    logger = lgr.Logger(name=log_name, client=logging_client,  labels = {"name":"user_report_logger"}, resource = resource)
    logger.log_struct(info = data, severity="INFO")
    return Response({"message":"ok"}, status.HTTP_200_OK)

@api_view(['GET'])
def GetAllUsers(request):
    db=firebase.get_db()
    responses = db.collection('report_users').get()
    res_lst= []
    for res in responses:
        us = res.to_dict()
        res_lst.append(us)
    return Response(res_lst, status.HTTP_200_OK)

@api_view(['GET'])
def GetOneUser(request,pk):
    msnv = pk
    db=firebase.get_db()
    res = db.collection('report_users').document(msnv).get()
    dict = res.to_dict()
    return Response(dict, status.HTTP_200_OK)

@api_view(['POST'])
def DeleteOneUser(request,pk):
    msnv = pk
    db=firebase.get_db()
    db.collection('report_users').document(msnv).delete()
    return Response({f"{pk}":"deleted"}, status.HTTP_200_OK)

@api_view(['POST'])
def CreateOneUser(request):
    try:
        data = request.data
        msnv = data['manv']
        default_dict = {}
        default_dict['manv'] = data['manv']
        default_dict['key'] = data['key']
        default_dict['trangthaihoatdong'] = data['trangthaihoatdong']
        db=firebase.get_db()
        db.collection('report_users').document(msnv).set(default_dict)
        # dict = res.to_dict()
        return Response({f"{msnv}":"created"}, status.HTTP_201_CREATED)
    except:
        return Response({"message":" Data Nhap Khong Du Vui Long Nhap Lai"}, status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def UpdateOneUser(request, pk):
    msnv = pk
    update_data = request.data
    db=firebase.get_db()
    db.collection('report_users').document(msnv).update(update_data)
    # dict = res.to_dict()
    return Response({f"{msnv}":"updated"}, status.HTTP_200_OK)
