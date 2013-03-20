// Copyright 2002-2012, University of Colorado

/**
 * Forward and inverse transforms with 3x3 matrices
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  "use strict";

  var assert = require( 'ASSERT/assert' )( 'dot' );
  
  var dot = require( 'DOT/dot' );
  
  require( 'DOT/Matrix3' );
  require( 'DOT/Vector2' );
  require( 'DOT/Ray2' );

  // takes a 4x4 matrix
  dot.Transform3 = function( matrix ) {
    // using immutable version for now. change it to the mutable identity copy if we need mutable operations on the matrices
    this.set( matrix === undefined ? dot.Matrix3.IDENTITY : matrix );
    
    this.listeners = [];
  };
  var Transform3 = dot.Transform3;

  Transform3.prototype = {
    constructor: Transform3,
    
    /*---------------------------------------------------------------------------*
    * mutators
    *----------------------------------------------------------------------------*/
    
    set: function( matrix ) {
      assert && assert( matrix instanceof dot.Matrix3 );
      this.matrix = matrix;
      
      // compute these lazily
      this.inverse = null;
      this.matrixTransposed = null;
      this.inverseTransposed = null;
      
      // notify about transform changes
      var length = this.listeners.length;
      for ( var i = 0; i < length; i++ ) {
        this.listeners[i]( matrix );
      }
    },
    
    prepend: function( matrix ) {
      this.set( matrix.timesMatrix( this.matrix ) );
    },

    append: function( matrix ) {
      this.set( this.matrix.timesMatrix( matrix ) );
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

    /*---------------------------------------------------------------------------*
     * forward transforms (for Vector2 or scalar)
     *----------------------------------------------------------------------------*/

    // transform a position (includes translation)
    transformPosition2: function( vec2 ) {
      return this.matrix.timesVector2( vec2 );
    },

    // transform a vector (exclude translation)
    transformDelta2: function( vec2 ) {
      return this.matrix.timesRelativeVector2( vec2 );
    },

    // transform a normal vector (different than a normal vector)
    transformNormal2: function( vec2 ) {
      return this.getInverse().timesTransposeVector2( vec2 );
    },

    transformDeltaX: function( x ) {
      return this.transformDelta2( new dot.Vector2( x, 0 ) ).x;
    },

    transformDeltaY: function( y ) {
      return this.transformDelta2( new dot.Vector2( 0, y ) ).y;
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
      // inverse actually has the translation rolled into the other coefficients, so we have to make this longer
      return this.inversePosition2( vec2 ).minus( this.inversePosition2( dot.Vector2.ZERO ) );
    },

    inverseNormal2: function( vec2 ) {
      return this.matrix.timesTransposeVector2( vec2 );
    },

    inverseDeltaX: function( x ) {
      return this.inverseDelta2( new dot.Vector2( x, 0 ) ).x;
    },

    inverseDeltaY: function( y ) {
      return this.inverseDelta2( new dot.Vector2( 0, y ) ).y;
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
    
    addTransformListener: function( listener ) {
      assert && assert( !_.contains( this.listeners, listener ) );
      this.listeners.push( listener );
    },
    
    removeTransformListener: function( listener ) {
      assert && assert( _.contains( this.listeners, listener ) );
      this.listeners.splice( _.indexOf( this.listeners, listener ), 1 );
    }
  };
  
  return Transform3;
} );
