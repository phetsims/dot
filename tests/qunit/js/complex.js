// Copyright 2016, University of Colorado Boulder

(function() {
  'use strict';
  
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
    equal( c.conjugated().real, 2, 'real conjugated' );
    equal( c.conjugated().imaginary, -3, 'imaginary conjugated' );
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
    approximateComplexEquals( new Complex( 3, 4 ).sqrtOf(), new Complex( 2, 1 ), 'Division' );
    approximateComplexEquals( new Complex( 3, -4 ).sqrtOf(), new Complex( 2, -1 ), 'Division' );

    var c = new Complex( 2.5, -7.1 );
    approximateComplexEquals( c.sqrtOf().times( c.sqrtOf() ), c );

    var cc = c.plus( c );
    new Complex( cc.x, cc.y ).sqrtOf(); // eslint-disable-line
  } );

  test( 'Exponentiation', function() {
    approximateComplexEquals( new Complex( 2, -3 ).exponentiated(), new Complex( -7.31511, -1.04274 ), 'Exponentiation' );
  } );

  test( 'Cos of', function() {
    var a = new Complex( 1, 1 );
    var b = new Complex( 0.8337300251311491, -0.9888977057628651 );
    approximateComplexEquals( a.cosOf(), b, 'Cos Of' );
  } );

  test( 'Sin of', function() {
    var a = new Complex( 1, 1 );
    var b = new Complex( 1.29845758, 0.634963914 );
    approximateComplexEquals( a.sinOf(), b, 'Sin Of' );
  } );
})();
