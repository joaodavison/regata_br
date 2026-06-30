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

export function convertHeading(hdg_degrees:number){

  // 1. Keep degrees between 0 and 359 using a modulo operation
  const normalizedDegrees = ((hdg_degrees % 360) + 360) % 360;

  // 2. Define the 8 compass points in clockwise order
  const directions = [
    "N", "NE", "E", "SE",  
    "S", "SW", "W", "NW"
  ];

  // 3. Divide 360 by 8 points = 45 degrees per sector
  const sectorWidth = 45;

  // 4. Rounding creates an Offset by half a sector (22.5°) 
  const index = Math.round(normalizedDegrees / sectorWidth) % 8;

  return directions[index];
}

export function calcBissetriz(o1:number, o2:number){
    // Calcula a diferença angular
    let dif = o2 - o1;
    
    // Normaliza a diferença para o intervalo -180 a 180
    dif = ((dif % 360) + 540) % 360 - 180;
    
    // Calcula o ângulo da bissetriz
    let bissetriz = (o1 + dif / 2) % 360;
    
    // Retorna o ângulo sempre positivo (0 a 360 graus)
    return bissetriz < 0 ? bissetriz + 360 : bissetriz;
}

export function arrayDesloca(array, novoValor:number){
        array.splice(0, 1) // remove first item
        array.push(novoValor);
        // console.log(array);
}

export function roundFirstDecimal(a:number){
  return Math.round(10 * a) / 10;
}

function absDiff(a:number, b:number){
  return Math.abs(a - b);
}

export function arrayFilterSog(array){
  for (let i = array.length - 2; i >= 0; i--){
    if(absDiff(array[i], array.at(-1)) < 0.3){ // compara ultimo valor com cada valor anterior
      return roundFirstDecimal((array[i] + array.at(-1)) / 2); // devolve a media arredondada
    }
  }
  return null;
}

export function arrayFilterHdg(array){
  for (let i = array.length - 2; i >= 0; i--){
    let diff = absDiff(array[i], array.at(-1));
    if(diff > 180){
      diff = 360 - diff;
    }
    if(diff < 30){ // compara ultimo valor com cada valor anterior
      console.log(array[i] + "--"  + array.at(-1))
      return Math.round((array[i] + array.at(-1)) / 2); // devolve a media arredondada
    }
  }
  return null;
}

// export function funcContagem(){
//     const tempo = 10
//     return Alert.alert(`T = ${tempo}`)
// }

// export function funcAvanca(){
//     router.navigate("./gps")
// }