// Copyright 2016, University of Colorado Boulder

(function() {
  'use strict';

  module( 'Dot: Matrix3' );

  var Matrix3 = dot.Matrix3;
  var Vector2 = dot.Vector2;

  var epsilon = 0.00001;

  function approximateEqual( a, b, msg ) {
    ok( Math.abs( a - b ) < epsilon, msg + ' expected: ' + b + ', got: ' + a );
  }

  function approximateMatrixEqual( a, b, msg ) {
    ok( a.equalsEpsilon( b, epsilon ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
  }

  // test matrices, randomly generated
  function A() {
    return Matrix3.createFromPool(
      0.216673, -0.455249, -0.0897734,
      -0.261922, -0.208968, -0.0790977,
      -0.0689069, -0.620147, 0.275399
    );
  }

  function B() {
    return Matrix3.createFromPool(
      0.366511, -0.872824, 0.490591,
      0.0543773, 0.610759, 0.961396,
      0.880586, 0.991026, -0.358927
    );
  }

  function C() {
    return Matrix3.createFromPool(
      0.521806, 0.523286, -0.275077,
      0.270099, 0.135544, 0.614202,
      0, 0, 1
    );
  }

  // test vectors, randomly generated
  function V2() {
    return new Vector2( 0.739498, 0.827537 );
  }

  test( 'Affine detection', function() {
    equal( A().type, Matrix3.Types.OTHER );
    equal( B().type, Matrix3.Types.OTHER );
    equal( C().type, Matrix3.Types.AFFINE );
  } );

  test( 'Row-major', function() {
    var m = Matrix3.createFromPool( 1, 2, 3, 4, 5, 6, 7, 8, 9 );
    equal( m.m00(), 1, 'm00' );
    equal( m.m01(), 2, 'm01' );
    equal( m.m02(), 3, 'm02' );
    equal( m.m10(), 4, 'm10' );
    equal( m.m11(), 5, 'm11' );
    equal( m.m12(), 6, 'm12' );
    equal( m.m20(), 7, 'm20' );
    equal( m.m21(), 8, 'm21' );
    equal( m.m22(), 9, 'm22' );
  } );

  test( 'Column-major', function() {
    var m = Matrix3.createFromPool();
    m.columnMajor( 1, 4, 7, 2, 5, 8, 3, 6, 9 );
    equal( m.m00(), 1, 'm00' );
    equal( m.m01(), 2, 'm01' );
    equal( m.m02(), 3, 'm02' );
    equal( m.m10(), 4, 'm10' );
    equal( m.m11(), 5, 'm11' );
    equal( m.m12(), 6, 'm12' );
    equal( m.m20(), 7, 'm20' );
    equal( m.m21(), 8, 'm21' );
    equal( m.m22(), 9, 'm22' );
  } );

  test( 'Determinant', function() {
    approximateEqual( A().getDeterminant(), -0.0717069, 'A' );
    approximateEqual( B().getDeterminant(), -1.42292, 'B' );
  } );

  test( 'Rotation', function() {
    var angle = Math.PI / 6 + 0.2543;
    approximateEqual( Matrix3.rotation2( angle ).getRotation(), angle );
  } );

  test( 'plus / add', function() {
    var a = A();
    var b = B();
    var result = Matrix3.createFromPool( 0.583184, -1.32807, 0.400818, -0.207545, 0.401791, 0.882298, 0.81168, 0.370878, -0.0835274 );

    approximateMatrixEqual( a.plus( b ), result, 'plus' );
    approximateMatrixEqual( a, A(), 'verifying immutability' );

    approximateMatrixEqual( a.add( b ), result, 'add' );
    approximateMatrixEqual( a, result, 'verifying mutability' );
  } );

  test( 'minus / subtract', function() {
    var a = A();
    var b = B();
    var result = Matrix3.createFromPool( -0.149837, 0.417574, -0.580365, -0.3163, -0.819726, -1.04049, -0.949493, -1.61117, 0.634326 );

    approximateMatrixEqual( a.minus( b ), result, 'minus' );
    approximateMatrixEqual( a, A(), 'verifying immutability' );

    approximateMatrixEqual( a.subtract( b ), result, 'subtract' );
    approximateMatrixEqual( a, result, 'verifying mutability' );
  } );

  test( 'transposed / transpose', function() {
    var a = A();
    var result = Matrix3.createFromPool( 0.216673, -0.261922, -0.0689069, -0.455249, -0.208968, -0.620147, -0.0897734, -0.0790977, 0.275399 );

    approximateMatrixEqual( a.transposed(), result, 'transposed' );
    approximateMatrixEqual( a, A(), 'verifying immutability' );

    approximateMatrixEqual( a.transpose(), result, 'transpose' );
    approximateMatrixEqual( a, result, 'verifying mutability' );
  } );

  test( 'negated / negate', function() {
    var a = A();
    var result = Matrix3.createFromPool( -0.216673, 0.455249, 0.0897734, 0.261922, 0.208968, 0.0790977, 0.0689069, 0.620147, -0.275399 );

    approximateMatrixEqual( a.negated(), result, 'negated' );
    approximateMatrixEqual( a, A(), 'verifying immutability' );

    approximateMatrixEqual( a.negate(), result, 'negate' );
    approximateMatrixEqual( a, result, 'verifying mutability' );
  } );

  test( 'inverted / invert', function() {
    var a = A();
    var result = Matrix3.createFromPool( 1.48663, -2.52483, -0.240555, -1.08195, -0.745893, -0.566919, -2.06439, -2.31134, 2.29431 );

    approximateMatrixEqual( a.inverted(), result, 'inverted' );
    approximateMatrixEqual( a, A(), 'verifying immutability' );

    approximateMatrixEqual( a.invert(), result, 'invert' );
    approximateMatrixEqual( a, result, 'verifying mutability' );
  } );

  test( 'timesMatrix / multiplyMatrix', function() {
    var a = A();
    var b = B();
    var result = Matrix3.createFromPool( -0.0243954, -0.556133, -0.299155, -0.177013, 0.0225954, -0.301007, 0.183536, -0.0456892, -0.72886 );

    approximateMatrixEqual( a.timesMatrix( b ), result, 'timesMatrix' );
    approximateMatrixEqual( a, A(), 'verifying immutability' );

    approximateMatrixEqual( a.multiplyMatrix( b ), result, 'multiplyMatrix' );
    approximateMatrixEqual( a, result, 'verifying mutability' );
  } );

  test( 'timesVector2 / multiplyVector2', function() {
    var c = C();
    var v = V2();
    var result = new Vector2( 0.543836, 0.926107 );

    approximateMatrixEqual( c.timesVector2( v ), result, 'timesVector2' );
    approximateMatrixEqual( v, V2(), 'verifying immutability' );

    approximateMatrixEqual( c.multiplyVector2( v ), result, 'multiplyVector2' );
    approximateMatrixEqual( v, result, 'verifying mutability' );
  } );

  test( 'timesTransposeVector2 / multiplyTransposeVector2', function() {
    var c = C();
    var v = V2();

    c.timesTransposeVector2( v );
    approximateMatrixEqual( v, V2(), 'verifying immutability' );

    approximateMatrixEqual( c.multiplyTransposeVector2( v ), c.timesTransposeVector2( V2() ), 'multiplyTransposeVector2' );
    approximateMatrixEqual( v, c.timesTransposeVector2( V2() ), 'verifying mutability' );
  } );

  test( 'timesRelativeVector2 / multiplyRelativeVector2', function() {
    var c = C();
    var v = V2();

    c.timesRelativeVector2( v );
    approximateMatrixEqual( v, V2(), 'verifying immutability' );

    approximateMatrixEqual( c.multiplyRelativeVector2( v ), c.timesRelativeVector2( V2() ), 'multiplyRelativeVector2' );
    approximateMatrixEqual( v, c.timesRelativeVector2( V2() ), 'verifying mutability' );
  } );

  test( 'Inverse / Multiplication tests', function() {
    approximateMatrixEqual( Matrix3.IDENTITY.inverted(), Matrix3.IDENTITY, 'I * I = I' );
    approximateMatrixEqual( Matrix3.IDENTITY.timesMatrix( A() ), A(), 'I * A = A' );
    approximateMatrixEqual( A().timesMatrix( Matrix3.IDENTITY ), A(), 'A * I = A' );

    var translation = Matrix3.translation( 2, -5 );
    var rotation = Matrix3.rotation2( Math.PI / 6 );
    var scale = Matrix3.scale( 2, 3 );
    approximateMatrixEqual( translation.timesMatrix( translation.inverted() ), Matrix3.IDENTITY, 'translation inverse check' );
    approximateMatrixEqual( rotation.timesMatrix( rotation.inverted() ), Matrix3.IDENTITY, 'rotation inverse check' );
    approximateMatrixEqual( scale.timesMatrix( scale.inverted() ), Matrix3.IDENTITY, 'scale inverse check' );
    approximateMatrixEqual( A().timesMatrix( A().inverted() ), Matrix3.IDENTITY, 'A inverse check' );
    approximateMatrixEqual( B().timesMatrix( B().inverted() ), Matrix3.IDENTITY, 'B inverse check' );
    approximateMatrixEqual( C().timesMatrix( C().inverted() ), Matrix3.IDENTITY, 'C inverse check' );
  } );

  test( 'Matrix Scaling Tests', function() {
    var scale = Matrix3.scale( -2, 3 );
    var scaleVector = scale.getScaleVector();
    approximateEqual( scaleVector.x, 2, 'Scale X should be -2' );
    approximateEqual( scaleVector.y, 3, 'Scale Y should be 3' );

    var beforeScale = scale.timesMatrix( Matrix3.rotation2( Math.PI / 2 ) );
    approximateEqual( beforeScale.getScaleVector().x, 3, 'before pi/2 rotation x' );
    approximateEqual( beforeScale.getScaleVector().y, 2, 'before pi/2 rotation y' );

    var afterScale = Matrix3.rotation2( Math.PI / 2 ).timesMatrix( scale );
    approximateEqual( afterScale.getScaleVector().x, 2, 'after pi/2 rotation x' );
    approximateEqual( afterScale.getScaleVector().y, 3, 'after pi/2 rotation y' );

    var rotation = Matrix3.rotation2( 0.35264 );
    approximateEqual( rotation.getScaleVector().x, 1, 'rotation x' );
    approximateEqual( rotation.getScaleVector().y, 1, 'rotation x' );
  } );

})();
