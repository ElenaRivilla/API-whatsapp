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
def getUsersMessages(loadSize, user1, user2):
    messages = db.getMessages(loadSize, user1, user2)
    return messages

# Function to get specific user friends
@app.get('/getFriends/{username}')
def getFriends(username: str):
    friendsList = db.getFriends(username)
    return friendsList