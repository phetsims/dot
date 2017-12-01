// Copyright 2016, University of Colorado Boulder

( function() {
  'use strict';

  module( 'Dot' );

  function approximateEquals( a, b, msg ) {
    ok( Math.abs( a - b ) < 0.00000001, msg + ' expected: ' + b + ', result: ' + a );
  }

  test( 'distance', function() {
    approximateEquals( new dot.Vector2( 2, 0 ).distance( dot.Vector2.ZERO ), 2 );
    approximateEquals( new dot.Vector2( 2, 0 ).distanceSquared( dot.Vector2.ZERO ), 4 );
    approximateEquals( new dot.Vector2( 4, 7 ).distance( new dot.Vector2( 6, 9 ) ), 2 * Math.sqrt( 2 ) );
    approximateEquals( new dot.Vector2( 4, 7 ).distanceSquared( new dot.Vector2( 6, 9 ) ), 8 );
  } );

  test( 'transform creation and setting', function() {
    var t = new dot.Transform3();
    t.append( dot.Matrix3.rotation2( Math.PI ) );

    expect( 0 ); // eslint-disable-line no-undef
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
} )();