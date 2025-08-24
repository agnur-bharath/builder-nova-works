import requests

r = requests.options(
    'http://127.0.0.1:5001/generate-avatar',
    headers={
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Accept'
    }
)

print('Status:', r.status_code)
print('Headers:')
for k, v in r.headers.items():
    print(f"{k}: {v}")
print('Body:', r.text)
