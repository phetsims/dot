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
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   * Wrapper type for phet/dot's Random
   * @param random
   * @param phetioID
   * @constructor
   */
  function TRandom( random, phetioID ) {
    assertInstanceOf( random, phet.dot.Random );
    TObject.call( this, random, phetioID );
  }

  phetioInherit( TObject, 'TRandom', TRandom, {}, {
    documentation: 'Generates pseudorandom values'
  } );

  dot.register( 'TRandom', TRandom );

  return TRandom;
} );