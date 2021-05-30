// Copyright 2013-2021, University of Colorado Boulder

/**
 * A numeric range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrew Adare
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';

class Range {
  /**
   * @param {number} min - the minimum value of the range
   * @param {number} max - the maximum value of the range
   */
  constructor( min, max ) {

    assert && assert( min <= max, `max must be >= min. min: ${min}, max: ${max}` );

    // @private {number} - the minimum value of the range
    this._min = min;

    // @private {number} - the maximum value of the range
    this._max = max;
  }

  /**
   * Getter for min
   * @returns {number}
   * @public
   */
  getMin() {
    return this._min;
  }

  get min() {
    return this.getMin();
  }

  /**
   * Setter for min
   * @public
   * @param {number} min
   */
  setMin( min ) {
    assert && assert( min <= this._max, `min must be <= max: ${min}` );
    this._min = min;
  }

  set min( min ) {
    this.setMin( min );
  }

  /**
   * Getter for max
   * @returns {number}
   * @public
   */
  getMax() {
    return this._max;
  }

  get max() {
    return this.getMax();
  }

  /**
   * Setter for max
   * @public
   * @param {number} max
   */
  setMax( max ) {
    assert && assert( this._min <= max, `max must be >= to min: ${max}` );
    this._max = max;
  }

  set max( max ) {
    this.setMax( max );
  }

  /**
   * Sets the minimum and maximum value of the range
   * @public
   * @param {number} min
   * @param {number} max
   */
  setMinMax( min, max ) {
    assert && assert( min <= max, `max must be >= to min. min: ${min}, max: ${max}` );
    this._min = min;
    this._max = max;
  }

  /**
   * Makes a copy of this range
   * @public
   * @returns {Range}
   */
  copy() {
    return new Range( this._min, this._max ); // eslint-disable-line no-html-constructors
  }

  /**
   * Gets the length of this range, that is the difference between the maximum and minimum value of this range
   * @public
   * @returns {number}
   */
  getLength() {
    return this._max - this._min;
  }

  /**
   * Gets the center of this range, that is the average value of the maximum and minimum value of this range
   * @public
   * @returns {number}
   */
  getCenter() {
    return ( this._max + this._min ) / 2;
  }

  /**
   * Determines if this range contains the value
   * @public
   * @param {number} value
   * @returns {boolean}
   */
  contains( value ) {
    return ( value >= this._min ) && ( value <= this._max );
  }

  /**
   * Does this range contain the specified range?
   * @public
   * @param {Range} range
   * @returns {boolean}
   */
  containsRange( range ) {
    return ( this._min <= range.min ) && ( this._max >= range.max );
  }

  /**
   * Determine if this range overlaps (intersects) with another range
   * @public
   * @param {Range} range
   * @returns {boolean}
   */
  intersects( range ) {
    return ( this._max >= range.min ) && ( range.max >= this._min );
  }

  /**
   * Do the two ranges overlap with one another?  Note that this assumes that
   * This is a open interval.
   * @public
   * @param {Range} range
   * @returns {boolean}
   */
  intersectsExclusive( range ) {
    return ( this._max > range.min ) && ( range.max > this._min );
  }

  /**
   * Converts the attributes of this range to a string
   * @public
   * @returns {string}
   */
  toString() {
    return `[Range (min:${this._min} max:${this._max})]`;
  }

  /**
   * Constrains a value to the range.
   * @public
   * @param {number} value
   * @returns {number}
   */
  constrainValue( value ) {
    return Math.min( Math.max( value, this._min ), this._max );
  }

  /**
   * Determines if this Range is equal to some object.
   * @public
   * @param {*} object
   * @returns {boolean}
   */
  equals( object ) {
    return ( this.constructor === object.constructor ) &&
           ( this._min === object.min ) &&
           ( this._max === object.max );
  }

  /**
   * Given a value, normalize it to this Range's length, returning a value between 0 and 1 for values contained in
   * the Range. If the value is not contained in Range, then the return value will not be between 0 and 1.
   * @public
   *
   * @param {number} value
   * @returns {number}
   */
  getNormalizedValue( value ) {
    assert && assert( typeof value === 'number' );
    assert && assert( this.getLength() !== 0, 'cannot get normalized value without a range length' );
    return ( value - this.min ) / this.getLength();
  }

  /**
   * In https://github.com/phetsims/dot/issues/57, defaultValue was moved to RangeWithValue.
   * This ES5 getter catches programming errors where defaultValue is still used with Range.
   */
  get defaultValue() {
    throw new Error( 'defaultValue is undefined, did you mean to use RangeWithValue?' );
  }
}

dot.register( 'Range', Range );

Range.RangeIO = new IOType( 'RangeIO', {
  valueType: Range,
  documentation: 'A range with "min" and a "max" members.',
  toStateObject: range => ( {
    min: NumberIO.toStateObject( range.min ),
    max: NumberIO.toStateObject( range.max )
  } ),

  // eslint-disable-next-line no-html-constructors
  fromStateObject: stateObject => new Range(
    NumberIO.fromStateObject( stateObject.min ),
    NumberIO.fromStateObject( stateObject.max )
  ),
  stateSchema: {
    min: NumberIO,
    max: NumberIO
  }
} );

export default Range;