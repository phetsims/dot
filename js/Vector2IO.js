// Copyright 2017-2019, University of Colorado Boulder

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
  var Vector2 = require( 'DOT/Vector2' );
  var validate = require( 'AXON/validate' );

  class Vector2IO extends ObjectIO {

    /**
     * Encodes a Vector2 instance to a state.
     * @param {Vector2} vector2
     * @returns {Object}
     */
    static toStateObject( vector2 ) {
      validate( vector2, this.validator );
      return vector2.toStateObject();
    }

    /**
     * Decodes a state into a Vector2.
     * @param {Object} stateObject
     * @returns {Vector2}
     */
    static fromStateObject( stateObject ) {
      return Vector2.fromStateObject( stateObject );
    }
  }

  Vector2IO.documentation = 'A numerical object with x and y properties, like {x:3,y:4}';
  Vector2IO.validator = { valueType: Vector2 };
  Vector2IO.typeName = 'Vector2IO';
  ObjectIO.validateSubtype( Vector2IO );

  return dot.register( 'Vector2IO', Vector2IO );
} );