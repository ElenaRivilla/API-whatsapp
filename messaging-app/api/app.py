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

db = database()
app = FastAPI()

#End-point to login
@app.post('/login')
def login(request: LoginRequest):
    
    try:
        # Obtener el ID del usuario desde la base de datos
        user_id = db.getUserId(request.USERNAME)
        
        if not user_id:
            raise HTTPException(status_code=404, detail='Usuario no encontrado')
        
        # Obtener el hash de la contraseña desde la base de datos
        stored_hash = db.loginCorrect(user_id)
        if not stored_hash:
            raise HTTPException(status_code=404, detail='Contraseña no encontrada')

        # Debugging: Imprimir valores de las contraseñas para depurar
        print("CONTRASEÑA", stored_hash, request.PASSWORD)
        print("USUARIO:", request.USERNAME, request.PASSWORD)

        # Verificar la contraseña comparando el hash almacenado con la contraseña proporcionada
        if verify_password(stored_hash, request.PASSWORD):
                return {"message": "Inicio de sesión exitoso", "user": user_id}
        else:
            raise HTTPException(status_code=401, detail='Contraseña incorrecta') 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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