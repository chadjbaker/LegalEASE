const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(express.json())
app.use(cors());
app.use(bodyParser.json());

app.listen(8000, "0.0.0.0", () => {
  console.log(`App server now listening on port ${8000}`);
});

app.get('/test', (req, res) => {
  const { table } = req.query;

  pool.query(`select * from ${table}`, (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
});

app.post('/search/', async (req, res) => {
  const {input} = req.body;
  
  try {
    // 1: Save user input to MySQL
    const query = 'INSERT INTO sample (`name`) VALUES (?)';
    pool.query(query, [input], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving input to database' });
      }
      console.log('Input saved to database:', result.insertId);
    });

    // 2: Call the 3rd-party API 
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${input}&format=json`)

    // 3: Return the response data to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from 3rd-party API:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
