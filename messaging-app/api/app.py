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
        print("CONTRASEÑA", stored_hash['contraseña_encriptada'], request.PASSWORD)

        # Verificar la contraseña comparando el hash almacenado con la contraseña proporcionada
        if verify_password(stored_hash['contraseña_encriptada'], request.PASSWORD):
            return {"message": "Inicio de sesión exitoso", "usuario": user_id}
        else:
            raise HTTPException(status_code=401, detail='Contraseña incorrecta')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TODO falta revisar y terminar
def encrypt_password(password, mem_cost, block_size, parallelization, salt):
    # Codificar la contraseña en bytes
    password_encoded = password.encode('utf-8')
    
    # Crear el objeto Scrypt con los parámetros proporcionados
    kdf = Scrypt(
        salt=salt,
        length=64,  # La longitud de la clave derivada (generalmente 64)
        n=mem_cost,
        r=block_size,
        p=parallelization,
        backend=default_backend()
    )
    
    # Derivar la clave
    derived_key = kdf.derive(password_encoded)
    
    return derived_key

@app.post('/login')
def verify_password():
    try:
        # Ejemplo de uso
        stored_hash = "scrypt:32768:8:1$WEPJFaJjJwPpKXJc$b718e9d6dddccbd220b218196f33cef51cb21825e4bebab777b8b7a0c7cbc10e4a2f6557579f723bf08e7c6de9b5076de8501f8c4ab4a212e746a68235ed83d2"
        password = "45192834"
        
        # Extraer los parámetros del hash almacenado
        algorithm, mem_cost, block_size, parallelization, salt, stored_key = re.split('[:$]', stored_hash)
        
        # Decodificar el salt (Base64) y el stored_key (Hexadecimal)
        salt = urlsafe_b64decode(salt)
        stored_key = bytes.fromhex(stored_key)
        
        # Debugging: Verifica el valor del salt y la clave almacenada
        print(f"Salt (Bytes): {salt}")
        print(f"Stored Key (Hex): {stored_key.hex()}")
        print(f"Expected Derived Key Length: {len(stored_key)}")
        
        # Usar la función encrypt_password para derivar la clave con la contraseña proporcionada
        derived_key = encrypt_password(password, int(mem_cost), int(block_size), int(parallelization), salt)
        
        # Debugging: Verificar la clave derivada generada
        print(f"Derived Key (Hex): {derived_key.hex()}")
        print(f"Actual Derived Key Length: {len(derived_key)}")
        
        # Comparar la clave derivada con la clave almacenada de manera segura
        if derived_key == stored_key:
            print("Password verification successful.")
            return True
        else:
            print("Password verification failed. Keys do not match.")
            return False
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False


    
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