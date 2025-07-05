import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem('favorites');
    if (data) setFavorites(JSON.parse(data));
  };

  const saveFavorites = async (newFavorites) => {
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addFavorite = (movie) => {
    if (!favorites.some((f) => f.id === movie.id)) {
      const updated = [...favorites, movie];
      saveFavorites(updated);
    }
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    saveFavorites(updated);
  };

  // Función para resetear los favoritos
  const resetFavorites = async () => {
    setFavorites([]);  // Vaciar el estado
    await AsyncStorage.removeItem('favorites');  // Eliminar los favoritos de AsyncStorage
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, resetFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}
