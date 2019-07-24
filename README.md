# Reservations

## API

## Listings
| HTTP Method   | Endpoint               | Description                                                   |
|:--------------|:-----------------------|:--------------------------------------------------------------|
| GET           | /api/listing/:listingid | Return an object which details about listing                      |
| POST          | /api/listing/           | Create new listing                                          |
| PUT           | /api/listing/:listingid | Update specific listing             |
| PATCH         | /api/listing/:listingid | Update and modify details for listing              |
| DELETE        | /api/listing/:listingid | Delete listing with id                                     |


## Reservations
| HTTP Method     | Endpoint                           | Description                                                    |
|:----------------|:-----------------------------------|:---------------------------------------------------------------|
| GET             | /api/reserved/:listingid| Return reservations               |
| POST            | /api/reserved/	           | Add reservation for listing                       |
| PUT             | /api/reserved/:listingid	             | Update specific reserved date for a listing|
| PATCH           | /api/reserved/:listingid	              | Update and modify booked date for a listing|
| DELETE          | /api/reserved/:listingid	       | Delete reservation with id                   |

## CustomRates
| HTTP Method   | Endpoint               | Description                                                   |
|:--------------|:-----------------------|:--------------------------------------------------------------|
| GET           | /api/rate/:listingid | Return custom rates                      |
| POST          | /api/rate/           | Add rate for listing                                          |
| PUT           | /api/rate/:listingid	 | Update specific custom rate for a listing             |
| PATCH         | /api/rate/:listingid	 | Update and modify custom rate for a listing              |
| DELETE        | /api/rate/:listingid	 | Delete custom rate with id                                     |
