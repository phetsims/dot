
(function() {
  module( 'Dot: Transform3' );
  
  var Matrix3 = dot.Matrix3;
  var Transform3 = dot.Transform3;
  
  // function approximateEqual( a, b, msg ) {
  //   ok( Math.abs( a - b ) < epsilon, msg + ' expected: ' + b + ', got: ' + a );
  // }
  
  // function approximateMatrixEqual( a, b, msg ) {
  //   ok( a.equalsEpsilon( b, epsilon ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
  // }
  
  function approximateRayEqual( a, b, msg ) {
    ok( a.pos.equalsEpsilon( b.pos, 0.00001 ) && a.dir.equalsEpsilon( b.dir, 0.00001 ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
  }
  
  test( 'Ray2 transforms', function() {
    var transform = new Transform3( new Matrix3( 0, -2, 5, 3, 0, 8, 0, 0, 1 ) );
    var ray = new dot.Ray2( new dot.Vector2( 2, 7 ), new dot.Vector2( -5, 2 ).normalized() );
    
    var tray = transform.transformRay2( ray );
    var iray = transform.inverseRay2( ray );
    
    var backOffset = transform.inversePosition2( tray.pointAtDistance( 1 ) );
    var backPos = transform.inversePosition2( tray.pos );
    ok( ray.dir.equalsEpsilon( backOffset.minus( backPos ).normalized(), 0.00001 ), 'transformRay2 ray linearity' );
    
    var forwardOffset = transform.transformPosition2( iray.pointAtDistance( 1 ) );
    var forwardPos = transform.transformPosition2( iray.pos );
    ok( ray.dir.equalsEpsilon( forwardOffset.minus( forwardPos ).normalized(), 0.00001 ), 'inverseRay2 ray linearity' );
    
    approximateRayEqual( transform.inverseRay2( transform.transformRay2( ray ) ), ray, 'inverse correctness' );
  } );
  
  test( 'Transform x/y', function() {
    var t = new Transform3( new Matrix3( 2, 0, 10, 0, 3, 1, 0, 0, 1 ) );
    equal( t.transformX( 5 ), 20 );
    equal( t.transformY( 5 ), 16 );
    
    var t2 = new Transform3( Matrix3.rotation2( Math.PI / 6 ) );
    throws( function() {
      var x = t2.transformX( 5 );
    } );
    throws( function() {
      var y = t2.transformY( 5 );
    } );
  } );
})();
