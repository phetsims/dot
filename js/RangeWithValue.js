// Copyright 2016-2021, University of Colorado Boulder

/**
 * A numeric range with a required default value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Range from './Range.js';
import dot from './dot.js';

class RangeWithValue extends Range {
  /**
   * @param {number} min - the minimum value of the range
   * @param {number} max - the maximum value of the range
   * @param {number} defaultValue - default value inside the range
   */
  constructor( min, max, defaultValue ) {

    super( min, max );

    assert && assert( defaultValue !== undefined, 'default value is required' );
    assert && assert( defaultValue >= min && defaultValue <= max, `defaultValue is out of range: ${defaultValue}` );

    // @private
    this._defaultValue = defaultValue;
  }


  /**
   * Getter for defaultValue
   * @returns {number}
   * @public
   */
  getDefaultValue() {
    return this._defaultValue;
  }

  get defaultValue() {
    return this.getDefaultValue();
  }

  /**
   * Setter for min
   * @param {number} min
   * @public
   * @override
   */
  setMin( min ) {
    assert && assert( this._defaultValue >= min, `min must be <= defaultValue: ${min}` );
    super.setMin( min );
  }

  /**
   * Setter for max
   * @param {number} max
   * @public
   * @override
   */
  setMax( max ) {
    assert && assert( this._defaultValue <= max, `max must be >= defaultValue: ${max}` );
    super.setMax( max );
  }

  /**
   * Setter for min and max
   * @param {number} min
   * @param {number} max
   * @public
   * @override
   */
  setMinMax( min, max ) {
    assert && assert( this._defaultValue >= min, `min must be <= defaultValue: ${min}` );
    assert && assert( this._defaultValue <= max, `max must be >= defaultValue: ${max}` );
    super.setMinMax( min, max );
  }

  /**
   * Converts the attributes of this range to a string
   * @public
   * @returns {string}
   * @override
   */
  toString() {
    return `[RangeWithValue (min:${this.min} max:${this.max} defaultValue:${this._defaultValue})]`;
  }

  /**
   * Determines if this RangeWithValue is equal to some object.
   * @public
   * @param {*} object
   * @returns {boolean}
   * @override
   */
  equals( object ) {
    return ( this.constructor === object.constructor ) &&
           ( this._defaultValue === object.defaultValue ) &&
           super.equals( object );
  }
}

dot.register( 'RangeWithValue', RangeWithValue );

export default RangeWithValue;