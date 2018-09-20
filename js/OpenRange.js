// Copyright 2013-2015, University of Colorado Boulder

/**
 * A numeric range that handles open and half open intervals. Defaults to an open interval.
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  /**
   * @param {number} min - the minimum value of the range
   * @param {number} max - the maximum value of the range
   * @param {Object} options
   * @constructor
   */
  function OpenRange( min, max, options ) {

    options = _.extend( {
      openMin: true,
      openMax: true
    }, options );

    // @public (read-only) - the minimum value of the range
    this.min = min;

    // @public (read-only) - the maximum value of the range
    this.max = max;

    // @public (read-only) - interval open at minimum value (excludes the min in comparisons)
    this.openMin = options.openMin;

    // @public (read-only) - interval open at maximum value (excludes the max in comparisons)
    this.openMax = options.openMax;

    // if the interval is open, ensure that the min is strictly less than the max
    assert && ( ( this.openMin || this.openMax ) ? assert( min < max ) : assert( min <= max ) );
  }

  dot.register( 'OpenRange', OpenRange );

  return inherit( Range, OpenRange, {

    /**
     * Determines if this range contains the value
     * @public
     * @param {number} value
     * @returns {boolean}
     */
    contains: function( value ) {
      return ( this.openMin ? value > this.min : value >= this.min ) &&
             ( this.openMax ? value < this.max : value <= this.max );
    },

    /**
     * Does this range contain the specified range?
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    containsRange: function( range ) {
      return ( this.openMin ? this.min < range.min : this.min <= range.min ) &&
             ( this.openMax ? this.max > range.max : this.max >= range.max );
    },

    /**
     * Determine if this range overlaps (intersects) with another range
     * @public
     * @param {Range} range
     * @returns {boolean}
     */
    intersects: function( range ) {
      return ( this.openMax ? this.max > range.min : this.max >= range.min ) &&
             ( this.openMin ? range.max > this.min : range.max >= this.min );
    },

    /**
     * Converts the attributes of this range to a string
     * @public
     * @returns {string}
     */
    toString: function() {
      var leftBracket = this.openMin ? '(' : '[';
      var rightBracket = this.openMax ? ')' : ']';
      return '[Range ' + leftBracket + 'min:' + this.min + ' max:' + this.max + rightBracket + ']';
    },

    /**
     * TODO: how will this function in an open range scenario?
     * Constrains a value to the range.
     * @public
     * @param {number} value
     * @returns {number}
     */
    constrainValue: function( value ) {
      return Math.min( Math.max( value, this.min ), this.max );
    },

    /**
     * Determines if this range is equal to other range.
     * @public
     * @param {Range} other
     * @returns {boolean}
     */
    equals: function( other ) {
      return other     instanceof Range &&
             this.min         === other.min &&
             this.max         === other.max &&
             this.openMin === other.openMin &&
             this.openMax === other.openMax;
    }
  } );
} );
