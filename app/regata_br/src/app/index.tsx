import { useState, useEffect } from "react"
import { Text, View, Pressable, StyleSheet, Alert } from 'react-native';
// import { Button} from "../components/button"
// import { Input} from "../components/input"
import * as Location from 'expo-location';

import { calcTime, calcLat, calcLong } from './aux-functions';
import { Input } from "../components/input";

export default function Index() {
  
  // estado atualizavel na renderizacao
  const [name, setName] = useState("teste")
  const [counter, setCounter] = useState(-300) // 5 min
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [heading, setHeading] = useState(0.5) 

  // chamada temporizada (1s) 
  useEffect(() => {
    const interval = setInterval(() => { setCounter((counter) => counter + 1); }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  // chamada temporizada (5s) 
  useEffect(() => {
    const interval = setInterval(() => { getLocation(); }, 5000);
    return () => clearInterval(interval);
  }, []);  

  // gps
  async function getLocation() {

    // solicita a permissão de acesso ao GPS
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    // captura as coordenadas
    try {
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    }
    catch (error) {
    } 
    // finally {
    // }
  }  

  // componentes renderizados no app
  return (
    <View style={styles.container}>

      { /* botoes superiores */ }
      <View style={styles.ladoalado}>
        <Pressable style={styles.pressable}>
          <Text style={styles.title}>Zona Morta</Text>
          <Text>.</Text>
        </Pressable>

        <Pressable style={styles.pressable} >
          <Text style={styles.title}>Boia Largada</Text>
          <Text>.</Text>
        </Pressable>        
      </View>      

      { /* quadros do meio */ }
      <View style={styles.ladoalado}>
        <View style={styles.card}><Text>GPS Coords</Text>{location && (<Text style={styles.title}>{calcLat(location.coords.latitude)}, {calcLong(location.coords.longitude)}</Text>)}</View>
        <View style={styles.card}><Text>Timestamp</Text>{location && (<Text style={styles.title}>{calcTime(location.timestamp)}</Text>)}</View>
      </View>
      <View style={styles.ladoalado}>
        <View style={styles.card}><Text>Est. Heading</Text>{heading && (<Text style={styles.title}>{heading}</Text>)}</View>
        <View style={styles.card}><Text>GPS Heading</Text>{location && (<Text style={styles.title}>{Math.round(location.coords.heading)}</Text>)}</View>
      </View>      
      

      { /* botoes inferiores */ }
      <View style={styles.ladoalado}>
        <Pressable style={styles.pressable} onPress={() => setCounter(-300)}>
          <Text style={styles.title}>Contagem</Text>
          <Text>{counter}</Text>
        </Pressable>

        <Pressable style={styles.pressable} >
          <Text style={styles.title}>Compara</Text>
          <Text>.</Text>
        </Pressable>        
      </View>

      { /* status bar */ }
      <Input></Input>
  
    </View>      
  
  );
}

// estilos da tela principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  ladoalado:{
    flexDirection: "row",    
    gap: 16,
    padding: 5,
  },
  card:{ 
    width: 140,
    height: 200,
    backgroundColor: "#ccccccff",
    justifyContent: "center",
    alignItems: "center",
  },  
  title:{
    color: "#334462",
    fontSize: 22,
    fontWeight: "bold",
  },
  pressable: {
    width: 140,
    height: 100,
    backgroundColor: "#eea826ff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
},
})