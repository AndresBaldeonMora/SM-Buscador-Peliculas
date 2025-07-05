import React from 'react';
import { render } from '@testing-library/react-native';
import Loader from '../Loader';

describe('Loader component', () => {
  it('se renderiza correctamente con el ActivityIndicator', () => {
    const { getByTestId } = render(<Loader />);
    expect(getByTestId('loader-indicator')).toBeTruthy();
  });
});
