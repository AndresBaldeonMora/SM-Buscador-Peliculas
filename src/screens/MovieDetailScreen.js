import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getMovieById } from "../services/movies";
import { FavoritesContext } from "../context/FavoritesContext";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { getComments, addComment } from "../services/comments";
import { auth } from "../firebase";

export default function MovieDetailScreen({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("INFO");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);
  const user = auth.currentUser;

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await getMovieById(id);
        setMovie(data);
        if (data?.id) {
          const commentsData = await getComments(data.id);
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error al obtener detalle:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  const isFavorite = movie && favorites.some((fav) => fav?.id === movie.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
      });
    }
  };

  const handleSendComment = async () => {
    if (!user || newComment.trim().length === 0) return;
    try {
      await addComment(movie.id, user.email, newComment.trim());
      const updatedComments = await getComments(movie.id);
      setComments(updatedComments);
      setNewComment("");
    } catch (err) {
      console.error("Error al enviar comentario:", err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const filled = Math.round(rating / 2);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{ fontSize: 20, color: i < filled ? "#f5c518" : "#ccc" }}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "INFO":
        return (
          <>
            <Image
              source={{
                uri:
                  movie.poster !== "N/A"
                    ? movie.poster
                    : "https://via.placeholder.com/300x450",
              }}
              style={styles.poster}
            />
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.detail}>
              Año: {movie.year || "No disponible"}
            </Text>
            <Text style={styles.detail}>
              Género: {movie.genre || "No disponible"}
            </Text>
            <Text style={styles.detail}>
              Director: {movie.director || "No disponible"}
            </Text>
            <Text style={styles.detail}>
              Duración:{" "}
              {movie.runtime ? `${movie.runtime} minutos` : "No disponible"}
            </Text>
            <Text style={styles.plot}>
              {movie.plot || "Sinopsis no disponible"}
            </Text>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                isFavorite ? styles.buttonFavorite : styles.buttonNotFavorite,
              ]}
              onPress={handleFavoriteToggle}
            >
              <Text style={styles.buttonText}>
                {isFavorite ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
              </Text>
            </TouchableOpacity>
          </>
        );

      case "CAST":
        return (
          <View style={styles.castContainer}>
            {movie.cast && movie.cast.length > 0 ? (
              movie.cast.map((actor, index) => (
                <View key={index} style={styles.actorContainer}>
                  <Image
                    source={{
                      uri: actor.profile_path
                        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                        : "https://via.placeholder.com/100x150",
                    }}
                    style={styles.actorImage}
                  />
                  <View style={styles.actorInfo}>
                    <Text style={styles.actorName}>{actor.name}</Text>
                    <Text style={styles.actorCharacter}>
                      {actor.character || "No disponible"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.detail}>No disponible</Text>
            )}
          </View>
        );

      case "TRAILER":
        return (
          <>
            {movie.trailerKey ? (
              <View style={{ width: "100%", marginTop: 20 }}>
                <YoutubePlayer
                  height={250}
                  videoId={movie.trailerKey}
                  play={false}
                />
              </View>
            ) : (
              <Text style={styles.detail}>No hay trailer disponible</Text>
            )}

            {typeof movie.vote_average === "number" && (
              <View style={styles.ratingBox}>
                <View style={styles.starsRow}>
                  {renderStars(movie.vote_average)}
                </View>
                <Text style={styles.ratingText}>
                  {movie.vote_average.toFixed(1)} / 10 - Puntuación de TMDb
                </Text>
              </View>
            )}

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitle}>Comentarios de usuarios</Text>

              {!user ? (
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <Text style={{ color: "#666", marginBottom: 8 }}>
                    Debes iniciar sesión para comentar.
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Cuenta")}
                    style={{
                      backgroundColor: "#0a84ff",
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Iniciar sesión
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.commentInputBox}>
                  <TextInput
                    placeholder="Escribe tu comentario..."
                    style={styles.commentInput}
                    value={newComment}
                    onChangeText={setNewComment}
                  />
                  <TouchableOpacity
                    onPress={handleSendComment}
                    style={styles.sendButton}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Enviar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {comments.length === 0 ? (
                <Text style={{ color: "#666", marginTop: 10 }}>
                  Aún no hay comentarios.
                </Text>
              ) : (
                comments.map((comment, idx) => (
                  <View key={idx} style={styles.commentBox}>
                    <Text style={styles.commentUser}>{comment.userEmail}:</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))
              )}
            </View>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0a84ff" />
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text style={styles.errorText}>
          No se pudo cargar la información de la película.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.tabs}>
          {["INFO", "CAST", "TRAILER"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  errorText: {
    fontSize: 16,
    color: "#e63946",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 15,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
    textAlign: "center",
  },
  plot: {
    fontSize: 15,
    marginTop: 12,
    lineHeight: 22,
    color: "#444",
    textAlign: "justify",
    paddingHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 25,
    paddingVertical: 14,
    width: "85%",
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  buttonFavorite: {
    backgroundColor: "#e63946",
  },
  buttonNotFavorite: {
    backgroundColor: "#0a84ff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 10,
    width: "100%",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#0a84ff",
  },
  tabText: {
    color: "#fff",
    fontSize: 15,
  },
  actorContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  actorImage: {
    width: 60,
    height: 90,
    borderRadius: 5,
  },
  actorInfo: {
    marginLeft: 10,
  },
  actorName: {
    fontSize: 16,
    color: "#000",
  },
  actorCharacter: {
    fontSize: 14,
    color: "#666",
  },
  castContainer: {
    padding: 10,
  },
  ratingBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  commentsContainer: {
    marginTop: 25,
    width: "100%",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  commentBox: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0a84ff",
  },
  commentText: {
    color: "#333",
    fontSize: 15,
  },
  commentInputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0a84ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
});
