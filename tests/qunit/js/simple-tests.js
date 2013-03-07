
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
    equal( scale2.scaling().x, 2, 'normal x scale' );
    equal( scale2.scaling().y, 2, 'normal y scale' );
    
    equal( scale2x3y.scaling().x, 2, 'normal x scale' );
    equal( scale2x3y.scaling().y, 3, 'normal y scale' );
    
    var combination = rotation.timesMatrix( scale2 ).timesMatrix( translation );
    
    approximateEquals( combination.scaling().x, 2, 'rotated x scale' );
    approximateEquals( combination.scaling().y, 2, 'rotated x scale' );
  } );
  
  test( 'isArray', function() {
    ok( dot.isArray( [ 1, 2, 3 ] ) );
    ok( dot.isArray( [] ) );
    ok( !dot.isArray( 0 ) );
    ok( !dot.isArray( {} ) );
    ok( !dot.isArray( function() {} ) );
  } );
  
  test( 'clamp', function() {
    equal( dot.clamp( 5, 1, 4 ), 4 );
    equal( dot.clamp( 3, 1, 4 ), 3 );
    equal( dot.clamp( 0, 1, 4 ), 1 );
  } );
  
  test( 'rangeInclusive', function() {
    var arr = dot.rangeInclusive( 2, 4 );
    equal( arr.length, 3 );
    equal( arr[0], 2 );
    equal( arr[1], 3 );
    equal( arr[2], 4 );
    
    arr = dot.rangeInclusive( 4, 2 );
    equal( arr.length, 0 );
  } );
  
  test( 'rangeExclusive', function() {
    var arr = dot.rangeExclusive( 2, 4 );
    equal( arr.length, 1 );
    equal( arr[0], 3 );
    
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
})();
