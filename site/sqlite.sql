DROP TABLE IF EXISTS examples;

CREATE TABLE examples(
    imageName VARCHAR(20),
    comments INTEGER,
    dateAdded INTEGER,
    imageurl VARCHAR(50)
);

INSERT INTO examples(imageName, comments, dateAdded, imageurl) VALUES("America", 10, strftime('%s','now'), "/images/america.jpg");
INSERT INTO examples(imageName, comments, dateAdded, imageurl) VALUES("European", 20, strftime('%s','2014-01-01 02:34:56'), "/images/european.jpg");
INSERT INTO examples(imageName, comments, dateAdded, imageurl) VALUES("Farmhouse", 30, strftime('%s','2015-03-05 15:34:23'), "/images/farmhouse.png");