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
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Vector2} vector2
   * @param {string} phetioID
   * @constructor
   */
  function Vector2IO( vector2, phetioID ) {
    ObjectIO.call( this, vector2, phetioID );
  }

  phetioInherit( ObjectIO, 'Vector2IO', Vector2IO, {}, {
    documentation: 'A numerical object with x and y properties, like {x:3,y:4}',

    /**
     * @override
     * @public
     */
    validator: { valueType: Vector2 },

    /**
     * Encodes a Vector2 instance to a state.
     * @param {Vector2} vector2
     * @returns {Object}
     */
    toStateObject: function( vector2 ) {
      validate( vector2, this.validator );
      return vector2.toStateObject();
    },

    /**
     * Decodes a state into a Vector2.
     * @param {Object} stateObject
     * @returns {Vector2}
     */
    fromStateObject: function( stateObject ) {
      return Vector2.fromStateObject( stateObject );
    }
  } );

  dot.register( 'Vector2IO', Vector2IO );

  return Vector2IO;
} );