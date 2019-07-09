/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import NumberFormat from 'react-number-format';

import Calendar from './Calendar.jsx';
import Guest from './Guest.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      base_rate: 0,
      currency: 'USD',
      extra_guest_cap: 0,
      extra_guest_charge: 0,
      id: null,
      local_tax: 0.09,
      cleaning_charge: 100,
      max_guests: 0,
      min_stay: 0,
      review_count: 0,
      star_rating: 0,
      selectedCheckIn: null,
      selectedCheckOut: null,
      displayCalendar: false,
      view: null,
      adults: 1,
      children: 0,
      infants: 0,
      showGuest: false,
      showCalendar: false,
      displayPricing: false,
      total_base: null,
      duration: null,
      extraGuestFee: 0,
      
    };

    this.getListing = this.getListing.bind(this);
    this.getSelectedDates = this.getSelectedDates.bind(this);
    this.getSelectedGuests = this.getSelectedGuests.bind(this);
    this.displayGuest = this.displayGuest.bind(this);
    this.changeView = this.changeView.bind(this);
    this.styleDisplayDate = this.styleDisplayDate.bind(this);
    this.validateStay = this.validateStay.bind(this);
    this.calculateBase = this.calculateBase.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.calculateExtraGuests = this.calculateExtraGuests.bind(this);
    this.styleNumber = this.styleNumber.bind(this);
    this.clearSelectedDates = this.clearSelectedDates.bind(this);
  }

  componentDidMount() {
    this.getListing();
  }


  getListing() {
    // const random = Math.floor(Math.random() * 100);
    const random = 1;
    axios.get(`/listing/${random}`)
      .then((response) => {
        const { base_rate, currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating } = response.data;
        
        this.setState({
          currency, extra_guest_cap, extra_guest_charge, id, local_tax, max_guests,
          min_stay, review_count, star_rating, base_rate: Number(base_rate),
        }, () => {
          this.setState({
            displayCalendar: false,
          });
        });
      });
  }

  getSelectedDates(date) {
    let { view } = this.state;

    if (view === 'in') {
      this.setState({
        selectedCheckIn: date,
        view: 'out',
      }, () => {
        this.validateStay();
      });
    } else {
      this.setState({
        selectedCheckOut: date,
        view: 'in',
      }, () => {
        this.validateStay();
      });
    }
  }

  // eslint-disable-next-line react/sort-comp
  clearSelectedDates() {
    this.setState({
      selectedCheckIn: null,
      selectedCheckOut: null,
      displayPricing: false,
    });
  }

  getSelectedGuests(type, number) {
    console.log('getting selected guests at parents');
    const { adults, children } = this.state;
    this.setState({
      [type]: number,
    }, () => {
      this.calculateExtraGuests();
    });
  }

  displayGuest() {
    if (this.state.showGuest === false) {
      this.setState(prevState => ({
        showGuest: !prevState.showGuest,
      }), () => {
        document.getElementById('overlay-guest').style.display = 'block';
      });
    } else {
      this.setState(prevState => ({
        showGuest: !prevState.showGuest,
      }), () => {
        document.getElementById('overlay-guest').style.display = 'none';
      });
    }
  }

  displayCalendar(event) {
    const { name } = event.target;
    this.setState({
      view: name,
    }, () => {
      if (this.state.showCalendar === false) {
        this.setState(prevState => ({
          showCalendar: !prevState.showCalendar,
        }), () => {
          document.getElementById('overlay-calendar').style.display = 'block';
        });
      } else {
        this.setState(prevState => ({
          showCalendar: !prevState.showCalendar,
        }), () => {
          document.getElementById('overlay-calendar').style.display = 'none';
        });
      }
    });
  }

  hideCalendar() {
    this.setState({
      showCalendar: false,
      view: null,
    });
  }

  changeView(event) {
    const { name } = event.target;
    this.setState(prevState => ({
      view: name,
      displayCalendar: !prevState.displayCalendar,
    }));
  }

  styleDisplayDate(date) {
    let data = date.split('-');
      return data[1] + '/' + data[2] + '/' + data[0];
  }

  validateStay(reserved) {
    console.log('here');
    const { selectedCheckIn, selectedCheckOut, min_stay } = this.state;
    if (selectedCheckIn && selectedCheckOut) {
      const dateIn = moment(selectedCheckIn);
      const dateOut = moment(selectedCheckOut);
      const duration = dateOut.diff(dateIn, 'days');

      if (duration >= min_stay) {
        this.setState({
          duration,
        }, () => {
          this.calculateExtraGuests(this.calculateBase);
        });
      } else {
        console.log('this is not a valid stay');
      }
    }
    return;
  }

  calculateBase() {
    // make a get request for any custom pricing for the month you are in 
    // then, check each one (start at check in, end at check out ) 
    // keep track of total stay 
    console.log("calculating stay...");
    const { id, selectedCheckIn, selectedCheckOut } = this.state;

    const dateIn = moment(selectedCheckIn);
    const dateOut = moment(selectedCheckOut);
    const daysBetween = [];
    let query = '';
    let total = 0;
    
    for (let m = moment(dateIn); m.isBefore(dateOut); m.add(1, 'days')) {
      daysBetween.push(m.format('YYYY-MM-DD'));
    }

    for (let i = 0; i < daysBetween.length; i += 1) {
      query += '&time=' + daysBetween[i];
    }

    axios.get(`/custom/month?id=${id}${query}`)
      .then((response) => {
        const customDatesOnly = response.data.map(element => element.date);
        const customPricesOnly = response.data.map(item => item.price);
        for (let j = moment(dateIn); j.isBefore(dateOut); j.add(1, 'days')) {
          let item = (j.format('YYYY-MM-DD'));
          let index = customDatesOnly.indexOf(item);
          if (index >= 0) {
            total += Number(customPricesOnly[index]);
          } else {
            total += this.state.base_rate;
          }
        }
        this.setState({ total_base: total }, () => {
          this.setState({ displayPricing: true });
        });
      });
  }

  calculateExtraGuests(callback = () => {}) {
    console.log("calculating extra guests...");
    const { adults, children, extra_guest_cap, extra_guest_charge, selectedCheckIn, selectedCheckOut } = this.state;
    let currTotal = adults + children;
    let currAddlCharge;
    let stayInDays = 1;
    // the extra charge should actually be multiplied by the number of nights 
    if (selectedCheckIn && selectedCheckOut) {
      const dateIn = moment(selectedCheckIn);
      const dateOut = moment(selectedCheckOut);
      stayInDays = dateOut.diff(dateIn, 'days');
    }

    if (currTotal > extra_guest_cap) {
      currAddlCharge = (currTotal - extra_guest_cap) * extra_guest_charge * stayInDays;
    } else {
      currAddlCharge = 0;
    }
    
    console.log("aggregate extra guest fee", currAddlCharge);

    this.setState({
      extraGuestFee: currAddlCharge,
    }, () => {
      callback();
    });
  }

  styleNumber(number) {
    return <NumberFormat value={number} displayType={'text'} 
    thousandSeparator={true} prefix={'$'} decimalScale={0}/>;
  }

  render() {
    const { id, displayCalendar, view, max_guests, star_rating, review_count, min_stay, base_rate, cleaning_charge, local_tax, showGuest,
      adults, children, infants, selectedCheckIn, selectedCheckOut, displayPricing, total_base, duration, extraGuestFee } = this.state;

    let displayGuests = '';
    let displayInfants = '';

    if (adults + children > 1) {
      displayGuests = `${adults + children} guests`;
    } else if (adults + children <= 1) {
      displayGuests = `${adults + children} guest`;
    }

    if (infants === 1) {
      displayInfants = ', 1 infant';
    } else if (infants > 1) {
      displayInfants = `, ${infants} infants`;  
    }

    let checkInView;
    let checkOutView;
    if (view === 'out') {
      checkOutView = <div className="check-background">Checkout</div>;
      checkInView = 'Check-in';
    } else if (view === 'in') {
      checkInView = <div className="check-background">Check-in</div>;
      checkOutView = 'Checkout';
    } else {
      checkInView = 'Check-in';
      checkOutView = 'Checkout';
    }

    let perNight;
    if (duration) {
      perNight = Math.round((total_base + extraGuestFee) / duration);
    } else if (!duration && adults + children > 1) {
      perNight = base_rate + extraGuestFee; // total base would only include the additional guest charge at this point since no dates selected
    } else {
      perNight = base_rate;
    }

    let serviceCharge = (total_base + extraGuestFee) * .08;
    let occupancyFees = local_tax * (total_base + extraGuestFee + serviceCharge + cleaning_charge);
    let aggregate = total_base + extraGuestFee + serviceCharge + occupancyFees + cleaning_charge;


    return (
      <div className="reservations-container">
        <div className="reservations-inner">
          <div className="price-displayed">{ this.styleNumber(perNight) || this.styleNumber(base_rate)}</div>
          <div className="ratings-displayed"><div className="star-reviews"></div>{review_count}</div>
          <p />

          <span className="titles">Dates</span>
          <div className="dates-options">
            <a name="in" className="options-text-checkin" onClick={(event) => {this.displayCalendar(event);}}>
              { selectedCheckIn ? this.styleDisplayDate(selectedCheckIn) : checkInView}</a>




            
            
            
              <a className="options-text-checkout" name="out" onClick={(event) => {this.displayCalendar(event);}}>
              { selectedCheckOut ? this.styleDisplayDate(selectedCheckOut) : checkOutView }</a>
          </div>
          { this.state.id ? 
          <Calendar id={id} view={view} getSelectedDates={this.getSelectedDates} hideCalendar={this.hideCalendar}
            clearSelectedDates={this.clearSelectedDates} minStay={min_stay} />
            : null }

          <span className="titles">Guests</span>
          <div id="guests-display" onClick={this.displayGuest}>{displayGuests} {displayInfants}
            <div className="right"><i className={showGuest ? "arrow-up" : "arrow-down"} /></div>
          </div>
          <Guest maxGuests={max_guests} getSelectedGuests={this.getSelectedGuests} />

          { displayPricing ?
          <div className="pricing">
            <div id="text-base-fee-description">{this.styleNumber(perNight)} x {duration} {duration > 1 ? 'nights' : 'night' }
              <div className="right">
                {this.styleNumber(total_base + extraGuestFee)}
              </div>
            </div>

            <div id="text-misc-fees-description">
              Cleaning fee
              <div className="right">${cleaning_charge}</div>
              <p></p>
              Service charge
              <div className="right">
                {this.styleNumber(serviceCharge)}
              </div>
            </div>
            
            <div id="text-taxes">Occupancy taxes and fees
            <div className="right">{this.styleNumber(occupancyFees)}
            </div>
          </div>
            <div id="total-price">Total
              <div className="right">{this.styleNumber(aggregate)}</div>
            </div>
            <div id="booking-button">
            <button type="submit" className="booking" aria-busy="false" data-veloute="book-it-button">
            <div className="_10cu6uvp">Request to Book</div></button>
            </div>
          </div>
          : null }

        </div>
      </div>
    );
  }
}

export default App;
