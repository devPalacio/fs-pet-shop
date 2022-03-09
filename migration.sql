DROP TABLE if exists pets;

CREATE TABLE pets (
  id serial primary key,
  name text,
  age integer,
  kind text
);

insert into pets (name, age, kind) VALUES
  ('fido', 7 ,'dog'),
  ('Buttons', 5, 'snake');
