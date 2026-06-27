import * as Location from 'expo-location';

export default function dummy(){}

export function calcTime(timestamp: number){
  return Math.trunc(timestamp / 1000 - 1782200000)
};

export function calcLat(latitude: number){
  return Math.trunc(-10000 * (23.22 + latitude))
};

export function calcLong(longitude: number){
  return Math.trunc(-10000 * (45.90 + longitude))
};

export function calcHeading(currentLocation:Location.LocationObject, lastLocation:Location.LocationObject){
  let delta_long = currentLocation.coords.longitude - lastLocation.coords.longitude;
  let delta_lat = currentLocation.coords.latitude - lastLocation.coords.latitude;
  let heading = null;

  if(delta_lat != 0){
    let heading_aux = Math.abs(Math.round(Math.atan(delta_long / delta_lat) * 180 / Math.PI));
    if(delta_long >= 0 && delta_lat >= 0){
      heading = heading_aux;
    }
    else if(delta_long >= 0 && delta_lat < 0){
      heading = 360 - heading_aux;
    }
    else if(delta_long < 0 && delta_lat >= 0){
      heading = 180 - heading_aux;
    }
    else{
      heading = heading_aux + 180;
    }
  }
  return heading;
};

export function calcSog(currentLocation:Location.LocationObject, lastLocation:Location.LocationObject){
  let delta_long = currentLocation.coords.longitude - lastLocation.coords.longitude;
  let delta_lat  = currentLocation.coords.latitude - lastLocation.coords.latitude;
  let delta_time = (currentLocation.timestamp - lastLocation.timestamp) / 1000;
  let sog = null;

  if(delta_time != 0){
    let k = 600 * 1852 * 1.944; // converts degrees/s to knots * 10
    // console.log(Math.cos(currentLocation.coords.latitude * Math.PI / 180)); -> 0.92
    let sog_aux = k * Math.hypot(delta_lat, delta_long * 0.92) / delta_time;
    // console.log(sog_aux)
    // arredondamento com 1 casa decimal
    sog = Math.round(sog_aux) / 10;
  }

  return sog;
}

// export function funcContagem(){
//     const tempo = 10
//     return Alert.alert(`T = ${tempo}`)
// }

// export function funcAvanca(){
//     router.navigate("./gps")
// }