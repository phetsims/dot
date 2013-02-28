
define( [
  'DOT/Bounds2',
  'DOT/CanvasTransform',
  'DOT/clamp',
  'DOT/Dimension2',
  'DOT/LUDecomposition',
  'DOT/Matrix',
  'DOT/Matrix3',
  'DOT/Matrix4',
  'DOT/Permutation',
  'DOT/QRDecomposition',
  'DOT/Ray2',
  'DOT/Ray3',
  'DOT/rangeInclusive',
  'DOT/SingularValueDecomposition',
  'DOT/TemporaryProperty',
  'DOT/toRadians',
  'DOT/Transform3',
  'DOT/Transform4',
  'DOT/Util',
  'DOT/Vector2',
  'DOT/Vector3',
  'DOT/Vector4'
  ], function(
    Bounds2,
    CanvasTransform,
    clamp,
    Dimension2,
    LUDecomposition,
    Matrix,
    Matrix3,
    Matrix4,
    Permutation,
    QRDecomposition,
    Ray2,
    Ray3,
    rangeInclusive,
    SingularValueDecomposition,
    TemporaryProperty,
    toRadians,
    Transform3,
    Transform4,
    Util,
    Vector2,
    Vector3,
    Vector4
  ) {
  
  var dot = {
    Bounds2: Bounds2,
    CanvasTransform: CanvasTransform,
    clamp: clamp,
    Dimension2: Dimension2,
    LUDecomposition: LUDecomposition,
    Matrix: Matrix,
    Matrix3: Matrix3,
    Matrix4: Matrix4,
    Permutation: Permutation,
    QRDecomposition: QRDecomposition,
    Ray2: Ray2,
    Ray3: Ray3,
    rangeInclusive: rangeInclusive,
    SingularValueDecomposition: SingularValueDecomposition,
    TemporaryProperty: TemporaryProperty,
    toRadians: toRadians,
    Transform3: Transform3,
    Transform4: Transform4,
    Util: Util,
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    
    // utility functions
    isArray: Util.isArray
  };
  
  return dot;
} );
