// Copyright 2019-2020, University of Colorado Boulder

/**
 * Property whose value must be a Vector2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import PropertyIO from '../../axon/js/PropertyIO.js';
import merge from '../../phet-core/js/merge.js';
import dot from './dot.js';
import Vector2 from './Vector2.js';
import Vector2IO from './Vector2IO.js';

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
    options = merge( {
      valueType: Vector2,
      phetioType: PropertyIO( Vector2IO )
    }, options );

    super( initialValue, options );
  }
}

dot.register( 'Vector2Property', Vector2Property );
export default Vector2Property;