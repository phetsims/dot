// Copyright 2017-2023, University of Colorado Boulder

/**
 * Handles constrained Delaunay triangulation based on "Sweep-line algorithm for constrained Delaunay triangulation"
 * by Domiter and Zalik (2008), with some details provided by "An efficient sweep-line Delaunay triangulation
 * algorithm" by Zalik (2005).
 *
 * TODO: Second (basin) heuristic not yet implemented. https://github.com/phetsims/dot/issues/120
 * TODO: Constraints not yet implemented.
 * TODO: Check number of triangles/edges/vertices with Euler's Formula
 * TODO: Handle "outside" cases (and changing the front edges) for constrained edges
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import arrayRemove from '../../phet-core/js/arrayRemove.js';
import merge from '../../phet-core/js/merge.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';
import Utils from './Utils.js';
import Vector2 from './Vector2.js';

class DelaunayTriangulation {
  /**
   * @public
   *
   * @param {Array.<Vector2>} points
   * @param {Array.<Array.<number>>} constraints - Pairs of indices into the points that should be treated as
   *                                               constrained edges.
   * @param {Object} [options]
   */
  constructor( points, constraints, options ) {
    options = merge( {}, options );

    let i;

    // @public {Array.<Vector2>}
    this.points = points;

    // @public {Array.<Array.<number>>}
    this.constraints = constraints;

    // @public {Array.<Triangle>}
    this.triangles = [];

    // @public {Array.<Edge>}
    this.edges = [];

    // @public {Array.<Vertex>}
    this.convexHull = [];

    if ( points.length === 0 ) {
      return;
    }

    // @private {Array.<Vertex>}
    this.vertices = points.map( ( point, index ) => {
      assert && assert( point instanceof Vector2 && point.isFinite() );

      return new Vertex( point, index );
    } );

    for ( i = 0; i < this.constraints.length; i++ ) {
      const constraint = this.constraints[ i ];
      const firstIndex = constraint[ 0 ];
      const secondIndex = constraint[ 1 ];
      assert && assert( typeof firstIndex === 'number' && isFinite( firstIndex ) && firstIndex % 1 === 0 && firstIndex >= 0 && firstIndex < points.length );
      assert && assert( typeof secondIndex === 'number' && isFinite( secondIndex ) && secondIndex % 1 === 0 && secondIndex >= 0 && secondIndex < points.length );
      assert && assert( firstIndex !== secondIndex );

      this.vertices[ firstIndex ].constrainedVertices.push( this.vertices[ secondIndex ] );
    }

    this.vertices.sort( DelaunayTriangulation.vertexComparison );

    for ( i = 0; i < this.vertices.length; i++ ) {
      const vertex = this.vertices[ i ];
      vertex.sortedIndex = i;
      for ( let j = vertex.constrainedVertices.length - 1; j >= 0; j-- ) {
        const otherVertex = vertex.constrainedVertices[ j ];

        // If the "other" vertex is later in the sweep-line order, it should have the reference to the earlier vertex,
        // not the other way around.
        if ( otherVertex.sortedIndex === -1 ) {
          otherVertex.constrainedVertices.push( vertex );
          vertex.constrainedVertices.splice( j, 1 );
        }
      }
    }

    // @private {Vertex}
    this.bottomVertex = this.vertices[ 0 ];

    // @private {Array.<Vertex>} - Our initialization will handle our first vertex
    this.remainingVertices = this.vertices.slice( 1 );

    const bounds = Bounds2.NOTHING.copy();
    for ( i = points.length - 1; i >= 0; i-- ) {
      bounds.addPoint( points[ i ] );
    }

    const alpha = 0.4;
    // @private {Vertex} - Fake index -1
    this.artificialMinVertex = new Vertex( new Vector2( bounds.minX - bounds.width * alpha, bounds.minY - bounds.height * alpha ), -1 );
    // @private {Vertex} - Fake index -2
    this.artificialMaxVertex = new Vertex( new Vector2( bounds.maxX + bounds.width * alpha, bounds.minY - bounds.height * alpha ), -2 );

    this.edges.push( new Edge( this.artificialMinVertex, this.artificialMaxVertex ) );
    this.edges.push( new Edge( this.artificialMaxVertex, this.bottomVertex ) );
    this.edges.push( new Edge( this.bottomVertex, this.artificialMinVertex ) );

    // Set up our first (artificial) triangle.
    this.triangles.push( new Triangle( this.artificialMinVertex, this.artificialMaxVertex, this.bottomVertex,
      this.edges[ 1 ], this.edges[ 2 ], this.edges[ 0 ] ) );

    // @private {Edge|null} - The start of our front (the edges at the front of the sweep-line)
    this.firstFrontEdge = this.edges[ 1 ];
    this.edges[ 1 ].connectAfter( this.edges[ 2 ] );

    // @private {Edge} - The start of our hull (the edges at the back, making up the convex hull)
    this.firstHullEdge = this.edges[ 0 ];
  }

  /**
   * Moves the triangulation forward by a vertex.
   * @private
   */
  step() {
    // TODO: reverse the array prior to this? https://github.com/phetsims/dot/issues/120
    const vertex = this.remainingVertices.shift();

    const x = vertex.point.x;

    let frontEdge = this.firstFrontEdge;
    while ( frontEdge ) {
      // TODO: epsilon needed here? https://github.com/phetsims/dot/issues/120
      if ( x > frontEdge.endVertex.point.x ) {
        const edge1 = new Edge( frontEdge.startVertex, vertex );
        const edge2 = new Edge( vertex, frontEdge.endVertex );
        edge1.connectAfter( edge2 );
        this.edges.push( edge1 );
        this.edges.push( edge2 );
        this.triangles.push( new Triangle( frontEdge.endVertex, frontEdge.startVertex, vertex,
          edge1, edge2, frontEdge ) );
        this.reconnectFrontEdges( frontEdge, frontEdge, edge1, edge2 );
        this.legalizeEdge( frontEdge );
        this.addHalfPiHeuristic( edge1, edge2 );
        this.constrainEdges( vertex, edge1, edge2 );
        break;
      }
      else if ( x === frontEdge.endVertex.point.x ) {
        const leftOldEdge = frontEdge.nextEdge;
        const rightOldEdge = frontEdge;
        assert && assert( leftOldEdge !== null );

        const middleOldVertex = frontEdge.endVertex;
        const leftVertex = leftOldEdge.endVertex;
        const rightVertex = rightOldEdge.startVertex;

        const leftEdge = new Edge( vertex, leftVertex );
        const rightEdge = new Edge( rightVertex, vertex );
        const middleEdge = new Edge( middleOldVertex, vertex );
        rightEdge.connectAfter( leftEdge );
        this.edges.push( leftEdge );
        this.edges.push( rightEdge );
        this.edges.push( middleEdge );
        this.triangles.push( new Triangle( leftVertex, middleOldVertex, vertex,
          middleEdge, leftEdge, leftOldEdge ) );
        this.triangles.push( new Triangle( middleOldVertex, rightVertex, vertex,
          rightEdge, middleEdge, rightOldEdge ) );
        this.reconnectFrontEdges( rightOldEdge, leftOldEdge, rightEdge, leftEdge );
        this.legalizeEdge( leftOldEdge );
        this.legalizeEdge( rightOldEdge );
        this.legalizeEdge( middleEdge );
        this.addHalfPiHeuristic( rightEdge, leftEdge );
        this.constrainEdges( vertex, rightEdge, leftEdge );
        break;
      }
      frontEdge = frontEdge.nextEdge;
    }
  }

  /**
   * Builds a triangle between two vertices.
   * @private
   *
   * @param {Edge} firstEdge
   * @param {Edge} secondEdge
   * @param {Vertex} firstSideVertex
   * @param {Vertex} middleVertex
   * @param {Vertex} secondSideVertex
   * @returns {Edge} - The newly created edge
   */
  fillBorderTriangle( firstEdge, secondEdge, firstSideVertex, middleVertex, secondSideVertex ) {
    assert && assert( firstEdge instanceof Edge );
    assert && assert( secondEdge instanceof Edge );
    assert && assert( firstSideVertex instanceof Vertex );
    assert && assert( middleVertex instanceof Vertex );
    assert && assert( secondSideVertex instanceof Vertex );

    assert && assert( middleVertex === firstEdge.startVertex || middleVertex === firstEdge.endVertex,
      'middleVertex should be in firstEdge' );
    assert && assert( middleVertex === secondEdge.startVertex || middleVertex === secondEdge.endVertex,
      'middleVertex should be in secondEdge' );
    assert && assert( firstSideVertex === firstEdge.startVertex || firstSideVertex === firstEdge.endVertex,
      'firstSideVertex should be in firstEdge' );
    assert && assert( secondSideVertex === secondEdge.startVertex || secondSideVertex === secondEdge.endVertex,
      'secondSideVertex should be in secondEdge' );

    const newEdge = new Edge( firstSideVertex, secondSideVertex );
    this.edges.push( newEdge );
    this.triangles.push( new Triangle( secondSideVertex, middleVertex, firstSideVertex,
      firstEdge, newEdge, secondEdge ) );
    this.legalizeEdge( firstEdge );
    this.legalizeEdge( secondEdge );
    return newEdge;
  }

  /**
   * Disconnects a section of front edges, and connects a new section.
   * @private
   *
   * Disconnects:
   * <nextEdge> (cut) <oldLeftEdge> ..... <oldRightEdge> (cut) <previousEdge>
   *
   * Connects:
   * <nextEdge> (join) <newLeftEdge> ..... <newRightEdge> (join) <previousEdge>
   *
   * If previousEdge is null, we'll need to set our firstFrontEdge to the newRightEdge.
   *
   * @param {Edge} oldRightEdge
   * @param {Edge} oldLeftEdge
   * @param {Edge} newRightEdge
   * @param {Edge} newLeftEdge
   */
  reconnectFrontEdges( oldRightEdge, oldLeftEdge, newRightEdge, newLeftEdge ) {
    const previousEdge = oldRightEdge.previousEdge;
    const nextEdge = oldLeftEdge.nextEdge;
    if ( previousEdge ) {
      previousEdge.disconnectAfter();
      previousEdge.connectAfter( newRightEdge );
    }
    else {
      this.firstFrontEdge = newRightEdge;
    }
    if ( nextEdge ) {
      oldLeftEdge.disconnectAfter();
      newLeftEdge.connectAfter( nextEdge );
    }
  }

  /**
   * Tries to fill in acute angles with triangles after we add a vertex into the front.
   * @private
   *
   * @param {Edge} rightFrontEdge
   * @param {Edge} leftFrontEdge
   */
  addHalfPiHeuristic( rightFrontEdge, leftFrontEdge ) {
    assert && assert( rightFrontEdge.endVertex === leftFrontEdge.startVertex );

    const middleVertex = rightFrontEdge.endVertex;

    while ( rightFrontEdge.previousEdge &&
            Utils.triangleAreaSigned( middleVertex.point, rightFrontEdge.startVertex.point, rightFrontEdge.previousEdge.startVertex.point ) > 0 &&
            ( middleVertex.point.minus( rightFrontEdge.startVertex.point ) ).angleBetween( rightFrontEdge.previousEdge.startVertex.point.minus( rightFrontEdge.startVertex.point ) ) < Math.PI / 2 ) {
      const previousEdge = rightFrontEdge.previousEdge;
      const newRightEdge = new Edge( previousEdge.startVertex, middleVertex );
      this.edges.push( newRightEdge );
      this.triangles.push( new Triangle( middleVertex, rightFrontEdge.startVertex, previousEdge.startVertex,
        previousEdge, newRightEdge, rightFrontEdge ) );

      this.reconnectFrontEdges( previousEdge, rightFrontEdge, newRightEdge, newRightEdge );
      this.legalizeEdge( previousEdge );
      this.legalizeEdge( rightFrontEdge );

      rightFrontEdge = newRightEdge;
    }
    while ( leftFrontEdge.nextEdge &&
            Utils.triangleAreaSigned( middleVertex.point, leftFrontEdge.nextEdge.endVertex.point, leftFrontEdge.endVertex.point ) > 0 &&
            ( middleVertex.point.minus( leftFrontEdge.endVertex.point ) ).angleBetween( leftFrontEdge.nextEdge.endVertex.point.minus( leftFrontEdge.endVertex.point ) ) < Math.PI / 2 ) {
      const nextEdge = leftFrontEdge.nextEdge;
      const newLeftEdge = new Edge( middleVertex, nextEdge.endVertex );
      this.edges.push( newLeftEdge );
      this.triangles.push( new Triangle( middleVertex, leftFrontEdge.nextEdge.endVertex, leftFrontEdge.endVertex,
        nextEdge, leftFrontEdge, newLeftEdge ) );
      this.reconnectFrontEdges( leftFrontEdge, nextEdge, newLeftEdge, newLeftEdge );
      this.legalizeEdge( nextEdge );
      this.legalizeEdge( leftFrontEdge );

      leftFrontEdge = newLeftEdge;
    }
  }

  /**
   * Handles any "edge events" that delete intersecting edges, creating the new edge, and filling in (all only if
   * necessary).
   * @private
   *
   * @param {Vertex} vertex
   * @param {Edge} rightFrontEdge
   * @param {Edge} leftFrontEdge
   */
  constrainEdges( vertex, rightFrontEdge, leftFrontEdge ) {
    assert && assert( vertex instanceof Vertex );
    assert && assert( rightFrontEdge instanceof Edge );
    assert && assert( leftFrontEdge instanceof Edge );
    assert && assert( vertex === rightFrontEdge.endVertex );
    assert && assert( vertex === leftFrontEdge.startVertex );

    for ( let i = 0; i < vertex.constrainedVertices.length; i++ ) {
      const bottomVertex = vertex.constrainedVertices[ i ];

      // Check if it's one of our front edge vertices (if so, bail out, since the edge already exists)
      if ( bottomVertex === rightFrontEdge.startVertex || bottomVertex === leftFrontEdge.endVertex ) {
        break;
      }

      const leftEdges = [];
      const rightEdges = [];
      let currentTriangle = null;
      let currentEdge = null;
      const trianglesToRemove = [];
      const edgesToRemove = [];

      let outsideRight = DelaunayTriangulation.vertexProduct( vertex, rightFrontEdge.startVertex, bottomVertex ) > 0;
      let outsideLeft = DelaunayTriangulation.vertexProduct( vertex, leftFrontEdge.endVertex, bottomVertex ) < 0;

      // If we start inside, we need to identify which triangle we're inside of.
      if ( !outsideRight && !outsideLeft ) {
        assert && assert( rightFrontEdge.triangles.length === 1 );
        assert && assert( leftFrontEdge.triangles.length === 1 );

        let lastVertex = rightFrontEdge.startVertex;
        let nextVertex;
        currentTriangle = rightFrontEdge.triangles[ 0 ];
        // TODO: Triangle operations to make this more readable https://github.com/phetsims/dot/issues/120
        while ( DelaunayTriangulation.vertexProduct( vertex, nextVertex = currentTriangle.getEdgeOppositeFromVertex( vertex ).getOtherVertex( lastVertex ), bottomVertex ) < 0 ) {
          currentTriangle = currentTriangle.getEdgeOppositeFromVertex( lastVertex ).getOtherTriangle( currentTriangle );
          lastVertex = nextVertex;
        }

        // If our initial triangle has our vertex and bottomVertex, then bail out (edge already exists)
        if ( currentTriangle.hasVertex( bottomVertex ) ) {
          break;
        }

        trianglesToRemove.push( currentTriangle );

        currentEdge = currentTriangle.getEdgeOppositeFromVertex( vertex );
        edgesToRemove.push( currentEdge );
        leftEdges.push( currentTriangle.getEdgeOppositeFromVertex( lastVertex ) );
        rightEdges.push( currentTriangle.getEdgeOppositeFromVertex( currentEdge.getOtherVertex( lastVertex ) ) );
        assert && assert( leftEdges[ 0 ].getOtherVertex( vertex ).point.x < rightEdges[ 0 ].getOtherVertex( vertex ).point.x );
      }

      while ( true ) { // eslint-disable-line no-constant-condition
        if ( outsideRight ) {
          // TODO: implement https://github.com/phetsims/dot/issues/120
          break;
        }
        else if ( outsideLeft ) {
          // TODO: implement https://github.com/phetsims/dot/issues/120
          break;
        }
        else {
          if ( currentEdge.triangles.length > 1 ) {
            const nextTriangle = currentEdge.getOtherTriangle( currentTriangle );
            if ( nextTriangle.hasVertex( bottomVertex ) ) {

              // TODO: do things! https://github.com/phetsims/dot/issues/120
              trianglesToRemove.push( nextTriangle );
              leftEdges.push( nextTriangle.getNextEdge( currentEdge ) );
              rightEdges.push( nextTriangle.getPreviousEdge( currentEdge ) );
              break;
            }
            else {
              // If this is the next edge intersected
              let nextEdge;
              if ( nextTriangle.aEdge !== currentEdge && nextTriangle.aEdge.intersectsConstrainedEdge( vertex, bottomVertex ) ) {
                nextEdge = nextTriangle.aEdge;
              }
              else if ( nextTriangle.bEdge !== currentEdge && nextTriangle.bEdge.intersectsConstrainedEdge( vertex, bottomVertex ) ) {
                nextEdge = nextTriangle.bEdge;
              }
              else if ( nextTriangle.cEdge !== currentEdge && nextTriangle.cEdge.intersectsConstrainedEdge( vertex, bottomVertex ) ) {
                nextEdge = nextTriangle.cEdge;
              }
              assert && assert( nextEdge );

              if ( nextTriangle.getNextEdge( nextEdge ) === currentEdge ) {
                leftEdges.push( nextTriangle.getPreviousEdge( nextEdge ) );
              }
              else {
                rightEdges.push( nextTriangle.getNextEdge( nextEdge ) );
              }

              currentEdge = nextEdge;
              edgesToRemove.push( currentEdge );

              currentTriangle = nextTriangle;
              trianglesToRemove.push( currentTriangle );
            }
          }
          // No other triangle, exited
          else {
            if ( bottomVertex.point.x < vertex.point.x ) {
              outsideLeft = true;
            }
            else {
              outsideRight = true;
            }
          }
        }
      }

      for ( let j = 0; j < trianglesToRemove.length; j++ ) {
        const triangleToRemove = trianglesToRemove[ j ];
        arrayRemove( this.triangles, triangleToRemove );
        triangleToRemove.remove();
      }

      for ( let j = 0; j < edgesToRemove.length; j++ ) {
        arrayRemove( this.edges, edgesToRemove[ j ] );
      }

      const constraintEdge = new Edge( bottomVertex, vertex );
      constraintEdge.isConstrained = true;
      this.edges.push( constraintEdge );
      leftEdges.push( constraintEdge );
      rightEdges.push( constraintEdge );
      rightEdges.reverse(); // Put edges in counterclockwise order

      // TODO: remove this! https://github.com/phetsims/dot/issues/120
      window.triDebug && window.triDebug( this );

      this.triangulatePolygon( leftEdges );
      this.triangulatePolygon( rightEdges );
    }
  }

  /**
   * Creates edges/triangles to triangulate a simple polygon.
   * @private
   *
   * @param {Array.<Edge>} edges - Should be in counterclockwise order
   */
  triangulatePolygon( edges ) {
    // TODO: Something more efficient than ear clipping method below https://github.com/phetsims/dot/issues/120
    while ( edges.length > 3 ) {
      for ( let k = 0; k < edges.length; k++ ) {
        const kx = k < edges.length - 1 ? k + 1 : 0;
        assert && assert( edges[ k ].getSharedVertex( edges[ kx ] ) );
      }

      // Check if each triple of vertices is an ear (and if so, remove it)
      for ( let i = 0; i < edges.length; i++ ) {
        // Next index
        const ix = i < edges.length - 1 ? i + 1 : 0;

        // Information about our potential ear
        const edge = edges[ i ];
        const nextEdge = edges[ ix ];
        const sharedVertex = edge.getSharedVertex( nextEdge );
        const startVertex = edge.getOtherVertex( sharedVertex );
        const endVertex = nextEdge.getOtherVertex( sharedVertex );

        if ( Utils.triangleAreaSigned( startVertex.point, sharedVertex.point, endVertex.point ) <= 0 ) {
          continue;
        }

        // Variables for computing barycentric coordinates
        const endDelta = endVertex.point.minus( sharedVertex.point );
        const startDelta = startVertex.point.minus( sharedVertex.point );
        const endMagnitudeSquared = endDelta.dot( endDelta );
        const startEndProduct = endDelta.dot( startDelta );
        const startMagnitudeSquared = startDelta.dot( startDelta );
        const x = endMagnitudeSquared * startMagnitudeSquared - startEndProduct * startEndProduct;

        // See if there are other vertices in our triangle (it wouldn't be an ear if there is another in it)
        let lastVertex = edges[ 0 ].getSharedVertex( edges[ edges.length - 1 ] );
        let hasInteriorVertex = false;
        for ( let j = 0; j < edges.length; j++ ) {
          const vertex = edges[ j ].getOtherVertex( lastVertex );

          if ( vertex !== sharedVertex && vertex !== startVertex && vertex !== endVertex ) {
            const pointDelta = vertex.point.minus( sharedVertex.point );
            const pointEndProduct = endDelta.dot( pointDelta );
            const pointStartProduct = startDelta.dot( pointDelta );

            // Compute barycentric coordinates
            const u = ( startMagnitudeSquared * pointEndProduct - startEndProduct * pointStartProduct ) / x;
            const v = ( endMagnitudeSquared * pointStartProduct - startEndProduct * pointEndProduct ) / x;

            // Test for whether the point is in our triangle
            if ( u >= -1e-10 && v >= -1e-10 && u + v < 1 + 1e-10 ) {
              hasInteriorVertex = true;
              break;
            }
          }

          lastVertex = vertex;
        }

        // If there is no interior vertex, then we reached an ear.
        if ( !hasInteriorVertex ) {
          const newEdge = new Edge( startVertex, endVertex );
          this.edges.push( newEdge );
          this.triangles.push( new Triangle( startVertex, sharedVertex, endVertex,
            nextEdge, newEdge, edge ) );
          if ( ix > i ) {
            edges.splice( i, 2, newEdge );
          }
          else {
            edges.splice( i, 1, newEdge );
            edges.splice( ix, 1 );
          }

          // TODO: remove this! https://github.com/phetsims/dot/issues/120
          window.triDebug && window.triDebug( this );
        }
      }
    }

    // Fill in the last triangle
    if ( edges.length === 3 ) {
      this.triangles.push( new Triangle( edges[ 0 ].getSharedVertex( edges[ 1 ] ), edges[ 1 ].getSharedVertex( edges[ 2 ] ), edges[ 0 ].getSharedVertex( edges[ 2 ] ),
        edges[ 2 ], edges[ 0 ], edges[ 1 ] ) );

      // TODO: remove this! https://github.com/phetsims/dot/issues/120
      window.triDebug && window.triDebug( this );
    }
  }

  /**
   * Should be called when there are no more remaining vertices left to be processed.
   * @private
   */
  finalize() {
    // Accumulate front edges, excluding the first and last.
    const frontEdges = [];
    let frontEdge = this.firstFrontEdge.nextEdge;
    while ( frontEdge && frontEdge.nextEdge ) {
      frontEdges.push( frontEdge );
      frontEdge = frontEdge.nextEdge;
    }
    const firstFrontEdge = this.firstFrontEdge;
    const lastFrontEdge = frontEdge;

    assert && assert( this.firstFrontEdge.triangles.length === 1 );
    assert && assert( lastFrontEdge.triangles.length === 1 );

    // Handle adding any triangles not in the convex hull (on the front edge)
    for ( let i = 0; i < frontEdges.length - 1; i++ ) {
      const firstEdge = frontEdges[ i ];
      const secondEdge = frontEdges[ i + 1 ];
      if ( Utils.triangleAreaSigned( secondEdge.endVertex.point, firstEdge.endVertex.point, firstEdge.startVertex.point ) > 1e-10 ) {
        const newEdge = this.fillBorderTriangle( firstEdge, secondEdge, firstEdge.startVertex, firstEdge.endVertex, secondEdge.endVertex );
        frontEdges.splice( i, 2, newEdge );
        // start scanning from behind where we were previously (if possible)
        i = Math.max( i - 2, -1 );
        // TODO: remove this! https://github.com/phetsims/dot/issues/120
        window.triDebug && window.triDebug( this );
      }
    }

    // Clear out front edge information, no longer needed.
    this.firstFrontEdge = null;

    // Accumulate back edges and items to get rid of
    const backEdges = [];
    const artificialEdges = [ firstFrontEdge ];
    let currentSplitEdge = firstFrontEdge;
    while ( currentSplitEdge !== lastFrontEdge ) {
      const nextTriangle = currentSplitEdge.triangles[ 0 ];
      nextTriangle.remove();
      arrayRemove( this.triangles, nextTriangle );

      const edge = nextTriangle.getNonArtificialEdge();
      if ( edge ) {
        backEdges.push( edge );
        const sharedVertex = edge.getSharedVertex( currentSplitEdge );
        currentSplitEdge = nextTriangle.getEdgeOppositeFromVertex( sharedVertex );
      }
      // Our min-max-bottomPoint triangle (pivot, no edge to add)
      else {
        assert && assert( currentSplitEdge.startVertex === this.artificialMaxVertex );

        // Remove the "bottom" edge connecting both artificial points
        artificialEdges.push( nextTriangle.getEdgeOppositeFromVertex( currentSplitEdge.endVertex ) );

        // Pivot
        currentSplitEdge = nextTriangle.getEdgeOppositeFromVertex( currentSplitEdge.startVertex );
      }
      artificialEdges.push( currentSplitEdge );
    }

    for ( let i = 0; i < artificialEdges.length; i++ ) {
      arrayRemove( this.edges, artificialEdges[ i ] );
    }

    // TODO: remove this! https://github.com/phetsims/dot/issues/120
    window.triDebug && window.triDebug( this );

    // Handle adding any triangles not in the convex hull (on the back edge)
    for ( let i = 0; i < backEdges.length - 1; i++ ) {
      const firstEdge = backEdges[ i + 1 ];
      const secondEdge = backEdges[ i ];

      const sharedVertex = firstEdge.getSharedVertex( secondEdge );
      const firstVertex = firstEdge.getOtherVertex( sharedVertex );
      const secondVertex = secondEdge.getOtherVertex( sharedVertex );
      if ( Utils.triangleAreaSigned( secondVertex.point, sharedVertex.point, firstVertex.point ) > 1e-10 ) {
        const newEdge = this.fillBorderTriangle( firstEdge, secondEdge, firstVertex, sharedVertex, secondVertex );
        backEdges.splice( i, 2, newEdge );
        // start scanning from behind where we were previously (if possible)
        i = Math.max( i - 2, -1 );
        // TODO: remove this! https://github.com/phetsims/dot/issues/120
        window.triDebug && window.triDebug( this );
      }
    }

    for ( let i = 0; i < frontEdges.length; i++ ) {
      this.convexHull.push( frontEdges[ i ].startVertex );
    }
    this.convexHull.push( frontEdges[ frontEdges.length - 1 ].endVertex );
    for ( let i = backEdges.length - 1; i >= 1; i-- ) {
      this.convexHull.push( backEdges[ i ].getSharedVertex( backEdges[ i - 1 ] ) );
    }
  }

  /**
   * Checks an edge to see whether its two adjacent triangles satisfy the delaunay condition (the far point of one
   * triangle should not be contained in the other triangle's circumcircle), and if it is not satisfied, flips the
   * edge so the condition is satisfied.
   * @private
   *
   * @param {Edge} edge
   */
  legalizeEdge( edge ) {
    // Checking each edge to see if it isn't in our triangulation anymore (or can't be illegal because it doesn't
    // have multiple triangles) helps a lot.
    if ( !_.includes( this.edges, edge ) || edge.triangles.length !== 2 || edge.isConstrained ) {
      return;
    }

    const triangle1 = edge.triangles[ 0 ];
    const triangle2 = edge.triangles[ 1 ];

    const farVertex1 = triangle1.getVertexOppositeFromEdge( edge );
    const farVertex2 = triangle2.getVertexOppositeFromEdge( edge );

    if ( Utils.pointInCircleFromPoints( triangle1.aVertex.point, triangle1.bVertex.point, triangle1.cVertex.point, farVertex2.point ) ||
         Utils.pointInCircleFromPoints( triangle2.aVertex.point, triangle2.bVertex.point, triangle2.cVertex.point, farVertex1.point ) ) {
      // TODO: better helper functions for adding/removing triangles (takes care of the edge stuff) https://github.com/phetsims/dot/issues/120
      triangle1.remove();
      triangle2.remove();
      arrayRemove( this.triangles, triangle1 );
      arrayRemove( this.triangles, triangle2 );
      arrayRemove( this.edges, edge );

      const newEdge = new Edge( farVertex1, farVertex2 );
      this.edges.push( newEdge );

      const triangle1Edge1 = triangle2.getEdgeOppositeFromVertex( triangle2.getVertexBefore( farVertex2 ) );
      const triangle1Edge2 = triangle1.getEdgeOppositeFromVertex( triangle1.getVertexAfter( farVertex1 ) );
      const triangle2Edge1 = triangle1.getEdgeOppositeFromVertex( triangle1.getVertexBefore( farVertex1 ) );
      const triangle2Edge2 = triangle2.getEdgeOppositeFromVertex( triangle2.getVertexAfter( farVertex2 ) );

      // Construct the new triangles with the correct orientations
      this.triangles.push( new Triangle( farVertex1, farVertex2, triangle1.getVertexBefore( farVertex1 ),
        triangle1Edge1, triangle1Edge2, newEdge ) );
      this.triangles.push( new Triangle( farVertex2, farVertex1, triangle2.getVertexBefore( farVertex2 ),
        triangle2Edge1, triangle2Edge2, newEdge ) );

      this.legalizeEdge( triangle1Edge1 );
      this.legalizeEdge( triangle1Edge2 );
      this.legalizeEdge( triangle2Edge1 );
      this.legalizeEdge( triangle2Edge2 );
    }
  }

  /**
   * Comparison for sorting points by y, then by x.
   * @private
   *
   * TODO: Do we need to reverse the x sort? "If our edge is horizontal, the ending point with smaller x coordinate https://github.com/phetsims/dot/issues/120
   *       is considered as the upper point"?
   *
   * @param {Vertex} a
   * @param {Vertex} b
   * @returns {number}
   */
  static vertexComparison( a, b ) {
    assert && assert( a instanceof Vertex );
    assert && assert( b instanceof Vertex );

    a = a.point;
    b = b.point;
    if ( a.y < b.y ) {
      return -1;
    }
    else if ( a.y > b.y ) {
      return 1;
    }
    else if ( a.x < b.x ) {
      return -1;
    }
    else if ( a.x > b.x ) {
      return 1;
    }
    else {
      // NOTE: How would the algorithm work if this is the case? Would the comparison ever test the reflexive
      // property?
      return 0;
    }
  }

  /**
   * Returns the cross product of (aVertex-sharedVertex) and (bVertex-sharedVertex)
   * @private
   *
   * @param {Vertex} sharedVertex
   * @param {Vertex} aVertex
   * @param {Vertex} bVertex
   * @returns {number}
   */
  static vertexProduct( sharedVertex, aVertex, bVertex ) {
    const aDiff = aVertex.point.minus( sharedVertex.point );
    const bDiff = bVertex.point.minus( sharedVertex.point );
    return aDiff.crossScalar( bDiff );
  }
}

dot.register( 'DelaunayTriangulation', DelaunayTriangulation );

class Vertex {
  /**
   * Vertex (point with an index)
   * @private
   *
   * @param {Vector2} point
   * @param {number} index - Index of the point in the points array
   */
  constructor( point, index ) {
    assert && assert( point instanceof Vector2 );
    assert && assert( point.isFinite() );
    assert && assert( typeof index === 'number' );

    // @public {Vector2}
    this.point = point;

    // @public {number}
    this.index = index;

    // @public {number} - Will be set after construction
    this.sortedIndex = -1;

    // @public {Array.<Vertex>} - Vertices with "lower" y values that have constrained edges with this vertex.
    this.constrainedVertices = [];
  }

  /**
   * Returns whether this is an artificial vertex (index less than zero).
   * @public
   *
   * @returns {boolean}
   */
  isArtificial() {
    return this.index < 0;
  }
}

class Edge {
  /**
   * Edge defined by two vertices
   * @private
   *
   * @param {Vertex} startVertex
   * @param {Vertex} endVertex
   */
  constructor( startVertex, endVertex ) {
    assert && assert( startVertex instanceof Vertex );
    assert && assert( endVertex instanceof Vertex );
    assert && assert( startVertex !== endVertex, 'Should be different vertices' );

    // @public {Vertex}
    this.startVertex = startVertex;
    this.endVertex = endVertex;

    // @public {Array.<Triangle>} - Adjacent triangles to the edge
    this.triangles = [];

    // @public {Edge|null} - Linked list for the front of the sweep-line (or in the back for the convex hull)
    this.nextEdge = null;
    this.previousEdge = null;

    // @public {boolean} - Can be set to note that it was constrained
    this.isConstrained = false;
  }


  /**
   * Returns whether this is an artificial edge (has an artificial vertex)
   * @public
   *
   * @returns {boolean}
   */
  isArtificial() {
    return this.startVertex.isArtificial() || this.endVertex.isArtificial();
  }

  /**
   * Appends the edge to the end of this edge (for our linked list).
   * @public
   *
   * @param {Edge} edge
   */
  connectAfter( edge ) {
    assert && assert( edge instanceof Edge );
    assert && assert( this.endVertex === edge.startVertex );

    this.nextEdge = edge;
    edge.previousEdge = this;
  }

  /**
   * @public
   */
  disconnectAfter() {
    this.nextEdge.previousEdge = null;
    this.nextEdge = null;
  }

  /**
   * Adds an adjacent triangle.
   * @public
   *
   * @param {Triangle} triangle
   */
  addTriangle( triangle ) {
    assert && assert( triangle instanceof Triangle );
    assert && assert( this.triangles.length <= 1 );

    this.triangles.push( triangle );
  }

  /**
   * Removes an adjacent triangle.
   * @public
   *
   * @param {Triangle} triangle
   */
  removeTriangle( triangle ) {
    assert && assert( triangle instanceof Triangle );
    assert && assert( _.includes( this.triangles, triangle ) );

    arrayRemove( this.triangles, triangle );
  }

  /**
   * Returns the triangle in common with both edges.
   * @public
   *
   * @param {Edge} otherEdge
   * @returns {Triangle}
   */
  getSharedTriangle( otherEdge ) {
    assert && assert( otherEdge instanceof Edge );

    for ( let i = 0; i < this.triangles.length; i++ ) {
      const triangle = this.triangles[ i ];
      for ( let j = 0; j < otherEdge.triangles.length; j++ ) {
        if ( otherEdge.triangles[ j ] === triangle ) {
          return triangle;
        }
      }
    }
    throw new Error( 'No common triangle' );
  }

  /**
   * Returns the vertex in common with both edges.
   * @public
   *
   * @param {Edge} otherEdge
   * @returns {Vertex}
   */
  getSharedVertex( otherEdge ) {
    assert && assert( otherEdge instanceof Edge );

    if ( this.startVertex === otherEdge.startVertex || this.startVertex === otherEdge.endVertex ) {
      return this.startVertex;
    }
    else {
      assert && assert( this.endVertex === otherEdge.startVertex || this.endVertex === otherEdge.endVertex );
      return this.endVertex;
    }
  }

  /**
   * Returns the other vertex of the edge.
   * @public
   *
   * @param {Vertex} vertex
   * @returns {Vertex}
   */
  getOtherVertex( vertex ) {
    assert && assert( vertex instanceof Vertex );
    assert && assert( vertex === this.startVertex || vertex === this.endVertex );

    if ( vertex === this.startVertex ) {
      return this.endVertex;
    }
    else {
      return this.startVertex;
    }
  }

  /**
   * Returns the other triangle associated with this edge (if there are two).
   * @public
   *
   * @param {Triangle} triangle
   * @returns {Triangle}
   */
  getOtherTriangle( triangle ) {
    assert && assert( triangle instanceof Triangle );
    assert && assert( this.triangles.length === 2 );

    if ( this.triangles[ 0 ] === triangle ) {
      return this.triangles[ 1 ];
    }
    else {
      return this.triangles[ 0 ];
    }
  }

  /**
   * Returns whether the line segment defined between the vertex and bottomVertex intersect this edge.
   * @public
   *
   * @param {Vertex} vertex
   * @param {Vertex} bottomVertex
   * @returns {boolean}
   */
  intersectsConstrainedEdge( vertex, bottomVertex ) {
    return Utils.lineSegmentIntersection( vertex.point.x, vertex.point.y, bottomVertex.point.x, bottomVertex.point.y,
      this.startVertex.point.x, this.startVertex.point.y,
      this.endVertex.point.x, this.endVertex.point.y );
  }
}

class Triangle {
  /**
   * Triangle defined by three vertices (with edges)
   * @private
   *
   * @param {Vertex} aVertex
   * @param {Vertex} bVertex
   * @param {Vertex} cVertex
   * @param {Edge} aEdge - Edge opposite the 'a' vertex
   * @param {Edge} bEdge - Edge opposite the 'b' vertex
   * @param {Edge} cEdge - Edge opposite the 'c' vertex
   */
  constructor( aVertex, bVertex, cVertex, aEdge, bEdge, cEdge ) {
    // Type checks
    assert && assert( aVertex instanceof Vertex );
    assert && assert( bVertex instanceof Vertex );
    assert && assert( cVertex instanceof Vertex );
    assert && assert( aEdge instanceof Edge );
    assert && assert( bEdge instanceof Edge );
    assert && assert( cEdge instanceof Edge );

    // Ensure each vertex is NOT in the opposite edge
    assert && assert( aVertex !== aEdge.startVertex && aVertex !== aEdge.endVertex, 'Should be an opposite edge' );
    assert && assert( bVertex !== bEdge.startVertex && bVertex !== bEdge.endVertex, 'Should be an opposite edge' );
    assert && assert( cVertex !== cEdge.startVertex && cVertex !== cEdge.endVertex, 'Should be an opposite edge' );

    // Ensure each vertex IS in its adjacent edges
    assert && assert( aVertex === bEdge.startVertex || aVertex === bEdge.endVertex, 'aVertex should be in bEdge' );
    assert && assert( aVertex === cEdge.startVertex || aVertex === cEdge.endVertex, 'aVertex should be in cEdge' );
    assert && assert( bVertex === aEdge.startVertex || bVertex === aEdge.endVertex, 'bVertex should be in aEdge' );
    assert && assert( bVertex === cEdge.startVertex || bVertex === cEdge.endVertex, 'bVertex should be in cEdge' );
    assert && assert( cVertex === aEdge.startVertex || cVertex === aEdge.endVertex, 'cVertex should be in aEdge' );
    assert && assert( cVertex === bEdge.startVertex || cVertex === bEdge.endVertex, 'cVertex should be in bEdge' );

    assert && assert( Utils.triangleAreaSigned( aVertex.point, bVertex.point, cVertex.point ) > 0,
      'Should be counterclockwise' );

    // @public {Vertex}
    this.aVertex = aVertex;
    this.bVertex = bVertex;
    this.cVertex = cVertex;

    // @public {Edge}
    this.aEdge = aEdge;
    this.bEdge = bEdge;
    this.cEdge = cEdge;

    this.aEdge.addTriangle( this );
    this.bEdge.addTriangle( this );
    this.cEdge.addTriangle( this );
  }

  /**
   * Returns whether the vertex is one in the triangle.
   * @public
   *
   * @param {Vertex} vertex
   * @returns {boolean}
   */
  hasVertex( vertex ) {
    return this.aVertex === vertex || this.bVertex === vertex || this.cVertex === vertex;
  }

  /**
   * Returns the vertex that is opposite from the given edge.
   * @public
   *
   * @param {Edge} edge
   * @returns {Vertex}
   */
  getVertexOppositeFromEdge( edge ) {
    assert && assert( edge instanceof Edge );
    assert && assert( edge === this.aEdge || edge === this.bEdge || edge === this.cEdge,
      'Should be an edge that is part of this triangle' );

    if ( edge === this.aEdge ) {
      return this.aVertex;
    }
    else if ( edge === this.bEdge ) {
      return this.bVertex;
    }
    else {
      return this.cVertex;
    }
  }

  /**
   * Returns the edge that is opposite from the given vertex.
   * @public
   *
   * @param {Vertex} vertex
   * @returns {Edge}
   */
  getEdgeOppositeFromVertex( vertex ) {
    assert && assert( vertex instanceof Vertex );
    assert && assert( vertex === this.aVertex || vertex === this.bVertex || vertex === this.cVertex,
      'Should be a vertex that is part of this triangle' );

    if ( vertex === this.aVertex ) {
      return this.aEdge;
    }
    else if ( vertex === this.bVertex ) {
      return this.bEdge;
    }
    else {
      return this.cEdge;
    }
  }

  /**
   * Returns the vertex that is just before the given vertex (in counterclockwise order).
   * @public
   *
   * @param {Vertex} vertex
   * @returns {Vertex}
   */
  getVertexBefore( vertex ) {
    assert && assert( vertex instanceof Vertex );
    assert && assert( vertex === this.aVertex || vertex === this.bVertex || vertex === this.cVertex );

    if ( vertex === this.aVertex ) {
      return this.cVertex;
    }
    else if ( vertex === this.bVertex ) {
      return this.aVertex;
    }
    else {
      return this.bVertex;
    }
  }

  /**
   * Returns the vertex that is just after the given vertex (in counterclockwise order).
   * @public
   *
   * @param {Vertex} vertex
   * @returns {Vertex}
   */
  getVertexAfter( vertex ) {
    assert && assert( vertex instanceof Vertex );
    assert && assert( vertex === this.aVertex || vertex === this.bVertex || vertex === this.cVertex );

    if ( vertex === this.aVertex ) {
      return this.bVertex;
    }
    else if ( vertex === this.bVertex ) {
      return this.cVertex;
    }
    else {
      return this.aVertex;
    }
  }

  /**
   * Returns the one non-artificial edge in the triangle (assuming it exists).
   * @public
   *
   * @returns {Edge|null}
   */
  getNonArtificialEdge() {
    assert && assert( ( this.aEdge.isArtificial() && this.bEdge.isArtificial() && !this.cEdge.isArtificial() ) ||
                      ( this.aEdge.isArtificial() && !this.bEdge.isArtificial() && this.cEdge.isArtificial() ) ||
                      ( !this.aEdge.isArtificial() && this.bEdge.isArtificial() && this.cEdge.isArtificial() ) ||
                      ( this.aEdge.isArtificial() && this.bEdge.isArtificial() && this.cEdge.isArtificial() ),
      'At most one edge should be non-artificial' );

    if ( !this.aEdge.isArtificial() ) {
      return this.aEdge;
    }
    else if ( !this.bEdge.isArtificial() ) {
      return this.bEdge;
    }
    else if ( !this.cEdge.isArtificial() ) {
      return this.cEdge;
    }
    else {
      return null;
    }
  }

  /**
   * Returns the next edge (counterclockwise).
   * @public
   *
   * @param {Edge} edge
   * @returns {Edge}
   */
  getNextEdge( edge ) {
    assert && assert( edge === this.aEdge || edge === this.bEdge || edge === this.cEdge );

    if ( this.aEdge === edge ) {
      return this.bEdge;
    }
    if ( this.bEdge === edge ) {
      return this.cEdge;
    }
    if ( this.cEdge === edge ) {
      return this.aEdge;
    }
    throw new Error( 'illegal edge' );
  }

  /**
   * Returns the previous edge (clockwise).
   * @public
   *
   * @param {Edge} edge
   * @returns {Edge}
   */
  getPreviousEdge( edge ) {
    assert && assert( edge === this.aEdge || edge === this.bEdge || edge === this.cEdge );

    if ( this.aEdge === edge ) {
      return this.cEdge;
    }
    if ( this.bEdge === edge ) {
      return this.aEdge;
    }
    if ( this.cEdge === edge ) {
      return this.bEdge;
    }

    throw new Error( 'illegal edge' );
  }

  /**
   * Returns whether this is an artificial triangle (has an artificial vertex)
   * @public
   *
   * @returns {boolean}
   */
  isArtificial() {
    return this.aVertex.isArtificial() || this.bVertex.isArtificial() || this.cVertex.isArtificial();
  }

  /**
   * @public
   */
  remove() {
    this.aEdge.removeTriangle( this );
    this.bEdge.removeTriangle( this );
    this.cEdge.removeTriangle( this );
  }
}

export default DelaunayTriangulation;