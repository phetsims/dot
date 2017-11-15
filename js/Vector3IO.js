// Copyright 2016, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
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
   * Wrapper type for phet/dot's Vector3
   * @param vector3
   * @param phetioID
   * @constructor
   */
  function Vector3IO( vector3, phetioID ) {
    assert && assertInstanceOf( vector3, phet.dot.Vector3 );
    ObjectIO.call( this, vector3, phetioID );
  }

  phetioInherit( ObjectIO, 'Vector3IO', Vector3IO, {}, {
    documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',

    /**
     * Decodes a state into a Vector3.
     * @param {Object} stateObject
     * @returns {Vector3}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector3( stateObject.x, stateObject.y, stateObject.z );
    },

    /**
     * Encodes a Vector3 instance to a state.
     * @param {Vector3} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return { x: instance.x, y: instance.y, z: instance.z };
    }
  } );

  dot.register( 'Vector3IO', Vector3IO );

  return Vector3IO;
} );

