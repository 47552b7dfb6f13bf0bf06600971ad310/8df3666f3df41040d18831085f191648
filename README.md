## ENV Example
```
NAME = ENI Studio
SHORT_NAME = ENI
CLIENT_URL = http://localhost:3000
DOMAIN = localhost
HOST = localhost
PORT = 3000
COLLAB = 
SECRET = dev@only
MONGO_URI = mongodb://localhost:27017
MONGO_DB = DBWeb
TZ = Asia/Ho_Chi_Minh
IPX_MAX_AGE = 31536000
```

## URL Rewrite
```
location /items {
  alias /data/web/items;
}
```