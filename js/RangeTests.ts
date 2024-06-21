// Copyright 2019-2024, University of Colorado Boulder

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
  const testSameRange = ( value: number ) => {
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
  const testSameRange = ( normalizedValue: number ) => {
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

QUnit.test( 'clampDelta', assert => {
  assert.equal( new Range( 0, 20 ).clampDelta( 10, 21 ), 10, 'clamped1' );
  assert.equal( new Range( 0, 20 ).clampDelta( 10, -21 ), -10, 'clamped2' );
  assert.equal( new Range( 0, 20 ).clampDelta( 10, 2 ), 2, 'clamped2' );
  assert.equal( new Range( 0, 1 ).clampDelta( 0, 2 ), 1, 'clamped2' );
  assert.equal( new Range( 0, 1 ).clampDelta( 0, -2 ), 0, 'clamped2' );
  assert.equal( new Range( 0, 1 ).clampDelta( 0, -0 ), 0, 'clamped2' );
  assert.equal( new Range( 0, 1 ).clampDelta( 1, -0 ), 0, 'clamped2' );
  assert.equal( new Range( 0, 1 ).clampDelta( 1, 10 ), 0, 'clamped2' );
  assert.equal( new Range( 0, 1 ).clampDelta( 0.5, 10 ), 0.5, 'clamped2' );
} );

QUnit.test( 'times/multiply', assert => {

  assert.equal( new Range( 0, 1 ).times( 3 ).min, 0, 'times1' );
  assert.equal( new Range( 0, 1 ).times( 3 ).max, 3, 'times2' );
  assert.equal( new Range( -30, 10 ).times( 3 ).min, -90, 'times3' );
  assert.equal( new Range( -30, 10 ).times( 3 ).max, 30, 'times4' );
  const range1 = new Range( 0, 10 );
  assert.ok( range1 !== range1.times( 0 ), 'times5' );
  assert.ok( range1 === range1.multiply( 0 ), 'multiply1' );
  assert.equal( new Range( 0, 1 ).multiply( 3 ).min, 0, 'multiply1' );
  assert.equal( new Range( 0, 1 ).multiply( 3 ).max, 3, 'multiply2' );
  assert.equal( new Range( -30, 10 ).multiply( 3 ).min, -90, 'multiply3' );
  assert.equal( new Range( -30, 10 ).multiply( 3 ).max, 30, 'multiply4' );
} );