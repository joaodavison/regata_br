import { useState, useEffect } from "react"
import { Text, View, StyleSheet, Alert } from 'react-native';
import {Button} from "../components/button"
import {Input} from "../components/input"

export default function Index() {
  
  // estado atualizavel na renderizacao
  const [name, setName] = useState("teste")
  const [counter, setCounter] = useState(-300) // 5 min

  // var global (nao atualiza na renderizacao)
  // let name = ""

  // chamada temporizada (1s) 
  useEffect(() => {
    const intervalo = setInterval(() => {
      setCounter((counter) => counter + 1);
    }, 1000);

    // limpa o intervalo quando o componente desmonta ou muda
    return () => clearInterval(intervalo);
  }, [counter]);


  // funcs auxiliares
  function funcContagem(){
    const tempo = 10
    return Alert.alert(`T = ${tempo}`)
  }

  function funcText(text: string){
    console.log(text)
    setName(text)
  }

  // componentes renderizados no app
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regata BR - var: {name}</Text>
      <Text style={styles.title}>Contagem: {counter}</Text>

      { /* input com onChange + arrow function */}
      <Input onChangeText={(text) => funcText(text)}></Input>
      { /* <Input onChangeText={(text) => setName(text)}></Input> */ }
      
      { /* botao com onPress */}
      <Button title="Contagem" onPress={funcContagem} />
      <Button title="Compara" />
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