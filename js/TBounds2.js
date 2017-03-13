// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
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
   * Wrapper type for phet/dot's Bounds2
   * @param bounds2
   * @param phetioID
   * @constructor
   */
  function TBounds2( bounds2, phetioID ) {
    assert && assert( !!bounds2, 'bounds should exist' );
    TObject.call( this, bounds2, phetioID );
    assertInstanceOf( bounds2, phet.dot.Bounds2 );
  }

  phetioInherit( TObject, 'TBounds2', TBounds2, {}, {
    documentation: 'a 2-dimensional bounds rectangle',

    /**
     * Decodes a state into a Bounds2.
     * @param {Object} stateObject
     * @returns {Bounds2}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Bounds2(
        stateObject.minX, stateObject.minY,
        stateObject.maxX, stateObject.maxY
      );
    },

    /**
     * Encodes a Bounds2 instance to a state.
     * @param {Bounds2} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return {
        minX: instance.minX,
        minY: instance.minY,

        maxX: instance.maxX,
        maxY: instance.maxY
      };
    }
  } );

  dot.register( 'TBounds2', TBounds2 );

  return TBounds2;
} );