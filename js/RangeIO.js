// Copyright 2017-2019, University of Colorado Boulder

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
  var Range = require( 'DOT/Range' );
  var validate = require( 'AXON/validate' );

  class RangeIO extends ObjectIO {

    /**
     * Encodes a Range instance to a state.
     * @param {Range} range
     * @returns {Object}
     */
    static toStateObject( range ) {
      validate( range, this.validator );
      return { min: range.min, max: range.max };
    }

    /**
     * Decodes a state into a Range.
     * @param {Object} stateObject
     * @returns {Range}
     */
    static fromStateObject( stateObject ) {
      return new Range( stateObject.min, stateObject.max );
    }
  }

  RangeIO.documentation = 'A range with "min" and a "max" members.';
  RangeIO.validator = { valueType: Range };
  RangeIO.typeName = 'RangeIO';
  ObjectIO.validateSubtype( RangeIO );

  return dot.register( 'RangeIO', RangeIO );
} );