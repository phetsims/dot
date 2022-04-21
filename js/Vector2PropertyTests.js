// Copyright 2019-2022, University of Colorado Boulder

/**
 * QUnit Tests for Vector2Property
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from './Bounds2.js';
import Vector2 from './Vector2.js';
import Vector2Property from './Vector2Property.js';

QUnit.module( 'Vector2Property' );
QUnit.test( 'Vector2Property', assert => {

  let vectorProperty = null;

  // constructor value
  assert.ok( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO );
  }, 'good constructor value' );
  window.assert && assert.throws( () => {
    vectorProperty = new Vector2Property( true );
  }, 'bad constructor value' );

  // set value
  assert.ok( () => {
    vectorProperty.set( new Vector2( 1, 1 ) );
  }, 'good set value' );
  window.assert && assert.throws( () => {
    vectorProperty.set( 5 );
  }, 'bad set value' );

  // validValues option
  assert.ok( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      validValues: [ Vector2.ZERO, new Vector2( 1, 1 ) ]
    } );
  }, 'good validValues' );
  window.assert && assert.throws( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      validValues: [ 1, 2, 3 ]
    } );
  }, 'bad validValues' );

  // isValidValue option
  assert.ok( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      isValidValue: value => ( value.x >= 0 && value.y <= 0 )
    } );
  }, 'good isValidValue' );
  window.assert && assert.throws( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      isValidValue: value => typeof value === 'string'
    } );
  }, 'bad isValidValue' );

  assert.ok( true, 'so we have at least 1 test in this set' );
} );

QUnit.test( 'Vector2Property.validBounds', assert => {
  let vectorProperty = null;

  window.assert && assert.throws( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      validBounds: 'fdsa'
    } );
  }, 'validBounds as a string' );

  window.assert && assert.throws( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      validBounds: 543
    } );
  }, 'validBounds as a string' );

  vectorProperty = new Vector2Property( Vector2.ZERO, {
    validBounds: null
  } );

  vectorProperty = new Vector2Property( Vector2.ZERO, {
    validBounds: Bounds2.EVERYTHING
  } );

  const myBounds = new Bounds2( 1, 1, 2, 2 );


  window.assert && assert.throws( () => {
    vectorProperty = new Vector2Property( Vector2.ZERO, {
      validBounds: myBounds
    } );
  }, 'starting value outside of validBounds' );

  vectorProperty = new Vector2Property( new Vector2( 1, 2 ), {
    validBounds: myBounds
  } );
  assert.ok( vectorProperty.validBounds === myBounds, 'same Bounds2 reference' );

  vectorProperty.value = new Vector2( 1, 1 );
  vectorProperty.value = new Vector2( 1.5, 1.5 );
  vectorProperty.value = new Vector2( 2, 2 );

  window.assert && assert.throws( () => {
    vectorProperty.value = new Vector2( 10, 10 );
  }, 'value outside of validBounds' );
} );