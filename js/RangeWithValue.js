// Copyright 2013-2019, University of Colorado Boulder

/**
 * A numeric range with a required default value.
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
   * @param {number} defaultValue - default value inside the range
   * @constructor
   */
  function RangeWithValue( min, max, defaultValue ) {

    Range.call( this, min, max );

    assert && assert( defaultValue !== undefined, 'default value is required' );
    assert && assert( defaultValue >= min && defaultValue <= max, 'defaultValue is out of range: ' + defaultValue );

    // @private
    this._defaultValue = defaultValue;
  }

  dot.register( 'RangeWithValue', RangeWithValue );

  return inherit( Range, RangeWithValue, {

    /**
     * Getter for defaultValue
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
      assert && assert( this._defaultValue >= min, 'min must be <= defaultValue: ' + min );
      Range.prototype.setMin.call( this, min );
    },

    /**
     * Setter for max
     * @param {number} max
     * @public
     * @override
     */
    setMax: function( max ) {
      assert && assert( this._defaultValue <= max, 'max must be >= defaultValue: ' + max );
      Range.prototype.setMax.call( this, max );
    },

    /**
     * Setter for min and max
     * @param {number} min
     * @param {number} max
     * @public
     * @override
     */
    setMinMax: function( min, max ) {
      assert && assert( this._defaultValue >= min, 'min must be <= defaultValue: ' + min );
      assert && assert( this._defaultValue <= max, 'max must be >= defaultValue: ' + max );
      Range.prototype.setMinMax.call( this, min, max );
    },

    /**
     * Converts the attributes of this range to a string
     * @public
     * @returns {string}
     * @override
     */
    toString: function() {
      return '[RangeWithValue (min:' + this.min + ' max:' + this.max + ' defaultValue:' + this._defaultValue + ')]';
    },

    /**
     * Determines if this RangeWithValue is equal to some object.
     * @public
     * @param {*} object
     * @returns {boolean}
     * @override
     */
    equals: function( object ) {
      return ( this.constructor === object.constructor ) &&
             ( this._defaultValue === object.defaultValue ) &&
             Range.prototype.equals.call( this, object );
    }
  } );
} );

