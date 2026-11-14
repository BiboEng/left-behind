// Lat/lon math for putting markers on the globe and turning the globe to face a site.
// Tested in geo.test.ts — don't change without re-running `npm test`.
//
// Assumes a standard equirectangular (simple cylindrical) texture on a three.js SphereGeometry,
// with longitude 0 in the CENTER of the image and east to the right. If a texture is centered
// differently, set `lonOffsetDeg` in src/worlds/<world>.ts instead of changing this file.
import { Euler, Quaternion, Vector3 } from "three";

const DEG = Math.PI / 180;

/** Point on a sphere of radius r for latitude/longitude in degrees (east-positive). */
export function latLonToVector3(latDeg: number, lonDeg: number, r = 1, lonOffsetDeg = 0): Vector3 {
  const lat = latDeg * DEG;
  const lon = (lonDeg + lonOffsetDeg) * DEG;
  return new Vector3(r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), -r * Math.cos(lat) * Math.sin(lon));
}

/**
 * Rotation to apply to the GLOBE so that (lat, lon) faces a camera sitting on +Z,
 * with north kept up. Slerp between these quaternions to glide from site to site.
 */
export function faceSiteQuaternion(latDeg: number, lonDeg: number, lonOffsetDeg = 0): Quaternion {
  const lat = latDeg * DEG;
  const lon = (lonDeg + lonOffsetDeg) * DEG;
  // Euler order XYZ = rotate around Y first (bring longitude round), then tilt around X (bring latitude up/down)
  return new Quaternion().setFromEuler(new Euler(lat, -(lon + Math.PI / 2), 0, "XYZ"));
}
