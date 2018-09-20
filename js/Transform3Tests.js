// Copyright 2017, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Matrix3 = require( 'DOT/Matrix3' );
  var Ray2 = require( 'DOT/Ray2' );
  var Transform3 = require( 'DOT/Transform3' );
  var Vector2 = require( 'DOT/Vector2' );

  QUnit.module( 'Transform3' );

  var epsilon = 1e-7;

  function approximateEqual( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < epsilon, msg + ' expected: ' + b + ', got: ' + a );
  }

  function approximateRayEqual( assert, a, b, msg ) {
    assert.ok( a.position.equalsEpsilon( b.position, 0.00001 ) && a.direction.equalsEpsilon( b.direction, 0.00001 ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
  }

  QUnit.test( 'Ray2 transforms', function( assert ) {
    var transform = new Transform3( Matrix3.createFromPool( 0, -2, 5, 3, 0, 8, 0, 0, 1 ) );
    var ray = new Ray2( new Vector2( 2, 7 ), new Vector2( -5, 2 ).normalized() );

    var tray = transform.transformRay2( ray );
    var iray = transform.inverseRay2( ray );

    var backOffset = transform.inversePosition2( tray.pointAtDistance( 1 ) );
    var backPos = transform.inversePosition2( tray.position );
    assert.ok( ray.direction.equalsEpsilon( backOffset.minus( backPos ).normalized(), 0.00001 ), 'transformRay2 ray linearity' );

    var forwardOffset = transform.transformPosition2( iray.pointAtDistance( 1 ) );
    var forwardPos = transform.transformPosition2( iray.position );
    assert.ok( ray.direction.equalsEpsilon( forwardOffset.minus( forwardPos ).normalized(), 0.00001 ), 'inverseRay2 ray linearity' );

    approximateRayEqual( assert, transform.inverseRay2( transform.transformRay2( ray ) ), ray, 'inverse correctness' );
  } );

  QUnit.test( 'Transform x/y', function( assert ) {
    var t = new Transform3( Matrix3.createFromPool( 2, 0, 10, 0, 3, 1, 0, 0, 1 ) );
    assert.equal( t.transformX( 5 ), 20 );
    assert.equal( t.transformY( 5 ), 16 );
    assert.equal( t.inverseX( 20 ), 5 );
    assert.equal( t.inverseY( 16 ), 5 );

    var t2 = new Transform3( Matrix3.rotation2( Math.PI / 6 ) );
    window.assert && assert.throws( function() { // eslint-disable-line no-undef
      t2.transformX( 5 );
    } );
    window.assert && assert.throws( function() { // eslint-disable-line no-undef
      t2.transformY( 5 );
    } );
  } );

  QUnit.test( 'Transform delta', function( assert ) {
    var t1 = new Transform3( Matrix3.createFromPool( 2, 1, 0, -2, 5, 0, 0, 0, 1 ) );
    var t2 = new Transform3( Matrix3.createFromPool( 2, 1, 52, -2, 5, -61, 0, 0, 1 ) );

    assert.ok( t1.transformDelta2( Vector2.ZERO ).equalsEpsilon( Vector2.ZERO, 1e-7 ), 'ensuring linearity at 0, no translation' );
    assert.ok( t2.transformDelta2( Vector2.ZERO ).equalsEpsilon( Vector2.ZERO, 1e-7 ), 'ensuring linearity at 0, with translation' );

    assert.ok( t1.transformDelta2( new Vector2( 2, -3 ) ).equalsEpsilon( new Vector2( 1, -19 ), 1e-7 ), 'basic delta check, no translation' );
    assert.ok( t2.transformDelta2( new Vector2( 2, -3 ) ).equalsEpsilon( new Vector2( 1, -19 ), 1e-7 ), 'basic delta check, with translation' );

    var v = new Vector2( -71, 27 );
    assert.ok( t1.inverseDelta2( t1.transformDelta2( v ) ).equalsEpsilon( v, 1e-7 ), 'inverse check, no translation' );
    assert.ok( t2.inverseDelta2( t2.transformDelta2( v ) ).equalsEpsilon( v, 1e-7 ), 'inverse check, with translation' );
  } );

  QUnit.test( 'Transform delta x/y', function( assert ) {
    var t = new Transform3( Matrix3.createFromPool( 2, 0, 52, 0, 5, -61, 0, 0, 1 ) );

    approximateEqual( assert, t.transformDeltaX( 1 ), 2, 'deltaX' );
    approximateEqual( assert, t.transformDeltaY( 1 ), 5, 'deltaY' );

    approximateEqual( assert, t.transformDeltaX( 71 ), t.transformDelta2( new Vector2( 71, 27 ) ).x, 'deltaX check vs transformDelta' );
    approximateEqual( assert, t.transformDeltaY( 27 ), t.transformDelta2( new Vector2( 71, 27 ) ).y, 'deltaY check vs transformDelta' );

    var v = new Vector2( -71, 27 );
    approximateEqual( assert, t.inverseDeltaX( t.transformDeltaX( v.x ) ), v.x, 'inverse check X' );
    approximateEqual( assert, t.inverseDeltaY( t.transformDeltaY( v.y ) ), v.y, 'inverse check Y' );
  } );

  QUnit.test( 'Transform setMatrix ensuring matrix instance equivalence', function( assert ) {
    var t = new Transform3();

    var m = t.getMatrix();

    t.setMatrix( Matrix3.createFromPool( 1, 2, 3, 4, 5, 6, 7, 8, 9 ) );
    assert.equal( t.getMatrix(), m );
    assert.equal( t.getMatrix().m00(), 1 );
    assert.equal( t.getMatrix().m01(), 2 );
    t.setMatrix( Matrix3.createFromPool( 9, 8, 7, 6, 5, 4, 3, 2, 1 ) );
    assert.equal( t.getMatrix(), m );
    assert.equal( t.getMatrix().m00(), 9 );
    assert.equal( t.getMatrix().m01(), 8 );
  } );

  QUnit.test( 'Transform event firing', function( assert ) {
    var t = new Transform3();

    var count = 0;

    t.on( 'change', function( assert ) { count += 1; } );
    assert.equal( count, 0 );
    t.setMatrix( Matrix3.rotation2( Math.PI / 2 ) );
    assert.equal( count, 1 );
    t.prepend( Matrix3.rotation2( Math.PI / 2 ) );
    assert.equal( count, 2 );
    t.prependTranslation( 1, 2 );
    assert.equal( count, 3 );
    t.append( Matrix3.rotation2( Math.PI / 2 ) );
    assert.equal( count, 4 );
  } );

  QUnit.test( 'Transform inverse validation', function( assert ) {
    var t = new Transform3();

    assert.ok( t.transformPosition2( new Vector2( 2, 4 ) ).equals( new Vector2( 2, 4 ) ) );
    assert.ok( t.inversePosition2( new Vector2( 2, 4 ) ).equals( new Vector2( 2, 4 ) ) );
    t.getMatrix().setToScale( 4, 2 );
    t.invalidate();
    assert.ok( t.transformPosition2( new Vector2( 2, 4 ) ).equals( new Vector2( 8, 8 ) ) );
    assert.ok( t.inversePosition2( new Vector2( 2, 4 ) ).equals( new Vector2( 0.5, 2 ) ) );
    t.append( Matrix3.rotation2( Math.PI / 2 ) );
    assert.ok( t.transformPosition2( new Vector2( 2, 4 ) ).equalsEpsilon( new Vector2( -16, 4 ), epsilon ) );
    assert.ok( t.inversePosition2( new Vector2( 2, 4 ) ).equalsEpsilon( new Vector2( 2, -0.5 ), epsilon ) );
  } );

  QUnit.test( 'transform creation and setting', function( assert ) {
    var t = new Transform3();
    t.append( Matrix3.rotation2( Math.PI ) );
    assert.ok( true, 'so we have at least 1 test in this set' );
  } );
} );