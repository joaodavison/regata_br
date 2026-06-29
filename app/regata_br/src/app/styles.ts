import { StyleSheet } from "react-native";

export default function dummy(){}

// estilos da tela principal
export const styles = StyleSheet.create({
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
    fontSize: 40,
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