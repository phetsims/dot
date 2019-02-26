// Copyright 2016, University of Colorado Boulder

/**
 * IO type for Vector3
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
  var Vector3 = require( 'DOT/Vector3' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Vector3} vector3
   * @param {string} phetioID
   * @constructor
   */
  function Vector3IO( vector3, phetioID ) {
    ObjectIO.call( this, vector3, phetioID );
  }

  phetioInherit( ObjectIO, 'Vector3IO', Vector3IO, {}, {
    documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',
    validator: { valueType: Vector3 },

    /**
     * Encodes a Vector3 instance to a state.
     * @param {Vector3} vector3
     * @returns {Object}
     */
    toStateObject: function( vector3 ) {
      validate( vector3, this.validator );
      return { x: vector3.x, y: vector3.y, z: vector3.z };
    },

    /**
     * Decodes a state into a Vector3.
     * @param {Object} stateObject
     * @returns {Vector3}
     */
    fromStateObject: function( stateObject ) {
      return new Vector3( stateObject.x, stateObject.y, stateObject.z );
    }
  } );

  dot.register( 'Vector3IO', Vector3IO );

  return Vector3IO;
} );

