from fastapi import FastAPI, Depends, HTTPException, status
from datetime import datetime
from database import database
from models import UserGroup

db = database()
app = FastAPI()

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