// Copyright 2013-2015, University of Colorado Boulder

/**
 * A numeric range with an optional default value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  /**
   * @param {number} min - the minimum value of the range
   * @param {number} max - the maximum value of the range
   * @param {number} [defaultValue] - default value inside the range
   * @constructor
   */

  function RangeWithValue( min, max, defaultValue ) {

    Range.call( this, min, max );

    // @private - the default value of the range
    this._defaultValue = ( defaultValue === undefined ) ? min : defaultValue;

    assert && assert( ( this._defaultValue >= min ) && ( this._defaultValue <= max ) );
  }

  dot.register( 'RangeWithValue', RangeWithValue );

  return inherit( Range, RangeWithValue, {

    /**
     * Getter for defaultValue
     *
     * @returns {number}
     * @public
     */
    getDefaultValue: function() {
      return this._defaultValue;
    },
    get defaultValue() {
      return this.getDefaultValue();
    },

    /**
     * Converts the attributes of this range to a string
     * @public
     * @returns {string}
     */
    toString: function() {
      return '[Range (min:' + this.min + ' max:' + this.max + ' defaultValue:' + this.defaultValue + ')]';
    },

    /**
     * Determines if this range is equal to other range.
     * Note the default values must match as well.
     * @public
     * @param {Range} other
     * @returns {boolean}
     */
    equals: function( other ) {
      return other instanceof Range && this.min === other.min && this.max === other.max;
    }

  } );
} );

