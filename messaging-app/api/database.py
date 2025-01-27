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
    
    def getMessages(self):
        self.conecta()
        sql="SELECT * from message;"
        self.cursor.execute(sql)
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
        sql=f'SELECT id from usuarisclase where username = "{username}";'
        self.cursor.execute(sql)
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