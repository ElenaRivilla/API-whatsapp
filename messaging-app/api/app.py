from fastapi import FastAPI, Depends, HTTPException, status
from datetime import datetime, date, timedelta, timezone
from database import database
from models import UserGroup, LastMessageUsers, LoginRequest
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from base64 import urlsafe_b64decode
import hashlib
import base64
import os
import re
import math
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

db = database()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes. Puedes poner un dominio específico si lo prefieres, por ejemplo: ["https://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

SECRET_KEY = "ivillave"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def extractVars(hash):
    # La cadena se divide en las tres partes del formato scrypt
    parts = hash.split('$')
    # Partes esperadas: ["", "scrypt:32768:8:1", "sal", "hash"]
    if len(parts) == 3:
        # Extraer los parámetros de la parte "scrypt:32768:8:1"
        params = parts[0].split(':')
        n, r, p = int(params[1]), int(params[2]), int(params[3])
        # La sal es la segunda parte (después de "scrypt:...")
        salt = parts[1]
        # El hash es la última parte
        hash_value = parts[2]
        hash_value_byte_length = math.ceil(len(parts[2]) / 2)
        return salt, hash_value, n, r, p, hash_value_byte_length
    else:
        raise ValueError("Fallo interno del servidor")

def encrypt(attempt, salt, n, r, p, hash_value_byte_length):
    try:
        # Convertir la contraseña a bytes
        pwd_bytes = attempt.encode('utf-8')
        # Convertir la sal a bytes
        salt_bytes = salt.encode('utf-8')
        # Aplicar scrypt con los parámetros extraídos
        encrypted_bytes = hashlib.scrypt(pwd_bytes, salt=salt_bytes, n=n, r=r, p=p, dklen=hash_value_byte_length)
        return encrypted_bytes.hex()
    except Exception as e:
        raise e
    
def pwdMatches(attempt, stored):
    try:
        # Extraer la sal, hash y parámetros del hash almacenado
        salt, stored_hash_value, n, r, p, hash_value_byte_length = extractVars(stored)
        # Generar el hash con la contraseña propuesta y comparar
        attempt = encrypt(attempt, salt, n, r, p, hash_value_byte_length)
        print(attempt, stored_hash_value)
        return attempt == stored_hash_value
    except Exception as e:
        raise e

# Función para crear un token JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=120)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Función para verificar el token
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        userId: int = payload.get("sub")
        if userId is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token no válido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return userId
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido",
            headers={"WWW-Authenticate": "Bearer"},
        )

#End-point to login
@app.post('/login')
def login(request: LoginRequest):
    try:
        # requestDecrypted = funcion_de_desencriptar(request)
        pwd = db.getUserPasswd(request.USERNAME)
        if pwd:
            if pwdMatches(request.PASSWORD, pwd['password']):
                user = db.getUser(request.USERNAME)
                tkn = create_access_token({'sub': user['id']})
                return {'username': user['username'], 'bio': user['bio'], 'token': tkn}
        raise HTTPException(status_code=404, detail=str("Usuario o contraseña incorrectos"))
    except Exception as e:
        raise e
    
# @app.post('/login')
# def login(request: LoginRequest):
#     pwd = db.getUserPasswd(request.USERNAME)
#     if pwd:
#         if pwd['password'] == request.PASSWORD:
#             return {'token': 'XD'}
#     raise HTTPException(status_code=404, detail=str("Usuario o contraseña incorrectos"))
    
#End-point to get group messages
@app.get('/getMessages/{loadSize}/{idGroup}')
def getGroupMessages(loadSize: int, idGroup: int): # podriamos hacer una query para saber si el user que pide esto esta en el grupo, via token
    try:
        messages = db.getMessagesGroups(loadSize, idGroup)
        for message in messages:
            date_time = message['date']
            format = date_time.strftime('%Y-%m-%d %H:%M:%S') # convertir el objeto datetime a una cadena en formato ISO 8601 antes de devolverlo como parte de la respuesta JSON.
            message['date'] = format
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#End-point to get chat messages between two users
@app.get('/getMessages/{loadSize}/{user1}/{user2}')
def getUsersMessages(loadSize: int, user1: str , user2: str):
    try:
        messages = db.getMessagesUsers(loadSize, db.getUserId(user1), db.getUserId(user2))
        for message in messages:
            date_time = message['date']
            format = date_time.strftime('%H:%M') # convertir el objeto datetime a una cadena en formato ISO 8601 antes de devolverlo como parte de la respuesta JSON.
            message['date'] = format
        return messages
    except Exception as e:
        raise e

@app.post("/home")
def getHome(users: LastMessageUsers): # userId: int = Depends(verify_token)
    try:
        lastMessage = db.getLastMessagesUsers(users.ID_USER)
        for hora in lastMessage:
            hora['time'] = date.strftime(hora['time'], "%H:%M")
        data = {
            "contacts": [
            {
                "username": message['username'],
                "imageUrl": message['imageUrl'],
                "message": message['message'],
                "time": message['time']
            } for message in lastMessage
            ]
        }
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# End-point to get user friends
@app.get('/getFriends/{username}')
def getFriends(username: str):
    try:
        friendsList = db.getFriends(db.getUserId(username))
        return friendsList
    except Exception as e:
        raise e

# End-point to change message status
@app.get('/check/{messageId}')
def check(messageId: int):
    try:
        db.checkMessage(messageId)
        return
    except Exception as e:
        raise e
    
@app.post('/sendMessage')
def sendMessage(message: dict):
    try:                              
        date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        status = "sent"
        completedMessage = {
            "date": date,
            "status": status,
            **message
        }
        if not completedMessage['receiver_id']:
            db.sendGroupMessage(completedMessage)    
        else:
            db.sendUsersMessage(completedMessage)
    except Exception as e:
        raise e

# End-point to change admin status
@app.post('/updateUserAdminStatus')
def changeUserAdminStatus(userId: int, groupId: int):
    try:
        db.updateUserAdminStatus(userId, groupId)
        return {"message": "Admin status changed"}
    except Exception as e:
        raise e
    
@app.post('/deleteUserFromGroup')
def deleteUserFromGroup(userId: int, groupId: int):
    try:
        if db.userExistsInGroup(userId, groupId):
            db.deleteUserFromGroup(userId, groupId)
            deletedUsername = db.getUsername(userId)
            groupMembers = db.infOfGroup(groupId)
            oldestDate = datetime.now()
            oldestUser = None

            for member in groupMembers:
                joinDate = member['join_date']
                isAdmin = member['admin']
 
                if isAdmin == 1:       
                    return {"message": f"Usuario {deletedUsername} borrado correctamente. Hay un administrador en el grupo."}
                else:
                    if joinDate < oldestDate:
                        oldestDate = joinDate
                        oldestUser = member

            if oldestUser:
                userId = oldestUser['id_user']
                db.updateUserAdminStatus(userId, groupId)
                adminUsername = db.getUsername(userId)
                return {"message": f"Usuario {deletedUsername} borrado correctamente. Ahora el usuario {adminUsername} es administrador."}         
        else:    
            return {"message": "Usuario borrado o inexistente"}
    except Exception as e:
        raise e
    
@app.post('/addUserToGroup')
def addUserToGroup( user_group: UserGroup):
    try: 
        if db.userExistsInGroup(user_group.ID_USER, user_group.ID_GROUP):
            return {'message': 'El usuario ya pertenece al grupo'}
        
        join_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.addUserToGroup(user_group, join_date)
    except Exception as e:
        raise e