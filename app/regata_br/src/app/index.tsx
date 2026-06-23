import { useState, useEffect } from "react"
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Button} from "../components/button"
import { Input} from "../components/input"
import * as Location from 'expo-location';

import { calcTime, calcLat, calcLong } from './aux-functions';

export default function Index() {
  
  // estado atualizavel na renderizacao
  const [name, setName] = useState("teste")
  const [counter, setCounter] = useState(-300) // 5 min
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // chamada temporizada (1s) 
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((counter) => counter + 1);
    }, 1000);

    // limpa o intervalo quando o componente desmonta ou muda
    return () => clearInterval(interval);
  }, [counter]);

  // chamada temporizada (5s) 
  useEffect(() => {
    const interval = setInterval(() => {
      getLocation();
    }, 5000);

    // limpa o intervalo quando o componente desmonta ou muda
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
      <Button title="Z. Morta" />
      <Button title="Boia Largada"/>

      <Text style={styles.title}>Regata BR - var: {name}</Text>
      <Text style={styles.title}>Contagem: {counter}</Text>

      { /* mostra location se tiver dados */}
      {
      location && (<Text style={styles.title}>{calcLat(location.coords.latitude)}, {calcLong(location.coords.longitude)}  @{calcTime(location.timestamp)}</Text>)}

      { /* input com onChange + arrow function */}
      <Input onChangeText={(text) => setName(text)}></Input>
      { /* <Input onChangeText={(text) => setName(text)}></Input> */ }
      
      { /* botao com onPress */}
      <Button title="Contagem" />
      <Button title="Compara"/>
    </View>
  );
}

// estilos da tela principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    gap: 16,
  },
  title:{
    color: "#334462",
    fontSize: 24,
    fontWeight: "bold",
  },
})