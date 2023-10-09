import pandas as pd
import numpy as np
from contextlib import closing
from django.conf import settings
from google.cloud import storage, bigquery
# from google.oauth2 import service_account
# from googleapiclient import discovery
import os
import pyodbc

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "bigquery1508.json" if settings.LOCAL == "1" else '/app/bigquery1508.json'
pjt = 'spatial-vision-343005'
dts = '.biteam'

def check_exist_ms(sql):
    server = '115.165.164.235'
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


def get_eotoken(manv, password):
    import requests
    from requests.structures import CaseInsensitiveDict
    # url = f"""https://eoffice.merapgroup.com/eoffice/api/api/auth/login"""
    headers = CaseInsensitiveDict()
    headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    headers['accept'] = 'application/json'
    headers['content-type'] = 'application/json; charset=UTF-8'
    headers['Host'] = 'eoffice.merapgroup.com'
    headers['client-id'] = '109065-26376-79422-746832'
    data = {'username':f'{manv}', 'password':f'{password}'}
    print("data", data)
    r = requests.post("https://eoffice.merapgroup.com/eoffice/api/api/auth/login", json=data, headers=headers)
    print(r.json())
    if any([r.status_code == 200, r.status_code == 201]):
        return {"manv":r.json()['user']['code_id'], "token": r.json()['token'], "trangthaihoatdong": r.json()['user']['ldap_email'] }
    else:
        return {"manv":manv, "token": "Get Token Failed", "trangthaihoatdong": 0 }
    

def get_eostatus(token):
    import requests
    from requests.structures import CaseInsensitiveDict
    headers = CaseInsensitiveDict()
    headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    headers['accept'] = 'application/json'
    headers['content-type'] = 'application/json; charset=UTF-8'
    headers['Host'] = 'eoffice.merapgroup.com'
    headers['Authorization'] = f'Bearer {token}'
    r = requests.get("https://eoffice.merapgroup.com/eoffice/api/api/oauth2/user", headers=headers)
    print(r.json())
    if any([r.status_code == 200, r.status_code == 201]):
        return {"check": bool(r.json()['user']['ldap_email']), "token": r.json()['token'], "manv":  r.json()['user']['code_id']}
    else:
        return {"check":False, "token":"Get Token Failed", "manv":"Get Manv Failed"}