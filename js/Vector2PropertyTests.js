// Copyright 2019, University of Colorado Boulder

/**
 * QUnit Tests for Vector2Property
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2IO = require( 'DOT/Vector2IO' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  QUnit.module( 'Vector2Property' );
  QUnit.test( 'Vector2Property', function( assert ) {

    let vectorProperty = null;

    // constructor value
    assert.ok( () => {
      vectorProperty = new Vector2Property( Vector2.ZERO );
    }, 'good constructor value' );
    window.assert && assert.throws( function() {
      vectorProperty = new Vector2Property( true );
    }, 'bad constructor value' );

    // set value
    assert.ok( () => {
      vectorProperty.set( new Vector2( 1, 1 ) );
    }, 'good set value' );
    window.assert && assert.throws( function() {
      vectorProperty.set( 5 );
    }, 'bad set value' );

    // validValues option
    assert.ok( () => {
      vectorProperty = new Vector2Property( Vector2.ZERO, {
        validValues: [ Vector2.ZERO, new Vector2( 1, 1 ) ]
      } );
    }, 'good validValues' );
    window.assert && assert.throws( function() {
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
    window.assert && assert.throws( function() {
      vectorProperty = new Vector2Property( Vector2.ZERO, {
        isValidValue: value => typeof value === 'string'
      } );
    }, 'bad isValidValue' );

    // superclass options that are controlled by Vector2Property
    window.assert && assert.throws( function() {
      vectorProperty = new Vector2Property( Vector2.ZERO, { valueType: Vector2 } );
    }, 'Vector2Property sets valueType' );
    window.assert && assert.throws( function() {
      vectorProperty = new Vector2Property( Vector2.ZERO, { phetioType: Vector2IO } );
    }, 'Vector2Property sets phetioType' );

    assert.ok( true, 'so we have at least 1 test in this set' );
  } );
} );