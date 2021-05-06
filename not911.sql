CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY ASC, 
  name TEXT,
  phone_number TEXT,
  category INTEGER,
  city TEXT,
  state TEXT
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY ASC,
  name TEXT
)

