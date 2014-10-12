// quad neighborhood surfaces for N states
ca2d_quad_neighborhood_surfaces = function () {

        // NURBS assistence
        var preimage_m = new THREE.MeshLambertMaterial( { color: 0x73ff00, ambient: 0x73ff00, opacity: 0.5, transparent: true, side: THREE.DoubleSide } );
        //var preimage_m = new THREE.MeshPhongMaterial( { color: 0x73ff00, ambient: 0x73ff00, opacity: 0.3, refractionRatio: 1.45, transparent: true, side: THREE.DoubleSide } );
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];

  // number of states
  var N = 2;

  // draw all possible neighborhoods
  var x = 0;
  var y = 0;
  var n = 0;  // neighborhood index

  var neighborhood_images = [];
  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };
  for (n = 0; n < Math.pow(N, 4); n++) {
    var neighborhood = [ [0,0], [0,0] ];
    for (y = 0; y < 2; y++) {
      for (x = 0; x < 2; x++) {
        // explicit integer division
        neighborhood [y][x] = ((n / Math.pow(N, 2*y+x) >> 0) % N);
      }
    }
    // NURBS surface
    var neighborhood_surface = [
      [
        new THREE.Vector4 ( 0  , 0  , neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0  , 0.5, neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0  , 0.5, neighborhood[1][0], 1 ),
        new THREE.Vector4 ( 0  , 1  , neighborhood[1][0], 1 )
      ],
      [
        new THREE.Vector4 ( 0.5, 0  , neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0.5, 0.5, neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0.5, 0.5, neighborhood[1][0], 1 ),
        new THREE.Vector4 ( 0.5, 1  , neighborhood[1][0], 1 )
      ],
      [
        new THREE.Vector4 ( 0.5, 0  , neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 0.5, 0.5, neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 0.5, 0.5, neighborhood[1][1], 1 ),
        new THREE.Vector4 ( 0.5, 1  , neighborhood[1][1], 1 )
      ],
      [
        new THREE.Vector4 ( 1  , 0  , neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 1  , 0.5, neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 1  , 0.5, neighborhood[1][1], 1 ),
        new THREE.Vector4 ( 1  , 1  , neighborhood[1][1], 1 )
      ]
    ];

    //console.log(neighborhood_surface);
    console.log(neighborhood);

    var nurbsSurface = new THREE.NURBSSurface(3, 3, knots, knots, neighborhood_surface);
    var preimage_g = new THREE.ParametricGeometry( getSurfacePoint, 10, 10 );
    var preimage_o = new THREE.Mesh( preimage_g, preimage_m );

    // NURBS curve
    var neighborhood_overlap = [
      [
        new THREE.Vector4 ( 0  , 0  , neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0  , 0.5, neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0  , 0.5, neighborhood[1][0], 1 ),
        new THREE.Vector4 ( 0  , 1  , neighborhood[1][0], 1 )
      ],
      [
        new THREE.Vector4 ( 0  , 1  , neighborhood[1][0], 1 ),
        new THREE.Vector4 ( 0.5, 1  , neighborhood[1][0], 1 ),
        new THREE.Vector4 ( 0.5, 1  , neighborhood[1][1], 1 ),
        new THREE.Vector4 ( 1  , 1  , neighborhood[1][1], 1 )
      ],
      [
        new THREE.Vector4 ( 1  , 1  , neighborhood[1][1], 1 ),
        new THREE.Vector4 ( 1  , 0.5, neighborhood[1][1], 1 ),
        new THREE.Vector4 ( 1  , 0.5, neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 1  , 0  , neighborhood[0][1], 1 )
      ],
      [
        new THREE.Vector4 ( 1  , 0  , neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 0.5, 0  , neighborhood[0][1], 1 ),
        new THREE.Vector4 ( 0.5, 0  , neighborhood[0][0], 1 ),
        new THREE.Vector4 ( 0  , 0  , neighborhood[0][0], 1 )
      ]
    ];

    var i;
    edge_o = new THREE.Object3D();
    for (i = 0; i < 4; i++) {
      var nurbsCurve = new THREE.NURBSCurve(3, knots, neighborhood_overlap[i]);
      var edge_g = new THREE.Geometry();
      edge_g.vertices = nurbsCurve.getPoints(200);
      var edge_m = new THREE.LineBasicMaterial( { linewidth: 0.1, color: 0x333333, ambient: 0x333333, transparent: true } );
  
      var edge = new THREE.Line( edge_g, edge_m );
      edge_o.add( edge );
    }

    // preimage neighborhood final object
    neighborhood_images[n] = new THREE.Object3D();
    neighborhood_images[n].add( preimage_o );
    neighborhood_images[n].add( edge_o );
  }

  return neighborhood_images;
}
