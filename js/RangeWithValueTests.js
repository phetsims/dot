// Copyright 2019, University of Colorado Boulder

/**
 * RangeWithValue tests
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  QUnit.module( 'RangeWithValue' );

  QUnit.test( 'constructor', assert => {
    assert.ok( new RangeWithValue( 1, 10, 2 ), 'valid range with value' );
    assert.ok( new RangeWithValue( 1, 10, 1 ), 'valid range with value' );
    assert.ok( new RangeWithValue( 1, 10, 10 ), 'valid range with value' );
    assert.ok( new RangeWithValue( 10, 10, 10 ), 'valid range with value' );
    window.assert && assert.throws( () => {
      new RangeWithValue( 1, 10, 11 ); // eslint-disable-line
    }, 'invalid range with value, default value is out of range' );
    window.assert && assert.throws( () => {
      new RangeWithValue( 1, 10 ); // eslint-disable-line
    }, 'invalid range with value, default value is required' );
  } );

  QUnit.test( 'methods', assert => {

    // test valid and invalid setMin()
    let rangeWithValue = new RangeWithValue( 1, 10, 3 );
    rangeWithValue.setMin( 2 );
    assert.equal( rangeWithValue.min, 2, 'setMin() succeeds when min <= defaultValue <= max' );
    rangeWithValue.setMin( 3 );
    assert.equal( rangeWithValue.min, 3, 'setMin() succeeds when min <= defaultValue <= max' );
    window.assert && assert.throws( () => { rangeWithValue.setMin( 4 ); }, 'setMin() fails when defaultValue < min' );

    // test valid and invalid setMax()
    rangeWithValue = new RangeWithValue( 1, 10, 8 );
    rangeWithValue.setMax( 9 );
    assert.equal( rangeWithValue.max, 9, 'setMax() succeeds when max >= defaultValue >= min' );
    rangeWithValue.setMax( 8 );
    assert.equal( rangeWithValue.max, 8, 'setMax() succeeds when max >= defaultValue >= min' );
    window.assert && assert.throws( () => { rangeWithValue.setMax( 7 ); }, 'setMax() fails when defaultValue > max' );

    // test a true and false equals()
    rangeWithValue = new RangeWithValue( 1, 10, 5 );
    assert.ok(
      rangeWithValue.equals( new RangeWithValue( 1, 10, 5 ) ),
      'equals() succeeds when rangeWithValue1 === rangeWithValue2'
    );
    assert.notOk(
      rangeWithValue.equals( new RangeWithValue( 1, 10, 6 ) ),
      'equals() fails when rangeWithValue1 !== rangeWithValue2'
    );

    // test valid and invalid setMinMax()
    rangeWithValue = new RangeWithValue( 1, 10, 5 );
    rangeWithValue.setMinMax( 2, 9 );
    assert.ok( rangeWithValue.equals( new RangeWithValue( 2, 9, 5 ) ), 'setMinMax() succeeds when min <= defaultValue <= max' );
    rangeWithValue.setMinMax( 2, 5 );
    assert.ok( rangeWithValue.equals( new RangeWithValue( 2, 5, 5 ) ), 'setMinMax() succeeds when min <= defaultValue <= max' );
    rangeWithValue.setMinMax( 5, 9 );
    assert.ok( rangeWithValue.equals( new RangeWithValue( 5, 9, 5 ) ), 'setMinMax() succeeds when min <= defaultValue <= max' );
    rangeWithValue.setMinMax( 5, 5 );
    assert.ok( rangeWithValue.equals( new RangeWithValue( 5, 5, 5 ) ), 'setMinMax() succeeds when min <= defaultValue <= max' );
    window.assert && assert.throws( () => {
      rangeWithValue.setMinMax( 3, 4 );
      }, 'setMinMax() fails when default value is out of range'
    );
    window.assert && assert.throws( () => {
        rangeWithValue.setMinMax( 6, 7 );
      }, 'setMinMax() fails when default value is out of range'
    );
  } );
} );