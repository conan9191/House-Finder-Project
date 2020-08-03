const long = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
const lat = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
const latitude = coordinate => lat.test(coordinate);
const longitude = coordinate => long.test(coordinate);
const latLong = (lat, long) => latitude(lat) && longitude(long);
export const validationLatitudeLongitude = {
  latitude,
  longitude,
  latLong
};
