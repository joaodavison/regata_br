
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

export function calcHeading(lat: number, long: number, last_lat: number, last_long: number){
  let delta_long = long - last_long;
  let delta_lat = lat - last_lat;
  let heading = null;

  if(delta_lat != 0){
    let heading_aux = Math.abs(Math.round(Math.atan(delta_long / delta_lat) * 180 / 3.14159));
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

// export function funcContagem(){
//     const tempo = 10
//     return Alert.alert(`T = ${tempo}`)
// }

// export function funcAvanca(){
//     router.navigate("./gps")
// }