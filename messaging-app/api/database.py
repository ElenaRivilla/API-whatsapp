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
    
    def userExists(self, username):
        self.conecta()
        sql=f'SELECT * from usuarisclase where username = "{username}";'
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery:
            return True
        return False
    
    def deleteUser(self, username):
        if not self.userExists(username):
            return {"status": "Non-existant user"}
        self.conecta()
        sql=f'DELETE from usuarisclase where username = "{username}";'
        self.cursor.execute(sql)
        self.desconecta()
        return {"status": "Succesfully deleted"}
    
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
            return {"status": "Non-existant group"}
        self.conecta()
        sql=f'DELETE from groups where id = {groupId};'
        self.cursor.execute(sql)
        self.desconecta()
        return {"status": "Succesfully deleted"}