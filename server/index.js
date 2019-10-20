const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./db/index.js');
// const db = require('./db/cs.js');

app.use(bodyParser());
// app.use('/:listing_id', express.static(path.resolve(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/listing/:listing_id', (req, res) => {
  const { listing_id } = req.params;

  db.listingsFindOne(listing_id, (err, listing) => {
    if (err) {
      res.status(400).end();
    } else {
      res.status(200).send(listing.rows[0]);
    }
  });
});

app.get('/reserved/:listing_id/', (req, res) => {
  const { id, month, year } = req.query;

  db.Reserved.findAll({
    attributes: ['date'],
    where: {
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
      $and: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
      listing_id: id,
    },
  })
    .then((results) => {
      const days = results.map(date => Number(date.date.slice(-2)));
      res.send(days);
    })
    .catch(error => res.send(error));
});

app.get('/rates/:listing_id', (req, res) => {
  const { id, time } = req.query;

  db.CustomRates.findAll({
    attributes: ['date', 'price'],
    where: {
      date: time,
      listing_id: id,
    },
  })
    .then(results => res.send(results))
    .catch(error => res.send(error));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
