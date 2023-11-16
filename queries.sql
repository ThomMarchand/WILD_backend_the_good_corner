DROP table ad;
DROP table category;

CREATE TABLE ad 
(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title VARCHAR(100) NOT NULL,
	description TEXT,
	owner VARCHAR(100) NOT NULL,
	price REAL,
  picture VARCHAR(255),
  location VARCHAR(100),
	createdAt DATE,
	category_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE category
(
id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
type VARCHAR(100) NOT NULL
);

INSERT INTO ad (title, owner, price, location, createdAt, category_id) VALUES 
    ('Un truc cool', 'Gérard Bouchard', 200, 'Bordeaux', '2023-09-01',3),
    ('Mon truc en plume', 'Edith Piaf', 9.99, 'Lyon', '2023-09-02',1),
    ('Plume de zoizeau', 'Zizi Jeanmaire', 4.49, 'Paris', '2023-09-01',1),
    ('Mon gros vilbrequin', 'Jack Black', 100, 'Bordeaux', '2023-09-10',2),
    ('clés de 12,5', 'Mecano Compétant', 70000, 'Paris', '2023-09-13',2),
    ('J ai pas d idées', 'Moi', 2000, 'Lyon', '2023-09-05',3),
    ('Un truc volé', 'Un Voleur', 1000, 'Bordeaux', '2023-09-06',3),
    ('Ceci est une arnaque', 'Un Scammeur', 350, 'Lyon', '2023-09-06',2),
    ('C est enfin fini', 'Unmec Pasinspiré', 80, 'Paris', '2023-09-01',3);

INSERT INTO category (type) VALUES
  ('Vêtement'),
  ('Voiture'),
  ('Autre');

SELECT * FROM ad;
SELECT * FROM category;

SELECT * FROM ad WHERE id=9;
SELECT * FROM ad WHERE location="Bordeaux";

SELECT * FROM ad LEFT JOIN category AS ca ON ca.id = ad.category_id WHERE ca.type = "Autre";

SELECT * FROM ad LEFT JOIN category AS ca ON ca.id = ad.category_id WHERE ca.type = "Vêtement" OR ca.type = "Voiture" ;

SELECT avg(price) FROM ad LEFT JOIN category AS ca ON ca.id = ad.category_id WHERE ca.type = "Autre";

SELECT * FROM ad LEFT JOIN category AS ca ON ca.id = ad.category_id WHERE ca.type LIKE 'V%';