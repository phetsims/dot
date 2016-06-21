(function() {
  module( 'Dot' );

  function approximateEquals( a, b, msg ) {
    ok( Math.abs( a - b ) < 0.00000001, msg + ' expected: ' + b + ', result: ' + a );
  }

  test( 'Creation checks', function() {
    ok( new dot.Vector2( 1, 2 ) );
  } );

  test( 'Matrix scaling()', function() {
    var rotation = dot.Matrix3.rotation2( Math.PI / 4 );
    var translation = dot.Matrix3.translation( 20, 30 );
    var scale2 = dot.Matrix3.scaling( 2 );
    var scale2x3y = dot.Matrix3.scaling( 2, 3 );

    // the basics, just to make sure it is working
    equal( scale2.getScaleVector().x, 2, 'normal x scale' );
    equal( scale2.getScaleVector().y, 2, 'normal y scale' );

    equal( scale2x3y.getScaleVector().x, 2, 'normal x scale' );
    equal( scale2x3y.getScaleVector().y, 3, 'normal y scale' );

    var combination = rotation.timesMatrix( scale2 ).timesMatrix( translation );

    approximateEquals( combination.getScaleVector().x, 2, 'rotated x scale' );
    approximateEquals( combination.getScaleVector().y, 2, 'rotated x scale' );
  } );

  test( 'clamp', function() {
    equal( dot.clamp( 5, 1, 4 ), 4 );
    equal( dot.clamp( 3, 1, 4 ), 3 );
    equal( dot.clamp( 0, 1, 4 ), 1 );
  } );

  test( 'rangeInclusive', function() {
    var arr = dot.rangeInclusive( 2, 4 );
    equal( arr.length, 3 );
    equal( arr[ 0 ], 2 );
    equal( arr[ 1 ], 3 );
    equal( arr[ 2 ], 4 );

    arr = dot.rangeInclusive( 4, 2 );
    equal( arr.length, 0 );
  } );

  test( 'rangeExclusive', function() {
    var arr = dot.rangeExclusive( 2, 4 );
    equal( arr.length, 1 );
    equal( arr[ 0 ], 3 );

    arr = dot.rangeExclusive( 4, 2 );
    equal( arr.length, 0 );
  } );

  test( 'toRadians', function() {
    approximateEquals( dot.toRadians( 90 ), Math.PI / 2 );
    approximateEquals( dot.toRadians( 45 ), Math.PI / 4 );
    approximateEquals( dot.toRadians( -45 ), -Math.PI / 4 );
  } );

  test( 'toDegrees', function() {
    approximateEquals( 90, dot.toDegrees( Math.PI / 2 ) );
    approximateEquals( 45, dot.toDegrees( Math.PI / 4 ) );
    approximateEquals( -45, dot.toDegrees( -Math.PI / 4 ) );
  } );

  test( 'distance', function() {
    approximateEquals( new dot.Vector2( 2, 0 ).distance( dot.Vector2.ZERO ), 2 );
    approximateEquals( new dot.Vector2( 2, 0 ).distanceSquared( dot.Vector2.ZERO ), 4 );
    approximateEquals( new dot.Vector2( 4, 7 ).distance( new dot.Vector2( 6, 9 ) ), 2 * Math.sqrt( 2 ) );
    approximateEquals( new dot.Vector2( 4, 7 ).distanceSquared( new dot.Vector2( 6, 9 ) ), 8 );
  } );

  test( 'transform creation and setting', function() {
    var t = new dot.Transform3();
    t.append( dot.Matrix3.rotation2( Math.PI ) );

    expect( 0 );
  } );

  test( 'linear map', function() {
    approximateEquals( dot.Util.linear( 4, 8, 8, 0, 4 ), 8 );
    approximateEquals( dot.Util.linear( 4, 8, 8, 0, 8 ), 0 );
    approximateEquals( dot.Util.linear( 4, 8, 8, 0, 6 ), 4 );
  } );

  test( 'LinearFunction', function() {
    var f = new dot.LinearFunction( 4, 8, 8, 0 ); // not clamped

    approximateEquals( f( 0 ), 16 );
    approximateEquals( f( 4 ), 8 );
    approximateEquals( f( 8 ), 0 );
    approximateEquals( f( 6 ), 4 );
    approximateEquals( f.inverse( 16 ), 0 );
    approximateEquals( f.inverse( 8 ), 4 );
    approximateEquals( f.inverse( 0 ), 8 );
    approximateEquals( f.inverse( 4 ), 6 );

    var g = new dot.LinearFunction( 4, 8, 8, 0, true ); // clamped

    approximateEquals( g( 0 ), 8 );
    approximateEquals( g( 4 ), 8 );
    approximateEquals( g( 8 ), 0 );
    approximateEquals( g( 6 ), 4 );
    approximateEquals( g.inverse( 16 ), 4 );
    approximateEquals( g.inverse( 8 ), 4 );
    approximateEquals( g.inverse( 0 ), 8 );
    approximateEquals( g.inverse( 4 ), 6 );
  } );

  test( 'lineLineIntersection', function() {
    var f = dot.lineLineIntersection;

    var p1 = dot.Vector2.ZERO;
    var p2 = new dot.Vector2( 1, 1 );
    var p3 = new dot.Vector2( -10, 10 );
    var p4 = new dot.Vector2( -12, 8 );

    equal( f( p1, p2, p3, p4 ), null );
    equal( f( p1, p4, p4, p1 ), null );
    equal( f( p1, p1, p3, p4 ), null );
    equal( f( p1, p2, p2, p3 ).x, 1 );
    equal( f( p1, p2, p2, p3 ).y, 1 );



  } );

})();
