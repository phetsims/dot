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

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Range} range
   * @param {string} phetioID
   * @constructor
   */
  function RangeIO( range, phetioID ) {
    assert && assertInstanceOf( range, dot.Range );
    ObjectIO.call( this, range, phetioID );
  }

  phetioInherit( ObjectIO, 'RangeIO', RangeIO, {}, {
    documentation: 'A range with "min" and a "max" members.',

    /**
     * Encodes a Range instance to a state.
     * @param {Range} range
     * @returns {Object}
     */
    toStateObject: function( range ) {
      assert && assertInstanceOf( range, dot.Range );
      return { min: range.min, max: range.max };
    },

    /**
     * Decodes a state into a Range.
     * @param {Object} stateObject
     * @returns {Range}
     */
    fromStateObject: function( stateObject ) {
      return new dot.Range( stateObject.min, stateObject.max );
    }
  } );

  dot.register( 'RangeIO', RangeIO );

  return RangeIO;
} );