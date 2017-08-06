from mysql_db import MySQL_Database
from passlib.hash import bcrypt

def main():
    db = MySQL_Database()

    # # Example query (no parameters)
    # rows1 = db.query('SELECT * FROM testtable',[])
    #
    # name_test = "Julian4321"
    # # Example query (multi-parameter)
    # rows2 = db.query('SELECT * FROM testtable WHERE name=%s AND id=%s', [name_test, 22])

    # print(rows2)

    # # Test user insertion into database
    # username = "Julian"
    # password = "test"
    # email="julian.j.lees@gmail.com"
    # hash = bcrypt.using(rounds=13).hash(password)
    # hash_bin = bytes(hash, 'utf-8')
    # # hash_test_decode = hash_bin.decode('utf-8')
    #
    # db.query('INSERT INTO registered_users (username, email, hash) VALUES(%s, %s, %s)', [username, email, hash_bin])
    #
    # # Example query (no parameters)
    rows3 = db.query('SELECT * FROM registered_users WHERE username=%s', ["Julian"])
    #
    print(rows3[0]['hash'].decode('utf-8'))
    print(rows3)

if __name__ == '__main__':
    main()