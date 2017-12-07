// Copyright 2017, University of Colorado Boulder

/**
 * Vector2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );

  QUnit.module( 'Vector2' );

  function approximateEquals( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < 0.00000001, msg + ' expected: ' + b + ', result: ' + a );
  }

  QUnit.test( 'distance', function( assert ) {
    approximateEquals( assert, new Vector2( 2, 0 ).distance( Vector2.ZERO ), 2 );
    approximateEquals( assert, new Vector2( 2, 0 ).distanceSquared( Vector2.ZERO ), 4 );
    approximateEquals( assert, new Vector2( 4, 7 ).distance( new Vector2( 6, 9 ) ), 2 * Math.sqrt( 2 ) );
    approximateEquals( assert, new Vector2( 4, 7 ).distanceSquared( new Vector2( 6, 9 ) ), 8 );
  } );
} );