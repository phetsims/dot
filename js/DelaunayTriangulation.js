// Copyright 2015, University of Colorado Boulder

/**
 * Handles constrained Delaunay triangulation based on "Sweep-line algorithm for constrained Delaunay triangulation"
 * by Domiter and Zalik (2008), with some details provided by "An efficient sweep-line Delaunay triangulation
 * algorithm" by Zalik (2005).
 *
 * TODO: Second (basin) heuristic not yet implemented.
 * TODO: Constraints not yet implemented.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var arrayRemove = require( 'PHET_CORE/arrayRemove' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @public
   * @constructor
   *
   * @param {Array.<Vector2>} points
   * @param {Array.<Array.<number>>} constraints - Pairs of indices into the points that should be treated as
   *                                               constrained edges.
   * @param {Object} [options]
   */
  function DelaunayTriangulation( points, constraints, options ) {
    options = _.extend( {

    }, options );

    var i;

    // @public {Array.<Vector2>}
    this.points = points;

    // @public {Array.<Array.<number>>}
    this.constraints = constraints;
    // TODO: record constraints in the Vertex objects

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
    this.vertices = points.map( function( point, index ) {
      return new Vertex( point, index );
    } );
    this.vertices.sort( DelaunayTriangulation.vertexComparison );

    // @private {Vertex}
    this.bottomVertex = this.vertices[ 0 ];

    // @private {Array.<Vertex>} - Our initialization will handle our first vertex
    this.remainingVertices = this.vertices.slice( 1 );

    var bounds = Bounds2.NOTHING.copy();
    for ( i = points.length - 1; i >= 0; i-- ) {
      bounds.addPoint( points[ i ] );
    }

    var alpha = 0.4;
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

  dot.register( 'DelaunayTriangulation', DelaunayTriangulation );

  inherit( Object, DelaunayTriangulation, {
    /**
     * Moves the triangulation forward by a vertex.
     * @private
     */
    step: function() {
      // TODO: reverse the array prior to this?
      var vertex = this.remainingVertices.shift();

      var x = vertex.point.x;

      var frontEdge = this.firstFrontEdge;
      while ( frontEdge ) {
        // TODO: epsilon needed here?
        if ( x > frontEdge.endVertex.point.x ) {
          var edge1 = new Edge( frontEdge.startVertex, vertex );
          var edge2 = new Edge( vertex, frontEdge.endVertex );
          edge1.connectAfter( edge2 );
          this.edges.push( edge1 );
          this.edges.push( edge2 );
          this.triangles.push( new Triangle( frontEdge.endVertex, frontEdge.startVertex, vertex,
                                             edge1, edge2, frontEdge ) );
          this.reconnectFrontEdges( frontEdge, frontEdge, edge1, edge2 );
          this.legalizeEdge( frontEdge );
          this.addHalfPiHeuristic( edge1, edge2 );
          return;
        }
        else if ( x === frontEdge.endVertex.point.x ) {
          var leftOldEdge = frontEdge.nextEdge;
          var rightOldEdge = frontEdge;
          assert && assert( leftOldEdge !== null );

          var middleOldVertex = frontEdge.endVertex;
          var leftVertex = leftOldEdge.endVertex;
          var rightVertex = rightOldEdge.startVertex;

          var leftEdge = new Edge( vertex, leftVertex );
          var rightEdge = new Edge( rightVertex, vertex );
          var middleEdge = new Edge( middleOldVertex, vertex );
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
          return;
        }
        frontEdge = frontEdge.nextEdge;
      }

      throw new Error( 'Did not find matching front edge?' );
    },

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
    fillBorderTriangle: function( firstEdge, secondEdge, firstSideVertex, middleVertex, secondSideVertex ) {
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

      var newEdge = new Edge( firstSideVertex, secondSideVertex );
      this.edges.push( newEdge );
      this.triangles.push( new Triangle( secondSideVertex, middleVertex, firstSideVertex,
                                         firstEdge, newEdge, secondEdge ) );
      this.legalizeEdge( firstEdge );
      this.legalizeEdge( secondEdge );
      return newEdge;
    },

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
    reconnectFrontEdges: function( oldRightEdge, oldLeftEdge, newRightEdge, newLeftEdge ) {
      var previousEdge = oldRightEdge.previousEdge;
      var nextEdge = oldLeftEdge.nextEdge;
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
    },

    /**
     * Tries to fill in acute angles with triangles after we add a vertex into the front.
     * @private
     *
     * @param {Edge} rightFrontEdge
     * @param {Edge} leftFrontEdge
     */
    addHalfPiHeuristic: function( rightFrontEdge, leftFrontEdge ) {
      assert && assert( rightFrontEdge.endVertex === leftFrontEdge.startVertex );

      var middleVertex = rightFrontEdge.endVertex;

      while ( rightFrontEdge.previousEdge &&
              Util.triangleAreaSigned( middleVertex.point, rightFrontEdge.startVertex.point, rightFrontEdge.previousEdge.startVertex.point ) > 0 &&
              ( middleVertex.point.minus( rightFrontEdge.startVertex.point ) ).angleBetween( rightFrontEdge.previousEdge.startVertex.point.minus( rightFrontEdge.startVertex.point ) ) < Math.PI / 2 ) {
        var previousEdge = rightFrontEdge.previousEdge;
        var newRightEdge = new Edge( previousEdge.startVertex, middleVertex );
        this.edges.push( newRightEdge );
        this.triangles.push( new Triangle( middleVertex, rightFrontEdge.startVertex, previousEdge.startVertex,
                                           previousEdge, newRightEdge, rightFrontEdge ) );

        this.reconnectFrontEdges( previousEdge, rightFrontEdge, newRightEdge, newRightEdge );
        this.legalizeEdge( previousEdge );
        this.legalizeEdge( rightFrontEdge );

        rightFrontEdge = newRightEdge;
      }
      while ( leftFrontEdge.nextEdge &&
              Util.triangleAreaSigned( middleVertex.point, leftFrontEdge.nextEdge.endVertex.point, leftFrontEdge.endVertex.point ) > 0 &&
              ( middleVertex.point.minus( leftFrontEdge.endVertex.point ) ).angleBetween( leftFrontEdge.nextEdge.endVertex.point.minus( leftFrontEdge.endVertex.point ) ) < Math.PI / 2 ) {
        var nextEdge = leftFrontEdge.nextEdge;
        var newLeftEdge = new Edge( middleVertex, nextEdge.endVertex );
        this.edges.push( newLeftEdge );
        this.triangles.push( new Triangle( middleVertex, leftFrontEdge.nextEdge.endVertex, leftFrontEdge.endVertex,
                                           nextEdge, leftFrontEdge, newLeftEdge ) );
        this.reconnectFrontEdges( leftFrontEdge, nextEdge, newLeftEdge, newLeftEdge );
        this.legalizeEdge( nextEdge );
        this.legalizeEdge( leftFrontEdge );

        leftFrontEdge = newLeftEdge;
      }
    },

    /**
     * Should be called when there are no more remaining vertices left to be processed.
     * @private
     */
    finalize: function() {
      // Accumulate front edges, excluding the first and last.
      var frontEdges = [];
      var frontEdge = this.firstFrontEdge.nextEdge;
      while ( frontEdge && frontEdge.nextEdge ) {
        frontEdges.push( frontEdge );
        frontEdge = frontEdge.nextEdge;
      }
      var firstFrontEdge = this.firstFrontEdge;
      var lastFrontEdge = frontEdge;

      assert && assert( this.firstFrontEdge.triangles.length === 1 );
      assert && assert( lastFrontEdge.triangles.length === 1 );

      // Handle adding any triangles not in the convex hull (on the front edge)
      for ( var i = 0; i < frontEdges.length - 1; i++ ) {
        var firstEdge = frontEdges[ i ];
        var secondEdge = frontEdges[ i + 1 ];
        if ( Util.triangleAreaSigned( secondEdge.endVertex.point, firstEdge.endVertex.point, firstEdge.startVertex.point ) > 1e-10 ) {
          var newEdge = this.fillBorderTriangle( firstEdge, secondEdge, firstEdge.startVertex, firstEdge.endVertex, secondEdge.endVertex );
          frontEdges.splice( i, 2, newEdge );
          // start scanning from behind where we were previously (if possible)
          i = Math.max( i - 2, -1 );
          // TODO: remove this!
          window.triDebug && window.triDebug( this );
        }
      }

      // Clear out front edge information, no longer needed.
      this.firstFrontEdge = null;

      // Accumulate back edges and items to get rid of
      var backEdges = [];
      var artificialEdges = [ firstFrontEdge ];
      var currentSplitEdge = firstFrontEdge;
      while ( currentSplitEdge !== lastFrontEdge ) {
        var nextTriangle = currentSplitEdge.triangles[ 0 ];
        nextTriangle.remove();
        arrayRemove( this.triangles, nextTriangle );

        var edge = nextTriangle.getNonArtificialEdge();
        if ( edge ) {
          backEdges.push( edge );
          var sharedVertex = edge.getSharedVertex( currentSplitEdge );
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

      for ( i = 0; i < artificialEdges.length; i++ ) {
        arrayRemove( this.edges, artificialEdges[ i ] );
      }

      // TODO: remove this!
      window.triDebug && window.triDebug( this );

      // Handle adding any triangles not in the convex hull (on the back edge)
      for ( i = 0; i < backEdges.length - 1; i++ ) {
        firstEdge = backEdges[ i + 1 ];
        secondEdge = backEdges[ i ];

        sharedVertex = firstEdge.getSharedVertex( secondEdge );
        var firstVertex = firstEdge.getOtherVertex( sharedVertex );
        var secondVertex = secondEdge.getOtherVertex( sharedVertex );
        if ( Util.triangleAreaSigned( secondVertex.point, sharedVertex.point, firstVertex.point ) > 1e-10 ) {
          newEdge = this.fillBorderTriangle( firstEdge, secondEdge, firstVertex, sharedVertex, secondVertex );
          backEdges.splice( i, 2, newEdge );
          // start scanning from behind where we were previously (if possible)
          i = Math.max( i - 2, -1 );
          // TODO: remove this!
          window.triDebug && window.triDebug( this );
        }
      }

      for ( i = 0; i < frontEdges.length; i++ ) {
        this.convexHull.push( frontEdges[ i ].startVertex );
      }
      this.convexHull.push( frontEdges[ frontEdges.length - 1 ].endVertex );
      for ( i = backEdges.length - 1; i >= 1; i-- ) {
        this.convexHull.push( backEdges[ i ].getSharedVertex( backEdges[ i - 1 ] ) );
      }
    },

    /**
     * Checks an edge to see whether its two adjacent triangles satisfy the delaunay condition (the far point of one
     * triangle should not be contained in the other triangle's circumcircle), and if it is not satisfied, flips the
     * edge so the condition is satisfied.
     * @private
     *
     * @param {Edge} edge
     */
    legalizeEdge: function( edge ) {
      // Checking each edge to see if it isn't in our triangulation anymore (or can't be illegal because it doesn't
      // have multiple triangles) helps a lot.
      if ( !_.includes( this.edges, edge ) || edge.triangles.length !== 2 ) {
        return;
      }

      var triangle1 = edge.triangles[ 0 ];
      var triangle2 = edge.triangles[ 1 ];

      var farVertex1 = triangle1.getVertexOppositeFromEdge( edge );
      var farVertex2 = triangle2.getVertexOppositeFromEdge( edge );

      if ( Util.pointInCircleFromPoints( triangle1.aVertex.point, triangle1.bVertex.point, triangle1.cVertex.point, farVertex2.point ) ||
           Util.pointInCircleFromPoints( triangle2.aVertex.point, triangle2.bVertex.point, triangle2.cVertex.point, farVertex1.point ) ) {
        // TODO: better helper functions for adding/removing triangles (takes care of the edge stuff)
        triangle1.remove();
        triangle2.remove();
        arrayRemove( this.triangles, triangle1 );
        arrayRemove( this.triangles, triangle2 );
        arrayRemove( this.edges, edge );

        var newEdge = new Edge( farVertex1, farVertex2 );
        this.edges.push( newEdge );

        var triangle1Edge1 = triangle2.getEdgeOppositeFromVertex( triangle2.getVertexBefore( farVertex2 ) );
        var triangle1Edge2 = triangle1.getEdgeOppositeFromVertex( triangle1.getVertexAfter( farVertex1 ) );
        var triangle2Edge1 = triangle1.getEdgeOppositeFromVertex( triangle1.getVertexBefore( farVertex1 ) );
        var triangle2Edge2 = triangle2.getEdgeOppositeFromVertex( triangle2.getVertexAfter( farVertex2 ) );

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
  }, {
    /**
     * Comparison for sorting points by y, then by x.
     * @private
     *
     * TODO: Do we need to reverse the x sort? "If our edge is horizontal, the ending point with smaller x coordinate
     *       is considered as the upper point"?
     *
     * @param {Vertex} a
     * @param {Vertex} b
     * @returns {number}
     */
    vertexComparison: function( a, b ) {
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
  } );

  /**
   * Vertex (point with an index)
   * @private
   * @constructor
   *
   * @param {Vector2} point
   * @param {number} index - Index of the point in the points array
   */
  function Vertex( point, index ) {
    assert && assert( point instanceof Vector2 );
    assert && assert( point.isFinite() );
    assert && assert( typeof index === 'number' );

    // @public {Vector2}
    this.point = point;

    // @public {number}
    this.index = index;
  }

  inherit( Object, Vertex, {
    /**
     * Returns whether this is an artificial vertex (index less than zero).
     * @public
     *
     * @returns {boolean}
     */
    isArtificial: function() {
      return this.index < 0;
    }
  } );

  /**
   * Edge defined by two vertices
   * @private
   * @constructor
   *
   * @param {Vertex} startVertex
   * @param {Vertex} endVertex
   */
  function Edge( startVertex, endVertex ) {
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
  }

  inherit( Object, Edge, {

    /**
     * Returns whether this is an artificial edge (has an artificial vertex)
     * @public
     *
     * @returns {boolean}
     */
    isArtificial: function() {
      return this.startVertex.isArtificial() || this.endVertex.isArtificial();
    },

    /**
     * Appends the edge to the end of this edge (for our linked list).
     * @public
     *
     * @param {Edge} edge
     */
    connectAfter: function( edge ) {
      assert && assert( edge instanceof Edge );
      assert && assert( this.endVertex === edge.startVertex );

      this.nextEdge = edge;
      edge.previousEdge = this;
    },

    // TODO: doc
    disconnectAfter: function()  {
      this.nextEdge.previousEdge = null;
      this.nextEdge = null;
    },

    /**
     * Adds an adjacent triangle.
     * @public
     *
     * @param {Triangle} triangle
     */
    addTriangle: function( triangle ) {
      assert && assert( triangle instanceof Triangle );
      assert && assert( this.triangles.length <= 1 );

      this.triangles.push( triangle );
    },

    /**
     * Removes an adjacent triangle.
     * @public
     *
     * @param {Triangle} triangle
     */
    removeTriangle: function( triangle ) {
      assert && assert( triangle instanceof Triangle );
      assert && assert( _.includes( this.triangles, triangle ) );

      arrayRemove( this.triangles, triangle );
    },

    /**
     * Returns the triangle in common with both edges.
     * @public
     *
     * @param {Edge} otherEdge
     * @returns {Triangle}
     */
    getSharedTriangle: function( otherEdge ) {
      assert && assert( otherEdge instanceof Edge );

      for ( var i = 0; i < this.triangles.length; i++ ) {
        var triangle = this.triangles[ i ];
        for ( var j = 0; j < otherEdge.triangles.length; j++ ) {
          if ( otherEdge.triangles[ j ] === triangle ) {
            return triangle;
          }
        }
      }
      throw new Error( 'No common triangle' );
    },

    /**
     * Returns the vertex in common with both edges.
     * @public
     *
     * @param {Edge} otherEdge
     * @returns {Vertex}
     */
    getSharedVertex: function( otherEdge ) {
      assert && assert( otherEdge instanceof Edge );

      if ( this.startVertex === otherEdge.startVertex || this.startVertex === otherEdge.endVertex ) {
        return this.startVertex;
      }
      else {
        assert && assert( this.endVertex === otherEdge.startVertex || this.endVertex === otherEdge.endVertex );
        return this.endVertex;
      }
    },

    /**
     * Returns the other vertex of the edge.
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Vertex}
     */
    getOtherVertex: function( vertex ) {
      assert && assert( vertex instanceof Vertex );
      assert && assert( vertex === this.startVertex || vertex === this.endVertex );

      if ( vertex === this.startVertex ) {
        return this.endVertex;
      }
      else {
        return this.startVertex;
      }
    },

    /**
     * Returns the other triangle associated with this edge (if there are two).
     * @public
     *
     * @param {Triangle} triangle
     * @returns {Triangle}
     */
    getOtherTriangle: function( triangle ) {
      assert && assert( triangle instanceof Triangle );
      assert && assert( this.triangles.length === 2 );

      if ( this.triangles[ 0 ] === triangle ) {
        return this.triangles[ 1 ];
      }
      else {
        return this.triangles[ 0 ];
      }
    }
  } );

  /**
   * Triangle defined by three vertices (with edges)
   * @private
   * @constructor
   *
   * @param {Vertex} aVertex
   * @param {Vertex} bVertex
   * @param {Vertex} cVertex
   * @param {Edge} aEdge - Edge opposite the 'a' vertex
   * @param {Edge} bEdge - Edge opposite the 'b' vertex
   * @param {Edge} cEdge - Edge opposite the 'c' vertex
   */
  function Triangle( aVertex, bVertex, cVertex, aEdge, bEdge, cEdge ) {
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

    assert && assert( Util.triangleAreaSigned( aVertex.point, bVertex.point, cVertex.point ) > 0,
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

  inherit( Object, Triangle, {
    /**
     * Returns the vertex that is opposite from the given edge.
     * @public
     *
     * @param {Edge} edge
     * @returns {Vertex}
     */
    getVertexOppositeFromEdge: function( edge ) {
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
    },

    /**
     * Returns the edge that is opposite from the given vertex.
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Edge}
     */
    getEdgeOppositeFromVertex: function( vertex ) {
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
    },

    /**
     * Returns the vertex that is just before the given vertex (in counterclockwise order).
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Vertex}
     */
    getVertexBefore: function( vertex ) {
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
    },

    /**
     * Returns the vertex that is just after the given vertex (in counterclockwise order).
     * @public
     *
     * @param {Vertex} vertex
     * @returns {Vertex}
     */
    getVertexAfter: function( vertex ) {
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
    },

    /**
     * Returns the one non-artificial edge in the triangle (assuming it exists).
     * @public
     *
     * @returns {Edge|null}
     */
    getNonArtificialEdge: function() {
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
    },

    /**
     * Returns whether this is an artificial triangle (has an artificial vertex)
     * @public
     *
     * @returns {boolean}
     */
    isArtificial: function() {
      return this.aVertex.isArtificial() || this.bVertex.isArtificial() || this.cVertex.isArtificial();
    },

    // TODO: doc
    remove: function() {
      this.aEdge.removeTriangle( this );
      this.bEdge.removeTriangle( this );
      this.cEdge.removeTriangle( this );
    }
  } );

  return DelaunayTriangulation;
} );
