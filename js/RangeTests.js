// Copyright 2019-2022, University of Colorado Boulder

/**
 * Range tests
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Range from './Range.js';

QUnit.module( 'Range' );

QUnit.test( 'constructor', assert => {
  assert.ok( new Range( 1, 10 ), 'valid range' );
  assert.ok( new Range( 10, 10 ), 'valid range' );
} );

QUnit.test( 'methods', assert => {

  // test valid and invalid setMin()
  let range = new Range( 1, 10 );
  range.setMin( 9 );
  assert.equal( range.min, 9, 'setMin() succeeds when min <= max' );
  range.setMin( 10 );
  assert.equal( range.min, 10, 'setMin() succeeds when min <= max' );
  window.assert && assert.throws( () => { range.setMin( 11 ); }, 'setMin() fails when min > max' );

  // test valid and invalid setMax()
  range = new Range( 1, 10 );
  range.setMax( 2 );
  assert.equal( range.max, 2, 'setMax() succeeds when max >= min' );
  range.setMax( 1 );
  assert.equal( range.max, 1, 'setMax() succeeds when max >= min' );
  window.assert && assert.throws( () => { range.setMax( 0 ); }, 'setMax() fails when max < min' );

  // test a true and false equals()
  const range1 = new Range( 1, 10 );
  const range2 = new Range( 1, 10 );
  assert.ok( range1.equals( range2 ), 'equals() succeeds when range1 === range2' );
  range2.setMin( 2 );
  assert.notOk( range1.equals( range2 ), 'equals() fails when range1 !== range2' );

  // test valid and invalid setMinMax()
  range = new Range( 1, 10 );
  range.setMinMax( 2, 11 );
  assert.ok( range.equals( new Range( 2, 11 ) ), 'setMinMax() succeeds when min <= max' );
  range.setMinMax( 5, 5 );
  assert.ok( range.equals( new Range( 5, 5 ) ), 'setMinMax() succeeds when min <= max' );
  window.assert && assert.throws( () => { range.setMinMax( 10, 1 ); }, 'setMinMax() fails when min > max' );
} );

QUnit.test( 'getNormalizedValue', assert => {
  const testSameRange = value => {
    assert.ok( value === new Range( 0, 1 ).getNormalizedValue( value ),
      `normalized value in range from 0 to 1 is the same as value: ${value}|` );
  };
  testSameRange( 0 );
  testSameRange( 1 );
  testSameRange( 0.5 );
  testSameRange( 0.2 );
  testSameRange( 0.2432124 );

  const rangeNoLength = new Range( 1, 1 );
  window.assert && assert.throws( () => {
    rangeNoLength.getNormalizedValue( 1 );
  }, 'no length' );
  window.assert && assert.throws( () => {
    rangeNoLength.getNormalizedValue( 2 );
  }, 'outside range no length' );

  const range = new Range( 2, 10 );
  assert.ok( range.getNormalizedValue( 2 ) === 0, 'min' );
  assert.ok( range.getNormalizedValue( 10 ) === 1, 'max' );
  assert.ok( range.getNormalizedValue( 6 ) === 0.5, 'half' );
  assert.ok( range.getNormalizedValue( 3.5432 ) === 0.19290000000000002, 'random weird number' );
} );

QUnit.test( 'expandNormalizedValue', assert => {
  const testSameRange = normalizedValue => {
    assert.ok( normalizedValue === new Range( 0, 1 ).expandNormalizedValue( normalizedValue ),
      `normalized normalized in range from 0 to 1 is the same as value: ${normalizedValue}` );
  };
  testSameRange( 0.1 );
  testSameRange( 1 );
  testSameRange( 0.5 );
  testSameRange( 0.2 );
  testSameRange( 0.2432124 );

  const range = new Range( 2, 10 );
  assert.ok( range.expandNormalizedValue( -2 ) === -14, 'less than min' );
  assert.ok( range.expandNormalizedValue( 0 ) === 2, 'min' );
  assert.ok( range.expandNormalizedValue( 1 ) === 10, 'max' );
  assert.ok( range.expandNormalizedValue( 2 ) === 18, 'double' );
  assert.ok( range.expandNormalizedValue( 0.5 ) === 6, 'half' );
  assert.ok( range.expandNormalizedValue( 0.75 ) === 8, 'random weird number' );
} );