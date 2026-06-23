import { useState, useEffect } from "react"
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Button} from "../components/button"
import { Input} from "../components/input"
import { router } from "expo-router"
import * as Location from 'expo-location';
import Page2 from "./gps";

export default function Index() {
  
  // estado atualizavel na renderizacao
  const [name, setName] = useState("teste")
  const [counter, setCounter] = useState(-300) // 5 min
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // var global (nao atualiza na renderizacao)
  // let name = ""

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

  // funcs auxiliares
  function funcContagem(){
    const tempo = 10
    return Alert.alert(`T = ${tempo}`)
  }

  function funcText(text: string){
    console.log(text)
    setName(text)
  }

  function funcAvanca(){
    router.navigate("./gps")
  }

  function calcTime(timestamp: number){
    return Math.trunc(timestamp / 1000 - 1782200000)
  }

  function calcLat(latitude: number){
    return Math.trunc(-10000 * (23.22 + latitude))
  } 

  function calcLong(longitude: number){
    return Math.trunc(-10000 * (45.90 + longitude))
  }  

  // componentes renderizados no app
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regata BR - var: {name}</Text>
      <Text style={styles.title}>Contagem: {counter}</Text>

      { /* mostra location se tiver dados */}
      {
      location && (<Text style={styles.title}>{calcLat(location.coords.latitude)}, {calcLong(location.coords.longitude)}  @{calcTime(location.timestamp)}</Text>)}

      { /* input com onChange + arrow function */}
      <Input onChangeText={(text) => funcText(text)}></Input>
      { /* <Input onChangeText={(text) => setName(text)}></Input> */ }
      
      { /* botao com onPress */}
      <Button title="Contagem" onPress={funcContagem} />
      <Button title="Compara" onPress={funcAvanca}/>
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