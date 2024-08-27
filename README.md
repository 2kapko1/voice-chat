# Voice chat Demo

## Instalacja
1. mkdir ssl
2. cd ssl
3. openssl genrsa -out client-key.pem 2048
4. openssl req -new -key client-key.pem -out client.csr
5. openssl x509 -req -in client.csr -signkey client-key.pem -out client-cert.pem
6. npm install

## Run
<code>npm run start</code> lub <code>npm run startssl</code>

start - http://localhost:3000

startssl - https://localhost:3001

npm run start startssl - działa po https u mnie wymagał to telefon żeby działał mikrofon jak łączę sie po ip
