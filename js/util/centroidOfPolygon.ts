// Copyright 2025, University of Colorado Boulder

/**
 * Returns the centroid of the simple planar polygon using Green's Theorem P=-y/2, Q=x/2 (similar to how kite
 * computes areas). See also https://en.wikipedia.org/wiki/Shoelace_formula.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';
import Vector2 from '../Vector2.js';

export function centroidOfPolygon( vertices: Vector2[] ): Vector2 {
  const centroid = new Vector2( 0, 0 );

  let area = 0;
  vertices.forEach( ( v0, i ) => {
    const v1 = vertices[ ( i + 1 ) % vertices.length ];
    const doubleShoelace = v0.x * v1.y - v1.x * v0.y;

    area += doubleShoelace / 2;

    // Compute the centroid of the flat intersection with https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
    centroid.addXY(
      ( v0.x + v1.x ) * doubleShoelace,
      ( v0.y + v1.y ) * doubleShoelace
    );
  } );
  centroid.divideScalar( 6 * area );

  return centroid;
}
dot.register( 'centroidOfPolygon', centroidOfPolygon );