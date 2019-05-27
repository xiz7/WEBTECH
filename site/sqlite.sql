DROP TABLE IF EXISTS examples;
DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user(
    userID INTEGER PRIMARY KEY AUTOINCREMENT, 
    username VARCHAR(50) UNIQUE NOT NULL, 
    password VARCHAR(50) NOT NULL
    );

CREATE TABLE examples(
    imageName VARCHAR(20),
    stars INTEGER,
    dateAdded INTEGER,
    imageurl VARCHAR(50)
);

INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES("America", 10, strftime('%s','now'), "/images/america.jpg");
INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES("European", 20, strftime('%s','2014-01-01 02:34:56'), "/images/european.jpg");
INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES("Farmhouse", 30, strftime('%s','2015-03-05 15:34:23'), "/images/farmhouse.png");
INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES("SVGAmerica", 99, strftime('%s','now'), "/images/america.svg");
INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES("SuperEuropean", 20, strftime('%s','2015-01-01 04:24:46'), "/images/european.svg");
INSERT INTO examples(imageName, stars, dateAdded, imageurl) VALUES("SVGFarmhouse", 35, strftime('%s','2018-03-07 05:14:13'), "/images/farmhouse.svg");


