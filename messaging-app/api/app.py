from fastapi import FastAPI, Depends, HTTPException, status
from datetime import datetime
from database import database
from models import UserGroup

db = database()
app = FastAPI()

#End-point to get group messages
@app.post('/getMessages/{loadSize}')
def getGroupMessages(loadSize: int, group_id: int):
    try:
        messages = db.getMessagesGroups(loadSize, group_id)
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
            group = db.infOfGroup(groupId)
            oldest_date = datetime.now()
            oldest_user = None

            for item in group:
                join_date = item['join_date']
                admin = item['admin']
                
                if admin == 1:
                    return {"message": "User successfully deleted. There is a admin in the group"}
                else:
                    if join_date < oldest_date:
                        oldest_date = join_date
                        oldest_user = item

            if oldest_user:
                userId = oldest_user['id_user']
                db.updateUserAdminStatus(userId, groupId)
                return {"message": f"User: {userId} is admin now."}
                            
        else:    
            return {"message": "User deleted or does not exist"}      
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