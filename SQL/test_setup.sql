#-----------------Testing---------------------
/*DROP TABLE if it exists*/
DROP TABLE IF EXISTS testTable;

/*Create TestTable*/
CREATE TABLE testTable (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  quote TEXT NOT NULL,
  PRIMARY KEY (id));

/*INSERT into testtable*/
INSERT INTO testTable (name, quote) VALUES('Julian', 'this is from PYCHARM SQL File');
INSERT INTO testTable (name, quote) VALUES('Julian1234', 'this is my second addition');
INSERT INTO testTable (name, quote) VALUES('Julian4321', 'refresh and you\'ll see a 3rd!');
INSERT INTO testTable (name, quote) VALUES('Julian54321', 'insertion on 27072017');

SELECT * FROM testTable;

# DROP TABLE IF EXISTS testTable;

SELECT * FROM walks_set LIMIT 3 OFFSET 1;

ALTER TABLE registered_users ADD rank INT NOT NULL;