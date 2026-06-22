import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function Gps() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function obterLocalizacao() {
    setLoading(true);
    setErrorMsg(null);

    // 1. Solicita a permissão de acesso ao GPS
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('A permissão para acessar a localização foi negada.');
      setLoading(false);
      return;
    }

    // 2. Captura as coordenadas atuais com alta precisão (GPS)
    try {
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg('Nao foi possível obter a localização atual.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Buscar Localização do GPS" onPress={obterLocalizacao} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {location && (
        <View style={styles.card}>
          <Text style={styles.title}>Dados do GPS:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Precisão: {location.coords.accuracy?.toFixed(1)} metros</Text>
          <Text>Altitude: {location.coords.altitude?.toFixed(1)} metros</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  card: { marginTop: 30, padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8, width: '100%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  errorText: { color: 'red', marginTop: 20, textAlign: 'center' }
});
