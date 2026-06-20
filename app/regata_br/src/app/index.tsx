import { Text, View, StyleSheet, Button, Alert } from 'react-native';

export default function Index() {

    function funcContagem(){
      const tempo = 10
      return Alert.alert(`T = ${tempo}`)
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regata BR</Text>
      <Button title="Contagem" onPress={funcContagem} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  title:{
    color: "#334462",
    fontSize: 24,
    fontWeight: "bold",
  },
})