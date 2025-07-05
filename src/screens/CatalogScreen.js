import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchMovies } from "../services/movies";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import debounce from "just-debounce-it";
import * as Animatable from "react-native-animatable";

const GENRES = [
  { label: "Acción", id: 28 },
  { label: "Comedia", id: 35 },
  { label: "Drama", id: 18 },
  { label: "Terror", id: 27 },
  { label: "Romance", id: 10749 },
  { label: "Ciencia ficción", id: 878 },
];

export default function CatalogScreen({ route }) {
  const { selectedGenres } = route.params || {};
  const navigation = useNavigation();

  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(selectedGenres || []);

  useEffect(() => {
    const loadGenres = async () => {
      const storedGenres = await AsyncStorage.getItem("favoriteGenres");
      if (storedGenres) {
        const parsedGenres = JSON.parse(storedGenres);
        setFavoriteGenres(parsedGenres);
        fetchSuggestions(parsedGenres);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    if (selectedGenres && selectedGenres.length > 0) {
      fetchMoviesByGenre(selectedGenres);
    }
  }, [selectedGenres]);

  const debouncedFetchMovies = useMemo(() => {
    return debounce((searchTerm) => {
      fetchMoviesByGenre(selectedGenre, searchTerm);
    }, 500);
  }, [selectedGenre]);

  const fetchMoviesByGenre = async (genres, searchTerm = "") => {
    setLoading(true);
    setHasMore(true);
    setMovies([]);

    try {
      const genreIds = genres
        .map((genre) => GENRES.find((g) => g.label === genre)?.id)
        .join(",");
      const results = await searchMovies({
        genreId: genreIds,
        search: searchTerm,
        page: page,
      });
      if (results.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...results]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMoviesByGenre(selectedGenre, searchTerm);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator size="small" color="#0a84ff" style={{ margin: 16 }} />
    );
  };

  const renderItem = ({ item }) => (
    <MovieCard
      movie={item}
      key={`${item.id}-${item.title}`}
      onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
    />
  );

  const handleApplyFilters = () => {
    setPage(1);
    fetchMoviesByGenre(selectedGenre, searchTerm);
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    setSelectedGenre([]);
    setSearchTerm("");
    setMovies([]);
    setPage(1);
    fetchMoviesByGenre([], "");
    setShowFiltersModal(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
    debouncedFetchMovies(searchTerm);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          delay={200}
          style={styles.searchFilterRow}
        >
          <View style={{ flex: 1 }}>
            <SearchBar value={searchTerm} onChange={handleSearch} />
          </View>
          <TouchableOpacity
            onPress={() => setShowFiltersModal(true)}
            style={styles.filterButton}
          >
            <Ionicons name="filter" size={24} color="#0a84ff" />
          </TouchableOpacity>
        </Animatable.View>

        {loading ? (
          <ActivityIndicator size="large" color="#0a84ff" />
        ) : movies.length === 0 ? (
          <Animatable.Text
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            style={styles.empty}
          >
            No se encontraron películas
          </Animatable.Text>
        ) : (
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            delay={300}
            style={{ flex: 1 }}
          >
            <FlatList
              data={movies}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          </Animatable.View>
        )}
      </View>

      <Modal
        visible={showFiltersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Filtros</Text>
            <Text style={styles.modalLabel}>Género</Text>
            <View style={styles.modalOptions}>
              {GENRES.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  style={[
                    styles.modalOption,
                    selectedGenre?.includes(genre.label) &&
                      styles.modalOptionSelected,
                  ]}
                  onPress={() =>
                    setSelectedGenre(
                      selectedGenre?.includes(genre.label)
                        ? selectedGenre.filter((g) => g !== genre.label)
                        : [...selectedGenre, genre.label]
                    )
                  }
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedGenre?.includes(genre.label) &&
                        styles.modalOptionTextSelected,
                    ]}
                  >
                    {genre.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButtonClear}
                onPress={handleClearFilters}
              >
                <Text style={styles.modalButtonText}>Limpiar</Text>
              </Pressable>
              <Pressable
                style={styles.modalButtonApply}
                onPress={handleApplyFilters}
              >
                <Text style={styles.modalButtonText}>Aplicar</Text>
              </Pressable>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  container: {
    flex: 1,
    padding: 12,
  },
  empty: {
    marginTop: 50,
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  modalOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalOption: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
  },
  modalOptionSelected: {
    backgroundColor: "#0a84ff",
  },
  modalOptionText: {
    color: "#333",
    fontWeight: "500",
  },
  modalOptionTextSelected: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  modalButtonApply: {
    backgroundColor: "#0a84ff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalButtonClear: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
