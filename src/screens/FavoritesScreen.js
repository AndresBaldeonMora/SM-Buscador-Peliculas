import React, { useContext } from "react";
import { View, FlatList, Text, StyleSheet, Button, Alert } from "react-native";
import { FavoritesContext } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

export default function FavoritesScreen({ navigation }) {
  const { favorites, resetFavorites } = useContext(FavoritesContext);

  const handleResetFavorites = () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres eliminar todos los favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí", onPress: resetFavorites },
      ],
      { cancelable: false }
    );
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyText}>
            No tienes películas favoritas aún.
          </Text>
        </Animatable.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.resetButtonContainer}
      >
        <Button
          title="Eliminar todos los Favoritos"
          onPress={handleResetFavorites}
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} duration={1000}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() =>
                navigation.navigate("MovieDetail", { id: item.id })
              }
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  resetButtonContainer: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
