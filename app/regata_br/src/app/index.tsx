import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from 'react-native';
import { Input } from "../components/input";
import { styles } from "./styles"
import { Audio } from 'expo-av';
import { roundFirstDecimal, arrayFilterHdg, arrayFilterSog, arrayDesloca, calcBissetriz, convertHeading, calcLat, calcLong } from './aux-functions';

export default function Index() {

  // Mensagens
  const [aviso, setAviso] = useState("Boa regata")  

  // Timer
  const [counter, setCounter] = useState(-300) // 5 min

  // Sound
  const [sound, setSound] = useState(null);

  // Chamada temporizada (rapida) 
  useEffect(() => {
    const interval = setInterval(() => { 
      setCounter((counter) => counter + 1); 
      if(counter == -60){
        setAviso("Falta 1 minuto");
        playBeep();
      }
      if((counter <= -10) && (counter > 0)){
        setAviso("Faltam " + counter + " segundos");
      }
      if(counter == 0){
        setAviso("Valendo!");
        playBeep();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);


  // GPS
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  // const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);

  const [shownHeading, setShownHeading] = useState<number | null>(null);
  const [shownLastHeading, setShownLastHeading] = useState<number | null>(null);
  let headingArray  = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let preValidHdg  = useRef<number | null>(null);
  
  const [shownSog, setShownSog] = useState<number | null>(null);
  const [shownLastSog, setShownLastSog] = useState<number | null>(null);
  let sogArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let preValidSog  = useRef<number | null>(null);

  const [shownWind, setShownWind] = useState<number | null>(null);
  const [shownVmg, setShownVmg] = useState<number | null>(null);

  // Valores processados
  let sog  = useRef<number | null>(null);
  let hdg  = useRef<number | null>(null);
  let wind  = useRef<number | null>(null);  
  let o1  = useRef<number | null>(null); // orca 1 e orca 2
  let o2  = useRef<number | null>(null);  
  let b1_lat  = useRef<number | null>(null); // boia 1 e boia 2
  let b1_lon  = useRef<number | null>(null);
  let b2_lat  = useRef<number | null>(null);
  let b2_lon  = useRef<number | null>(null);

  // Chamada temporizada (lenta) 
  useEffect(() => {
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
        sog.current = arrayFilterSog(sogArray);
        if(sog.current != null){ // encontra valor consolidado, atualiza tela
          setShownLastSog(preValidSog.current); // TO DO: futuramente guardar apenas no nbotao Compare
          preValidSog.current = sog.current; // guarda para a proxima iteracao
          setShownSog(sog.current);
          setAviso("Novo sog " + (sog.current) + "kt");
        }

        // trata Heading
        arrayDesloca(headingArray, Math.round(currentLocation.coords.heading));
        // console.log(headingArray)
        hdg.current = arrayFilterHdg(headingArray);
        if(hdg.current != null){ // encontra valor consolidado, atualiza tela
          setShownLastHeading(preValidHdg.current); // TO DO: futuramente guardar apenas no nbotao Compare
          preValidHdg.current = hdg.current; // guarda para a proxima iteracao
          setShownHeading(hdg.current);
          setAviso("Novo heading " + (hdg.current) + "deg");
          playBeep();
        }

        // calcula VMG      
        if((preValidSog.current != null) && (preValidHdg.current != null) && (wind.current != null)){
          // console.log("sog " +(preValidSog.current))
          // console.log("angles " + wind.current + " , " + (preValidHdg.current))
          // console.log("cosine " + ( Math.cos(Math.PI*(wind.current - preValidHdg.current) / 180)))          
          let vmg = roundFirstDecimal(preValidSog.current * Math.cos(Math.PI*(wind.current - preValidHdg.current) / 180));          
          setShownVmg(vmg);
        }      

      }

    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function botaoZMorta(){
    if(o1.current == null){
      o1.current = shownHeading;
      setAviso("Z_MORTA 1 definida como " + (o1.current) + "deg");
    }
    else if(o2.current == null){
      o2.current = shownHeading;
      wind.current = calcBissetriz(o2.current, o1.current);
      setShownWind(wind.current);
      setAviso("Z_MORTA 2 definida como " + (o2.current) + "deg");      
    }
    else{
      o1.current = null;
      o2.current = null;
      wind.current = null;
      setShownWind(null);
      setAviso("Reset do vento estimado");
    }
  }

  function botaoBoia(){
    if(b1_lat.current == null){
      b1_lat.current = calcLat(location.coords.latitude);
      b1_lon.current = calcLong(location.coords.longitude);
      setAviso("BOIA 1 definida como " + (b1_lat.current ) + ", " + b1_lon.current );
    }
    else if(b2_lat.current == null){
      b2_lat.current = calcLat(location.coords.latitude);
      b2_lon.current = calcLong(location.coords.longitude);
      setAviso("BOIA 2 definida como " + (b2_lat.current ) + ", " + b2_lon.current );
    }
    else{
      b1_lat.current = null;
      b1_lon.current = null;
      b2_lat.current = null;
      b2_lon.current = null;      
      setAviso("Reset das boias");
    }
  }  

  async function playBeep() {
    // Carrega e toca o som imediatamente
    const { sound: soundInstance } = await Audio.Sound.createAsync(
       require('../../assets/sounds/beep.mp3')
    );
    setSound(soundInstance);
    await soundInstance.playAsync();
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
          <Text style={styles.medtext} onPress={() => botaoBoia()}>Boia Larg.</Text>
          {(b1_lat.current == null) && (b2_lat.current == null) && (<Text>captura primeira boia</Text>)}
          {(b1_lat.current != null) && (b2_lat.current == null) && (<Text>captura segunda boia</Text>)}
          {(b1_lat.current != null) && (b2_lat.current != null) && (<Text>reset das boias</Text>)}
        </Pressable>        
      </View>      

      { /* quadros do meio */ }
      <View style={styles.ladoalado}>
        <View style={styles.card}>
          { (<Text style={styles.smalltext}>RUMO</Text>)}      
          {(shownHeading != null) && (<Text style={styles.bigtext}>{convertHeading(shownHeading)}</Text>)}
          {(shownHeading == null) && (<Text style={styles.bigtext}>?</Text>)}
          {(shownLastHeading != null) && (<Text style={styles.smalltext}>pre: {convertHeading(shownLastHeading)}</Text>)}
        </View>
        <View style={styles.card}>
          { (<Text style={styles.smalltext}>SOG</Text>)}          
          {(shownSog != null) && (<Text style={styles.bigtext}>{shownSog} kt</Text>)}
          {(shownSog == null) && (<Text style={styles.bigtext}>?</Text>)}
          {(shownLastSog != null) && (<Text style={styles.smalltext}>pre: {shownLastSog} kt</Text>)}
        </View>        
      </View> 
      <View style={styles.ladoalado}>
        <View style={styles.card}>
          { (<Text style={styles.smalltext}>VENTO</Text>)}
          {(shownWind != null) && (<Text style={styles.bigtext}>{convertHeading(shownWind)}</Text>)}
          {(shownWind == null) && (<Text style={styles.bigtext}>?</Text>)}
          </View>
        <View style={styles.card}>
          {(<Text style={styles.smalltext}>VMG </Text>)}
          {(shownVmg != null) && (<Text style={styles.bigtext}>{shownVmg}</Text>)}
          {(shownVmg == null) && (<Text style={styles.bigtext}>?</Text>)}
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

