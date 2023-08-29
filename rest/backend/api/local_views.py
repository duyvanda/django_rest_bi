from base64 import encode
from django.shortcuts import render
from django.contrib.auth.models import User, AnonymousUser
from django.contrib.auth.hashers import make_password, check_password
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from requests.structures import CaseInsensitiveDict
from utils.df_handle import get_bq_client, get_bq_df, pd, np
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json, sys, os, requests, traceback, time, pickle
from contextlib import closing
from datetime import timedelta, datetime
from math import pi, cos
pk_path = '/app/thumuc/'

@api_view(['GET'])
def tinh(request):
    QUERY = \
    """
    SELECT * from staging.d_tinh
    """
    client = get_bq_client()
    query_job = client.query(QUERY)
    records = [dict(row) for row in query_job]
    client.close()
    return Response(records)


@api_view(['GET'])
def api_ds_theo_khach_example(request):
    request_params = request.query_params.dict()

    P_MAKHDMS = request_params.get('makhdms') if request_params.get('makhdms') is not None else ''
    P_STARTDATE = request_params.get('startdate') if request_params.get('startdate') is not None else ''
    P_ENDDATE = request_params.get('enddate') if request_params.get('enddate') is not None else ''
    P_PAGE = int(request_params.get('page')) if request_params.get('page') is not None else 1
    P_LIMIT = request_params.get('limit') if request_params.get('limit') is not None else ''


    QUERY = \
    f"""
    CALL staging_temp.api_ds_theo_khach_example('{P_STARTDATE}','{P_ENDDATE}','{P_PAGE}','{P_LIMIT}')
    """
    CACHED_API_CALL_PATH = pk_path+'staging_temp.api_ds_theo_khach_example'+P_STARTDATE+P_ENDDATE+'.pk'
    try:
    # LOOK FOR CACHED DATA FIRST
        assert pd.read_pickle(CACHED_API_CALL_PATH).expired_date.values[0] > np.datetime64(datetime.now())
        CACHED_DF = pd.read_pickle(CACHED_API_CALL_PATH)
        # OUTPUT DATA
        OUTPUT_DF = CACHED_DF.query(f" page=={P_PAGE} ")
        if P_MAKHDMS == '':
            pass
        else: OUTPUT_DF = OUTPUT_DF.query(f" makhdms=='{P_MAKHDMS}' ")

    except (FileNotFoundError, AssertionError) as e:
        CACHED_DF = get_bq_df(QUERY)
        print(CACHED_DF.shape)
        #CACHED RESULTS TO PICKPLE FILE
        x = 30 if datetime.now().minute >= 30 else 0
        CACHED_DF['expired_date'] = datetime.now().replace(minute=x, second=0, microsecond=0) + timedelta(minutes=31)
        CACHED_DF.to_pickle(CACHED_API_CALL_PATH)
        #END CACHED
        # OUTPUT DATA
        OUTPUT_DF = CACHED_DF.query(f" page=={P_PAGE} ")
        if P_MAKHDMS == '':
            pass
        else: OUTPUT_DF = OUTPUT_DF.query(f" makhdms=='{P_MAKHDMS}' ")

    
    res_data = OUTPUT_DF.to_dict(orient='records')   
    response = \
    {
    'rows': CACHED_DF.shape[0],
    'data': res_data
    }
    return Response(response)


@api_view(['GET'])
def GetData(request):
    sql = """SELECT * from staging.d_tinh"""
    df = get_bq_df(sql)
    return Response(request.META, status.HTTP_200_OK)
