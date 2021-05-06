const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.use(express.static('html'));
app.use(express.json());

function getCategories (id) {
  let sql, params = [];
  const db = new sqlite3.Database('not911.db');

  if(id !== undefined) {
    sql = 'SELECT id, name FROM categories WHERE id = ?';
    params.push(id);
  } else {
    sql = 'SELECT id, name FROM categories';
  }

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
}

//app.get. For reading the existing categories. If given a query, it'll return those. If not, it'll return all
app.get('/admin/category', (req, res) => {
  getCategories(req.query.id).then(rows => {
    res.send(rows);
  });
});

//app.post. For creating new categories
app.post('/admin/category', (req, res) => {
  const db = new sqlite3.Database('not911.db');

  let {category} = req.body;
  
  db.serialize( () =>{
    let insert = db.prepare('INSERT INTO categories (name) VALUES (?)');
    insert.run(category);
    insert.finalize();
  });

  db.close();

  getCategories().then(rows => {
    res.send(rows);
  });
});

//app.delete. In progress
app.delete('/admin/category', (req, res) => {
  const db = new sqlite3.Database('not911.db');
  
  let {id} = req.query;
  if(id) {  
    db.serialize( () => { 
     let del = db.prepare('DELETE FROM categories WHERE id = ?');
       del.run(id);
       del.finalize();
      res.send('Deleted');
    });
  }
  else {
    res.send('No query id');
  }
  
  db.close();
});

//app.put. To edit a category
app.put('/admin/category', (req, res) =>{
  const db = new sqlite3.Database('not911.db');

  let {id, category} = req.body;
  console.log(id);
  console.log(category);
  if(id) {
    db.serialize( () => {
      let update = db.prepare('UPDATE categories SET name = ? WHERE id = ?');
      update.run(category, id);
      update.finalize();
    });
  }

  db.close();

  getCategories().then(rows => {
    res.send(rows);
  });
});


/***************************************************
 *  Resources
 ***************************************************/

app.post('/admin/resource', (req, res) => {
  const db = new sqlite3.Database('not911.db');

  let {resource, phoneNumber, category, city, state} = req.body;

  db.serialize( () => {
    let insert = db.prepare('INSERT INTO resources (name, phone_number, catagory, city, state) VALUES (?, ?, ?, ?, ?)');
    insert.run(resource, phoneNumber, category, city, state);
    insert.finalize();
  });

  db.close();
  res.send('{}');
});


app.listen(3000);
