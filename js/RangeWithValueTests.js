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
    assert.ok( new RangeWithValue( 1, 10, 10 ), 'valid range with value' );
    window.assert && assert.throws( () => {
      new RangeWithValue( 1, 10, 11 ); // eslint-disable-line
    }, 'invalid range with value, default value is out of range' );
    window.assert && assert.throws( () => {
      new RangeWithValue( 1, 10 ); // eslint-disable-line
    }, 'invalid range with value, default value is required' );
  } );

  QUnit.test( 'methods', assert => {

    // test a valid and invalid setMin()
    const rangeWithValue1 = new RangeWithValue( 1, 10, 3 );
    rangeWithValue1.setMin( 2 );
    assert.equal( rangeWithValue1.min, 2, 'setMin() succeeds when min < defaultValue < max' );
    window.assert && assert.throws( () => { rangeWithValue1.setMin( 4 ); }, 'setMin() fails when defaultValue < min < max' );

    // test a valid and invalid setMax()
    const rangeWithValue2 = new RangeWithValue( 1, 10, 8 );
    rangeWithValue2.setMax( 9 );
    assert.equal( rangeWithValue2.max, 9, 'setMax() succeeds when max > defaultValue > min' );
    window.assert && assert.throws( () => { rangeWithValue2.setMax( 7 ); }, 'setMax() fails when defaultValue > max > min' );

    // test a true and false equals()
    const rangeWithValue3 = new RangeWithValue( 1, 10, 5 );
    assert.ok(
      rangeWithValue3.equals( new RangeWithValue( 1, 10, 5 ) ),
      'equals() succeeds when rangeWithValue1 === rangeWithValue2'
    );
    assert.notOk(
      rangeWithValue3.equals( new RangeWithValue( 1, 10, 6 ) ),
      'equals() fails when rangeWithValue1 !== rangeWithValue2'
    );

    // test a valid and invalid setMinMax()
    const rangeWithValue5 = new RangeWithValue( 1, 10, 5 );
    rangeWithValue5.setMinMax( 2, 9 );
    assert.ok( rangeWithValue5.equals( new RangeWithValue( 2, 9, 5 ) ), 'setMinMax() succeeds when min < defaultValue < max' );
    window.assert && assert.throws( () => {
        rangeWithValue5.setMinMax( 3, 4 );
      }, 'setMinMax() fails when default value is out of range'
    );
  } );
} );