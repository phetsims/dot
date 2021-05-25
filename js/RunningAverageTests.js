// Copyright 2021, University of Colorado Boulder

/**
 * RunningAverage tests
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import RunningAverage from './RunningAverage.js';

QUnit.module( 'RunningAverage' );

QUnit.test( 'main tests', assert => {
  const a = new RunningAverage( 1 );
  assert.ok( isNaN( a.getRunningAverage() ), 'when there are no samples, the average should be NaN' );
  assert.equal( a.updateRunningAverage( 7 ), 7, 'value should update' );
  assert.equal( a.updateRunningAverage( 8 ), 8, 'value should update' );

  const b = new RunningAverage( 4 );
  b.updateRunningAverage( 1 );
  b.updateRunningAverage( 1 );
  assert.equal( b.getRunningAverage(), 1, 'value should update' );
  b.updateRunningAverage( 0 );
  assert.equal( b.getRunningAverage(), 2 / 3, 'value should update' );
  b.updateRunningAverage( 0 );
  b.updateRunningAverage( 0 );
  assert.equal( b.getRunningAverage(), 1 / 4, 'value should update' );
} );