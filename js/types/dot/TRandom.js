// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );

  // constants
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  var TRandom = phetioInherit( TObject, 'TRandom', function( random, phetioID ) {
    TObject.call( this, random, phetioID );
    assert && assert( random instanceof phet.dot.Random );
  }, {}, {
    documentation: 'Generates pseudorandom values'
  } );

  phetioNamespace.register( 'TRandom', TRandom );

  return TRandom;
} );