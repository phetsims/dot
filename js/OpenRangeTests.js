// Copyright 2018-2023, University of Colorado Boulder

/**
 * OpenRange tests
 *
 * @author Michael Barlow (PhET Interactive Simulations)
 */

import OpenRange from './OpenRange.js';
import Range from './Range.js';

const minHalfOpenOptions = { openMax: false };
const maxHalfOpenOptions = { openMin: false };

QUnit.module( 'OpenRange' );

QUnit.test( 'half open min', assert => {
  const testMinOpenRange = new OpenRange( 1, 10, minHalfOpenOptions );
  assert.notOk( testMinOpenRange.contains( 1 ), '(1, 10] does not contain 1' );
  assert.notOk( testMinOpenRange.intersects( new Range( 0, 1 ) ), '(1, 10] does not intersect [0, 1]' );
  assert.notOk( testMinOpenRange.containsRange( new Range( 1, 2 ), '(1, 10] does not contain [1, 2]' ) );
  assert.ok( testMinOpenRange.contains( 1.000000001 ), '(1, 10] contains 1.000000001' );
  assert.ok( testMinOpenRange.intersects( new Range( 0, 1.000000001 ) ), '(1, 10] intersects [0, 1.000000001]' );
  assert.ok( testMinOpenRange.containsRange( new Range( 1.000000001, 2 ) ), '(1, 10] contains [1.000000001, 2]' );
} );

QUnit.test( 'half open max', assert => {
  const maxOpenRange = new OpenRange( 1, 10, maxHalfOpenOptions );
  assert.notOk( maxOpenRange.contains( 10 ), '[1, 10) does not contain 10' );
  assert.notOk( maxOpenRange.intersects( new Range( 10, 11 ) ), '[1, 10) does not intersect [10,11]' );
  assert.notOk( maxOpenRange.containsRange( new Range( 9, 10 ), '[1, 10) does not contain [9, 10]' ) );
  assert.ok( maxOpenRange.contains( 9.999999999 ), '[1, 10) contains 9.999999999' );
  assert.ok( maxOpenRange.intersects( new Range( 9.999999999, 11 ) ), '[1, 10) intersects [9.999999999, 11]' );
  assert.ok( maxOpenRange.containsRange( new Range( 9, 9.999999999 ) ), '[1, 10) contains [9, 9.999999999]' );
} );

QUnit.test( 'fully open range', assert => {
  const openRange = new OpenRange( 1, 10 );
  assert.notOk( openRange.contains( 1 ), '(1, 10) does not contain 1' );
  assert.notOk( openRange.contains( 10 ), '(1, 10) does not contain 10' );
  assert.notOk( openRange.intersects( new Range( 0, 1 ) ), '(1, 10) does not intersect [0, 1]' );
  assert.notOk( openRange.intersects( new Range( 10, 11 ) ), '(1, 10) does not intersect [10,11]' );
  assert.notOk( openRange.containsRange( new Range( 9, 10 ), '(1, 10) does not contain [9, 10]' ) );
  assert.notOk( openRange.containsRange( new Range( 1, 2 ), '(1, 10) does not contain [1, 2]' ) );
  assert.ok( openRange.contains( 1.000000001 ), '(1, 10) contains 1.000000001' );
  assert.ok( openRange.contains( 9.999999999 ), '(1, 10) contains 9.999999999' );
  assert.ok( openRange.intersects( new Range( 0, 1.000000001 ) ), '(1, 10) intersects [0, 1.000000001]' );
  assert.ok( openRange.intersects( new Range( 9.999999999, 11 ) ), '(1, 10) intersects [9.999999999, 11]' );
  assert.ok( openRange.containsRange( new Range( 9, 9.999999999 ) ), '(1, 10) contains [9, 9.999999999]' );
  assert.ok( openRange.containsRange( new Range( 1.000000001, 2 ) ), '(1, 10) contains [1.000000001, 2]' );
} );

QUnit.test( 'setter overrides', assert => {
  let openRange = new OpenRange( 1, 10 );
  assert.notOk( openRange.setMin( 2 ), 'can set min < max' );
  window.assert && assert.throws( () => { openRange.setMin( 10 ); }, 'cannot set min = max in OpenRange' );
  openRange = new OpenRange( 1, 10 );
  assert.notOk( openRange.setMax( 2 ), 'can set max > min' );
  window.assert && assert.throws( () => { openRange.setMax( 1 ); }, 'cannot set min = max in OpenRange' );
} );

QUnit.test( 'assertion failures', assert => {
  if ( window.assert ) {
    assert.throws( () => new OpenRange( 1, 10, {
      openMin: false,
      openMax: false
    } ), 'include both min and max throws an error' );
    assert.throws( () => new OpenRange( 1, 1, minHalfOpenOptions ), 'min open range with min === max throws an error' );
    assert.throws( () => new OpenRange( 1, 1, maxHalfOpenOptions ), 'max open range with min === max throws an error' );
    assert.throws( () => new OpenRange( 1, 1 ), 'full open range with min === max throws an error' );

    let range = new OpenRange( 1, 10 );
    assert.throws( () => { range.setMin( 10 ); }, 'setting min equal to max throws an error' );
    range = new OpenRange( 1, 10 );
    assert.throws( () => { range.setMin( 11 ); }, 'setting min greater than max throws an error' );
    range = new OpenRange( 1, 10 );
    assert.throws( () => { range.setMax( 1 ); }, 'setting max equal to min throws an error' );
    range = new OpenRange( 1, 10 );
    assert.throws( () => { range.setMax( 0 ); }, 'setting max less than min throws an error' );
  }
  assert.ok( true );
} );
