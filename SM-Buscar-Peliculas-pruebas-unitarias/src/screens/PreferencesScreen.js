import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

const genres = [
  "Acción",
  "Comedia",
  "Drama",
  "Terror",
  "Romance",
  "Ciencia ficción",
];

const { height } = Dimensions.get("window");

export default function PreferencesScreen({ navigation }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem(
        "favoriteGenres",
        JSON.stringify(selectedGenres)
      );
      navigation.navigate("Main", {
        screen: "Inicio",
        params: { selectedGenres },
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar tus preferencias.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.container}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          ¿Cuáles son tus géneros favoritos?
        </Animatable.Text>

        <View style={styles.genresContainer}>
          {genres.map((genre, index) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Animatable.View
                animation="zoomIn"
                delay={index * 100}
                key={genre}
              >
                <TouchableOpacity
                  style={[
                    styles.genreButton,
                    isSelected && styles.genreSelected,
                  ]}
                  onPress={() => toggleGenre(genre)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genreText,
                      isSelected && styles.genreTextSelected,
                    ]}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </View>

        <Animatable.View
          animation="fadeInUp"
          delay={700}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            onPress={handleContinue}
            disabled={selectedGenres.length === 0}
            style={[
              styles.continueButton,
              selectedGenres.length === 0 && { backgroundColor: "#ccc" },
            ]}
          >
            <Text style={styles.continueText}>CONTINUAR</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 30,
    textAlign: "center",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 40,
  },
  genreButton: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    margin: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  genreSelected: {
    backgroundColor: "#0a84ff",
    borderColor: "#0a84ff",
    elevation: 6,
  },
  genreText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "500",
  },
  genreTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonContainer: {
    width: "70%",
  },
  continueButton: {
    backgroundColor: "#0a84ff",
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  continueText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
