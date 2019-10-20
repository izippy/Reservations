DROP TABLE IF EXISTS listings;

CREATE TABLE listings (
  listing_id serial primary key,
  max_guests integer NOT NULL,
  cleaning_fee integer  default 0,
  local_tax decimal(10,2) default 0.085,
  min_stay integer default 1,
  base_rate decimal(10,2) NOT NULL,
  extra_guest_cap integer,
  extra_guest_charge decimal(10,2),
  currency varchar(32) default 'USD',
  star_rating decimal(10,2),
  review_count integer NOT NULL
);

DROP TABLE IF EXISTS reserved;

CREATE TABLE reserved (
  listing_id integer NOT NULL,
  date DATE 
); 

DROP TABLE IF EXISTS rates;

CREATE TABLE rates (
  listing_id integer NOT NULL,
  date DATE,
  price decimal(11,2) NOT NULL
);

