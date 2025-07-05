import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Preferences");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animatable.Image
          animation="bounceInDown"
          duration={1500}
          source={require("../images/logo.png")}
          style={styles.logo}
        />

        <Animatable.Text animation="fadeInUp" delay={800} style={styles.title}>
          Bienvenido a MovieFinder
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          delay={1200}
          style={styles.subtitle}
        >
          Tu app para descubrir películas
        </Animatable.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#60c8d7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00343a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
    color: '#00343a',
    textAlign: 'center',
  },
});
