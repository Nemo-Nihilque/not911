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
})


/***************************************************
 *  Resources
 ***************************************************/

app.post('/admin/resource', (req, res) => {
  const db = new sqlite3.Database('not911.db');
  function checkField (pattern, field, message) {
    if(!pattern.test(field)) {
      res.status(400).send(message);
      db.close();
      res.end();
      
      return true;
    }
    return false;
  }

  let {resource, phoneNumber, category, city, state} = req.body;

  let reResource = /^[a-zA-Z\.\-'\s,0-9]{3,50}$/;
  let rePhoneNumber = /^\(\d{3}\)\s*\d{3}-\d{4}$/;
  let reCategory = /^[0-9]+$/;
  let reCity = /^[a-zA-Z\.\-'\s,]{1,50}$/;
  let reState = /^[a-zA-Z]{2}$/;

  if(
    checkField(reResource, resource, 'Resource name must be 3-100 characters') ||
    checkField(rePhoneNumber, phoneNumber, 'Phone number must follow the formatting "(111) 222-3333"') ||
    checkField(reCategory, category, 'Please select a valid category') ||
    checkField(reCity, city, 'City names can only contain the characters a-z, symbols, amd must be 1-50 characters in length') ||
    checkField(reState, state, 'Please enter a 2 letter state')
  ) {
    return;
  }
 
  db.serialize( () => {
    let insert = db.prepare('INSERT INTO resources (name, phone_number, catagory, city, state) VALUES (?, ?, ?, ?, ?)');
    insert.run(resource, phoneNumber, category, city, state);
    insert.finalize();
  });

  db.close();
  res.send('{}');
});


app.listen(3000);
