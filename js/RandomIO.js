// Copyright 2016, University of Colorado Boulder

/**
 * IO type for Random
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
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