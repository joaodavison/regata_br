import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Input } from "../components/input";

import { calcHeading, calcLat, calcLong, calcTime } from './aux-functions';

export default function Index() {

  // Mensagens
  const [aviso, setAviso] = useState("Boa regata")  

  // Timer
  const [counter, setCounter] = useState(-300) // 5 min

  useEffect(() => {
    // chamada temporizada (1s) 
    const interval = setInterval(() => { 
      setCounter((counter) => counter + 1); 
      if(counter == -60){
        setAviso("Falta 1 minuto");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);


  // GPS
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [heading, setHeading]   = useState<number | null>(null);
  const lastLatitude  = useRef<number | null>(null);
  const lastLongitude = useRef<number | null>(null);

  useEffect(() => {

     // chamada temporizada (5s) 
    const interval = setInterval(async () => {

      // solicita a permissão de acesso ao GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // coleta dados do GPS
      const currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
      setLocation(currentLocation);

      // calcula heading estimado
      if (lastLatitude.current !== null && lastLongitude.current !== null) {
        let heading = calcHeading(currentLocation.coords.latitude, currentLocation.coords.longitude, lastLatitude.current, lastLongitude.current);
        if(heading != null){
          setHeading(heading);
        }
        // console.log(currentLocation.coords.latitude, currentLocation.coords.longitude, lastLatitude.current, lastLongitude.current, heading)   
      }

      // guarda dados para proxima iteracao
      lastLatitude.current = currentLocation.coords.latitude;
      lastLongitude.current = currentLocation.coords.longitude;
    }, 5000);

    return () => clearInterval(interval);
  }, []);



  // componentes renderizados no app
  return (
    <View style={styles.container}>

      { /* banner */ }
      <View style={styles.rodape}> 
        <Input style={styles.bigtext} value="RegataBR" />
      </View>      

      { /* botoes superiores */ }
      <View style={styles.ladoalado}>
        <Pressable style={styles.pressable}>
          <Text style={styles.medtext}>Zona Morta</Text>
          <Text>.</Text>
        </Pressable>

        <Pressable style={styles.pressable} >
          <Text style={styles.medtext}>Boia Larg.</Text>
          <Text>.</Text>
        </Pressable>        
      </View>      

      { /* quadros do meio */ }
      <View style={styles.ladoalado}>
        <View style={styles.card}><Text style={styles.smalltext}>GPS Coords</Text>{(location != null) && (<Text style={styles.bigtext}>{calcLat(location.coords.latitude)}, {calcLong(location.coords.longitude)}</Text>)}</View>
        <View style={styles.card}><Text style={styles.smalltext}>Timestamp</Text>{(location != null) && (<Text style={styles.bigtext}>{calcTime(location.timestamp)}</Text>)}</View>
      </View>
      <View style={styles.ladoalado}>
        <View style={styles.card}><Text style={styles.smalltext}>GPS Heading</Text>{(location != null) && (<Text style={styles.bigtext}>{Math.round(location.coords.heading)}</Text>)}</View>
        <View style={styles.card}><Text style={styles.smalltext}>Estimated Hdg</Text>{(heading != null) && (<Text style={styles.bigtext}>{heading}</Text>)}</View>        
      </View>      
      

      { /* botoes inferiores */ }
      <View style={styles.ladoalado}>
        <Pressable style={styles.pressable} onPress={() => setCounter(-300)}>
          <Text style={styles.medtext}>Contagem</Text>
          <Text>{counter}</Text>
        </Pressable>

        <Pressable style={styles.pressable} >
          <Text style={styles.medtext}>Compara</Text>
          <Text>.</Text>
        </Pressable>        
      </View>

      { /* status bar */ }
      <View style={styles.rodape}> 
        <Input style={styles.message} value={aviso} />
      </View>
  
    </View>      
  
  );
}

// estilos da tela principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 5
  },
  ladoalado:{
    flexDirection: "row",    
    gap: 16,
    padding: 5,
  },
  rodape:{
    flexDirection: "row",  
    height: 100,  
    alignItems: "flex-end",
    padding: 5,
  },  
  card:{ 
    width: 160,
    height: 140,
    backgroundColor: "#f3f3f3ff",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 28,
    fontWeight: "bold",    
  },  
  bigtext:{
    color: "#334462",
    fontSize: 36,
    fontWeight: "bold",
  },
  medtext:{
    color: "#334462",
    fontSize: 28,
    fontWeight: "bold",
  }, 
  smalltext:{
    color: "#334462",
    fontSize: 20,
    fontWeight: "bold",
  },   
  pressable: {
    width: 160,
    height: 70,
    backgroundColor: "#ffd27dff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    width: 320,
    fontSize: 20,
  },  
})