// Copyright 2002-2014, University of Colorado Boulder

/**
 * Observable version of the basic 2-dimensional bounding box (Bounds2)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var inherit = require( 'PHET_CORE/inherit' );
  var extend = require( 'PHET_CORE/extend' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Property = require( 'AXON/Property' );
  require( 'DOT/Bounds2' );

  dot.ObservableBounds2 = function ObservableBounds2( minX, minY, maxX, maxY ) {
    dot.Bounds2.call( this, minX, minY, maxX, maxY );

    this._oldValue = this.copy();
    Property.call( this, this );
    this._initialMinX = minX;
    this._initialMinY = minY;
    this._initialMaxX = maxX;
    this._initialMaxY = maxY;
  };
  var ObservableBounds2 = dot.ObservableBounds2;

  inherit( dot.Bounds2, ObservableBounds2, extend( {}, Property.prototype, {
    // returns this value directly
    get: function() {
      return this;
    },

    /*---------------------------------------------------------------------------*
     * Overriding the core mutable methods (any mutable operation should call one of these)
     *----------------------------------------------------------------------------*/
    setMinMax: function( minX, minY, maxX, maxY ) {
      if ( this.minX !== minX || this.minY !== minY || this.maxX !== maxX || this.maxY !== maxY ) {
        this._oldValue.minX = this.minX;
        this._oldValue.minY = this.minY;
        this._oldValue.maxX = this.maxX;
        this._oldValue.maxY = this.maxY;
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    setMinX: function( minX ) {
      if ( this.minX !== minX ) {
        this._oldValue.minX = this.minX;
        this.minX = minX;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    setMinY: function( minY ) {
      if ( this.minY !== minY ) {
        this._oldValue.minY = this.minY;
        this.minY = minY;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    setMaxX: function( maxX ) {
      if ( this.maxX !== maxX ) {
        this._oldValue.maxX = this.maxX;
        this.maxX = maxX;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    setMaxY: function( maxY ) {
      if ( this.maxY !== maxY ) {
        this._oldValue.maxY = this.maxY;
        this.maxY = maxY;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    set: dot.Bounds2.prototype.set,

    // override with vector equality instead of instance equality
    equalsValue: function( value ) {
      return this.equals( value );
    },

    reset: function() {
      this.setMinMax( this._initialMinX, this._initialMinY, this._initialMaxX, this._initialMaxY );
    },

    toString: function() {
      return 'ObservableBounds2(' + this.minX + ', ' + this.minY + ', ' + this.maxX + ', ' + this.maxY + ')';
    }
  } ) );

  Poolable.mixin( ObservableBounds2, {
    defaultFactory: function() { return new ObservableBounds2(); },
    constructorDuplicateFactory: function( pool ) {
      return function( minX, minY, maxX, maxY ) {
        if ( pool.length ) {
          return pool.pop().setMinMax( minX, minY, maxX, maxY );
        }
        else {
          return new ObservableBounds2( minX, minY, maxX, maxY );
        }
      };
    }
  } );

  return ObservableBounds2;
} );
