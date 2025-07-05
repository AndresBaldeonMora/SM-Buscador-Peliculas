import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renderiza correctamente el input', () => {
    const { getByTestId } = render(<SearchBar value="" onChange={() => {}} />);
    expect(getByTestId('search-input')).toBeTruthy();
  });

  it('llama a onChange al escribir texto', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(<SearchBar value="" onChange={onChangeMock} />);

    fireEvent.changeText(getByTestId('search-input'), 'Matrix');
    expect(onChangeMock).toHaveBeenCalledWith('Matrix');
  });

  it('muestra el botón de limpiar y lo activa', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(<SearchBar value="Batman" onChange={onChangeMock} />);

    act(() => {
      fireEvent.press(getByTestId('clear-button'));
    });

    expect(onChangeMock).toHaveBeenCalledWith('');
  });
});
