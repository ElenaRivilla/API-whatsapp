from fastapi import FastAPI, Depends, HTTPException, status
import datetime
from database import database
from models import Group, UsuarisClase, UserGroup, Message

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
        raise e
        
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