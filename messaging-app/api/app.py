from fastapi import FastAPI, Depends, HTTPException, status
from datetime import datetime, date
from database import database
from models import UserGroup, LastMessageUsers, LoginRequest
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from base64 import urlsafe_b64decode
import hashlib
import base64
import os
import re
from fastapi.middleware.cors import CORSMiddleware

db = database()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes. Puedes poner un dominio específico si lo prefieres, por ejemplo: ["https://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

def extractVars(hash):
    # La cadena se divide en las tres partes del formato scrypt
    parts = hash.split('$')
    # Partes esperadas: ["", "scrypt:32768:8:1", "sal", "hash"]
    if len(parts) == 3:
        # Extraer los parámetros de la parte "scrypt:32768:8:1"
        params = parts[0].split(':')
        n, r, p = int(params[0]), int(params[1]), int(params[2])
        # La sal es la segunda parte (después de "scrypt:...")
        salt = parts[1]
        # El hash es la última parte
        hash_value = parts[2]
        hash_value_byte_length = len(parts[2]) / 2
        return salt, hash_value, n, r, p, hash_value_byte_length
    else:
        raise ValueError("Fallo interno del servidor")

def encrypt(attempt, salt, n, r, p, hash_value_byte_length):
    try:
        # Convertir la contraseña a bytes
        pwd_bytes = attempt.encode('utf-8')
        # Aplicar scrypt con los parámetros extraídos
        encrypted_bytes = hashlib.scrypt(pwd_bytes, salt=bytes.fromhex(salt), n=n, r=r, p=p, dklen=hash_value_byte_length)
        return encrypted_bytes.hex()
    except Exception as e:
        raise e
    
def pwdMatches(attempt, stored):
    try:
        # Extraer la sal, hash y parámetros del hash almacenado
        salt, stored_hash_value, n, r, p = extractVars(stored)
        # Generar el hash con la contraseña propuesta y comparar
        attempt = encrypt(attempt, salt, n, r, p)
        return attempt == stored_hash_value
    except Exception as e:
        raise e

def generateToken(user):
    return {'token': 'XD'}

#End-point to login
@app.post('/login')
def login(request: LoginRequest):
    try:
        # requestDecrypted = funcion_de_desencriptar(request)
        pwd = db.getUserPasswd(request.USERNAME)
        if pwd:
            if pwdMatches(request.PASSWORD, pwd['password']):
                tkn = generateToken(db.getUser(request.USERNAME))
                return tkn
        raise HTTPException(status_code=404, detail=str("Usuario o contraseña incorrectos"))
    except Exception as e:
        raise e

def prueba(request: LoginRequest):
    pwd = db.getUserPasswd(request.USERNAME)
    if pwd:
        if pwd['password'] == request.PASSWORD:
            return {'token': 'XD'}
    raise HTTPException(status_code=404, detail=str("Usuario o contraseña incorrectos"))

@app.post('/pruebaEncriptación')
def verify_password(password: str, stored_hash: str) -> str:
    try:
        # Extraer valores desde la contraseña encriptada
        parts = stored_hash.split("$")
        algo_params, salt_b64, _ = parts
        _, N, r, p = algo_params.split(":")
        
        # Convertir parámetros a enteros
        N, r, p = int(N), int(r), int(p)

        # Limitar N si es demasiado alto
        if N > 8192:  # ⚠️ Ajustar este valor si sigue fallando
            print(f"⚠️ N={N} es demasiado alto, reduciendo a 8192.")
            N = 8192

        # Decodificar la salt de Base64
        salt = base64.b64decode(salt_b64)

        # Generar el hash con scrypt usando la misma salt
        dklen = 64
        key = hashlib.scrypt(password.encode(), salt=salt, n=N, r=r, p=p, dklen=dklen)
        hashed_password_hex = key.hex()

        return f"scrypt:{N}:{r}:{p}${salt_b64}${hashed_password_hex}"
    
    except ValueError as e:
        print(f"🚨 Error: {e}")
        return None  # Devuelve None si hay un error

    
#End-point to get group messages
@app.get('/getMessages/{loadSize}/{idGroup}')
def getGroupMessages(loadSize: int, idGroup: int):
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
            format = date_time.strftime('%Y-%m-%d %H:%M:%S') # convertir el objeto datetime a una cadena en formato ISO 8601 antes de devolverlo como parte de la respuesta JSON.
            message['date'] = format
        return messages
    except Exception as e:
        raise e

@app.get("/home")
def getHome(users: LastMessageUsers):
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