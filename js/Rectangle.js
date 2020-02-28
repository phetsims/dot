// Copyright 2013-2020, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area, with a convenience name and constructor. Totally functionally
 * equivalent to Bounds2, but with a different constructor.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../phet-core/js/inherit.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @constructor
 */
function Rectangle( x, y, width, height ) {
  assert && assert( height !== undefined, 'Rectangle requires 4 parameters' );
  Bounds2.call( this, x, y, x + width, y + height );
}

dot.register( 'Rectangle', Rectangle );

inherit( Bounds2, Rectangle );

export default Rectangle;