// Copyright 2017, University of Colorado Boulder

/**
 * PhET-iO wrapper type for Range.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * Wrapper type for phet/dot's Range
   * @param {Range} range
   * @param {string} phetioID
   * @constructor
   */
  function TRange( range, phetioID ) {
    assert && assertInstanceOf( range, phet.dot.Range );
    ObjectIO.call( this, range, phetioID );
  }

  phetioInherit( ObjectIO, 'TRange', TRange, {}, {
    documentation: 'A range',

    /**
     * Decodes a state into a Range.
     * @param {Object} stateObject
     * @returns {Range}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Range( stateObject.min, stateObject.max );
    },

    /**
     * Encodes a Range instance to a state.
     * @param {Range} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return { min: instance.min, max: instance.max };
    }
  } );

  dot.register( 'TRange', TRange );

  return TRange;
} );