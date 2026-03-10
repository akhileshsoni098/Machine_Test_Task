// the Haversine Distance Formula

exports.getDistance = function (lat, lon, destinationLat, destinationLon) {
  const R = 6371;

  const dLat = ((destinationLat - lat) * Math.PI) / 180;
  const dLon = ((destinationLon - lon) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((destinationLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};