// Copyright 2013-2015, University of Colorado Boulder

/**
 * A numeric range with an optional default value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Chris Klusendorf (PhET Interactive Simulations)
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

    assert && assert( this._defaultValue >= min && this._defaultValue <= max,
      'Default value must be less than or equal to max and greater than or equal to min: ' + this._defaultValue
    );
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
     * Setter for min
     * @param {number} min
     * @public
     * @override
     */
    setMin: function( min ) {
      assert && assert( this._defaultValue >= min, 'min must be less than or equal to default value: ' + min );
      Range.prototype.setMin.call( this, min );
    },

    /**
     * Setter for max
     * @param {number} max
     * @public
     * @override
     */
    setMax: function( max ) {
      assert && assert( this._defaultValue <= max, 'max must be greater than or equal to default value: ' + max );
      Range.prototype.setMax.call( this, max );
    },

    /**
     * Converts the attributes of this range to a string
     * @public
     * @returns {string}
     * @override
     */
    toString: function() {
      return '[RangeWithValue (min:' + this._min + ' max:' + this._max + ' defaultValue:' + this._defaultValue + ')]';
    },

    /**
     * Determines if this range is equal to other range.
     * Note the default values must match as well.
     * @public
     * @param {Range} other
     * @returns {boolean}
     * @override
     */
    equals: function( other ) {
      return other instanceof RangeWithValue &&
             this._min === other.min &&
             this._max === other.max &&
             this._defaultValue === other.defaultValue;
    }
  } );
} );

