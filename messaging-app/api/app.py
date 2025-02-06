from fastapi import FastAPI, Depends, HTTPException, status
from datetime import datetime, date
from database import database
from models import UserGroup, LastMessageUsers, LoginRequest
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from base64 import urlsafe_b64decode
import os
import re


db = database()
app = FastAPI()

#End-point to login
# TODO falta revisar y terminar
@app.post('/login')
def login(request: LoginRequest):
    try:
        user_id = db.getUserId(request.USERNAME)
        if not user_id:
            raise HTTPException(status_code=404, detail='Usuario no encontrado')
        stored_hash= db.loginCorrect(user_id)
        """ if not stored_hash:
            raise HTTPException(status_code=404, detail='Contraseña no encontrada')
        print("CONTRASEÑA", stored_hash['contraseña_encriptada'], request.PASSWORD)
        if verify_password(stored_hash['contraseña_encriptada'], request.PASSWORD):
            return {"message": "Inicio de sesión exitosa", "usuario": user_id}
        else:
            raise HTTPException(status_code=401, detail='Contraseña incorrecta') """
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/loginPrueba')
def verify_password():
    try:
        # Ejemplo de hash almacenado
        stored_hash = "scrypt:32768:8:1$WEPJFaJjJwPpKXJc$85f45fef7d073181d4993f80178e373349a0c55e791679c7ce00ce2da2612f7cd57ebf437d6cd97f01fc35c6fdaad9197e9bd0d638092c7a59b528074619b69e"
        password = "123456"  # Contraseña ingresada

        # Extraer los parámetros del hash almacenado
        algorithm, mem_cost, block_size, parallelization, salt, stored_key = re.split('[:$]', stored_hash)

        # Decodificar el salt (Base64) y stored_key (Hex)
        salt = urlsafe_b64decode(salt)
        stored_key = bytes.fromhex(stored_key)

        # Codificar la contraseña proporcionada
        password_encoded = password.encode('utf-8')

        # Imprimir la contraseña, salt y stored_key para depuración
        print(f"Contraseña (Codificada): {password_encoded}")
        print(f"Salt (Base64): {salt}")
        print(f"Stored Key (Hex): {stored_key.hex()}")

        # Crear el objeto Scrypt con los parámetros extraídos
        kdf = Scrypt(
            salt=salt,
            length=64,  # Longitud de la clave derivada
            n=int(mem_cost),
            r=int(block_size),
            p=int(parallelization),
            backend=default_backend()
        )

        # Derivar la clave con la contraseña proporcionada
        derived_key = kdf.derive(password_encoded)
        # Imprimir la clave derivada y su longitud para verificar
        print(f"Clave derivada (Hex): {derived_key.hex()}")
        print(f"Longitud de la clave derivada: {len(derived_key)}")

    except Exception as e:
        print(f"Error verifying password: {e}")
        return {"message": f"Error verifying password: {e}"}

    
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
            hora['fecha']=date.strftime(hora['fecha'], "%H:%M")
        return lastMessage
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