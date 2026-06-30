import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from 'react-native';
import { Input } from "../components/input";
import { styles } from "./styles"
import { roundFirstDecimal, arrayFilterSog, arrayDesloca, calcBissetriz, convertHeading, calcLat, calcLong } from './aux-functions';

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
      if(counter == -10){
        setAviso("Faltam 10 segundos");
      }
      if(counter == 0){
        setAviso("Valendo!");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);


  // GPS
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);

  const [heading, setHeading] = useState<number | null>(null);
  const [lastHeading, setLastHeading] = useState<number | null>(null);
  let headingArray  = [0, 0, 0, 0, 0, 0];

  const [sog, setSog] = useState<number | null>(null);
  const [lastSog, setLastSog] = useState<number | null>(null);
  let sogArray = [0, 0, 0, 0, 0, 0];

  // Valores processados
  let o1  = useRef<number | null>(null);
  let o2  = useRef<number | null>(null);
  let anguloVento  = useRef<number | null>(null);


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
  
      if(currentLocation != null){
        setLocation(currentLocation);

        // trata SOG
        arrayDesloca(sogArray, roundFirstDecimal(currentLocation.coords.speed));
        console.log(sogArray)
        let newConsSog = arrayFilterSog(sogArray);
        if(newConsSog != null){ // encontra valor consolidado, atualiza tela
          setLastSog(sog);
          setSog(roundFirstDecimal(newConsSog));
        }

        // trata Heading
        setLastHeading(headingArray.at(-1));
        setHeading(Math.round(currentLocation.coords.heading));
        arrayDesloca(headingArray, Math.round(currentLocation.coords.heading));
      }

    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function botaoZMorta(){
    if(o1.current == null){
      o1.current = heading;
      setAviso("Z_MORTA 1 definida como " + (o1.current));
    }
    else if(o2.current == null){
      o2.current = heading;
      angulo_vento.current = calcBissetriz(o2.current, o1.current);
      setAviso("Z_MORTA 2 definida como " + (o2.current));
    }
    else{
      o1.current = null;
      o2.current = null;
      anguloVento.current = null;
      setAviso("Reset do vento estimado");
    }
  }



  // componentes renderizados no app
  return (
    <View style={styles.container}>

      { /* banner */ }
      <View style={styles.rodape}> 
        <Text style={styles.bigtext}>RegataBR</Text> 
      </View>      

      { /* botoes superiores */ }
      <View style={styles.ladoalado}>
        <Pressable style={styles.pressable}>
          <Text style={styles.medtext} onPress={() => botaoZMorta()}>Zona Morta</Text>
          {(o1.current == null) && (o2.current == null) && (<Text>captura primeira proa</Text>)}
          {(o1.current != null) && (o2.current == null) && (<Text>captura segunda proa</Text>)}
          {(o1.current != null) && (o2.current != null) && (<Text>reset zona morta</Text>)}
        </Pressable>

        <Pressable style={styles.pressable} >
          <Text style={styles.medtext}>Boia Larg.</Text>
          <Text>.</Text>
        </Pressable>        
      </View>      

      { /* quadros do meio */ }
      <View style={styles.ladoalado}>
        <View style={styles.card}>
          {(lastHeading != null) && (<Text style={styles.smalltext}>RUMO {convertHeading(lastHeading)}</Text>)}
          {(heading != null) && (<Text style={styles.bigtext}>{convertHeading(heading)}</Text>)}
        </View>
        <View style={styles.card}>
          {(lastSog != null) && (<Text style={styles.smalltext}>SOG {lastSog} kt</Text>)}
          {(sog != null) && (<Text style={styles.bigtext}>{sog} kt</Text>)}
        </View>        
      </View> 
      <View style={styles.ladoalado}>
        <View style={styles.card}>
          {(lastLocation != null) && (<Text style={styles.smalltext}>VENTO</Text>)}
          {(anguloVento.current != null) && (<Text style={styles.bigtext}>{convertHeading(anguloVento.current)}</Text>)}
          {(anguloVento.current == null) && (<Text style={styles.bigtext}>?</Text>)}
          </View>
        <View style={styles.card}>
          {(location != null) && (<Text style={styles.smalltext}>VMG </Text>)}
          {(location != null) && (<Text style={styles.bigtext}>{calcLat(location.coords.latitude)}, {calcLong(location.coords.longitude)}</Text>)}
        </View>
      </View>
           

      { /* botoes inferiores */ }
      <View style={styles.ladoalado}>
        <Pressable style={styles.pressable} onPress={() => {setCounter(-300); setAviso("Contagem iniciada");}}>
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

