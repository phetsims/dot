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
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );

  /**
   * Wrapper type for phet/dot's Vector2
   * @param vector2
   * @param phetioID
   * @constructor
   */
  function TVector2( vector2, phetioID ) {
    assertInstanceOf( vector2, phet.dot.Vector2 );
    TObject.call( this, vector2, phetioID );
  }

  phetioInherit( TObject, 'TVector2', TVector2, {}, {
    documentation: 'A numerical object with x/y scalar values',

    /**
     * Decodes a state into a Vector2.
     * @param {Object} stateObject
     * @returns {Vector2}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector2( stateObject.x, stateObject.y );
    },

    /**
     * Encodes a Vector2 instance to a state.
     * @param {Vector2} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return { x: instance.x, y: instance.y };
    }
  } );

  dot.register( 'TVector2', TVector2 );

  return TVector2;
} );