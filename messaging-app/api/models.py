from pydantic import BaseModel
from datetime import date, datetime

class Group(BaseModel):
    id: int
    name: str
    description: str
    size: int
    creation_date: date
    
class UsuarisClase(BaseModel):
    id:int
    username: str
    password: str
    bio: str

class UserGroup(BaseModel):
    id_group: int
    id_user: int
    join_date: datetime
    admin: int  #revisar el tinyint de la DB es un bool
    
class Message(BaseModel):
    id: int
    date: datetime
    status: str
    body: str
    sender_id: int
    receiver_id: int
    group_id: int 