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

  function TVector3( vector3, phetioID ) {
    TObject.call( this, vector3, phetioID );
    assert && assert( vector3 instanceof phet.dot.Vector3 );
  }

  phetioInherit( TObject, 'TVector3', TVector3, {}, {
    documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',

    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector3( stateObject.x, stateObject.y, stateObject.z );
    },

    toStateObject: function( instance ) {
      return { x: instance.x, y: instance.y, z: instance.z };
    }
  } );

  phetioNamespace.register( 'TVector3', TVector3 );

  return TVector3;
} );

