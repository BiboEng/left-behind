# Draco glTF decoder

These unmodified glTF decoder builds are copied from the installed Three.js package,
`three/examples/jsm/libs/draco/gltf/`. Source: https://github.com/google/draco.

Copyright Google LLC. Licensed under Apache 2.0; see LICENSE in this directory.
Three.js distribution: https://github.com/mrdoob/three.js/tree/dev/examples/jsm/libs/draco.

The NASA GLBs use KHR_draco_mesh_compression. Keeping the compatible decoder here
lets the model viewer load without a third-party decoder CDN. When updating Three.js,
copy all three decoder files together from the new installed package and retest the models.
