// Copyright 2019-2022, University of Colorado Boulder

/**
 * Property whose value must be a Vector2.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property, { PropertyOptions } from '../../axon/js/Property.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Bounds2 from './Bounds2.js';
import Vector2 from './Vector2.js';
import dot from './dot.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  validBounds?: Bounds2 | null;
};

export type Vector2PropertyOptions = SelfOptions & StrictOmit<PropertyOptions<Vector2>, 'phetioValueType' | 'valueType'>;

class Vector2Property extends Property<Vector2> {
  public readonly validBounds: Bounds2 | null;

  public constructor( initialValue: Vector2, providedOptions?: Vector2PropertyOptions ) {

    // Fill in superclass options that are controlled by Vector2Property.
    const options = optionize<Vector2PropertyOptions, SelfOptions, PropertyOptions<Vector2>>()( {
      valueType: Vector2,

      // {Bounds2|null} - Confine the valid area of acceptable Vector2 values to within a Bounds2.
      validBounds: null,

      validators: [],

      // phet-io
      phetioValueType: Vector2.Vector2IO
    }, providedOptions );

    options.validBounds && options.validators.push( {
      validationMessage: 'Vector2 is not within validBounds',
      isValidValue: v => options.validBounds!.containsPoint( v )
    } );

    super( initialValue, options );

    this.validBounds = options.validBounds;
  }
}

dot.register( 'Vector2Property', Vector2Property );
export default Vector2Property;