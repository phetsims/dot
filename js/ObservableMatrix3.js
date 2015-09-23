// Copyright 2002-2014, University of Colorado Boulder

/**
 * Observable version of the basic 3-dimensional matrix (Matrix3)
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
  require( 'DOT/Matrix3' );

  dot.ObservableMatrix3 = function ObservableMatrix3( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) {
    dot.Matrix3.call( this, v00, v01, v02, v10, v11, v12, v20, v21, v22, type );

    this._oldValue = this.copy();
    this._skipChecks = false;
    Property.call( this, this );

    this._initial00 = v00;
    this._initial01 = v01;
    this._initial02 = v02;
    this._initial10 = v10;
    this._initial11 = v11;
    this._initial12 = v12;
    this._initial20 = v20;
    this._initial21 = v21;
    this._initial22 = v22;
    this._initialType = type;
  };
  var ObservableMatrix3 = dot.ObservableMatrix3;

  inherit( dot.Matrix3, ObservableMatrix3, extend( {}, Property.prototype, {
    // returns this value directly
    get: function() {
      return this;
    },

    /*---------------------------------------------------------------------------*
     * Overriding the core mutable methods (any mutable operation should call one of these)
     *----------------------------------------------------------------------------*/
    // every mutable method goes through rowMajor
    rowMajor: function( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) {
      var skip = this._skipChecks;
      var modified = skip ||
                     v00 !== this.entries[ 0 ] ||
                     v10 !== this.entries[ 1 ] ||
                     v20 !== this.entries[ 2 ] ||
                     v01 !== this.entries[ 3 ] ||
                     v11 !== this.entries[ 4 ] ||
                     v21 !== this.entries[ 5 ] ||
                     v02 !== this.entries[ 6 ] ||
                     v12 !== this.entries[ 7 ] ||
                     v22 !== this.entries[ 8 ] ||
                     type !== this.type;
      if ( modified ) {

        if ( !skip && this._oldValue ) {
          this._oldValue.entries[ 0 ] = this.entries[ 0 ];
          this._oldValue.entries[ 1 ] = this.entries[ 1 ];
          this._oldValue.entries[ 2 ] = this.entries[ 2 ];
          this._oldValue.entries[ 3 ] = this.entries[ 3 ];
          this._oldValue.entries[ 4 ] = this.entries[ 4 ];
          this._oldValue.entries[ 5 ] = this.entries[ 5 ];
          this._oldValue.entries[ 6 ] = this.entries[ 6 ];
          this._oldValue.entries[ 7 ] = this.entries[ 7 ];
          this._oldValue.entries[ 8 ] = this.entries[ 8 ];
          this._oldValue.type = this.type;
        }

        this.entries[ 0 ] = v00;
        this.entries[ 1 ] = v10;
        this.entries[ 2 ] = v20;
        this.entries[ 3 ] = v01;
        this.entries[ 4 ] = v11;
        this.entries[ 5 ] = v21;
        this.entries[ 6 ] = v02;
        this.entries[ 7 ] = v12;
        this.entries[ 8 ] = v22;

        // TODO: consider performance of the affine check here
        this.type = type === undefined ? ( ( v20 === 0 && v21 === 0 && v22 === 1 ) ? dot.Matrix3.Types.AFFINE : dot.Matrix3.Types.OTHER ) : type;

        // if this isn't initialization, fire off changes and update the old value
        if ( this._observers ) {
          this._notifyObservers( skip ? null : this._oldValue );
        }
      }

      return this;
    },

    // override set, since it is overridden by property
    set: dot.Matrix3.prototype.set,

    // override with vector equality instead of instance equality
    equalsValue: function( value ) {
      return this.equals( value );
    },

    reset: function() {
      this.rowMajor(
        this._initial00, this._initial01, this._initial02,
        this._initial10, this._initial11, this._initial12,
        this._initial20, this._initial21, this._initial22,
        this._initialType );
    },

    toString: dot.Matrix3.prototype.toString
  } ) );

  Poolable.mixin( ObservableMatrix3, {
    defaultFactory: function() { return new ObservableMatrix3(); },
    constructorDuplicateFactory: function( pool ) {
      return function( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) {
        if ( pool.length ) {
          return pool.pop().rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type );
        }
        else {
          return new ObservableMatrix3( v00, v01, v02, v10, v11, v12, v20, v21, v22, type );
        }
      };
    }
  } );

  return ObservableMatrix3;
} );
