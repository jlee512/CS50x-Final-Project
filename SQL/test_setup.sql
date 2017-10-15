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

SELECT user_badges.badge_id, user_badges.user_id, user_badges.trip_id, user_badges.award_date, walks_set.walk_id, walks_set.one_way_distance FROM user_badges INNER JOIN completed_trips ON user_badges.trip_id = completed_trips.trip_id INNER JOIN walks_set ON completed_trips.walk_id = walks_set.walk_id;

DELETE FROM completed_trips WHERE walk_id = 12 AND user_id = 22;

INSERT INTO completed_trips (user_id, walk_id, date_started, date_completed) VALUES (22, (SELECT walk_id FROM walks_set WHERE walk_name="Tongariro Northern Circuit"), "2017-10-14 00:00:00", "2017-10-16 00:00:00");

INSERT IGNORE INTO user_badges (badge_id, user_id, trip_id, award_date) VALUES ((SELECT badge_id FROM walks_set WHERE walk_name="Tongariro Northern Circuit"), 22, (SELECT t.trip_id FROM completed_trips AS t, walks_set AS w WHERE t.user_id=22 AND w.walk_name="Tongariro Northern Circuit" AND t.walk_id = w.walk_id), "2017-10-16 00:00:00");

SELECT SUM(w.one_way_distance) FROM completed_trips AS t, walks_set AS w WHERE t.walk_id=w.walk_id AND t.user_id=22;