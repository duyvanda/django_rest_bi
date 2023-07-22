import pandas as pd
# import pandas_gbq as pdq
import numpy as np
# import psycopg2
# import sys, csv, unidecode, pyodbc, os, time
# from sqlalchemy import create_engine, Table, MetaData
# from sqlalchemy.dialects import postgresql
from contextlib import closing
# from sqlalchemy import create_engine
# from typing import Iterable, List, Optional, Tuple
# from datetime import datetime, timedelta
# import psycopg2.extras as extras
from django.conf import settings
from google.cloud import storage, bigquery
from google.oauth2 import service_account
from googleapiclient import discovery
import os
import pyodbc

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "bigquery1508.json" if settings.LOCAL == "1" else '/app/bigquery1508.json'
pjt = 'spatial-vision-343005'
dts = '.biteam'

def check_exist_ms(sql):
    server = '101.99.42.27'
    driver = 'SQL Server'
    db1 = 'MERAPLION_PRO'
    tcon = 'no'
    uname = 'esales_sync'
    pword = 'Hqs0fteSal3sd0toM3r2p'
    with closing(pyodbc.connect(driver='{ODBC Driver 17 for SQL Server}', host=server, database=db1, trusted_connection=tcon, user=uname, password=pword)) as cnxn:
            with closing(cnxn.cursor()) as cursor:
                data = cursor.execute(sql).fetchone()
                x = False if data[0] == 0 else True
                return x

def get_bq_client():
    client = bigquery.Client()
    return client

def upload_file_to_bucket(blobname: str, imagefile, filetype='text/csv', bucketname='django_media_biteam'):
    '''
    bucketname: default is django_media_biteam
    blobname: strpath example bucket.blob("admin/duy.csv")
    df_tocsv_method: df.to_csv(index=False)
    filetype: default is text/csv, can be 'application/json'
    '''
    with closing(storage.Client()) as client:
        bucket = client.get_bucket(bucketname)
        blob = bucket.blob(blobname)
        blob.upload_from_string(imagefile, content_type=filetype)
        return blob.public_url

def upload_file_to_bucket_with_metadata(blobname: str, file, bucketname='django_media_biteam'):
    '''
    bucketname: default is django_media_biteam
    blobname: strpath example bucket.blob("admin/duy.csv")
    file: D:/duy.csv
    filetype: default is text/csv, can be 'application/json'
    '''
    with closing(storage.Client()) as client:
        bucket = client.get_bucket(bucketname)
        blob = bucket.blob(blobname)
        # metadata = {'Cache-Control': 'no-cache'}
        # blob.metadata = metadata
        blob.cache_control = 'no-cache'
        blob.upload_from_filename(file)
        return blob.public_url

def download_pk_files(blobname: str, filetype='text/csv', bucketname='django_media_biteam'):
    '''
    bucketname: default is django_media_biteam
    blobname: strpath example bucket.blob("admin/duy.csv")
    df_tocsv_method: df.to_csv(index=False)
    filetype: default is text/csv, can be 'application/json'
    '''
    with closing(storage.Client()) as client:
        bucket = client.get_bucket(bucketname)
        blob = bucket.blob(blobname)
        pickle_in = blob.download_as_string()
        with open('phuongxa.pk','wb') as f:
            f.write(pickle_in)
        # metadata = {'Cache-Control': 'no-cache'}
        # blob.metadata = metadata
        # blob.download_from_string(imagefile, content_type=filetype)
        # print(os.getcwd())
        # print("Done")
        return pickle_in


def insert_google_sheet(data: list, spreadsheets_id: str, worksheetname: str = 'DATA!', cellrangeinsert: str = 'A1'):
    '''
    data: must be a list, can be list1, list2
    spreadsheets_id: spreadsheets_id
    worksheetname: DATA!, remember to put ! at the end
    cellrangeinsert: A1
    '''
    scopes = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file']
    jsonfile = 'bigquery1508.json' if settings.LOCAL == "1" else ('/app/bigquery1508.json')
    credentials = service_account.Credentials.from_service_account_file(jsonfile, scopes = scopes)
    service = discovery.build('sheets','v4',credentials = credentials)
    worksheetname = worksheetname
    cellrangeinsert = cellrangeinsert
    values = [data]
    value_range_body = {
        'majorDimension':'ROWS',
        'values': values
    }
    spreadsheets_id = spreadsheets_id
    service.spreadsheets().values().append(
        spreadsheetId = spreadsheets_id,
        valueInputOption='USER_ENTERED',
        range=worksheetname+cellrangeinsert,
        body=value_range_body
    ).execute()

# print("Default bq project: ",pjt+dts)
# download_pk_files(blobname="public/phuongxa.pk")


def get_bq_df(sql) -> pd.DataFrame():
    '''
    input a BQ SQL 
    '''
    # os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "D:/spatial-vision-343005-340470c8d77b.json"
    with closing(bigquery.Client()) as client:
        df = client.query(sql).to_dataframe()
        return df
    
def vc(df, subset=None):
    return df.value_counts(subset=subset, dropna=False).reset_index(name='counts')

def df_to_dict(df):
    """
    insert df with 2 columns
    """
    dict = df.set_index(df.columns[0]).to_dict()[df.columns[1]]
    return dict