// Copyright 2002-2014, University of Colorado Boulder

/**
 * Forward and inverse transforms with 3x3 matrices
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  require( 'DOT/Matrix3' );
  require( 'DOT/Vector2' );
  require( 'DOT/Ray2' );

  // takes a 4x4 matrix
  dot.Transform3 = function Transform3( matrix ) {
    this.listeners = [];

    // using immutable version for now. change it to the mutable identity copy if we need mutable operations on the matrices
    this.setMatrix( matrix === undefined ? dot.Matrix3.IDENTITY : matrix );

    phetAllocation && phetAllocation( 'Transform3' );
  };
  var Transform3 = dot.Transform3;

  Transform3.prototype = {
    constructor: Transform3,

    /*---------------------------------------------------------------------------*
    * mutators
    *----------------------------------------------------------------------------*/

    setMatrix: function( matrix ) {
      // TODO: performance: don't notify or handle instances where the matrix is detected to be the identity matrix?
      assert && assert( matrix instanceof dot.Matrix3 );

      assert && assert( matrix.isFinite(), 'Matrix was suspicious' );

      //Temporary solution: if the programmer tried to set the top, bottom, etc of a node without defined bounds, do a no-op
      //In the future, this should be replaced with the assertion above, once we have tested that everything is working properly
      if ( !matrix.isFinite() ) {
        return;
      }

      var oldMatrix = this.matrix;
      var length = this.listeners.length;
      var i;

      // notify listeners before the change
      for ( i = 0; i < length; i++ ) {
        this.listeners[i].before( matrix, oldMatrix );
      }

      this.matrix = matrix;

      // compute these lazily
      this.inverse = null;
      this.matrixTransposed = null;
      this.inverseTransposed = null;

      // notify listeners after the change
      for ( i = 0; i < length; i++ ) {
        this.listeners[i].after( matrix, oldMatrix );
      }
    },

    prepend: function( matrix ) {
      this.setMatrix( matrix.timesMatrix( this.matrix ) );
    },

    //Simpler case of prepending a translation without having to allocate a matrix for it, see scenery#119
    prependTranslation: function( x, y ) {
      this.setMatrix( dot.Matrix3.translationTimesMatrix( x, y, this.matrix ) );
    },

    append: function( matrix ) {
      this.setMatrix( this.matrix.timesMatrix( matrix ) );
    },

    prependTransform: function( transform ) {
      this.prepend( transform.matrix );
    },

    appendTransform: function( transform ) {
      this.append( transform.matrix );
    },

    applyToCanvasContext: function( context ) {
      context.setTransform( this.matrix.m00(), this.matrix.m10(), this.matrix.m01(), this.matrix.m11(), this.matrix.m02(), this.matrix.m12() );
    },

    /*---------------------------------------------------------------------------*
    * getters
    *----------------------------------------------------------------------------*/

    // uses the same matrices, for use cases where the matrices are considered immutable
    copy: function() {
      var transform = new Transform3( this.matrix );
      transform.inverse = this.inverse;
      transform.matrixTransposed = this.matrixTransposed;
      transform.inverseTransposed = this.inverseTransposed;
    },

    // copies matrices, for use cases where the matrices are considered mutable
    deepCopy: function() {
      var transform = new Transform3( this.matrix.copy() );
      transform.inverse = this.inverse ? this.inverse.copy() : null;
      transform.matrixTransposed = this.matrixTransposed ? this.matrixTransposed.copy() : null;
      transform.inverseTransposed = this.inverseTransposed ? this.inverseTransposed.copy() : null;
    },

    getMatrix: function() {
      return this.matrix;
    },

    getInverse: function() {
      if ( this.inverse === null ) {
        this.inverse = this.matrix.inverted();
      }
      return this.inverse;
    },

    getMatrixTransposed: function() {
      if ( this.matrixTransposed === null ) {
        this.matrixTransposed = this.matrix.transposed();
      }
      return this.matrixTransposed;
    },

    getInverseTransposed: function() {
      if ( this.inverseTransposed === null ) {
        this.inverseTransposed = this.getInverse().transposed();
      }
      return this.inverseTransposed;
    },

    isIdentity: function() {
      return this.matrix.type === dot.Matrix3.Types.IDENTITY;
    },

    isFinite: function() {
      return this.matrix.isFinite();
    },

    /*---------------------------------------------------------------------------*
     * forward transforms (for Vector2 or scalar)
     *----------------------------------------------------------------------------*/

    // transform a position (includes translation)
    transformPosition2: function( vec2 ) {
      return this.matrix.timesVector2( vec2 );
    },

    // transform a vector (exclude translation)
    transformDelta2: function( vec2 ) {
      var m = this.getMatrix();
      // m . vec2 - m . Vector2.ZERO
      return new dot.Vector2( m.m00() * vec2.x + m.m01() * vec2.y, m.m10() * vec2.x + m.m11() * vec2.y );
    },

    // transform a normal vector (different than a normal vector)
    transformNormal2: function( vec2 ) {
      return this.getInverse().timesTransposeVector2( vec2 );
    },

    transformX: function( x ) {
      var m = this.getMatrix();
      // TODO: ensure assertions are stripped out
      assert && assert( !m.m01(), 'Transforming an X value with a rotation/shear is ill-defined' );
      return m.m00() * x + m.m02();
    },

    transformY: function( y ) {
      var m = this.getMatrix();
      assert && assert( !m.m10(), 'Transforming a Y value with a rotation/shear is ill-defined' );
      return m.m11() * y + m.m12();
    },

    transformDeltaX: function( x ) {
      var m = this.getMatrix();
      assert && assert( !m.m01(), 'Transforming an X value with a rotation/shear is ill-defined' );
      // same as this.transformDelta2( new dot.Vector2( x, 0 ) ).x;
      return m.m00() * x;
    },

    transformDeltaY: function( y ) {
      var m = this.getMatrix();
      assert && assert( !m.m10(), 'Transforming a Y value with a rotation/shear is ill-defined' );
      // same as this.transformDelta2( new dot.Vector2( 0, y ) ).y;
      return m.m11() * y;
    },

    transformBounds2: function( bounds2 ) {
      return bounds2.transformed( this.matrix );
    },

    transformShape: function( shape ) {
      return shape.transformed( this.matrix );
    },

    transformRay2: function( ray ) {
      return new dot.Ray2( this.transformPosition2( ray.pos ), this.transformDelta2( ray.dir ).normalized() );
    },

    /*---------------------------------------------------------------------------*
     * inverse transforms (for Vector2 or scalar)
     *----------------------------------------------------------------------------*/

    inversePosition2: function( vec2 ) {
      return this.getInverse().timesVector2( vec2 );
    },

    inverseDelta2: function( vec2 ) {
      var m = this.getInverse();
      // m . vec2 - m . Vector2.ZERO
      return new dot.Vector2( m.m00() * vec2.x + m.m01() * vec2.y, m.m10() * vec2.x + m.m11() * vec2.y );
    },

    inverseNormal2: function( vec2 ) {
      return this.matrix.timesTransposeVector2( vec2 );
    },

    inverseX: function( x ) {
      var m = this.getInverse();
      assert && assert( !m.m01(), 'Inverting an X value with a rotation/shear is ill-defined' );
      return m.m00() * x + m.m02();
    },

    inverseY: function( y ) {
      var m = this.getInverse();
      assert && assert( !m.m10(), 'Inverting a Y value with a rotation/shear is ill-defined' );
      return m.m11() * y + m.m12();
    },

    inverseDeltaX: function( x ) {
      var m = this.getInverse();
      assert && assert( !m.m01(), 'Inverting an X value with a rotation/shear is ill-defined' );
      // same as this.inverseDelta2( new dot.Vector2( x, 0 ) ).x;
      return m.m00() * x;
    },

    inverseDeltaY: function( y ) {
      var m = this.getInverse();
      assert && assert( !m.m10(), 'Inverting a Y value with a rotation/shear is ill-defined' );
      // same as this.inverseDelta2( new dot.Vector2( 0, y ) ).y;
      return m.m11() * y;
    },

    inverseBounds2: function( bounds2 ) {
      return bounds2.transformed( this.getInverse() );
    },

    inverseShape: function( shape ) {
      return shape.transformed( this.getInverse() );
    },

    inverseRay2: function( ray ) {
      return new dot.Ray2( this.inversePosition2( ray.pos ), this.inverseDelta2( ray.dir ).normalized() );
    },

    /*---------------------------------------------------------------------------*
    * listeners
    *----------------------------------------------------------------------------*/

    // note: listener.before( matrix, oldMatrix ) will be called before the change, listener.after( matrix, oldMatrix ) will be called after
    addTransformListener: function( listener ) {
      assert && assert( !_.contains( this.listeners, listener ) );
      this.listeners.push( listener );
    },

    // useful for making sure the listener is triggered first
    prependTransformListener: function( listener ) {
      assert && assert( !_.contains( this.listeners, listener ) );
      this.listeners.unshift( listener );
    },

    removeTransformListener: function( listener ) {
      assert && assert( _.contains( this.listeners, listener ) );
      this.listeners.splice( _.indexOf( this.listeners, listener ), 1 );
    }
  };

  return Transform3;
} );
