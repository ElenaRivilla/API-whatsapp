import pymysql.cursors
from datetime import datetime
from models import UserGroup

class database(object):
    def conecta(self):
        self.db = pymysql.connect(host='localhost',
                                     user='root',
                                     db='tricod',
                                     charset='utf8mb4',
                                     autocommit=True,
                                     cursorclass=pymysql.cursors.DictCursor)
        self.cursor = self.db.cursor()

    def desconecta(self):
        self.db.close()

    def getUsers(self):
        self.conecta()
        sql="SELECT * from usuarisclase;"
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def getUser(self, username):
        self.conecta()
        sql="SELECT password from usuarisclase where username = %s;"
        self.cursor.execute(sql, (username))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        return ResQuery

    def getGroups(self):
        self.conecta()
        sql="SELECT * from groups;"
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def getMessagesUsers(self, loadSize, user1_id, user2_id):
        self.conecta()
        sql = """
                SELECT m.* FROM message m
                JOIN usuarisclase u ON u.id = m.sender_id
                WHERE m.sender_id = %s AND m.receiver_id = %s
                ORDER BY m.date DESC
                LIMIT %s;
        """
        self.cursor.execute(sql, (user1_id, user2_id, loadSize))
        ResQuery = self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def getLastMessagesUsers(self, userId):
        self.conecta()
        sql= """SELECT 
                u.username AS username,
                m.body AS message,
                m.date AS time,
                u.image AS imageUrl
                FROM message m
                JOIN usuarisclase u ON u.id = m.receiver_id
                WHERE m.sender_id = %s 
                AND m.date = (SELECT MAX(m2.date) 
                             FROM message m2 
                             WHERE m2.sender_id = m.sender_id 
                             AND m2.receiver_id = m.receiver_id)
                ORDER BY time DESC;"""
        self.cursor.execute(sql,(userId))
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    def getMessagesGroups(self, loadSize, group_id):
        self.conecta()
        sql = """
                SELECT m.* FROM message m
                JOIN groups g ON g.id = m.group_id
                WHERE m.group_id = %s
                ORDER BY m.date DESC
                LIMIT %s;
        """
        self.cursor.execute(sql, (group_id, loadSize))
        ResQuery = self.cursor.fetchall()
        self.desconecta()
        return ResQuery

    def getFriends(self, userId):
        self.conecta()
        sql="SELECT id, username, password, bio FROM usuarisclase WHERE id != %s"
        self.cursor.execute(sql, (userId))
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def getUserGroup(self):
        self.conecta()
        sql="SELECT * from user_group;"
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def getUserId(self, username):
        self.conecta()
        sql='SELECT id from usuarisclase where username = %s;'
        self.cursor.execute(sql, (username))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if not ResQuery:
            raise Exception("Usuario no encontrado")
        return ResQuery['id']
    
    def getUsername(self, userId):
        self.conecta()
        sql="SELECT username FROM usuarisclase WHERE id = %s"
        self.cursor.execute(sql, (userId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        return ResQuery['username']
        
    def getGroupId(self, group_name):
        self.conecta()
        sql='SELECT id from groups where name = %s;'
        self.cursor.execute(sql, (group_name))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if not ResQuery:
            raise Exception("Grupo no encontrado")
        return ResQuery['id']

    def userExists(self, userId):
        self.conecta()
        sql='SELECT * from usuarisclase where id = %s;'
        self.cursor.execute(sql, (userId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteUser(self, userId):
        if not self.userExists(userId):
            raise Exception("Usuario no encontrado")
        self.conecta()
        sql='DELETE from usuarisclase where id = %s;'
        self.cursor.execute(sql, (userId))
        self.desconecta()
        return
    
    def groupExists(self, groupId):
        self.conecta()
        sql='SELECT * from groups where id = %s;'
        self.cursor.execute(sql, (groupId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteGroup(self, groupId):
        if not self.groupExists(groupId):
            raise Exception("Grupo no encontrado")
        self.conecta()
        sql='DELETE from groups where id = %s;'
        self.cursor.execute(sql, (groupId))
        self.desconecta()
        return
    
    def messageExists(self, messageId):
        self.conecta()
        sql='SELECT * from message where id = %s;'
        self.cursor.execute(sql, (messageId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteMessage(self, messageId):
        if not self.messageExists(messageId):
            raise Exception("Mensaje no encontrado")
        self.conecta()
        sql='DELETE from message where id = %s;'
        self.cursor.execute(sql, (messageId))
        self.desconecta()
        return
    
    def userExistsInGroup(self, userId, groupId):
        self.conecta()
        sql='SELECT * from user_group where id_user = %s and id_group = %s;'
        self.cursor.execute(sql, (userId, groupId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def addUserToGroup(self, user_group: UserGroup, join_date):
       self.conecta()
       sql="INSERT INTO user_group VALUES (%s, %s, %s, 0);"
       self.cursor.execute(sql,(user_group.ID_GROUP, user_group.ID_USER, join_date))
       self.cursor.fetchone()
       self.desconecta()
        
    def deleteUserFromGroup(self, userId, groupId):
        if not self.userExistsInGroup(userId, groupId):
            raise Exception("User not registered in group")
        self.conecta()
        sql="DELETE from user_group where id_user = %s and id_group = %s;"
        self.cursor.execute(sql, (userId, groupId))
        sql2="UPDATE groups SET size = size - 1 WHERE id = %s;"
        self.cursor.execute(sql2, (groupId))
        sql3="SELECT size FROM groups WHERE id = %s"
        self.cursor.execute(sql3, (groupId))
        size=self.cursor.fetchone()   
        if size['size'] == 0:
            self.deleteMessagesAndGroup(groupId)
        self.desconecta()
        return
    
    def deleteMessagesAndGroup(self, groupId):
        self.conecta()
        sql="DELETE FROM message WHERE group_id = %s"
        self.cursor.execute(sql, (groupId))
        sql2="DELETE FROM groups WHERE id = %s AND size = 0;"
        self.cursor.execute(sql2, (groupId))       
        self.desconecta()
        
    def getUsername(self, userId):
        self.conecta()
        sql="SELECT username FROM usuarisclase WHERE id = %s"
        self.cursor.execute(sql, (userId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        return ResQuery['username']
    
    def setMessageStatus(self, messageId, newStatus):
        self.conecta()
        sql = 'UPDATE message set status = %s where id = %s;'
        self.cursor.execute(sql, (messageId, newStatus))
        self.desconecta()
        return

    def checkMessage(self, messageId):
        if not self.messageExists(messageId):
            raise Exception("Mensaje no encontrado")
        self.conecta()
        sql='SELECT status from message where id = %s;'
        self.cursor.execute(sql, (messageId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery['status'] == 'sent':
            self.setMessageStatus(messageId, 'received')
        elif ResQuery['status'] == 'received':
            self.setMessageStatus(messageId, 'seen')
        elif ResQuery['status'] == 'seen':
            raise Exception("Message already seen")
        return
    
    def sendGroupMessage(self, message: dict):
        self.conecta()
        sql = "INSERT INTO message (date, status, body, sender_id, group_id) VALUES (%s, %s, %s, %s, %s);"
        self.cursor.execute(sql, (message['date'], message['status'], message['body'], message['sender_id'], message['group_id']))
        self.desconecta()
        return 
        
    def sendUsersMessage(self, message: dict):
        self.conecta()
        sql = "INSERT INTO message (date, status, body, sender_id, receiver_id) VALUES (%s, %s, %s, %s, %s);"
        self.cursor.execute(sql, (message['date'], message['status'], message['body'], message['sender_id'], message['receiver_id']))
        self.desconecta()
        return

    def isUserAdmin(self, userId, groupId):
        self.conecta()
        sql="SELECT * from user_group where id_user = %s and id_group = %s;"
        self.cursor.execute(sql, (userId, groupId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()    
        return ResQuery     
    
    def updateUserAdminStatus(self, userId, groupId):
        user = self.isUserAdmin(userId, groupId)
        newStatus = 0 if user['admin'] == 1 else 1         
        self.conecta()
        sql="UPDATE user_group SET admin = %s WHERE id_user = %s AND id_group = %s;"
        self.cursor.execute(sql, (newStatus, userId, groupId))
        self.cursor.fetchone()
        self.desconecta()

    def infOfGroup(self, groupId):
        self.conecta()
        sql="SELECT * FROM user_group WHERE id_group = %s;"
        self.cursor.execute(sql, (groupId))
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery

    def getClientUser(self, username):
        self.conecta()
        sql='select id, username, bio from usuarisclase where username = "%s";'
        self.cursor.execute(sql, (username))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        return ResQuery
    
    def loginCorrect(self, userId):
        self.conecta()
        sql='select password AS contraseña_encriptada from usuarisclase where id = %s;'
        self.cursor.execute(sql, (userId))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        return ResQuery['contraseña_encriptada']