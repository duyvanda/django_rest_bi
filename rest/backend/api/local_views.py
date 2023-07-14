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
from utils.df_handle import pd, vc, df_to_dict, np, get_bq_client
from firebase_admin import firestore
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from google.cloud import logging
from google.cloud.logging_v2 import client
from google.cloud.logging_v2 import logger as lgr
from google.cloud.logging_v2.resource import Resource
import json, sys, os, requests, traceback, time, datetime, pickle, folium, geopandas
from contextlib import closing
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
num_str = str( (datetime.datetime.now().hour*0 + datetime.datetime.now().day*4 + datetime.datetime.now().month*3 + datetime.datetime.now().year*2) *123123)
token_s = """1Iujws5qaz2Nl1qcZpJ01D7Zb8cH7FaErnFG7uM3GxiL.hz7A.z4L1Y207QDWUx8TMN2g8e43jnzt9qFjJ5vQABwoBET.c2y7owPhZAmU4Tpn0YbOxk.MF"""
extra_s = """GIwSgZdtwXadjrHA.U9ftBp.SOis8YoKLU4yaj1U9ftBp_c2y7owPhZAmU4Tpn0YbOxkMFSOis8YoKLU4yaj1U9ftBp"""
token_str = extra_s+num_str
# logger = logging_client.logger(log_name)


@api_view(['GET'])
def nhacdon_pcl(request):
    QUERY = \
    """
    SELECT makhdms, tenkhachhang,phone, sotuan_chuadatdon  FROM `spatial-vision-343005.view_report.f_nhacdon_pcl` where dieukien_guitn = 0
    """
    client = get_bq_client()
    query_job = client.query(QUERY)
    records = [dict(row) for row in query_job]
    client.close()
    return Response(records)