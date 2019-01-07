// Copyright 2018, University of Colorado Boulder

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

    // test a valid and invalid setMin()
    const range1 = new Range( 1, 10 );
    range1.setMin( 9 );
    assert.equal( range1.min, 9, 'setMin() succeeds when min < max' );
    window.assert && assert.throws( () => { range1.setMin( 11 ); }, 'setMin() fails when min > max' );

    // test a valid and invalid setMax()
    const range2 = new Range( 1, 10 );
    range2.setMax( 2 );
    assert.equal( range2.max, 2, 'setMax() succeeds when max > min' );
    window.assert && assert.throws( () => { range2.setMax( 0 ); }, 'setMax() fails when max < min' );

    // test a true and false equals()
    const range3 = new Range( 1, 10 );
    const range4 = new Range( 1, 10 );
    assert.ok( range3.equals( range4 ), 'equals() succeeds when range1 === range2' );
    range4.setMin( 2 );
    assert.notOk( range3.equals( range4 ), 'equals() fails when range1 !== range2' );

    // test a valid and invalid setMinMax()
    const range5 = new Range( 1, 10 );
    range5.setMinMax( 2, 11 );
    assert.ok( range5.equals( new Range( 2, 11 ) ), 'setMinMax() succeeds when min < max' );
    window.assert && assert.throws( () => { range5.setMinMax( 10, 1 ); }, 'setMinMax() fails when min > max' );
  } );
} );