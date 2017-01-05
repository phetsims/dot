// Copyright 2016, University of Colorado Boulder

(function() {
  'use strict';
  
  module( 'Dot: Bounds2' );

  var Bounds2 = dot.Bounds2;

  var epsilon = 0.00000001;

  function approximateBoundsEquals( a, b, msg ) {
    ok( Math.abs( a.minX - b.minX ) < epsilon, msg + ' minX: expected: ' + b.minX + ', result: ' + a.minX );
    ok( Math.abs( a.minY - b.minY ) < epsilon, msg + ' minY: expected: ' + b.minY + ', result: ' + a.minY );
    ok( Math.abs( a.maxX - b.maxX ) < epsilon, msg + ' maxX: expected: ' + b.maxX + ', result: ' + a.maxX );
    ok( Math.abs( a.maxY - b.maxY ) < epsilon, msg + ' maxY: expected: ' + b.maxY + ', result: ' + a.maxY );
  }

  test( 'Rectangle', function() {
    ok( new Bounds2( -2, -4, 2, 4 ).equals( new dot.Rectangle( -2, -4, 4, 8 ) ), 'Bounds2-Rectangle equivalence' );
  } );

  test( 'Basic', function() {
    var bounds = new Bounds2( 1, 2, 3, 4 );
    ok( bounds.minX === 1, 'minX' );
    ok( bounds.minY === 2, 'minY' );
    ok( bounds.maxX === 3, 'maxX' );
    ok( bounds.maxY === 4, 'maxY' );
    ok( bounds.width === 2, 'width' );
    ok( bounds.height === 2, 'height' );
    ok( bounds.x === 1, 'x' );
    ok( bounds.y === 2, 'y' );
    ok( bounds.centerX === 2, 'centerX' );
    ok( bounds.centerY === 3, 'centerY' );
  } );

  test( 'Coordinates', function() {
    var bounds = new Bounds2( 1, 2, 3, 4 );
    ok( !bounds.isEmpty(), 'isEmpty' );

    ok( !bounds.containsCoordinates( 0, 0 ), 'coordinates #1' );
    ok( !bounds.containsCoordinates( 2, 0 ), 'coordinates #2' );
    ok( bounds.containsCoordinates( 2, 2 ), 'coordinates #3 (on boundary)' );
    ok( !bounds.containsCoordinates( 4, 2 ), 'coordinates #4' );

    ok( !Bounds2.NOTHING.containsBounds( bounds ), 'nothing.contains' );
    ok( Bounds2.EVERYTHING.containsBounds( bounds ), 'everything.contains' );

    ok( bounds.equals( bounds ), 'reflexive' );
    ok( !bounds.equals( Bounds2.NOTHING ), 'reflexive' );
    ok( !Bounds2.NOTHING.equals( bounds ), 'reflexive' );

    ok( bounds.intersectsBounds( new Bounds2( 2, 3, 4, 5 ) ), 'intersect #1' );
    ok( bounds.intersectsBounds( new Bounds2( 3, 4, 5, 6 ) ), 'intersect #2 (boundary point)' );
    ok( !bounds.intersectsBounds( new Bounds2( 4, 5, 6, 7 ) ), 'intersect #3' );

    ok( Bounds2.NOTHING.isEmpty(), 'Bounds2.NOTHING.isEmpty()' );
    ok( !Bounds2.EVERYTHING.isEmpty(), '!Bounds2.EVERYTHING.isEmpty()' );
  } );

  function A() { return new Bounds2( 0, 0, 2, 3 ); }

  function B() { return new Bounds2( 1, 1, 5, 4 ); }

  function C() { return new Bounds2( 1.5, 1.2, 5.7, 4.8 ); }

  test( 'Mutable / immutable versions', function() {
    approximateBoundsEquals( A().union( B() ), A().includeBounds( B() ), 'union / includeBounds' );
    approximateBoundsEquals( A().intersection( B() ), A().constrainBounds( B() ), 'intersection / constrainBounds' );
    approximateBoundsEquals( A().withCoordinates( 10, 12 ), A().addCoordinates( 10, 12 ), 'withCoordinates / addCoordinates' );
    approximateBoundsEquals( A().withPoint( new dot.Vector2( 10, 12 ) ), A().addPoint( new dot.Vector2( 10, 12 ) ), 'withPoint / addPoint' );

    approximateBoundsEquals( A().withMinX( 1.5 ), A().setMinX( 1.5 ), 'withMinX / setMinX' );
    approximateBoundsEquals( A().withMinY( 1.5 ), A().setMinY( 1.5 ), 'withMinY / setMinY' );
    approximateBoundsEquals( A().withMaxX( 1.5 ), A().setMaxX( 1.5 ), 'withMaxX / setMaxX' );
    approximateBoundsEquals( A().withMaxY( 1.5 ), A().setMaxY( 1.5 ), 'withMaxY / setMaxY' );

    approximateBoundsEquals( C().roundedOut(), C().roundOut(), 'roundedOut / roundOut' );
    approximateBoundsEquals( C().roundedIn(), C().roundIn(), 'roundedIn / roundIn' );

    var matrix = dot.Matrix3.rotation2( Math.PI / 4 ).timesMatrix( dot.Matrix3.translation( 11, -13 ) ).timesMatrix( dot.Matrix3.scale( 2, 3.5 ) );
    approximateBoundsEquals( A().transformed( matrix ), A().transform( matrix ), 'transformed / transform' );

    approximateBoundsEquals( A().dilated( 1.5 ), A().dilate( 1.5 ), 'dilated / dilate' );
    approximateBoundsEquals( A().eroded( 1.5 ), A().erode( 1.5 ), 'eroded / erode' );
    approximateBoundsEquals( A().shiftedX( 1.5 ), A().shiftX( 1.5 ), 'shiftedX / shiftX' );
    approximateBoundsEquals( A().shiftedY( 1.5 ), A().shiftY( 1.5 ), 'shiftedY / shiftY' );
    approximateBoundsEquals( A().shifted( 1.5, 2 ), A().shift( 1.5, 2 ), 'shifted / shift' );
  } );

  test( 'Bounds transforms', function() {
    approximateBoundsEquals( A().transformed( dot.Matrix3.translation( 10, 20 ) ), new Bounds2( 10, 20, 12, 23 ), 'translation' );
    approximateBoundsEquals( A().transformed( dot.Matrix3.rotation2( Math.PI / 2 ) ), new Bounds2( -3, 0, 0, 2 ), 'rotation' );
    approximateBoundsEquals( A().transformed( dot.Matrix3.scale( 3, 2 ) ), new Bounds2( 0, 0, 6, 6 ), 'scale' );
  } );

  test( 'Equality', function() {
    ok( new Bounds2( 0, 1, 2, 3 ).equals( new Bounds2( 0, 1, 2, 3 ) ), 'Without epsilon: regular - reflexive' );
    ok( new Bounds2( 0, 1, 2, 3 ).equalsEpsilon( new Bounds2( 0, 1, 2, 3 ), epsilon ), 'With epsilon: regular - reflexive' );
    ok( !new Bounds2( 0, 1, 2, 3 ).equals( new Bounds2( 0, 1, 2, 5 ) ), 'Without epsilon: regular - different' );
    ok( !new Bounds2( 0, 1, 2, 3 ).equalsEpsilon( new Bounds2( 0, 1, 2, 5 ), epsilon ), 'With epsilon: regular - different' );
    ok( Bounds2.NOTHING.equals( Bounds2.NOTHING ), 'Without epsilon: Nothing - reflexive' );
    ok( Bounds2.NOTHING.equalsEpsilon( Bounds2.NOTHING, epsilon ), 'With epsilon: Nothing - reflexive' );
    ok( Bounds2.NOTHING.equals( Bounds2.NOTHING.copy() ), 'Without epsilon: Nothing - copy - reflexive' );
    ok( Bounds2.NOTHING.equalsEpsilon( Bounds2.NOTHING.copy(), epsilon ), 'With epsilon: Nothing - copy - reflexive' );
    ok( Bounds2.EVERYTHING.equals( Bounds2.EVERYTHING ), 'Without epsilon: Everything - reflexive' );
    ok( Bounds2.EVERYTHING.equalsEpsilon( Bounds2.EVERYTHING, epsilon ), 'With epsilon: Everything - reflexive' );
    ok( Bounds2.EVERYTHING.equals( Bounds2.EVERYTHING.copy() ), 'Without epsilon: Everything - copy - reflexive' );
    ok( Bounds2.EVERYTHING.equalsEpsilon( Bounds2.EVERYTHING.copy(), epsilon ), 'With epsilon: Everything - copy - reflexive' );
    ok( !Bounds2.NOTHING.equals( Bounds2.EVERYTHING ), 'Without epsilon: Nothing !== Everything' );
    ok( !Bounds2.NOTHING.equalsEpsilon( Bounds2.EVERYTHING, epsilon ), 'With epsilon: Nothing !== Everything' );
    ok( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equals( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ) ), 'Without epsilon: Mixed finite-ness - reflexive' );
    ok( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equalsEpsilon( new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ), epsilon ), 'With epsilon: Mixed finite-ness - reflexive' );
    ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equals( new Bounds2( 0, 0, 5, Number.NEGATIVE_INFINITY ) ), 'Without epsilon: Mixed finite-ness - swapped infinity' );
    ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equalsEpsilon( new Bounds2( 0, 0, 5, Number.NEGATIVE_INFINITY ), epsilon ), 'With epsilon: Mixed finite-ness - swapped infinity' );
    ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equals( new Bounds2( 0, 0, 6, Number.POSITIVE_INFINITY ) ), 'Without epsilon: Mixed finite-ness - different finite number' );
    ok( !new Bounds2( 0, 0, 5, Number.POSITIVE_INFINITY ).equalsEpsilon( new Bounds2( 0, 0, 6, Number.POSITIVE_INFINITY ), epsilon ), 'With epsilon: Mixed finite-ness - different finite number' );
  } );

})();
