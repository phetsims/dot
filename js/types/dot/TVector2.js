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

  function TVector2( vector2, phetioID ) {
    TObject.call( this, vector2, phetioID );
    assert && assert( vector2 instanceof phet.dot.Vector2 );
  }

  phetioInherit( TObject, 'TVector2', TVector2, {}, {
    documentation: 'A numerical object with x/y scalar values',

    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector2( stateObject.x, stateObject.y );
    },

    toStateObject: function( instance ) {
      return { x: instance.x, y: instance.y };
    }
  } );

  phetioNamespace.register( 'TVector2', TVector2 );

  return TVector2;
} );