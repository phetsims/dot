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
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   * Wrapper type for phet/dot's Range
   * @param {Range} range
   * @param {string} phetioID
   * @constructor
   */
  function TRange( range, phetioID ) {
    assertInstanceOf( range, phet.dot.Range );
    TObject.call( this, range, phetioID );
  }

  phetioInherit( TObject, 'TRange', TRange, {}, {
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