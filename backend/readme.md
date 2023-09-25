**Register**:
method: POST
url: http://localhost:5000/api/user/register
request: {
"email": "test@test.test",
"password": "test"
}
response: {
"token": "token"
}

**Login**:
method: POST
url: http://localhost:5000/api/user/login
request: {
"email": "test@test.test",
"password": "test"
}
response: {
"token": "token"
}
