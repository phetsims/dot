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
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var Random = require( 'DOT/Random' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );

  /**
   * @param {Random} random
   * @param {string} phetioID
   * @constructor
   */
  function RandomIO( random, phetioID ) {
    assert && assertInstanceOf( random, Random );
    ObjectIO.call( this, random, phetioID );
  }

  phetioInherit( ObjectIO, 'RandomIO', RandomIO, {}, {
    documentation: 'Generates pseudorandom values'
  } );

  dot.register( 'RandomIO', RandomIO );

  return RandomIO;
} );