DELETE TABLE IF EXISTS 'pet';

CREATE Table pet (
    id SERIAL PRIMARY KEY,
    name varchar(25),
    age INTEGER,
    kind TEXT
); 