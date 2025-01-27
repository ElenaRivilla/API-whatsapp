
class TriCoded(object):
    def conecta(self):
        self.db = pymysql.connect(host='localhost',
                                    user='root',
                                    passwd='',
                                    db='futbol',
                                    charset='utf8mb4',
                                    autocommit=True,
                                    cursorclass=pymysql.cursors.DictCursor)
        self.cursor=self.db.cursor()
        
    def desconecta(self):
        self.db.close()