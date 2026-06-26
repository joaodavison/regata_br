
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
  let heading = 33;
  if(delta_lat != 0){
    heading = Math.round(Math.atan(delta_long / delta_lat) * 180 / 3.14159);
  }
  return heading;
};

// export function funcContagem(){
//     const tempo = 10
//     return Alert.alert(`T = ${tempo}`)
// }

// export function funcText(text: string){
//     console.log(text)
// }

// export function funcAvanca(){
//     router.navigate("./gps")
// }