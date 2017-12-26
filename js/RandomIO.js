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
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * Wrapper type for phet/dot's Random
   * @param {Random} random
   * @param {string} phetioID
   * @constructor
   */
  function RandomIO( random, phetioID ) {
    assert && assertInstanceOf( random, phet.dot.Random );
    ObjectIO.call( this, random, phetioID );
  }

  phetioInherit( ObjectIO, 'RandomIO', RandomIO, {}, {
    documentation: 'Generates pseudorandom values'
  } );

  dot.register( 'RandomIO', RandomIO );

  return RandomIO;
} );