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
  var Bounds2 = require( 'DOT/Bounds2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Rectangle = require( 'DOT/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  QUnit.module( 'Bounds2' );

  var epsilon = 0.00000001;

  function approximateBoundsEquals( assert, a, b, msg ) {
    assert.ok( Math.abs( a.minX - b.minX ) < epsilon, msg + ' minX: expected: ' + b.minX + ', result: ' + a.minX );
    assert.ok( Math.abs( a.minY - b.minY ) < epsilon, msg + ' minY: expected: ' + b.minY + ', result: ' + a.minY );
    assert.ok( Math.abs( a.maxX - b.maxX ) < epsilon, msg + ' maxX: expected: ' + b.maxX + ', result: ' + a.maxX );
    assert.ok( Math.abs( a.maxY - b.maxY ) < epsilon, msg + ' maxY: expected: ' + b.maxY + ', result: ' + a.maxY );
  }

  QUnit.test( 'Rectangle', function( assert ) {
    assert.ok( new Bounds2( -2, -4, 2, 4 ).equals( new Rectangle( -2, -4, 4, 8 ) ), 'Bounds2-Rectangle equivalence' );
  } );

  QUnit.test( 'Basic', function( assert ) {
    var bounds = new Bounds2( 1, 2, 3, 4 );
    assert.ok( bounds.minX === 1, 'minX' );
    assert.ok( bounds.minY === 2, 'minY' );
    assert.ok( bounds.maxX === 3, 'maxX' );
    assert.ok( bounds.maxY === 4, 'maxY' );
    assert.ok( bounds.width === 2, 'width' );
    assert.ok( bounds.height === 2, 'height' );
    assert.ok( bounds.x === 1, 'x' );
    assert.ok( bounds.y === 2, 'y' );
    assert.ok( bounds.centerX === 2, 'centerX' );
    assert.ok( bounds.centerY === 3, 'centerY' );
  } );

  QUnit.test( 'Coordinates', function( assert ) {
    var bounds = new Bounds2( 1, 2, 3, 4 );
    assert.ok( !bounds.isEmpty(), 'isEmpty' );

    assert.ok( !bounds.containsCoordinates( 0, 0 ), 'coordinates #1' );
    assert.ok( !bounds.containsCoordinates( 2, 0 ), 'coordinates #2' );
    assert.ok( bounds.containsCoordinates( 2, 2 ), 'coordinates #3 (on boundary)' );
    assert.ok( !bounds.containsCoordinates( 4, 2 ), 'coordinates #4' );

    assert.ok( !Bounds2.NOTHING.containsBounds( bounds ), 'nothing.contains' );
    assert.ok( Bounds2.EVERYTHING.containsBounds( bounds ), 'everything.contains' );

    assert.ok( bounds.equals( bounds ), 'reflexive' );
    assert.ok( !bounds.equals( Bounds2.NOTHING ), 'reflexive' );
    assert.ok( !Bounds2.NOTHING.equals( bounds ), 'reflexive' );

    assert.ok( bounds.intersectsBounds( new Bounds2( 2, 3, 4, 5 ) ), 'intersect #1' );
    assert.ok( bounds.intersectsBounds( new Bounds2( 3, 4, 5, 6 ) ), 'intersect #2 (boundary point)' );
    assert.ok( !bounds.intersectsBounds( new Bounds2( 4, 5, 6, 7 ) ), 'intersect #3' );

    assert.ok( Bounds2.NOTHING.isEmpty(), 'Bounds2.NOTHING.isEmpty()' );
    assert.ok( !Bounds2.EVERYTHING.isEmpty(), '!Bounds2.EVERYTHING.isEmpty()' );
  } );

  function A() { return new Bounds2( 0, 0, 2, 3 ); }

  function B() { return new Bounds2( 1, 1, 5, 4 ); }

  function C() { return new Bounds2( 1.5, 1.2, 5.7, 4.8 ); }

  QUnit.test( 'Mutable / immutable versions', function( assert ) {
    approximateBoundsEquals( assert, A().union( B() ), A().includeBounds( B() ), 'union / includeBounds' );
    approximateBoundsEquals( assert, A().intersection( B() ), A().constrainBounds( B() ), 'intersection / constrainBounds' );
    approximateBoundsEquals( assert, A().withCoordinates( 10, 12 ), A().addCoordinates( 10, 12 ), 'withCoordinates / addCoordinates' );
    approximateBoundsEquals( assert, A().withPoint( new Vector2( 10, 12 ) ), A().addPoint( new Vector2( 10, 12 ) ), 'withPoint / addPoint' );

    approximateBoundsEquals( assert, A().withMinX( 1.5 ), A().setMinX( 1.5 ), 'withMinX / setMinX' );
    approximateBoundsEquals( assert, A().withMinY( 1.5 ), A().setMinY( 1.5 ), 'withMinY / setMinY' );
    approximateBoundsEquals( assert, A().withMaxX( 1.5 ), A().setMaxX( 1.5 ), 'withMaxX / setMaxX' );
    approximateBoundsEquals( assert, A().withMaxY( 1.5 ), A().setMaxY( 1.5 ), 'withMaxY / setMaxY' );

    approximateBoundsEquals( assert, C().roundedOut(), C().roundOut(), 'roundedOut / roundOut' );
    approximateBoundsEquals( assert, C().roundedIn(), C().roundIn(), 'roundedIn / roundIn' );

    var matrix = Matrix3.rotation2( Math.PI / 4 ).timesMatrix( Matrix3.translation( 11, -13 ) ).timesMatrix( Matrix3.scale( 2, 3.5 ) );
    approximateBoundsEquals( assert, A().transformed( matrix ), A().transform( matrix ), 'transformed / transform' );

    approximateBoundsEquals( assert, A().dilated( 1.5 ), A().dilate( 1.5 ), 'dilated / dilate' );
    approximateBoundsEquals( assert, A().eroded( 1.5 ), A().erode( 1.5 ), 'eroded / erode' );
    approximateBoundsEquals( assert, A().shiftedX( 1.5 ), A().shiftX( 1.5 ), 'shiftedX / shiftX' );
    approximateBoundsEquals( assert, A().shiftedY( 1.5 ), A().shiftY( 1.5 ), 'shiftedY / shiftY' );
    approximateBoundsEquals( assert, A().shifted( 1.5, 2 ), A().shift( 1.5, 2 ), 'shifted / shift' );
  } );

  QUnit.test( 'Bounds transforms', function( assert ) {
    approximateBoundsEquals( assert, A().transformed( Matrix3.translation( 10, 20 ) ), new Bounds2( 10, 20, 12, 23 ), 'translation' );
    approximateBoundsEquals( assert, A().transformed( Matrix3.rotation2( Math.PI / 2 ) ), new Bounds2( -3, 0, 0, 2 ), 'rotation' );
    approximateBoundsEquals( assert, A().transformed( Matrix3.scale( 3, 2 ) ), new Bounds2( 0, 0, 6, 6 ), 'scale' );
  } );

  QUnit.test( 'Equality', function( assert ) {
    assert.ok( new Bounds2( 0, 1, 2, 3 ).equals( new Bounds2( 0, 1, 2, 3 ) ), 'Without epsilon: regular - reflexive' );
    assert.ok( new Bounds2( 0, 1, 2, 3 ).equalsEpsilon( new Bounds2( 0, 1, 2, 3 ), epsilon ), 'With epsilon: regular - reflexive' );
    assert.ok( !new Bounds2( 0, 1, 2, 3 ).equals( new Bounds2( 0, 1, 2, 5 ) ), 'Without epsilon: regular - different' );
    assert.ok( !new Bounds2( 0, 1, 2, 3 ).equalsEpsilon( new Bounds2( 0, 1, 2, 5 ), epsilon ), 'With epsilon: regular - different' );
    assert.ok( Bounds2.NOTHING.equals( Bounds2.NOTHING ), 'Without epsilon: Nothing - reflexive' );
    assert.ok( Bounds2.NOTHING.equalsEpsilon( Bounds2.NOTHING, epsilon ), 'With epsilon: Nothing - reflexive' );
    assert.ok( Bounds2.NOTHING.equals( Bounds2.NOTHING.copy() ), 'Without epsilon: Nothing - copy - reflexive' );
    assert.ok( Bounds2.NOTHING.equalsEpsilon( Bounds2.NOTHING.copy(), epsilon ), 'With epsilon: Nothing - copy - reflexive' );
    assert.ok( Bounds2.EVERYTHING.equals( Bounds2.EVERYTHING ), 'Without epsilon: Everything - reflexive' );
    assert.ok( Bounds2.EVERYTHING.equalsEpsilon( Bounds2.EVERYTHING, epsilon ), 'With epsilon: Everything - reflexive' );
    assert.ok( Bounds2.EVERYTHING.equals( Bounds2.EVERYTHING.copy() ), 'Without epsilon: Everything - copy - reflexive' );
    assert.ok( Bounds2.EVERYTHING.equalsEpsilon( Bounds2.EVERYTHING.copy(), epsilon ), 'With epsilon: Everything - copy - reflexive' );
    assert.ok( !Bounds2.NOTHING.equals( Bounds2.EVERYTHING ), 'Without epsilon: Nothing !== Everything' );
    assert.ok( !Bounds2.NOTHING.equalsEpsilon( Bounds2.EVERYTHING, epsilon ), 'With epsilon: Nothing !== Everything' );
    assert.ok( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equals( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ) ), 'Without epsilon: Mixed finite-ness - reflexive' );
    assert.ok( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equalsEpsilon( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ), epsilon ), 'With epsilon: Mixed finite-ness - reflexive' );
    assert.ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equals( new Bounds2( 0, 0, 5, Number.NEGATIVE_INFINITY ) ), 'Without epsilon: Mixed finite-ness - swapped infinity' );
    assert.ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equalsEpsilon( new Bounds2( 0, 0, 5, Number.NEGATIVE_INFINITY ), epsilon ), 'With epsilon: Mixed finite-ness - swapped infinity' );
    assert.ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equals( new Bounds2( 0, 0, 6, Number.POSITIVE_INFINITY ) ), 'Without epsilon: Mixed finite-ness - different finite number' );
    assert.ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equalsEpsilon( new Bounds2( 0, 0, 6, Number.POSITIVE_INFINITY ), epsilon ), 'With epsilon: Mixed finite-ness - different finite number' );
  } );
} );