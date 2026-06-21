import { Text, View, StyleSheet, Alert } from 'react-native';
import {Button} from "../components/button"

export default function Index() {

    function funcContagem(){
      const tempo = 10
      return Alert.alert(`T = ${tempo}`)
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regata BR</Text>
      <Button title="Contagem" onPress={funcContagem} />
      <Button title="Compara" />
    </View>
  );
}


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