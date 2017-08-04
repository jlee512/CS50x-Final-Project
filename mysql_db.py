import MySQLdb
import os

if os.environ['ENV_TYPE'] == 'LOCAL':
    import configparser

    dir = os.path.dirname(__file__)
    filename = os.path.join(dir, 'config.ini')
    config = configparser.ConfigParser()
    config.read(filename)

    local = config['LOCAL']
    DB_HOST = local['DB_HOST']
    DB_USER = local['DB_USER']
    DB_PASSWORD = local['DB_PASSWORD']
    DB_NAME = local['DB_NAME']

else:
    DB_HOST = os.environ['DB_HOST']
    DB_USER = os.environ['DB_USER']
    DB_PASSWORD = os.environ['DB_PASSWORD']
    DB_NAME = os.environ['DB_NAME']

class MySQL_Database:

    _db_conn = None
    _db_cursor = None

    # Constructor for database connection
    def __init__(self):
        self._db_conn = MySQLdb.connect(host=DB_HOST, port=3306, user=DB_USER, passwd=DB_PASSWORD, database=DB_NAME)
        self._db_cursor = self._db_conn.cursor(MySQLdb.cursors.DictCursor)

    # Query Method with parameters
    def query(self, sql, parameters):
        try:
            self._db_cursor.execute(sql, parameters)
            self._db_conn.commit()
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            print(e)
            self._db_conn.rollback()
            return None

        return self._db_cursor.fetchall()

    # def addUserToDB(self, username, password):
    #     try:
    #         self._db_cursor.execute('INSERT INTO registered_users (username, hash) VALUES()')

    # When the class is deleted, the database will disconnect
    def __del__(self):
        self._db_conn.close()




