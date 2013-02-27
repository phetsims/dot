
(function() {
  module( 'Dot' );
  
  test( 'Creation checks', function() {
    ok( new dot.Vector2( 1, 2 ) );
  } );
  
  test( 'Matrix scaling()', function() {
    var rotation = dot.Matrix3.rotation2( Math.PI / 4 );
    var scale2 = dot.Matrix3.scaling( 2 );
    var scale2x3y = dot.Matrix3.scaling( 2, 3 );
    
    // the basics, just to make sure it is working
    equal( scale2.scaling().x, 2, 'normal x scale' );
    equal( scale2.scaling().y, 2, 'normal y scale' );
    
    equal( scale2x3y.scaling().x, 2, 'normal x scale' );
    equal( scale2x3y.scaling().y, 3, 'normal y scale' );
    
    var combination = rotation.timesMatrix( scale2 );
    
    equal( combination.scaling().x, 2, 'rotated x scale' );
    equal( combination.scaling().y, 2, 'rotated x scale' );
  } );
})();
