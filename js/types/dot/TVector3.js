// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );

  // constants
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  /**
   * Wrapper type for phet/dot's Vector3
   * @param vector3
   * @param phetioID
   * @constructor
   */
  function TVector3( vector3, phetioID ) {
    TObject.call( this, vector3, phetioID );
    assert && assert( vector3 instanceof phet.dot.Vector3 );
  }

  phetioInherit( TObject, 'TVector3', TVector3, {}, {
    documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',

    /**
     * Decodes a state into a Vector3.
     * @param {Object} stateObject
     * @returns {Object}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector3( stateObject.x, stateObject.y, stateObject.z );
    },

    /**
     * Encodes a Vector3 instance to a state.
     * @param {Object} instance
     * @returns {Object}
     */
    toStateObject: function( instance ) {
      return { x: instance.x, y: instance.y, z: instance.z };
    }
  } );

  phetioNamespace.register( 'TVector3', TVector3 );

  return TVector3;
} );

