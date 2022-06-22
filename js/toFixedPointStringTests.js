// Copyright 2022, University of Colorado Boulder

/**
 * QUnit tests for toFixedPointString.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import toFixedPointString from './toFixedPointString.js';

QUnit.module( 'toFixedPointString' );

QUnit.test( 'tests', assert => {

  assert.equal( toFixedPointString( 35.855, 2 ), '35.86' );
  assert.equal( toFixedPointString( 35.854, 2 ), '35.85' );
  assert.equal( toFixedPointString( -35.855, 2 ), '-35.86' );
  assert.equal( toFixedPointString( -35.854, 2 ), '-35.85' );

  assert.equal( toFixedPointString( 0.005, 2 ), '0.01' );
  assert.equal( toFixedPointString( 0.004, 2 ), '0.00' );
  assert.equal( toFixedPointString( -0.005, 2 ), '-0.01' );
  assert.equal( toFixedPointString( -0.004, 2 ), '0.00' );

  assert.equal( toFixedPointString( -0.005, 2 ), '-0.01' );

  assert.equal( toFixedPointString( 1.5, 0 ), '2' );
  assert.equal( toFixedPointString( 1.56, 0 ), '2' );
  assert.equal( toFixedPointString( 1.56, 1 ), '1.6' );
  assert.equal( toFixedPointString( 1.54, 1 ), '1.5' );

  assert.equal( toFixedPointString( 1.4, 0 ), '1' );
  assert.equal( toFixedPointString( 1.46, 0 ), '1' );
  assert.equal( toFixedPointString( 1.46, 1 ), '1.5' );
  assert.equal( toFixedPointString( 1.44, 1 ), '1.4' );
} );