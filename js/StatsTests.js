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

  QUnit.test( 'Quartiles', assert => {

    if ( window.assert ) {
      assert.throws( () => {
        Stats.getBoxPlotValues( [ 'test' ] );
      } );
      assert.throws( () => {
        Stats.getBoxPlotValues( 'hi' );
      } );
      assert.throws( () => {
        Stats.getBoxPlotValues( [ 45, 'test' ] );
      } );

      assert.throws( () => {
        Stats.getBoxPlotValues( [ 45 ] );
      } );

      assert.throws( () => {
        Stats.getBoxPlotValues( [ 45, 3 ] );
      } );

      assert.throws( () => {
        Stats.getBoxPlotValues( [ 45, 2, 2 ] );
      } );
    }

    let limits = Stats.getBoxPlotLimits( [ 10, 20, 30, 40 ] );
    let values = Stats.getBoxPlotValues( [ 10, 20, 30, 40 ] );
    assert.equal( values.q1, 15 );
    assert.equal( values.q3, 35 );
    assert.equal( limits.lowerLimit, -15 );
    assert.equal( limits.upperLimit, 65 );

    limits = Stats.getBoxPlotLimits( [ 5, 4, 3, 1, 50 ] );
    values = Stats.getBoxPlotValues( [ 5, 4, 3, 1, 50 ] );
    assert.equal( values.q1, 3 );
    assert.equal( values.q3, 5 );
    assert.equal( limits.lowerLimit, 0 );
    assert.equal( limits.upperLimit, 8 );


    limits = Stats.getBoxPlotLimits( [ 5, 4, 3, 23, 1, 50 ] );
    values = Stats.getBoxPlotValues( [ 5, 4, 3, 23, 1, 50 ] );
    assert.equal( values.q1, 3 );
    assert.equal( values.q3, 23 );
    assert.equal( limits.lowerLimit, -27 );
    assert.equal( limits.upperLimit, 53 );

    limits = Stats.getBoxPlotLimits( [ 35, 36, 46, 53, 58, 65, 75, 94 ] );
    values = Stats.getBoxPlotValues( [ 35, 36, 46, 53, 58, 65, 75, 94 ] );
    assert.equal( values.q1, 41 );
    assert.equal( values.q3, 70 );
    assert.equal( limits.lowerLimit, -2.5 );
    assert.equal( limits.upperLimit, 113.5 );

    limits = Stats.getBoxPlotLimits( [ 21, 25, 24, 23, 22, 22, 200, 24, 28, 29, 20, 29, 28 ] );
    values = Stats.getBoxPlotValues( [ 21, 25, 24, 23, 22, 22, 200, 24, 28, 29, 20, 29, 28 ] );
    assert.equal( values.q1, 22 );
    assert.equal( values.q3, 28 );
    assert.equal( limits.lowerLimit, 13 );
    assert.equal( limits.upperLimit, 37 );
  } );

} );