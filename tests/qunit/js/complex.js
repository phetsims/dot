(function() {
  module( 'Dot: Complex' );

  var Complex = dot.Complex;

  function approximateComplexEquals( a, b, msg ) {
    var epsilon = 0.00001;
    ok( a.equalsEpsilon( b, epsilon ), msg + ' expected: ' + b.toString() + ', result: ' + a.toString() );
  }

  test( 'Basic', function() {
    var c = new Complex( 2, 3 );
    equal( c.real, 2, 'real' );
    equal( c.imaginary, 3, 'imaginary' );
    equal( c.conjugate().real, 2, 'real conjugate' );
    equal( c.conjugate().imaginary, -3, 'imaginary conjugate' );
  } );

  test( 'Multiplication', function() {
    approximateComplexEquals( new Complex( 2, 3 ).times( new Complex( 7, -13 ) ), new Complex( 53, -5 ), 'Multiplication' );
  } );

  test( 'Division', function() {
    approximateComplexEquals( new Complex( 2, 3 ).dividedBy( new Complex( 7, -13 ) ), new Complex( -25 / 218, 47 / 218 ), 'Division' );
  } );

  test( 'Canceling', function() {
    var a = new Complex( 2, -3 );
    var b = new Complex( 7, 13 );
    approximateComplexEquals( a.times( b ).dividedBy( b ), a, 'Canceling' );
  } );

  test( 'Square root', function() {
    approximateComplexEquals( new Complex( 3, 4 ).sqrt(), new Complex( 2, 1 ), 'Division' );
    approximateComplexEquals( new Complex( 3, -4 ).sqrt(), new Complex( 2, -1 ), 'Division' );

    var c = new Complex( 2.5, -7.1 );
    approximateComplexEquals( c.sqrt().times( c.sqrt() ), c );

    var cc = c.plus( c );
    var d = new Complex( cc.x, cc.y ).sqrt();
  } );

  test( 'Exponentiation', function() {
    approximateComplexEquals( new Complex( 2, -3 ).exponentiated(), new Complex( -7.31511, -1.04274 ), 'Exponentiation' );
  } );

})();
