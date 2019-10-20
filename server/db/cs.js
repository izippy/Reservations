const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'reservations',
});

function listingsFindOne(id, cb) {
  const query = 'SELECT * FROM reservations.listings WHERE listing_id = 1024';
  client.execute(query, [], (err, result) => {
    cb(err, result);
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
