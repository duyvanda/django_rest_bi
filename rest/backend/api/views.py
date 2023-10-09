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
from utils.df_handle import check_exist_ms, upload_file_to_bucket, insert_google_sheet, download_pk_files, get_bq_df, upload_file_to_bucket_with_metadata
from utils.df_handle import pd, vc, df_to_dict, np, get_eotoken, get_eostatus
from firebase_admin import firestore
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from google.cloud import logging
from google.cloud.logging_v2 import client
from google.cloud.logging_v2 import logger as lgr
from google.cloud.logging_v2.resource import Resource
import json, sys, os, requests, traceback, time, datetime, pickle, folium, geopandas
import duckdb as db
from folium.plugins import *
from datetime import timedelta
from math import pi, cos
from . import firebase
from . import TinhThanh,PhuongXa2,QuanHuyen

# print(path)
# list_dict = []

logging_client = logging.Client()
log_name = "django_bi_team_logger"
resource = Resource(type= "global", labels={})
# num_str = str( (datetime.datetime.now().hour*0 + datetime.datetime.now().day*4 + datetime.datetime.now().month*3 + datetime.datetime.now().year*2) *123123)
# token_s = """1Iujws5qaz2Nl1qcZpJ01D7Zb8cH7FaErnFG7uM3GxiL.hz7A.z4L1Y207QDWUx8TMN2g8e43jnzt9qFjJ5vQABwoBET.c2y7owPhZAmU4Tpn0YbOxk.MF"""
# extra_s = """GIwSgZdtwXadjrHA.U9ftBp.SOis8YoKLU4yaj1U9ftBp_c2y7owPhZAmU4Tpn0YbOxkMFSOis8YoKLU4yaj1U9ftBp"""
# token_str = extra_s+num_str
# logger = logging_client.logger(log_name)
token_str="GIwSgZdtwXadjrHA.U9ftBp.SOis8YoKLU4yaj1U9ftBp_c2y7owPhZAmU4Tpn0YbOxkMFSOis8YoKLU4yaj1U9ftBp509236728"

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

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getAllVipPlus(request):
#     pk_file = open("/app/thumuc/data_list.pk", "rb")
#     lst = pickle.load(pk_file)
#     return Response(lst)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def GetAutoLoginKey(request, pk):
    domain = "https://ds.merapgroup.com/login?"
    try:
        if request.headers['Authorization'] == token_str:
            return Response({"utm_source":"eoffice", "manv": pk, "token": token_str, "url": domain+f"utm_source=eoffice&manv={pk}&token={token_str}"}, status.HTTP_200_OK)
        else:
            return Response({"message": "Sai Token"}, status.HTTP_401_UNAUTHORIZED)
    except KeyError:
        return Response({"message": "Thieu Authorization Token"}, status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({"message": "Server Bi Loi"}, status.HTTP_401_UNAUTHORIZED)

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


# OLD
# @api_view(['GET'])
# def getPhuongXa(request, pk):
#     # pk= "1240"
#     data = []
#     lst = PhuongXa.phuongxa
#     for i in lst:
#         if i['MaQuanHuyen'] == pk:
#             data.append(i['TenPhuongXa']+'-'+ i['MaPhuongXa'])
#     return Response({'sucess':data})

@api_view(['GET'])
def getPhuongXa(request, pk):
    if os.path.isfile("/app/phuongxa.pk"):
        with open("/app/phuongxa.pk",'rb') as f:
            dct = pickle.load(f)
    else:
        download_pk_files("public/phuongxa.pk")
        with open("/app/phuongxa.pk",'rb') as f:
            dct = pickle.load(f)
    # with open("/app/phuongxa.pk",'rb') as f:
    #     dct = pickle.load(f)
    data =  dct[pk]['MaPhuongXa']
    return Response({'sucess':data})

@api_view(['GET'])
def getPKFiles(request):
    download_pk_files("public/phuongxa.pk")
    return Response({'sucess':'ok'})


@api_view(['POST'])
def CreateOrder(request):
    logger = logging_client.logger(log_name)
    logger.log_text(f"Received create request,\nRequest Data :{request.data},\nRequest Headers: {request.headers},\npath: {request.get_full_path()},\nHTTP_X_FORWARDED_FOR: {request.META.get('HTTP_X_FORWARDED_FOR')},\nREMOTE_ADDR: {request.META.get('REMOTE_ADDR')},\nQueryParams: {request.query_params}")
    default_dict = {
        "ReceiverAddressType": 1,
        "ServiceName": "BK",
        "PackageContent": "",
        "WeightEvaluation": 0.1,
        "IsPackageViewable": True,
        "CustomerNote": "Phat Dong Kiem, Thu Hoi Bien Ban",
        "PickupType": 1,
        "UseBaoPhat": True,
        "UseHoaDon": False,
        "PickupPoscode": "0"
    }
    data =  request.data
    x = 'K' + str(data['Kien']) if int(data['ToTalKien']) != 1 else ''
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
    # print(data)
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
        manv = request.data['email']
        db=firebase.get_db()
        res = db.collection('report_users').document(manv).get()
        dict = res.to_dict()
        dict.pop('report', None)
        password = request.data['password'] if request.data['password'] != token_str else dict['key']
        dk1 = dict['manv'] == manv
        dk2 = dict['key'] == password
        encryptedpassword=make_password(password)
        dict['token'] = encryptedpassword
        dict.pop('key', None)
        if dk1 & dk2:
            return Response(dict, status.HTTP_200_OK)
        else:
            return Response({"message":"Ma NV & Password khong dung"}, status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({"message":"Ma NV & Password khong dung"}, status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def LogIn_V1(request):
    try:
        manv = request.data['email']
        pwd = request.data['password']

        """
        XỬ LÝ LOGIN = URL HOẶC SUPER PASSWORD
        NẾU PASSWORD = token_str => Pass
        NẾU PASSWORD dài hơn 50 ký tự => Check EO Token
        """

        db=firebase.get_db()
        res = db.collection('report_users').document(manv).get()
        dict = res.to_dict()

        if pwd == token_str:
            response_dict = {
                "manv":manv,
                "token":token_str,
                "trangthaihoatdong":1
            }
            return Response(response_dict, status.HTTP_200_OK)
        else: pass

        
        if len(pwd)>=100:

            # check = get_eostatus(pwd)
            # print("check", check)
            
            # trangthaihoatdong = 1 if check['check'] == 1 else 0
            trangthaihoatdong = 1
            response_dict = {
                "manv":manv,
                "token":make_password(dict['key']),
                "trangthaihoatdong":trangthaihoatdong
            }
            return Response(response_dict, status.HTTP_200_OK)
        else: pass

        login_dict = get_eotoken(manv, pwd)
        print("login_dict", login_dict)
        manv = login_dict['manv']
        # token = login_dict['token']
        trangthaihoatdong = login_dict['trangthaihoatdong']
        dk1 = trangthaihoatdong == 1
        print("dk1",dk1)
        if dk1:
            user_dict = {
                "manv":manv,
                "key":pwd,
                "trangthaihoatdong":trangthaihoatdong
                # "token":token
            }
            """SAVE USERS"""
            db=firebase.get_db()
            db.collection('report_users').document(manv).set(user_dict)
            response_dict = {
                "manv":manv,
                "token":make_password(pwd),
                "trangthaihoatdong":trangthaihoatdong
            }
            return Response(response_dict, status.HTTP_200_OK)
        else:
            return Response({"message":"Ma NV & Password khong dung"}, status.HTTP_401_UNAUTHORIZED)
        
    except BaseException as e:
        return Response({"message":"Ma NV & Password khong dung", "error": repr(e)}, status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def ChangePass(request):
    # print(request.data)
    # db=firebase.get_db()
    # manv = request.data['manv']
    # newpass = request.data['password']
    # update_data = {'key': newpass}
    # db.collection('report_users').document(manv).update(update_data)
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
        decryptedpassword=check_password(dict['key'], encryptedpassword)
        stat = bool(stat)
        bol = all([decryptedpassword,stat])
        data = {"check": bol}
        return Response(data, status.HTTP_200_OK)
    except:
        return Response({"check":False}, status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def GetStatus_V1(request, pk):
    try:
        msnv = pk
        db=firebase.get_db()
        res = db.collection('report_users').document(msnv).get()
        dict = res.to_dict()
        stat = dict['trangthaihoatdong']
        encryptedpassword=request.data['token']
        decryptedpassword=check_password(dict['key'], encryptedpassword)
        stat = bool(stat)
        stat2 = bool(get_eotoken(msnv, dict['key'])['trangthaihoatdong'])
        bol = all([decryptedpassword, stat, stat2])

        # password = request.data['password'] if request.data['password'] != token_str else dict['key']
        data = {"check": True} if request.data['token'] == token_str else {"check": bol}

        print("data", data)
        return Response(data, status.HTTP_200_OK)
    except BaseException as e:
        return Response({"check":False, "error": repr(e)}, status.HTTP_401_UNAUTHORIZED)


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


@api_view(['POST'])
def GetVNPOrders(request):
    db=firebase.get_db()
    dict = request.data
    year = int(dict['year'])
    month = int(dict['month'])
    day = int(dict['day'])
    dt = datetime.datetime(year, month, day)
    dt1 = dt + timedelta(days=1)
    print("dt", dt)
    responses = responses = db.collection('vnpost').where('SERVER_TIMESTAMP','>=', dt).where('SERVER_TIMESTAMP','<', dt1).get()
    res_lst= []
    for res in responses:
        us = res.to_dict()
        res_lst.append(us)
    return Response(res_lst, status.HTTP_200_OK)


@api_view(['GET'])
def GetOneKHVNP(request,pk):
    mkh = pk
    db=firebase.get_db()
    res = db.collection('vnp_cust').document(mkh).get()
    dict = res.to_dict()
    # print(res)
    # print(dict)
    # print(len(dict))

    n_dict = {
    "diachikh": "Chưa Tạo Mã",
    "tenkhachhang": "Chưa Tạo Mã",
    "codequanhuyen": "Chưa Tạo Mã",
    "codephuongxa": "Chưa Tạo Mã",
    "codetinhkh": "Chưa Tạo Mã",
    "sodienthoai": "Chưa Tạo Mã",
    "makhdms": "Chưa Tạo Mã"
    }

    if dict:
        return Response(dict, status.HTTP_200_OK)
    else:
        return Response(n_dict, status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def CreateOneKHVNP(request):
    try:
        data = request.data
        mkh = data['makhdms']
        default_dict = {}
        default_dict['makhdms'] = data['makhdms']
        default_dict['codetinhkh'] = data['codetinhkh']
        default_dict['codephuongxa'] = data['codephuongxa']
        default_dict['codequanhuyen'] = data['codequanhuyen']
        default_dict['diachikh'] = data['diachikh']
        default_dict['sodienthoai'] = data['sodienthoai']
        default_dict['tenkhachhang'] = data['tenkhachhang']
        db=firebase.get_db()
        db.collection('vnp_cust').document(mkh).set(default_dict)
        # dict = res.to_dict()
        return Response({f"{mkh}":"created"}, status.HTTP_201_CREATED)
    except:
        return Response({"message":" Data Nhap Khong Du Vui Long Nhap Lai"}, status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def DeleteOneKHVNP(request,pk):
    msnv = pk
    db=firebase.get_db()
    db.collection('vnp_cust').document(msnv).delete()
    return Response({f"{pk}":"deleted"}, status.HTTP_200_OK)


# @api_view(['POST'])
# def GetMap(request):
#     dict = request.data
#     dict['map_string'] = 'https://storage.googleapis.com/django_media_biteam/public/maps/map_3tinh.html'
#     return Response(dict, status.HTTP_200_OK)


@api_view(['POST'])
def GetMap(request):
    dict_data = request.data
    kenh = dict_data['kenh']
    kenh_tuple = ()
    for e in kenh.split(","):
        kenh_tuple = kenh_tuple + (e, )
    kenh_tuple = kenh_tuple + ('',)
    fromDate = dict_data['fromDate'].split("-")
    toDate = dict_data['toDate'].split("-")
    fromDate = fromDate[2]+'-'+fromDate[1]+'-'+fromDate[0]
    toDate = toDate[2]+'-'+toDate[1]+'-'+toDate[0]
    # fromDate
    sql = \
    f"""
    SELECT
    a.tentinhkh,
    a.makhdms,
    a.tenkhachhang,
    a.makenhkh,
    a.makenhphu,
    b.lat,
    b.lng,
    sum(a.doanhsochuavat) as doanhsochuavat,
    count (distinct sodondathang) as sldh
    FROM `spatial-vision-343005.staging.f_sales` a
    left join `spatial-vision-343005.staging.d_master_khachhang` b on a.macongtycn = b.branchid and a.makhdms = b.custid
    WHERE (DATE(a.ngaychungtu) >= "{fromDate}" and DATE(a.ngaychungtu) <= "{toDate}") and a.tentinhkh in ('Hà Nam', 'Ninh Bình','Nam Định') and a.makenhkh not in ('NB','OTH_LAB') and a.makenhkh in {kenh_tuple}
    and b.lat is not null
    GROUP BY 1,2,3,4,5,6,7
    having doanhsochuavat > 0
    """
    print("sql", sql)
    df = get_bq_df(sql)
    print("Done getting DF")
    df.lat = df.lat.astype(str)
    df.lng = df.lng.astype(str)
    df_kh_locations = df[['lat', 'lng']]
    # df_kh_locations
    kh_location_list = df_kh_locations.values.tolist()
    kh_location_list_size = len(kh_location_list)
    # Classification
    # Setup the map
    map = folium.Map(location=[20.4168907,105.920043], zoom_start=10)
    print("Done BQ and create Map")
    folium.GeoJson(data='https://storage.googleapis.com/django_media_biteam/public/myfile.json', style_function = lambda x: {"fillColor": "#0000ff" if x["properties"]["Name_EN"] == "Ha Nam" else "#00ff00" if x["properties"]["Name_EN"] == "Nam Dinh" else "#ffaf7a"}).add_to(map)
    for point in range(0, kh_location_list_size):
        tooltip = \
        f"""
        <b>NT</b>: <b>{df['makhdms'][point]} - {df['tenkhachhang'][point]}</b><br>
        <b>Kenh & Kenh Phu</b>: <b>{df['makenhkh'][point]} - {df['makenhphu'][point]}</b><br>
        <b>Lat & Lng</b>: <b>{df['lat'][point]} - {df['lng'][point]}</b><br>
        <b>DH</b>: {df['sldh'][point]}<br>
        <b>DS</b>: {round(df['doanhsochuavat'][point]/1000000, 2)}M<br>
        """
        # tooltip = "ABC"
        if df['makenhkh'][point] == 'TP':
            folium.Marker(kh_location_list[point], tooltip=tooltip, icon=folium.Icon(color='green', icon_color='white', angle=0, prefix='fa')).add_to(map)
        elif any([df['makenhkh'][point] == 'INS', df['makenhkh'][point] == 'CLC']):
            folium.Marker(kh_location_list[point], tooltip=tooltip, icon=folium.Icon(color='red', icon_color='white', angle=0, prefix='fa')).add_to(map)
        else:
            folium.Marker(kh_location_list[point], tooltip=tooltip, icon=folium.Icon(color='blue', icon_color='white', angle=0, prefix='fa')).add_to(map)
    # import datetime
    str_time = datetime.datetime.now().strftime(format="%Y%m%d%H%M%S")
    output_file = f"map_{str_time}.html"
    blobname = f"public/maps/{output_file}"
    map.save(output_file)
    # import os
    url = upload_file_to_bucket_with_metadata(blobname=blobname, file=output_file)
    # url
    os.remove(f"map_{str_time}.html")
    dict_data['map_string'] = url
    return Response(dict_data, status.HTTP_200_OK)

@api_view(['POST'])
def GetRoutes(request):
    dict_data = request.data
    kenh = dict_data['kenh']
    kenh_tpl = tuple(kenh)
    kenh_tpl = kenh_tpl + ('',) + ('',)
    manv = sorted(dict_data['manv'])
    manv_tpl = tuple(manv)
    manv_tpl = manv_tpl + ('',) + ('',)
    onDate = dict_data['onDate']
    fg = dict_data['fg']
    # fromDate
    # df = pd.read_csv("https://cloud.merapgroup.com/index.php/s/DCcRCMGYJyLSjgg/download/Hanam_Namdinh_Ninhbinh.csv", encoding="utf-8")
    # df = df.sort_values(by="manv")
    # manv_tpl = tuple(df.manv.to_list())
    len_tpl = len(manv)
    color_lst = ['red', 'blue', 'green', 'purple', 'orange', 'gray', 'black', 'pink', 'red', 'blue', 'green', 'purple', 'orange', 'gray', 'black', 'pink', 'red', 'blue', 'green', 'purple', 'orange', 'gray', 'black', 'pink']
    color_lst = color_lst[0:len_tpl]

    data = {
        'manv': manv,
        'fg': fg,
        'cl': color_lst
    }

    print(data)

    df = pd.DataFrame(data)

    # url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHV5dnEiLCJhIjoiY2xqaGJ5anJtMGg1bTNtbzJxNHl1bmtzNCJ9.EMV1gOcu5ild0gIepl9vdQ"
    map = folium.Map(
        location=[10.7681538,106.6751171], 
        zoom_start=5, 
        tiles=None,
        zoom_control=True,
        control_scale=True)
    
    # folium.TileLayer(
    #     url,
    #     attr='mapbox',
    #     name='MapBox'
    # ).add_to(map)

    folium.TileLayer('openstreetmap').add_to(map)

    draw = Draw()
    draw.add_to(map)
    lc = folium.LayerControl(collapsed=False)
    sql = \
    f"""
    with all_check as
    (
    SELECT
    slsperid,
    locationtime as updatetime,
    lat,
    lng,
    null as custid,
    "PING" as checktype,
    null as numbercico,
    1 as stt
    FROM staging.d_locationtime where date(LocationTime) ='{onDate}' and slsperid in {manv_tpl}

    UNION ALL

    SELECT
    slsperid,
    updatetime,
    lat,
    lng,
    custid,
    checktype,
    numbercico,
    2 as stt
    FROM staging.d_checkin where date(updatetime) ='{onDate}' and slsperid in {manv_tpl}
    and checktype = 'IO'

    UNION ALL

    SELECT
    a.slsperid,
    sa_updatetime as updatetime,
    b.lat,
    b.lng,
    custid,
    'SA' as checktype,
    a.numbercico,
    3 as stt
    FROM staging.sync_dms_sacheckin a 
    LEFT JOIN staging.d_checkin b
    on a.numbercico = b.numbercico
    and date(b.updatetime) = '{onDate}'
    and b.checktype = 'IO'
    where date(sa_updatetime) ='{onDate}' and a.slsperid in {manv_tpl}

    UNION ALL

    SELECT
    a.slsperid,
    de_updatetime as updatetime,
    b.lat,
    b.lng,
    custid,
    'DE' as checktype,
    a.numbercico,
    4 as stt
    FROM staging.sync_dms_decheckin a
    LEFT JOIN staging.d_checkin b
    on a.numbercico = b.numbercico
    and b.checktype = 'IO'
    and date(b.updatetime) = '{onDate}'
    where date(de_updatetime) ='{onDate}' and a.slsperid in {manv_tpl}

    )

    , data_tuyen as (
    SELECT a.custid, a.slsperid, a.crtd_datetime,
    Case when routetype in ('B','D') then 1 else 2 end as routetype,
    FROM `spatial-vision-343005.staging.sync_dms_srm`  a
    INNER JOIN `spatial-vision-343005.staging.d_master_khachhang`  b on a.custid = b.custid and b.channel in {kenh_tpl}
    where delroutedet is false and routetype in ('B','D') and slsperid in {manv_tpl}
    )

    , merged as
    (
    select * from all_check
    UNION ALL
    select
    slsperid,
    null as updatetime,
    lat,
    lng,
    custid,
    'MCP' as checktype,
    null as numbercico,
    4 as stt
    from (
    select a.*,row_number() over (partition by a.custid order by routetype asc,a.crtd_datetime desc) as loc ,lat,lng 

    from data_tuyen a 
    LEFT JOIN `staging.d_master_khachhang` b on a.custid = b.custid

    )
    where loc =1
    )

    select a.*, b.custname from merged a LEFT JOIN `staging.d_master_khachhang` b on a.custid = b.custid
    order by stt,slsperid, updatetime asc
    """
    # print("sql", sql)
    df_all = get_bq_df(sql)
    # vc(df_all, "checktype")
    df_dms = df_all.copy()
    df_dms = db.sql("select a.*, b.cl, b.fg from df_dms a left join df b on a.slsperid = b.manv").df()
    # df['manv'] = df['manv'] + ' ' + df['role'] + ' ' + df['tencvbh']
    # manv_tpl = df['manv'].to_list()
    # manv_tpl
    df_dms = df_dms[df_dms.lat > 0].copy()
    lst_df = [v for k, v in df_dms.groupby('slsperid')]

    for df in lst_df:
        fg = db.query("""select fg from df limit 1""").fetchone()[0]
        cl = db.query("""select cl from df limit 1""").fetchone()[0]
        feature_group = folium.FeatureGroup(name=f"{fg} {cl.upper()}")
        #Handle PING
        df_ping = df[df['checktype'] == "PING"].copy()
        if df_ping.shape[0] != 0:
            data_gpd=geopandas.GeoDataFrame(df_ping,geometry=geopandas.points_from_xy(df_ping.lng,df_ping.lat),crs="EPSG:4326").to_crs("EPSG:6340")
            data_gpd_pv = data_gpd.shift(1)
            df_ping['distance_from_previous'] = data_gpd['geometry'].distance(data_gpd_pv['geometry'])
            df_ping.fillna(6.00, inplace=True)
            df_ping = df_ping[df_ping['distance_from_previous'] >= 1].copy()
            df_ping = df_ping[df_ping['distance_from_previous'] <= 20000].copy()
            folium.PolyLine(locations = df_ping[['lat','lng']].values, color=f"{cl}", dash_array='5').add_to(feature_group)
        else:
            pass
        #Handle MCP
        df_MCP = df[df['checktype'] == "MCP"].copy()
        for row in df_MCP.itertuples():
            folium.CircleMarker( location=[row.lat, row.lng],
            radius=5,
            fill=True,
            color = f"{cl}",
            popup=row.custid+'-'+row.custname,
            fill_opacity=0.5).add_to(feature_group)
        feature_group.add_to(map)
        #Handle IO
        dfIO = df[df['checktype'] == "IO"].copy().reset_index()
        dfSA = df_all[df_all['checktype'] == "SA"]
        dfSA = dfSA[['numbercico','checktype']]
        dfSA.columns = ['numbercico', 'check']
        dfDE = df_all[df_all['checktype'] == "DE"]
        dfDE = dfDE[['numbercico','checktype']]
        dfDE.columns = ['numbercico', 'check']
        dfIO['checksa'] = dfIO['numbercico'].map(df_to_dict(dfSA))
        dfIO['checkde'] = dfIO['numbercico'].map(df_to_dict(dfDE))
        dfIO['checkde'].fillna('IN',inplace=True)
        dfIO['checksa'].fillna('IN',inplace=True)
        dfIO['check'] = dfIO['checksa'] + dfIO['checkde']
        if dfIO.shape[0] != 0:
            data_gpd=geopandas.GeoDataFrame(dfIO,geometry=geopandas.points_from_xy(dfIO.lng,dfIO.lat),crs="EPSG:4326").to_crs("EPSG:6340")
            data_gpd_pv = data_gpd.shift(1)
            dfIO['distance_from_previous'] = data_gpd['geometry'].distance(data_gpd_pv['geometry'])
            dfIO['distance_from_previous'].fillna(0.00, inplace=True)
            dfIO['g'] = dfIO['distance_from_previous'] > 10
            dfIO['g'] = dfIO.g.cumsum()
            dfIO['count'] = 1
            dfIO['meter'] = dfIO.groupby(['g'])['count'].cumsum()-1
            def getnewcor(lng, meter, lat):
                earth = 6378.137
                m = (1 / ((2 * pi / 360) * earth)) / 1000
                return lng + (20*meter* m) / cos(lat * (pi / 180))
            dfIO['new_lng'] = dfIO.apply(lambda x: getnewcor(x['lng'], x['meter'], x['lat']), axis=1)
            dfIO['lng'] = np.where(dfIO.meter > 0, dfIO.new_lng, dfIO.lng)
            # dfIO[['lng','new_lng']]
            for row in dfIO.itertuples():
                tooltip = \
                f"""
                <b>NT</b>: <b>{row.custid} - {row.custname}</b><br>
                <b>Lat & Lng</b>: <b>{row.lat} - {row.lng}</b><br>
                <b>Time</b>: {row.updatetime}<br>
                """
                if row.check == "SAIN":
                    bt_icon = folium.plugins.BeautifyIcon(iconSize=[20,20], iconShape = "marker", borderWidth = 2, border_color="black", number=row.Index+1, background_color=f"{cl}", textColor="white")
                elif row.check == "INDE":
                    bt_icon = folium.plugins.BeautifyIcon(iconSize=[20,20], iconShape = "rectangle", borderWidth = 2, border_color="black", number=row.Index+1, background_color=f"{cl}", textColor="white")
                else:
                    bt_icon = folium.plugins.BeautifyIcon(iconSize=[20,20], iconShape = "circle", borderWidth = 2, border_color="black", number=row.Index+1, background_color=f"{cl}", textColor="white")
                folium.Marker(location=[row.lat, row.lng],
                tooltip = tooltip,
                icon=bt_icon,
                draggable=True,
                tags=row.check
                ).add_to(feature_group)
            else:
                pass
        feature_group.add_to(map)
    # Handle hub con
    HUBCON = pd.read_csv("https://cloud.merapgroup.com/index.php/s/Yy6rN3rrzpJCBgT/download/hubcon.csv")
    for row in HUBCON.itertuples():
        bt_icon = folium.plugins.BeautifyIcon(iconSize=[30,30], icon="home", iconShape = "marker", borderWidth = 2, border_color="black")
        tooltip = \
        f"""
        <b>NT</b>: <b>{row.hubname}</b>
        """        
        folium.Marker(location=[row.lat, row.lng], tooltip=tooltip, icon=bt_icon).add_to(map)

    # import datetime
    TagFilterButton(['SAIN','INDE','ININ']).add_to(map)
    lc.add_to(map)
    str_time = datetime.datetime.now().strftime(format="%Y%m%d%H%M%S")
    output_file = f"map_{str_time}.html"
    blobname = f"public/maps/{output_file}"
    map.save(output_file)
    url = upload_file_to_bucket_with_metadata(blobname=blobname, file=output_file)
    os.remove(f"map_{str_time}.html")
    dict_data['map_string'] = url
    return Response(dict_data, status.HTTP_200_OK)