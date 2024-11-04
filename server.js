const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'retail_store',
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database.');
});

app.use(cors());
app.use(bodyParser.json());

// Routes for Users
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  conn.query(sql, [name, email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true, message: 'User registered' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  conn.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length && bcrypt.compareSync(password, results[0].password)) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Routes for Products
app.post('/products', (req, res) => {
  const { name, price, quantity } = req.body;
  const sql = 'INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)';

  conn.query(sql, [name, quantity, price], (err) => {
    if (err){
      console.log(err);
       return res.status(500).json({ error: 'Server error' });}
    res.json({ success: true, message: 'Product added' });
  });
});

app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  conn.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';

    conn.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    });
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const {  name, price, quantity } = req.body;
  const sql = 'UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?';

  conn.query(sql, [name, quantity, price, id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true, message: 'Product updated' });
  });
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';

  conn.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true, message: 'Product deleted' });
  });
});

// Routes for Customers

// Create a new customer
app.post('/customers', (req, res) => {
  console.log("abc");
    const { name, email, contact_number } = req.body;
    const sql = 'INSERT INTO customers (name, email, contact_number) VALUES (?, ?, ?)';

    conn.query(sql, [name, email, contact_number], (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ success: true, message: 'Customer added' });
    });
});

// Get all customers
app.get('/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';
    conn.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(results);
    });
});

// Get a customer by ID
app.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM customers WHERE id = ?';

    conn.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (result.length > 0) {
            res.json(result[0]); // Return the customer details
        } else {
            res.status(404).json({ success: false, message: 'Customer not found' });
        }
    });
});

// Update a customer
app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, contact_number } = req.body;
    const sql = 'UPDATE customers SET name = ?, email = ?, contact_number = ? WHERE id = ?';

    conn.query(sql, [name, email, contact_number, id], (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ success: true, message: 'Customer updated' });
    });
});

// Delete a customer
app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM customers WHERE id = ?';

    conn.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ success: true, message: 'Customer deleted' });
    });
});


// Routes for Sales
app.post('/sales', (req, res) => {
  const { customer_id, product_id, quantity } = req.body;
  const sql = 'INSERT INTO sales (customer_id, product_id, quantity) VALUES (?, ?, ?)';

  conn.query(sql, [customer_id, product_id, quantity], (err) => {
    if (err){console.log(err)
       return res.status(500).json({ error: 'Server error' });}
    res.json({ success: true, message: 'Sale recorded' });
  });
});
app.put('/sales/:id', (req, res) => {
  const saleId = req.params.id; // Get the sale ID from the URL parameters
  const { customer_id, product_id, quantity } = req.body;

  // SQL query to update the sale
  const sql = 'UPDATE sales SET customer_id = ?, product_id = ?, quantity = ? WHERE id = ?';

  conn.query(sql, [customer_id, product_id, quantity, saleId], (err) => {
      if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Server error' });
      }
      res.json({ success: true, message: 'Sale updated' });
  });
});

app.get('/sales', (req, res) => {
  const sql = 'SELECT * FROM sales';
  conn.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});
// Get a sale by ID
app.get('/sales/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM sales WHERE id = ?'; // Ensure your sales table has an 'id' column

    conn.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (result.length > 0) {
            res.json(result[0]); // Return the sale details
        } else {
            res.status(404).json({ success: false, message: 'Sale not found' });
        }
    });
});


app.delete('/sales/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM sales WHERE id = ?';

  conn.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true, message: 'Sale deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
