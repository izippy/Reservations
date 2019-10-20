const faker = require('faker');
const fs = require('fs');


const MAX_LISTINGS_COUNT = 10000000;

function WriteListings() {
  const listings_ws = fs.createWriteStream('listings.csv', { flags: 'w' });
  let listings_count = 0;

  function write_listings() {
    while (listings_count < MAX_LISTINGS_COUNT) {
      listings_count++;
      // console.log("listings", listings_count);

      const max_guests = faker.random.number({ min: 2, max: 20 });
      const cleaning_fee = faker.finance.amount(10, 100, 0); const min_stay = faker.random.number({ min: 1, max: 10 });
      const base_rate = faker.finance.amount(50, 1000, 0); const extra_guest_cap = faker.random.number({ min: 2, max: 4 });
      const extra_guest_charge = faker.finance.amount(10, 100, 0);
      const star_rating = faker.finance.amount(1.01, 5.00, 2);
      const review_count = faker.random.number({ min: 24, max: 1000 });

      const out = `${listings_count },${ max_guests},${cleaning_fee },0.085,${min_stay},${
        base_rate },${extra_guest_cap},${extra_guest_charge },USD,${
        star_rating},${ review_count}\n`;

      if (listings_ws.write(out) === false) {
        // come here, the stream write stop and need to wait for "drain event".
        // tell stream to call write_listings again
        listings_ws.once('drain', write_listings);
        break;
      }
    }
  }

  // start to write
  write_listings();
}

function WriteReserved() {
  const MAX_RESERVED_COUNT = 10000000;
  let reserved_count = 0;
  const reserved_ws = fs.createWriteStream('reserved.csv', { flags: 'w' });

  function write_reserved() {
    while (reserved_count < MAX_RESERVED_COUNT) {
      reserved_count++;
      // console.log("reserved", reserved_count);

      const listingid = faker.random.number({ min: 1, max: MAX_LISTINGS_COUNT });
      const dateCurrentYear = faker.date.between('2019-08-01', '2019-12-31').toISOString().split('T')[0];

      const out = `${listingid},${dateCurrentYear}\n`;

      if (reserved_ws.write(out) === false) {
        // come here, the stream write stop and need to wait for "drain event".

        // tell stream to call write_reseved again after drain event
        reserved_ws.once('drain', write_reserved);
        break;
      }
    }
  }

  // start to write
  write_reserved();
}

function WriteRates() {
  const MAX_RATES_COUNT = 10000000;

  let rates_count = 0;
  const rates_ws = fs.createWriteStream('rates.csv', { flags: 'w' });

  function write_rates() {
    while (rates_count < MAX_RATES_COUNT) {
      rates_count++;
      // console.log("rates", rates_count);

      const listingid = faker.random.number({ min: 1, max: MAX_LISTINGS_COUNT });
      const dateCurrentYear = faker.date.between('2019-08-01', '2019-12-31').toISOString().split('T')[0];
      const price = faker.finance.amount(30, 1000, 0);

      const out = `${listingid},${dateCurrentYear},${price}\n`;

      if (rates_ws.write(out) === false) {
        // come here, the stream write stop and need to wait for "drain event".
        // tell stream to call write_rates again after drain event
        rates_ws.once('drain', write_rates);
        break;
      }
    }
  }

  // start to write
  write_rates();
}

WriteListings();
WriteReserved();
WriteRates();
