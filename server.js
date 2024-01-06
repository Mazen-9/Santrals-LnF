const pool = require('./database.js');
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const validator = require('email-validator');
const bcrypt = require("bcrypt");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const port = 3300;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 10 * 60 * 1000, 
    }
}));


app.use((req, res, next) => {

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  if (req.session && req.session.cookie && req.session.cookie.expires < Date.now()) {
      req.session.destroy((err) => {
          if (err) {
              console.error('Error destroying session:', err);
          }
          res.redirect('/pro.html'); 
      });
  } else {
      next();
  }
});


// checks authentication before redirecting
function isAuthenticatedStaff(req, res, next) {
  if (req.session && req.session.loggedin === true && req.session.role === 'Staff') {
    return next();
  }
  req.session.destroy(function(err) {
    if(err) {
    console.error('Error destroying session:', err);
    res.status(500).send('Internal Server Error');
  } else {
    console.log('logging out...', req.session);
    res.redirect('/pro.html');
  }
});
}

function isAuthenticatedUser(req, res, next) {
  if (req.session && req.session.loggedin === true && req.session.role === 'User') {
    return next();
  }
  req.session.destroy(function(err) {
    if(err) {
    console.error('Error destroying session:', err);
    res.status(500).send('Internal Server Error');
  } else {
    console.log('logging out...', req.session);
    res.redirect('/pro.html');
  }
});
}


// get methods
app.get('/', function(req, res) {
  if(!req.session.loggedin){
    res.redirect('/pro.html');}
    else{
      if(req.session.role === 'User'){
        res.redirect('/santrals-lf/user.html');}
        else res.redirect('/santrals-lf/staff.html');
      }
});

app.get('/pro.html', function(request, response) {
  response.sendFile(path.join(__dirname + '/santrals-lf/pro.html'));
});

app.get('/prostaff.html', function(request, response) {
  response.sendFile(path.join(__dirname + '/santrals-lf/prostaff.html'));
});

app.get('/santrals-lf/user.html', isAuthenticatedUser, (req, res) => {
  res.sendFile(path.join(__dirname + '/santrals-lf/user.html'));
});

app.get('/santrals-lf/staff.html', isAuthenticatedStaff, (req, res) => {
  res.sendFile(path.join(__dirname + '/santrals-lf/staff.html'));
});

app.get('/santrals-lf/myrequests.html', isAuthenticatedUser, function(request, response) {
	response.sendFile(path.join(__dirname + '/santrals-lf/myrequests.html'));
});
app.get('/santrals-lf/L&FOfficeUser.html', isAuthenticatedUser, function(request, response) {
	response.sendFile(path.join(__dirname + '/santrals-lf/L&FOffice.html'));
});

app.get('/santrals-lf/Itemsfound.html', isAuthenticatedStaff, function(request, response) {
  console.log(request.session);
	response.sendFile(path.join(__dirname + '/santrals-lf/Itemsfound.html'));
});

app.get('/santrals-lf/L&FOfficeStaff.html', isAuthenticatedStaff, function(request, response) {
  console.log(request.session);
	response.sendFile(path.join(__dirname + '/santrals-lf/L&FOfficeStaff.html'));
});

app.get('/santrals-lf/user_chat.html', isAuthenticatedUser, function(request, response) {
  console.log(request.session);
	response.sendFile(path.join(__dirname + '/santrals-lf/user_chat.html'));
});

app.get('/santrals-lf/staff_chat.html', isAuthenticatedStaff, function(request, response) {
  console.log(request.session);
	response.sendFile(path.join(__dirname + '/santrals-lf/staff_chat.html'));
});

// adding images
app.get('/img/bilgi-logotype-en-light.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/bilgi-logotype-en-light.png'));
});
app.get('/santrals-lf/img/bilgi-logotype-en-light.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/bilgi-logotype-en-light.png'));
});
app.get('/img/moon.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/moon.png'));
});
app.get('/img/sun.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/sun.png'));
});
app.get('/img/bilgibw.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/bilgibw.png'));
});
// app.get('/img/bilgilogo1.png', function(_, res) {
//   res.sendFile(path.join(__dirname + '/santrals-lf/img/bilgilogo1.png'));
// });
app.get('/img/bilgilloo.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/bilgilloo.png'));
});
app.get('/santrals-lf/img/Profile.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/Profile.png'));
});
app.get('/img/smain.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/smain.png'));
});
app.get('/img/ssmainw.png', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/ssmainw.png'));
});
app.get('/santrals-lf/img/campusmap.jpg', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/img/campusmap.jpg'));
});

// adding styles
app.get('/santrals-lf/style.css', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/style.css'));
});
app.get('/style1.css', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/style1.css'));
});

// adding js files
app.get('/santrals-lf/user.js', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/user.js'));
});
app.get('/santrals-lf/myrequests.js', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/myrequests.js'));
});
app.get('/santrals-lf/Itemsfound.js', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/Itemsfound.js'));
});
app.get('/santrals-lf/staff.js', function(_, res) {
  res.sendFile(path.join(__dirname + '/santrals-lf/staff.js'));
});

// more get operations
app.get('/staff.html', function(request, response) {
  //added item desc and userid heeereyah
  pool.query('SELECT user_id, itemID, item_name, category, date_lost, item_status, item_description, last_loc, image_path, date_added FROM items', function(error, results, fields) {
          if (error) {
              console.error('Error fetching missing items:', error);
              return response.status(500).send('Internal Server Error');
          }            
          const items = results
          .filter(resultx => resultx.item_status === 'Lost')
          .map(result => ({
            user_id: result.user_id,
            itemID: result.itemID,
            item_name: result.item_name,
            item_description: result.item_description,
            category: result.category,
            date_lost: result.date_lost,
            last_loc: result.last_loc,
            image_path: result.image_path,
            date_added: result.date_added,
            image_path: result.image_path ? `/${result.image_path}` : '' 
        }));
        response.json(items);
      });

}); 

app.get('/user.html', function(req, res) {
  pool.query('SELECT user_id, itemID, item_name, category, date_lost, item_status, item_description, last_loc, image_path FROM items', function(error, results, fields) {
          if (error) {
              console.error('Error fetching missing items: ', error);
              return res.status(500).send('Internal Server Error');
          }            
          const items = results
          .filter(resultx => resultx.item_status === 'Lost')
          .map(result => ({
            itemID: result.itemID,
            item_name: result.item_name,
            item_description: result.item_description,
            category: result.category,
            date_lost: result.date_lost,
            last_loc: result.last_loc,
            image_url: result.image_path ? `/${result.image_path}` : '' 
        }));
        res.json(items);
      });

});

app.get('/myrequests.html', function(request, response) {
        
  pool.query('SELECT * FROM items', function(error, results, fields) {
          if (error) {
              console.error('Error fetching missing items:', error);
              return response.status(500).send('Internal Server Error');
          } 

          const items = results
          .filter(resultx => request.session.userID === resultx.user_id)
          .map(result => ({
            itemID: result.itemID,
            item_name: result.item_name,
            item_description: result.item_description,
            category: result.category,
            date_lost: result.date_lost,
            last_loc: result.last_loc,
            image_url: result.image_path ? `/${result.image_path}` : '',
            item_status: result.item_status,
            return_status: result.return_status,
            date_found: result.date_found,
            date_returned: result.date_returned,
            found_loc: result.found_loc
          }));
        
        response.json(items);
          
      });

});   

app.get('/itemsfound.html', function(request, response) {
  
  pool.query('SELECT user_id, itemID, item_name, category, date_lost, item_status, item_description, last_loc, image_path, date_added FROM items', function(error, results, fields) {
          if (error) {
              console.error('Error fetching missing items:', error);
              return response.status(500).send('Internal Server Error');
          }            
          const items = results
          .filter(resultx => resultx.item_status === 'Found')
          .map(result => ({
            user_id: result.user_id,
            itemID: result.itemID,
            item_name: result.item_name,
            item_description: result.item_description,
            category: result.category,
            date_lost: result.date_lost,
            last_loc: result.last_loc,
            image_path: result.image_path ? `/${result.image_path}` : '',
            date_added: result.date_added
        }));
        response.json(items);
      });

}); 


/////////////////////////////////////////////////////////////////////

// post methods

// sign up authentication
app.post('/auth', async function(req, res){
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const phone_no = req.body.number;
  const pass = req.body.pass;
  const pass_ver = req.body.pass_ver;

  // change the following to await if you figured out how to use it
  // const isValid = await validator.validate(email);
  const isValid = validator.validate(email);
  
  const phoneRegex = /^\d{10}$/;

  const salt = await bcrypt.genSalt(10);
  
  const hashpass = await bcrypt.hash(pass,salt);

  // some logic 
    if (!fname || !lname || !email || !pass || !phone_no) {
    console.error('All fields must be filled.');
    return res.status(400).send('Bad Request');
  }

  if (fname.length > 60 || lname.length > 60) {
    return res.status(400).json({ error: 'First name and last name must be at most 60 characters long' });
  }

  if (!isValid) {
    return res.status(400).json({ error: 'Email is not valid' });
    }

  if(pass.length < 8){
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }
  if(pass.length > 255){
      return res.status(400).json({ error: 'Password length can not exceed 255 characters' });
  }

  // password verification
  if(pass != pass_ver){
    return res.status(400).json({ error: "Passwords given don't match" });
  }

  if(email.length > 320){
    return res.status(400).json({ error: 'Email length can not exceed 320 characters' });
  }

  if (!phoneRegex.test(phone_no)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }


  // inserting values into the database with some error handling
  pool.query(`INSERT INTO users (first_name, last_name, email, passhash, role, phone_no) VALUES (?,?,?,?,?,?);`, [fname, lname,email,hashpass,'User',phone_no], function(error, result){
      
    if(error){
        if (error.code === 'ER_DUP_ENTRY') {
          if (error.message.includes('email')) {
              return res.status(400).json({ error: 'Email already exists' });
          } else if (error.message.includes('phone_no')) {
              return res.status(400).json({ error: 'Phone number already exists' });
          }
        }

        console.error('Error inserting record:', error);
        return res.status(500).send('Internal Server Error');

      }

      const insertId = result && result.insertId;

      if (insertId) {
        console.log('Record inserted successfully');
        console.log(req.session);
        res.redirect('/pro.html');

      } else {
        console.error('Error inserting record. No rows affected.');
        res.status(500).send('Internal Server Error');
      }

      });});

// sign in authentication
app.post('/signin', function(req, res){
  const email = req.body.email;
  const pass = req.body.passhash;
  const loginType = req.body.loginType;
  console.log('this is the email and password for the login operation: ', email, ', ', pass);
  if (email && pass) {
    pool.query('SELECT * FROM users WHERE email = ?', [email], function(err, results, fields) {
      if(err){
        console.error('Error: ', err);
      }
      else if (results.length > 0) {
                
        const storedPassHash = results[0].passhash;

        // this is synchronous blocking method which affects concurrent operations...
        // but tbh i don't feel like understanding async funcitons and promises so there's that
        const passwordMatch = bcrypt.compareSync(pass, storedPassHash);

        const role = results[0].role;

        // this should check if the input field is coming from the user login or the staff login before password validation       
        if(loginType === 'staff' && role === 'Staff'){
          if(passwordMatch){
            req.session.loggedin = true;
            req.session.first_name = results[0].first_name;
            req.session.email = results[0].email;  
            req.session.userID = results[0].userID;
            req.session.role = results[0].role;                 
            console.log('this is the staff session information: ', req.session);     
            res.redirect('/santrals-lf/staff.html');
                  } else {
                      res.send('Incorrect Email and/or Password!');
                  }
        }
        else if(loginType === 'user' && role ==='User'){

          if(passwordMatch){
            req.session.loggedin = true;
            req.session.first_name = results[0].first_name;
            req.session.email = results[0].email; 
            req.session.userID = results[0].userID;
            req.session.role = results[0].role;    
            console.log('this is the user session information: ', req.session);
            res.redirect('/santrals-lf/user.html');
                  } else {
                      res.send('Incorrect Email and/or Password!');
                  }
        } else{
          res.send('Please input your information in the correct fields');
        }
                    
      } else {
        res.send('Incorrect Email and/or Password!');
      }			
      res.end();
    });
  } else {
    res.send('Please enter both the Email and Password!');
    res.end();
  }
});

// inserting items into a database
/*
app.post('/itemreport', upload.single('image'), function(req, res){
  // make sure the session timeout is used everywhere 
  console.log('this is the session for item report: ', req.session);
  if (req.session.loggedin /*&& req.session.role === 'User' for now ill leave this here for as long as its logged in it works){
  const itemName = req.body.itemName;
  const category = req.body.category;
  const lastLocation = req.body.lastLocation;
  const dateLost =  req.body.dateLost;
  const itemDescription = req.body.itemDescription;
  //const imagePath = req.file.path;
  const imagePath = req.file ? req.file.path : null;

if (!itemName || !category || !dateLost || !itemDescription || !lastLocation) {
    console.error('All fields must be filled.');
    return res.status(400).send('Bad Request');
}
if(countWords(itemDescription) > 200){
  console.error('Item description must not exceed 200 words.');
    return res.status(400).send('Bad Request');
}
if(countWords(itemName) > 15){
  console.error('Item name must not exceed 15 words.');
    return res.status(400).send('Bad Request');
}

// date validation
const currentDate = new Date();
const enteredDate = new Date(dateLost);
if (enteredDate > currentDate) {
return res.status(400).send('Date Lost cannot be in the future.');
}

const max = new Date();
max.setFullYear(max.getFullYear() - 2);
const datie = currentDate.getFullYear() - enteredDate.getFullYear();

if (enteredDate < max) {
  return res.status(400).send(`Date Lost cannot be more than 2 years in the past. \n My guy its been ${datie} years. Come on. MOVE ON`);
}

console.log('this is the session email for item report: ', req.session.email, ' and this is the userid: ', req.session.userID);

  const sql = `INSERT INTO items (user_id, item_name, category, item_description, date_lost, image_path, item_status, last_loc) VALUES (?,?,?,?,?,?,?,?);`
  pool.query(sql, [req.session.userID, itemName, category, itemDescription, dateLost, imagePath, 'Lost', lastLocation], function(err, results){

    if(err){
      console.error('Error inserting record:', err);
      return res.status(500).send('Internal Server Error');
    }

    const insertId = results && results.insertId;

    if (insertId) {
        console.log('Record inserted successfully: ', itemName, category, lastLocation, dateLost, itemDescription);
        // i don't think redirection is recommended here but this is temporary
        // double check this
        if(req.session.role === 'User'){
          res.redirect('/santrals-lf/user.html');
        }
        else res.redirect('/santrals-lf/staff.html');

    } else {
        console.error('Error inserting record. No rows affected.');
        res.status(500).send('Internal Server Error');
    }

  });} else { res.send("session timeout please login again");}} ) ;
*/

// logout
app.post('/logout', function(req, res){
  req.session.destroy(function(err) {
    if(err) {
    console.error('Error destroying session:', err);
    res.status(500).send('Internal Server Error');
  } else {
    console.log('logging out...', req.session);
    res.redirect('/pro.html');
  }
});
})

// edit button db operation
app.post('/editItem', function (req, res) {
  const updatedItem = req.body;
  const itemId = updatedItem.itemID;
  console.log('Sending request:', JSON.stringify(updatedItem));
  pool.query(
      'UPDATE items SET item_name=?, date_lost=?, category=?, item_description=?, last_loc=?, image_path=? WHERE itemID=?',
      [updatedItem.item_name, updatedItem.date_lost, updatedItem.category, updatedItem.item_description, updatedItem.last_loc, updatedItem.image_path, itemId],
      function (error, result) {
          if (error) {
              console.error('Error updating item:', error);
              res.status(500).send('Internal Server Error');
          } else {
              console.log('Item updated successfully');
              res.status(200).send('Item updated successfully');
          }
      }
  );
});

app.post('/deleteItem', function (req, res) {

  const itemId = req.body.itemID;

  if (itemId) {
    pool.query('DELETE FROM items WHERE itemID = ?', [itemId], function (error, result) {
      if (error) {
          console.error('Error deleting item:', error);
      } else {
          console.log('Item deleted!'); //should probably add smth to check if item no longer exists
      }
  });
  } else {
      res.status(400).send('Error mate');
  }
});

app.post('/updateStatus', function (req, res) {
  try {
      const { itemID, item_status, return_status, found_loc, date_found, date_returned } = req.body;
      const sanitizedDateFound = date_found || null;
      const sanitizedDateReturned = date_returned || null;
      pool.query(
          'UPDATE items SET item_status=?, return_status=?, found_loc=?, date_found=?, date_returned=? WHERE itemID=?',
          [item_status, return_status, found_loc, sanitizedDateFound, sanitizedDateReturned, itemID],
          (error, results) => {
              if (error) {
                  console.error('Error updating status:', error);
                  return res.status(500).json({ error: 'Internal Server Error' });
              }

              if (results.affectedRows === 0) {
                  return res.status(404).json({ error: 'Item not found' });
              }

              // Send a success response
              res.status(200).json({ message: 'Status updated successfully' });
          }
      );
  } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/itemreport', upload.single('image'), function(req, res){
  console.log('Received request:', req.body);

  if (req.session.loggedin /*&& req.session.role === 'User' for now ill leave this here for as long as its logged in it works*/){
  console.log('this is the session', req.session);
  console.log('this is the request: ', req.body);
  const itemName = req.body.itemName || req.body.item_name;
  const category = req.body.category;
  const lastLocation = req.body.lastLocation || req.body.last_loc;
  const dateLost =  req.body.dateLost || req.body.date_lost;
  const itemDescription = req.body.itemDescription || req.body.item_description;
  //const imagePath = req.file.path;
  const imagePath = req.file ? req.file.path : null;
  const date_added = req.body.date_added;

  if (!itemName || !category || !dateLost || !itemDescription || !lastLocation) {
    console.error('All fields must be filled.');
    return res.status(400).send('Bad Requestomak');
}

if(countWords(itemDescription) > 200){
  console.error('Item description must not exceed 200 words.');
    return res.status(400).send('Bad Requestabook');
}
if(countWords(itemName) > 15){
  console.error('Item name must not exceed 15 words.');
    return res.status(400).send('Bad Requesto5tak');
}

// date validation
const currentDate = new Date();
const enteredDate = new Date(dateLost);
if (enteredDate > currentDate) {
return res.status(400).send('Date Lost cannot be in the future.');
}

const max = new Date();
max.setFullYear(max.getFullYear() - 2);

const datie = currentDate.getFullYear() - enteredDate.getFullYear();

if (enteredDate < max) {
  return res.status(400).send(`Date Lost cannot be more than 2 years in the past. \n My guy its been ${datie} years. Come on. MOVE ON`);
}

// i did it like this instead of querying the db again
  const sql = `INSERT INTO items (user_id, item_name, category, item_description, date_lost, image_path, item_status, last_loc, date_added) VALUES (?,?,?,?,?,?,?,?,?);`
  pool.query(sql, [req.session.userID, itemName, category, itemDescription, dateLost, imagePath, 'Lost', lastLocation, date_added], function(err, results){

    if(err){
      console.error('Error inserting record:', err);
      return res.status(500).send('Internal Server Error');
    }

    const insertId = results && results.insertId;

    if (insertId) {
        console.log('Record inserted successfully');
        // i don't think redirection is recommended here but this is temporary
        if(req.session.role ==='User'){
          res.redirect('/santrals-lf/user.html');
        } else res.redirect('/santrals-lf/staff.html');

    } else {
        console.error('Error inserting record. No rows affected.');
        res.status(500).send('Internal Server Error');
    }

  });
  
  console.log(itemName, category, lastLocation, dateLost, itemDescription);       

} else{ res.send("Error");}} ) ;

 // functions
 function countWords(text) {
  const words = text.trim().split(/\s+/);
  return words.length;
}     


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

