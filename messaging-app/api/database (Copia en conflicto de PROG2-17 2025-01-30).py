import pymysql.cursors

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
        print(ResQuery)
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
        self.cursor.execute(sql, (username,))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if not ResQuery:
            raise Exception("Non-existant user")
        return ResQuery['id']

    def userExists(self, userId):
        self.conecta()
        sql=f'SELECT * from usuarisclase where id = "{userId}";'
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteUser(self, userId):
        if not self.userExists(userId):
            raise Exception("Non-existant group")
        self.conecta()
        sql=f'DELETE from usuarisclase where id = "{userId}";'
        self.cursor.execute(sql)
        self.desconecta()
        return
    
    def groupExists(self, groupId):
        self.conecta()
        sql=f'SELECT * from groups where id = {groupId};'
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteGroup(self, groupId):
        if not self.userExists(groupId):
            raise Exception("Non-existant group")
        self.conecta()
        sql=f'DELETE from groups where id = {groupId};'
        self.cursor.execute(sql)
        self.desconecta()
        return
    
    def messageExists(self, messageId):
        self.conecta()
        sql=f'SELECT * from message where id = {messageId};'
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteMessage(self, messageId):
        if not self.messageExists(messageId):
            raise Exception("Non-existant message")
        self.conecta()
        sql=f'DELETE from message where id = {messageId};'
        self.cursor.execute(sql)
        self.desconecta()
        return
    
    def userExistsInGroup(self, userId, groupId):
        self.conecta()
        sql=f'SELECT * from user_group where id_user = {userId} and id_group = {groupId};'
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteUserFromGroup(self, userId, groupId):
        if not self.userExistsInGroup(userId, groupId):
            raise Exception("User not registered in group")
        self.conecta()
        sql=f'DELETE from user_group where where id_user = {userId} and id_group = {groupId};'
        self.cursor.execute(sql)
        self.desconecta()
        return
    
    def setMessageStatus(self, messageId, newStatus):
        self.conecta()
        sql = f'UPDATE message set status = "{newStatus}" where id = {messageId};'
        self.cursor.execute(sql)
        self.desconecta()
        return

    def checkMessage(self, messageId):
        if not self.messageExists(messageId):
            raise Exception("Non-existant message")
        self.conecta()
        sql=f'SELECT status from message where id = {messageId};'
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery['status'] == 'sent':
            self.setMessageStatus(messageId, 'received')
        elif ResQuery['status'] == 'received':
            self.setMessageStatus(messageId, 'seen')
        elif ResQuery['status'] == 'seen':
            raise Exception("Message already seen")
        return    
        
    def sendGroupMessage(self, date, status, body, sender_id, group_id):
        self.conecta()
        sql = "INSERT INTO message (date, status, body, sender_id, group_id) VALUES (%s, %s, %s, %s, %s);"
        self.cursor.execute(sql, (date, status, body, sender_id, group_id))
        self.cursor.fetchone()
        self.desconecta()
        return 
        
    def sendUsersMessage(self, date, status, body, sender_id, reciever_id):
        self.conecta()
        sql = "INSERT INTO message (date, status, body, sender_id, reciever_id) VALUES (%s, %s, %s, %s, %s);"
        self.cursor.execute(sql, (date, status, body, sender_id, reciever_id))
        self.cursor.fetchone()
        self.desconecta()
        return