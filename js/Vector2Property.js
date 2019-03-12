// Copyright 2019, University of Colorado Boulder

/**
 * Property whose value must be a Vector2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const dot = require( 'DOT/dot' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2IO = require( 'DOT/Vector2IO' );

  class Vector2Property extends Property {

    /**
     * @param {Vector2} initialValue
     * @param {Object} [options]
     */
    constructor( initialValue, options ) {

      // client cannot specify superclass options that are controlled by Vector2Property
      if ( options ) {
        assert && assert( !options.hasOwnProperty( 'valueType' ), 'Vector2Property sets valueType' );
        assert && assert( !options.hasOwnProperty( 'phetioType' ), 'Vector2Property sets phetioType' );
      }

      // Fill in superclass options that are controlled by Vector2Property.
      options = _.extend( {
        valueType: Vector2,
        phetioType: PropertyIO( Vector2IO )
      }, options );

      super( initialValue, options );
    }
  }

  return dot.register( 'Vector2Property', Vector2Property );
} );