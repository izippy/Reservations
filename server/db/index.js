const { Client } = require('pg');

const client = new Client();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'lun',
  host: 'localhost',
  database: 'reservations',
  password: '',
  port: 5432,
});

function listingsFindOne(id, cb) {
  pool.query('SELECT * FROM listings WHERE listing_id = $1', [id], (error, results) => {
    cb(error, results);
  });
}

function reservedFind(id, cb) {
  pool.query('SELECT * FROM reserved WHERE listing_id = $1', [id], (error, results) => {
    cb(error, results);
  });
}

function ratesFind(id, cb) {
  pool.query('SELECT * FROM rates WHERE listing_id = $1', [id], (error, results) => {
    cb(error, results);
  });
}

module.exports = {
  listingsFindOne, reservedFind, ratesFind,
};
