from fastapi import FastAPI, Depends, HTTPException, status
import datetime
from database import database

db = database()
app = FastAPI()

#End-point to get group messages
@app.get('/getMessages/{loadSize}/{idGroup}')
def getGroupMessages(loadSize: int, idGroup: int):
    messages = db.getMessages(loadSize, idGroup)
    return messages

#End-point to get chat messages between two users
@app.get('/getMessages/{loadSize}/{user1}/{user2}')
def getUsersMessages(loadSize: int, user1: str , user2: str):
    messages = db.getMessages(loadSize, db.getUserId(user1), db.getUserId(user2))
    return messages

# End-point to get user friends
@app.get('/getFriends/{username}')
def getFriends(username: str):
    friendsList = db.getFriends(db.getUserId(username))
    return friendsList

# End-point to change message status
@app.get('/check/{messageId}')
def check(messageId: int):
    try:
        db.checkMessage(messageId)
        return
    except Exception as e:
        raise e