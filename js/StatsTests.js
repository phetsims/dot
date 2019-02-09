// Copyright 2019, University of Colorado Boulder

/**
 * tests for Stats
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Stats = require( 'DOT/Stats' );

  QUnit.module( 'Stats' );

  QUnit.test( 'median', assert => {

    if ( window.assert ) {
      assert.throws( () => {
        Stats.median( [ 'test' ] );
      } );
      assert.throws( () => {
        Stats.median( 'hi' );
      } );
      assert.throws( () => {
        Stats.median( [ 45, 'test' ] );
      } );
    }
    assert.equal( Stats.median( [ 3, 2, 1 ] ), 2 );
    assert.equal( Stats.median( [ 2, 3, 1 ] ), 2 );
    assert.equal( Stats.median( [ 1, 2, 3 ] ), 2 );
    assert.equal( Stats.median( [ 1, 3, 2 ] ), 2 );
    assert.equal( Stats.median( [ 1, 300, 2 ] ), 2 );
    assert.equal( Stats.median( [ 1, 2, 2, 2 ] ), 2 );
    assert.equal( Stats.median( [ 1, 1, 3, 20 ] ), 2 );
    assert.equal( Stats.median( [ 1, 1, 5, 20 ] ), 3 );
    assert.equal( Stats.median( [ 1 ] ), 1 );
    assert.equal( Stats.median( [ 500 ] ), 500 );
    assert.equal( Stats.median( [] ), null );
  } );

} );