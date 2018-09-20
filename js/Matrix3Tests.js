// Copyright 2017, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Matrix3 = require( 'DOT/Matrix3' );
  var Vector2 = require( 'DOT/Vector2' );

  QUnit.module( 'Matrix3' );

  function approximateEquals( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < 0.00000001, msg + ' expected: ' + b + ', result: ' + a );
  }

  var epsilon = 0.00001;

  function approximateEqual( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < epsilon, msg + ' expected: ' + b + ', got: ' + a );
  }

  function approximateMatrixEqual( assert, a, b, msg ) {
    assert.ok( a.equalsEpsilon( b, epsilon ), msg + ' expected: ' + b.toString() + ', got: ' + a.toString() );
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

  QUnit.test( 'Affine detection', function( assert ) {
    assert.equal( A().type, Matrix3.Types.OTHER );
    assert.equal( B().type, Matrix3.Types.OTHER );
    assert.equal( C().type, Matrix3.Types.AFFINE );
  } );

  QUnit.test( 'Row-major', function( assert ) {
    var m = Matrix3.createFromPool( 1, 2, 3, 4, 5, 6, 7, 8, 9 );
    assert.equal( m.m00(), 1, 'm00' );
    assert.equal( m.m01(), 2, 'm01' );
    assert.equal( m.m02(), 3, 'm02' );
    assert.equal( m.m10(), 4, 'm10' );
    assert.equal( m.m11(), 5, 'm11' );
    assert.equal( m.m12(), 6, 'm12' );
    assert.equal( m.m20(), 7, 'm20' );
    assert.equal( m.m21(), 8, 'm21' );
    assert.equal( m.m22(), 9, 'm22' );
  } );

  QUnit.test( 'Column-major', function( assert ) {
    var m = Matrix3.createFromPool();
    m.columnMajor( 1, 4, 7, 2, 5, 8, 3, 6, 9 );
    assert.equal( m.m00(), 1, 'm00' );
    assert.equal( m.m01(), 2, 'm01' );
    assert.equal( m.m02(), 3, 'm02' );
    assert.equal( m.m10(), 4, 'm10' );
    assert.equal( m.m11(), 5, 'm11' );
    assert.equal( m.m12(), 6, 'm12' );
    assert.equal( m.m20(), 7, 'm20' );
    assert.equal( m.m21(), 8, 'm21' );
    assert.equal( m.m22(), 9, 'm22' );
  } );

  QUnit.test( 'Determinant', function( assert ) {
    approximateEqual( assert, A().getDeterminant(), -0.0717069, 'A' );
    approximateEqual( assert, B().getDeterminant(), -1.42292, 'B' );
  } );

  QUnit.test( 'Rotation', function( assert ) {
    var angle = Math.PI / 6 + 0.2543;
    approximateEqual( assert, Matrix3.rotation2( angle ).getRotation(), angle );
  } );

  QUnit.test( 'plus / add', function( assert ) {
    var a = A();
    var b = B();
    var result = Matrix3.createFromPool( 0.583184, -1.32807, 0.400818, -0.207545, 0.401791, 0.882298, 0.81168, 0.370878, -0.0835274 );

    approximateMatrixEqual( assert, a.plus( b ), result, 'plus' );
    approximateMatrixEqual( assert, a, A(), 'verifying immutability' );

    approximateMatrixEqual( assert, a.add( b ), result, 'add' );
    approximateMatrixEqual( assert, a, result, 'verifying mutability' );
  } );

  QUnit.test( 'minus / subtract', function( assert ) {
    var a = A();
    var b = B();
    var result = Matrix3.createFromPool( -0.149837, 0.417574, -0.580365, -0.3163, -0.819726, -1.04049, -0.949493, -1.61117, 0.634326 );

    approximateMatrixEqual( assert, a.minus( b ), result, 'minus' );
    approximateMatrixEqual( assert, a, A(), 'verifying immutability' );

    approximateMatrixEqual( assert, a.subtract( b ), result, 'subtract' );
    approximateMatrixEqual( assert, a, result, 'verifying mutability' );
  } );

  QUnit.test( 'transposed / transpose', function( assert ) {
    var a = A();
    var result = Matrix3.createFromPool( 0.216673, -0.261922, -0.0689069, -0.455249, -0.208968, -0.620147, -0.0897734, -0.0790977, 0.275399 );

    approximateMatrixEqual( assert, a.transposed(), result, 'transposed' );
    approximateMatrixEqual( assert, a, A(), 'verifying immutability' );

    approximateMatrixEqual( assert, a.transpose(), result, 'transpose' );
    approximateMatrixEqual( assert, a, result, 'verifying mutability' );
  } );

  QUnit.test( 'negated / negate', function( assert ) {
    var a = A();
    var result = Matrix3.createFromPool( -0.216673, 0.455249, 0.0897734, 0.261922, 0.208968, 0.0790977, 0.0689069, 0.620147, -0.275399 );

    approximateMatrixEqual( assert, a.negated(), result, 'negated' );
    approximateMatrixEqual( assert, a, A(), 'verifying immutability' );

    approximateMatrixEqual( assert, a.negate(), result, 'negate' );
    approximateMatrixEqual( assert, a, result, 'verifying mutability' );
  } );

  QUnit.test( 'inverted / invert', function( assert ) {
    var a = A();
    var result = Matrix3.createFromPool( 1.48663, -2.52483, -0.240555, -1.08195, -0.745893, -0.566919, -2.06439, -2.31134, 2.29431 );

    approximateMatrixEqual( assert, a.inverted(), result, 'inverted' );
    approximateMatrixEqual( assert, a, A(), 'verifying immutability' );

    approximateMatrixEqual( assert, a.invert(), result, 'invert' );
    approximateMatrixEqual( assert, a, result, 'verifying mutability' );
  } );

  QUnit.test( 'timesMatrix / multiplyMatrix', function( assert ) {
    var a = A();
    var b = B();
    var result = Matrix3.createFromPool( -0.0243954, -0.556133, -0.299155, -0.177013, 0.0225954, -0.301007, 0.183536, -0.0456892, -0.72886 );

    approximateMatrixEqual( assert, a.timesMatrix( b ), result, 'timesMatrix' );
    approximateMatrixEqual( assert, a, A(), 'verifying immutability' );

    approximateMatrixEqual( assert, a.multiplyMatrix( b ), result, 'multiplyMatrix' );
    approximateMatrixEqual( assert, a, result, 'verifying mutability' );
  } );

  QUnit.test( 'timesVector2 / multiplyVector2', function( assert ) {
    var c = C();
    var v = V2();
    var result = new Vector2( 0.543836, 0.926107 );

    approximateMatrixEqual( assert, c.timesVector2( v ), result, 'timesVector2' );
    approximateMatrixEqual( assert, v, V2(), 'verifying immutability' );

    approximateMatrixEqual( assert, c.multiplyVector2( v ), result, 'multiplyVector2' );
    approximateMatrixEqual( assert, v, result, 'verifying mutability' );
  } );

  QUnit.test( 'timesTransposeVector2 / multiplyTransposeVector2', function( assert ) {
    var c = C();
    var v = V2();

    c.timesTransposeVector2( v );
    approximateMatrixEqual( assert, v, V2(), 'verifying immutability' );

    approximateMatrixEqual( assert, c.multiplyTransposeVector2( v ), c.timesTransposeVector2( V2() ), 'multiplyTransposeVector2' );
    approximateMatrixEqual( assert, v, c.timesTransposeVector2( V2() ), 'verifying mutability' );
  } );

  QUnit.test( 'timesRelativeVector2 / multiplyRelativeVector2', function( assert ) {
    var c = C();
    var v = V2();

    c.timesRelativeVector2( v );
    approximateMatrixEqual( assert, v, V2(), 'verifying immutability' );

    approximateMatrixEqual( assert, c.multiplyRelativeVector2( v ), c.timesRelativeVector2( V2() ), 'multiplyRelativeVector2' );
    approximateMatrixEqual( assert, v, c.timesRelativeVector2( V2() ), 'verifying mutability' );
  } );

  QUnit.test( 'Inverse / Multiplication tests', function( assert ) {
    approximateMatrixEqual( assert, Matrix3.IDENTITY.inverted(), Matrix3.IDENTITY, 'I * I = I' );
    approximateMatrixEqual( assert, Matrix3.IDENTITY.timesMatrix( A() ), A(), 'I * A = A' );
    approximateMatrixEqual( assert, A().timesMatrix( Matrix3.IDENTITY ), A(), 'A * I = A' );

    var translation = Matrix3.translation( 2, -5 );
    var rotation = Matrix3.rotation2( Math.PI / 6 );
    var scale = Matrix3.scale( 2, 3 );
    approximateMatrixEqual( assert, translation.timesMatrix( translation.inverted() ), Matrix3.IDENTITY, 'translation inverse check' );
    approximateMatrixEqual( assert, rotation.timesMatrix( rotation.inverted() ), Matrix3.IDENTITY, 'rotation inverse check' );
    approximateMatrixEqual( assert, scale.timesMatrix( scale.inverted() ), Matrix3.IDENTITY, 'scale inverse check' );
    approximateMatrixEqual( assert, A().timesMatrix( A().inverted() ), Matrix3.IDENTITY, 'A inverse check' );
    approximateMatrixEqual( assert, B().timesMatrix( B().inverted() ), Matrix3.IDENTITY, 'B inverse check' );
    approximateMatrixEqual( assert, C().timesMatrix( C().inverted() ), Matrix3.IDENTITY, 'C inverse check' );
  } );

  QUnit.test( 'Matrix Scaling Tests', function( assert ) {
    var scale = Matrix3.scale( -2, 3 );
    var scaleVector = scale.getScaleVector();
    approximateEqual( assert, scaleVector.x, 2, 'Scale X should be -2' );
    approximateEqual( assert, scaleVector.y, 3, 'Scale Y should be 3' );

    var beforeScale = scale.timesMatrix( Matrix3.rotation2( Math.PI / 2 ) );
    approximateEqual( assert, beforeScale.getScaleVector().x, 3, 'before pi/2 rotation x' );
    approximateEqual( assert, beforeScale.getScaleVector().y, 2, 'before pi/2 rotation y' );

    var afterScale = Matrix3.rotation2( Math.PI / 2 ).timesMatrix( scale );
    approximateEqual( assert, afterScale.getScaleVector().x, 2, 'after pi/2 rotation x' );
    approximateEqual( assert, afterScale.getScaleVector().y, 3, 'after pi/2 rotation y' );

    var rotation = Matrix3.rotation2( 0.35264 );
    approximateEqual( assert, rotation.getScaleVector().x, 1, 'rotation x' );
    approximateEqual( assert, rotation.getScaleVector().y, 1, 'rotation x' );
  } );

  QUnit.test( 'Matrix scaling()', function( assert ) {
    var rotation = Matrix3.rotation2( Math.PI / 4 );
    var translation = Matrix3.translation( 20, 30 );
    var scale2 = Matrix3.scaling( 2 );
    var scale2x3y = Matrix3.scaling( 2, 3 );

    // the basics, just to make sure it is working
    assert.equal( scale2.getScaleVector().x, 2, 'normal x scale' );
    assert.equal( scale2.getScaleVector().y, 2, 'normal y scale' );
    assert.equal( scale2x3y.getScaleVector().x, 2, 'normal x scale' );
    assert.equal( scale2x3y.getScaleVector().y, 3, 'normal y scale' );

    var combination = rotation.timesMatrix( scale2 ).timesMatrix( translation );

    approximateEquals( assert, combination.getScaleVector().x, 2, 'rotated x scale' );
    approximateEquals( assert, combination.getScaleVector().y, 2, 'rotated x scale' );
  } );
} );