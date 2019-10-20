/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import styles from '../styles/guest.css';

class Guest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adult: 1,
      child: 0,
      infant: 0,
    };

    this.selectGuests = this.selectGuests.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClickOutside();
  }

  handleClickOutside() {
    document.getElementById('overlayGuest').style.display = 'none';
  }

  selectGuests(event, name) {
    event.preventDefault();
    const { getSelectedGuests } = this.props;

    if (name.includes('minus')) {
      if (name.includes('adult')) {
        this.setState(prevState => ({
          adult: prevState.adult - 1,
        }), () => {
          getSelectedGuests('adults', this.state.adult);
        });
      } else if (name.includes('child')) {
        this.setState(prevState => ({
          child: prevState.child - 1,
        }), () => {
          getSelectedGuests('children', this.state.child);
        });
      } else {
        this.setState(prevState => ({
          infant: prevState.infant - 1,
        }), () => {
          getSelectedGuests('infants', this.state.infant);
        });
      }
    } else if (name.includes('plus')) {
      if (name.includes('adult')) {
        this.setState(prevState => ({
          adult: prevState.adult + 1,
        }), () => {
          getSelectedGuests('adults', this.state.adult);
        });
      } else if (name.includes('child')) {
        this.setState(prevState => ({
          child: prevState.child + 1,
        }), () => {
          getSelectedGuests('children', this.state.child);
        });
      } else {
        this.setState(prevState => ({
          infant: prevState.infant + 1,
        }), () => {
          getSelectedGuests('infants', this.state.infant);
        });
      }
    }
  }

  render() {
    const { maxGuests } = this.props;
    const { adult, child, infant } = this.state;
    let adultStatusPlus = 'buttonPlusOuter';
    let adultStatusMinus = 'buttonMinusOuter';
    let childStatusPlus = 'buttonPlusOuter';
    let childStatusMinus = 'buttonMinusOuter';
    let infantStatusPlus = 'buttonPlusOuter';
    let infantStatusMinus = 'buttonMinusOuter';

    if (adult + child >= maxGuests) {
      adultStatusPlus = 'buttonPlusOuterDisabled';
      childStatusPlus = 'buttonPlusOuterDisabled';
    }
    if (adult === 1) {
      adultStatusMinus = 'buttonMinusOuterDisabled';
    }
    if (child === 0) {
      childStatusMinus = 'buttonMinusOuterDisabled';
    }
    if (infant === 0) {
      infantStatusMinus = 'buttonMinusOuterDisabled';
    }
    if (infant >= 5) {
      infantStatusPlus = 'buttonPlusOuterDisabled';
    }

    return (
      <div ref={node => this.node = node}>
        <div id={styles.overlayGuest}>
          <div className={styles.guestOuterContainer}>

            <div className={styles.guestOptionOuter}>
              <div className={styles.guestOptionText}>
                Adults
              </div>
            </div>
          
            <div className={styles.buttonOuterContainer}>
              <div className={styles.buttonInnerContainer}>

                <div className={styles.buttonLeftAlign}>
                  <button type="button" className={styles[adultStatusMinus]}>
                    <span className={styles.buttonMinusInner}>
                      <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false"
                        onClick={(event) => {this.selectGuests(event, 'adult-minus')}}>
                        <rect height="2" rx="1" width="12" x="6" y="11" />
                      </svg>
                    </span>
                  </button>
                </div>
            
                <div className={styles.guestOptionText}>
                  {adult}
                </div>
              
                <div className={styles.buttonRightAlign}>
                  <button name="adult-plus" className={styles[adultStatusPlus]}>
                    <span className={styles.buttonPlusInner}>
                      <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false" 
                        onClick={(event) => {this.selectGuests(event, 'adult-plus')}}>
                        <rect height="2" rx="1" width="12" x="6" y="11" />
                        <rect height="12" rx="1" width="2" x="11" y="6" />
                      </svg>
                    </span>
                  </button>
                </div>

              </div>
            </div>
            <p></p>

            <div className={styles.guestOptionOuter}>
              <div className={styles.guestOptionText}>
              Children
                <div className={styles.guestAdditionalOuter}>
                  <div className={styles.guestAdditionalText}>
                    Ages 2–12
                  </div>
                </div>
              </div>
            </div>
        
            <div className={styles.buttonOuterContainer}>
              <div className={styles.buttonInnerContainer}>

                <div className={styles.buttonLeftAlign}>
                  <button type="button" className={styles[childStatusMinus]}>
                    <span className={styles.buttonMinusInner}>
                      <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false"
                        onClick={(event) => {this.selectGuests(event, 'child-minus')}}>
                        <rect height="2" rx="1" width="12" x="6" y="11" />
                      </svg>
                    </span>
                  </button>
                </div>
          
                <div className={styles.guestOptionText}>
                  {child}
                </div>
                
                <div className={styles.buttonRightAlign}>
                  <button name="adult-plus" className={styles[childStatusPlus]}>
                    <span className={styles.buttonPlusInner}>
                      <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false"
                        onClick={(event) => {this.selectGuests(event, 'child-plus')}}>
                        <rect height="2" rx="1" width="12" x="6" y="11" />
                        <rect height="12" rx="1" width="2" x="11" y="6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <p />

            <div className={styles.guestOptionOuter}>
              <div className={styles.guestOptionText}>
                Infants
                <div className={styles.guestAdditionalOuter}>
                  <div className={styles.guestAdditionalText}>
                    Under 2
                  </div>
                </div>
              </div>
            </div>
          
            <div className={styles.buttonOuterContainer}>
              <div className={styles.buttonInnerContainer}>
                <div className={styles.buttonLeftAlign}>
                  <button type="button" className={styles[infantStatusMinus]}>
                    <span className={styles.buttonMinusInner}>
                      <svg viewBox="0 0 24 24" role="img" aria-label="subtract" focusable="false"
                        onClick={(event) => {this.selectGuests(event, 'infant-minus')}}>
                        <rect height="2" rx="1" width="12" x="6" y="11" />
                      </svg>
                    </span>
                  </button>
                </div>
            
                <div className={styles.guestOptionText}>
                  {infant}
                </div>
                
                <div className={styles.buttonRightAlign}>
                  <button name="adult-plus" className={styles[infantStatusPlus]}>
                    <span className={styles.buttonPlusInner}>
                      <svg viewBox="0 0 24 24" role="img" aria-label="add" focusable="false" 
                        onClick={(event) => {this.selectGuests(event, 'infant-plus')}}>
                        <rect height="2" rx="1" width="12" x="6" y="11" />
                        <rect height="12" rx="1" width="2" x="11" y="6" />
                      </svg>
                    </span>          
                  </button>
                </div>
              </div>
            </div>
            <p />
            <div className={styles.guestDisclaimer}>{maxGuests} guests maximum. Infants don't count toward the number of guests.</div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Guest;
