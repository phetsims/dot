// Copyright 2016, University of Colorado Boulder

/**
 * IO type for Vector2
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Vector2} vector2
   * @param {string} phetioID
   * @constructor
   */
  function Vector2IO( vector2, phetioID ) {
    assert && assertInstanceOf( vector2, dot.Vector2 );
    ObjectIO.call( this, vector2, phetioID );
  }

  phetioInherit( ObjectIO, 'Vector2IO', Vector2IO, {}, {
    documentation: 'A numerical object with x and y properties, like {x:3,y:4}',

    /**
     * Encodes a Vector2 instance to a state.
     * @param {Vector2} vector2
     * @returns {Object}
     */
    toStateObject: function( vector2 ) {
      assert && assertInstanceOf( vector2, dot.Vector2 );
      return { x: vector2.x, y: vector2.y };
    },

    /**
     * Decodes a state into a Vector2.
     * @param {Object} stateObject
     * @returns {Vector2}
     */
    fromStateObject: function( stateObject ) {
      return new dot.Vector2( stateObject.x, stateObject.y );
    }
  } );

  dot.register( 'Vector2IO', Vector2IO );

  return Vector2IO;
} );