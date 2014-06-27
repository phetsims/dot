// Copyright 2002-2014, University of Colorado Boulder

/**
 * Observable version of the basic 2-dimensional vector
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
  require( 'DOT/Vector2' );

  dot.ObservableVector2 = function ObservableVector2( x, y ) {
    dot.Vector2.call( this, x, y );

    this._oldValue = this.copy();
    Property.call( this, this );
  };
  var ObservableVector2 = dot.ObservableVector2;

  inherit( dot.Vector2, ObservableVector2, extend( {}, Property.prototype, {
    // returns this value directly
    get: function() {
      return this;
    },

    /*---------------------------------------------------------------------------*
    * Overriding the core mutable methods (any mutable operation should call one of these)
    *----------------------------------------------------------------------------*/
    setXY: function( x, y ) {
      if ( this.x !== x || this.y !== y ) {
        this._oldValue.x = this.x;
        this._oldValue.y = this.y;
        this.x = x;
        this.y = y;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    setX: function( x ) {
      if ( this.x !== x ) {
        this._oldValue.x = this.x;
        this.x = x;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    setY: function( y ) {
      if ( this.y !== y ) {
        this._oldValue.y = this.y;
        this.y = y;
        this._notifyObservers( this._oldValue );
      }
      return this;
    },
    set: dot.Vector2.prototype.set,

    // override with vector equality instead of instance equality
    equalsValue: function( value ) {
      return this.equals( value );
    },

    // we are not storing a separate value field (_value), so we leave this blank
    storeValue: function( value ) {
    },

    // to prevent a user from modifying the passed in initial value, we store the x/y here
    storeInitialValue: function( value ) {
      this._initialX = value.x;
      this._initialY = value.y;
    },

    reset: function() {
      this.setXY( this._initialX, this._initialY );
    },

    toString: function() {
      return 'ObservableVector2(' + this.x + ', ' + this.y + ')';
    }
  } ) );

  // experimental object pooling
  /* jshint -W064 */
  Poolable( ObservableVector2, {
    defaultFactory: function() { return new ObservableVector2(); },
    constructorDuplicateFactory: function( pool ) {
      return function( x, y ) {
        if ( pool.length ) {
          return pool.pop().setXY( x, y );
        }
        else {
          return new ObservableVector2( x, y );
        }
      };
    }
  } );

  return ObservableVector2;
} );
