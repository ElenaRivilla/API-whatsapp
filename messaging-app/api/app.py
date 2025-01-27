from fastapi import FastAPI, Depends, HTTPException, status
import datetime
from database import database

db = database()
app = FastAPI()

#Get group messages
@app.get('/getMessages/{loadSize}/{idGroup}')
def getGroupMessages(loadSize, idGroup):
    messages = db.getMessages(loadSize, idGroup)
    return messages

#Get specific chat messages
@app.get('/getMessages/{loadSize}/{user1}/{user2}')
def getUsersMessages(loadSize: int, user1: str , user2: str):
    id1 = db.getUserId(user1)
    id2 = db.getUserId(user2)
    messages = db.getMessages(loadSize, id1, id2)
    return messages