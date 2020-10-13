// Copyright 2019-2020, University of Colorado Boulder

/**
 * Property whose value must be a Vector2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import validate from '../../axon/js/validate.js';
import merge from '../../phet-core/js/merge.js';
import Bounds2 from './Bounds2.js';
import Vector2 from './Vector2.js';
import dot from './dot.js';

const BOUNDS_VALIDATOR = { isValidValue: value => ( value instanceof Bounds2 || value === null ) };

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

      // {Bounds2|null} - Confine the valid area of acceptable Vector2 values to within a Bounds2.
      validBounds: null,

      // phet-io
      phetioType: Property.PropertyIO( Vector2.Vector2IO )
    }, options );

    super( initialValue, options );

    // @public (read-only) {Bounds2|null}
    this.validBounds = options.validBounds;

    validate( this.validBounds, BOUNDS_VALIDATOR );

    assert && this.validBounds && this.link( newValue => assert( this.validBounds.containsPoint( newValue ) ) );
  }
}

dot.register( 'Vector2Property', Vector2Property );
export default Vector2Property;