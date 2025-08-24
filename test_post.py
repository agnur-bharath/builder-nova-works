import requests
import sys

payload = {"description": "test character from script"}
try:
    r = requests.post('http://127.0.0.1:5001/generate-avatar', json=payload, headers={'Origin':'http://localhost:8081','Content-Type':'application/json','Accept':'image/png'})
    print('Status:', r.status_code)
    print('Headers:')
    for k, v in r.headers.items():
        print(f"{k}: {v}")
    print('Body length:', len(r.content))
except Exception as e:
    print('Error:', e)
