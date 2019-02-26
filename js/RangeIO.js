// Copyright 2017, University of Colorado Boulder

/**
 * IO type for Range.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var Range = require( 'DOT/Range' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Range} range
   * @param {string} phetioID
   * @constructor
   */
  function RangeIO( range, phetioID ) {
    ObjectIO.call( this, range, phetioID );
  }

  phetioInherit( ObjectIO, 'RangeIO', RangeIO, {}, {
    documentation: 'A range with "min" and a "max" members.',
    validator: { valueType: Range },

    /**
     * Encodes a Range instance to a state.
     * @param {Range} range
     * @returns {Object}
     */
    toStateObject: function( range ) {
      validate( range, this.validator );
      return { min: range.min, max: range.max };
    },

    /**
     * Decodes a state into a Range.
     * @param {Object} stateObject
     * @returns {Range}
     */
    fromStateObject: function( stateObject ) {
      return new Range( stateObject.min, stateObject.max );
    }
  } );

  dot.register( 'RangeIO', RangeIO );

  return RangeIO;
} );