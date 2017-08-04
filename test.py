from mysql_db import MySQL_Database

def main():
    db = MySQL_Database()
    rows1 = db.query('SELECT * FROM testtable',[])

    rows2 = db.query('SELECT * FROM testtable where name=%s AND id=%s', ["Julian4321", 22])

    print(rows1[0])
    print(rows2[0])


if __name__ == '__main__':
    main()