// Copyright 2013-2020, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area, with a convenience name and constructor. Totally functionally
 * equivalent to Bounds2, but with a different constructor.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Bounds2 from './Bounds2.js';
import dot from './dot.js';

class Rectangle extends Bounds2 {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor( x, y, width, height ) {
    assert && assert( height !== undefined, 'Rectangle requires 4 parameters' );
    super( x, y, x + width, y + height );
  }
}

dot.register( 'Rectangle', Rectangle );

export default Rectangle;