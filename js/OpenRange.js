// Copyright 2018-2022, University of Colorado Boulder

/**
 * A numeric range that handles open and half open intervals. Defaults to an open interval.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import dot from './dot.js';
import Range from './Range.js';

class OpenRange extends Range {
  /**
   * @param {number} min - the minimum value of the range
   * @param {number} max - the maximum value of the range
   * @param {Object} [options]
   */
  constructor( min, max, options ) {

    options = merge( {
      openMin: true,
      openMax: true
    }, options );

    super( min, max );

    // @public (read-only) - interval open at minimum value (excludes the min in comparisons)
    this.openMin = options.openMin;

    // @public (read-only) - interval open at maximum value (excludes the max in comparisons)
    this.openMax = options.openMax;

    // if the interval is open, ensure that the min is strictly less than the max
    assert && assert( this.openMin || this.openMax, 'use Range type if min and max are inclusive' );
    assert && assert( min < max, 'must instantiate OpenRange with min strictly less than max' );
  }


  /**
   * OpenRange override for setMin.
   * @public
   * @override
   * @param  {number} min
   */
  setMin( min ) {
    assert && assert( min < this._max, 'min must be strictly less than max for OpenRange' );
    super.setMin( min );
  }

  /**
   * OpenRange override for setMax.
   * @public
   * @override
   * @param  {number} max
   */
  setMax( max ) {
    assert && assert( max > this._min, 'max must be strictly greater than min for OpenRange' );
    super.setMax( max );
  }

  /**
   * OpenRange override for setMinMax. Ensures that min is strictly less than max.
   * @override
   * @public
   * @param  {number} min
   * @param  {number} max
   */
  setMinMax( min, max ) {
    assert && assert( min < max, 'min must be strictly less than max in OpenRange' );
    super.setMinMax( min, max );
  }

  /**
   * Determines if this range contains the value
   * @public
   * @param {number} value
   * @returns {boolean}
   */
  contains( value ) {
    return ( this.openMin ? value > this.min : value >= this.min ) &&
           ( this.openMax ? value < this.max : value <= this.max );
  }

  /**
   * Does this range contain the specified range?
   * @public
   * @param {Range} range
   * @returns {boolean}
   */
  containsRange( range ) {
    return ( this.openMin ? this.min < range.min : this.min <= range.min ) &&
           ( this.openMax ? this.max > range.max : this.max >= range.max );
  }

  /**
   * Determine if this range overlaps (intersects) with another range
   * @public
   * @param {Range} range
   * @returns {boolean}
   */
  intersects( range ) {
    return ( this.openMax ? this.max > range.min : this.max >= range.min ) &&
           ( this.openMin ? range.max > this.min : range.max >= this.min );
  }

  /**
   * Converts the attributes of this range to a string
   * @public
   * @returns {string}
   */
  toString() {
    const leftBracket = this.openMin ? '(' : '[';
    const rightBracket = this.openMax ? ')' : ']';
    return `[Range ${leftBracket}min:${this.min} max:${this.max}${rightBracket}]`;
  }

  /**
   * TODO: how will this function in an open range scenario?
   * Constrains a value to the range.
   * @public
   * @param {number} value
   * @returns {number}
   */
  constrainValue( value ) {
    return Math.min( Math.max( value, this.min ), this.max );
  }

  /**
   * Determines if this range is equal to other range.
   * @public
   * @param {Range} other
   * @returns {boolean}
   */
  equals( other ) {
    return other instanceof Range &&
           this.min === other.min &&
           this.max === other.max &&
           this.openMin === other.openMin &&
           this.openMax === other.openMax;
  }
}

dot.register( 'OpenRange', OpenRange );

export default OpenRange;