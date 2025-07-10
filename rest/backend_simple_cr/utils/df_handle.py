import os
def get_eotoken(manv, password):
    import requests
    from requests.structures import CaseInsensitiveDict
    headers = CaseInsensitiveDict()
    headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    headers['accept'] = 'application/json'
    headers['content-type'] = 'application/json; charset=UTF-8'
    headers['Host'] = 'eoffice.meraplion.com'
    headers['client-id'] = '109065-26376-79422-746832'
    data = {'username':f'{manv}', 'password':f'{password}'}
    print("data", data)
    r = requests.post("https://eoffice.meraplion.com/admincp/api/api/auth/login", json=data, headers=headers, verify=True)
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
    headers['Host'] = 'eoffice.meraplion.com'
    headers['Authorization'] = f'Bearer {token}'
    r = requests.get("https://eoffice.meraplion.com/admincp/api/api/oauth2/user", headers=headers, verify=True)
    print(r.json())
    if any([r.status_code == 200, r.status_code == 201]):
        return {"check": bool(r.json()['user']['ldap_email']), "token": r.json()['token'], "manv":  r.json()['user']['code_id']}
    else:
        return {"check":False, "token":"Get Token Failed", "manv":"Get Manv Failed"}