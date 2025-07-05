import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import MovieCard from "../MovieCard";

describe("MovieCard", () => {
  const movie = {
    title: "Inception",
    year: "2010",
    poster: "https://image.tmdb.org/t/p/original/inception.jpg",
  };

  it("muestra el título, año y poster correctamente", () => {
    const { getByText, getByTestId } = render(<MovieCard movie={movie} />);

    expect(getByText("Inception")).toBeTruthy();
    expect(getByText("2010")).toBeTruthy();
    expect(getByTestId("movie-poster")).toBeTruthy();
  });

  it('muestra "No Image" si el poster es "N/A"', () => {
    const movieNoPoster = { ...movie, poster: "N/A" };
    const { getByText, queryByTestId } = render(
      <MovieCard movie={movieNoPoster} />
    );

    expect(getByText("No Image")).toBeTruthy();
    expect(queryByTestId("movie-poster")).toBeNull(); // no hay imagen
  });

  it("ejecuta onPress al tocar la tarjeta", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <MovieCard movie={movie} onPress={onPressMock} />
    );

    fireEvent.press(getByTestId("movie-card"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
