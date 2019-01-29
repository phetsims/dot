// Copyright 2019, University of Colorado Boulder

/**
 * Range tests
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const Range = require( 'DOT/Range' );

  QUnit.module( 'Range' );

  QUnit.test( 'constructor', assert => {
    assert.ok( new Range( 1, 10 ), 'valid range' );
    assert.ok( new Range( 10, 10 ), 'valid range' );
    window.assert && assert.throws( () => {
      new Range( 10, 1 ); // eslint-disable-line
    }, 'invalid range, max < min' );
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
} );