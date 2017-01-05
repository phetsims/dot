// Copyright 2016, University of Colorado Boulder

(function() {
  'use strict';
  
  module( 'Dot: Modulo' );

  test( 'Modulus between up/down tests', function() {
    var mbd = dot.Util.moduloBetweenDown;
    var mbu = dot.Util.moduloBetweenUp;

    equal( mbd( 8, 0, 1 ), 0 );
    equal( mbu( 8, 0, 1 ), 1 );

    equal( mbd( 8, -1, 0 ), -1 );
    equal( mbu( 8, -1, 0 ), 0 );

    equal( mbd( 8, 0, 4 ), 0 );
    equal( mbu( 8, 0, 4 ), 4 );

    equal( mbd( 8, -2, 2 ), 0 );
    equal( mbu( 8, -2, 2 ), 0 );

  } );
})();
