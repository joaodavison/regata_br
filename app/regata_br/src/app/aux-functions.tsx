import Page2 from "./gps";
import { router } from "expo-router"

export function calcTime(timestamp: number){
    return Math.trunc(timestamp / 1000 - 1782200000)
};

export function calcLat(latitude: number){
    return Math.trunc(-10000 * (23.22 + latitude))
};

export function calcLong(longitude: number){
    return Math.trunc(-10000 * (45.90 + longitude))
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