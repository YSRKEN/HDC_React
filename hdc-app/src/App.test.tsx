import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/OutputGraph', () => ({ default: () => <div data-testid='output-graph' /> }));

it('主要画面の要素が表示される', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '艦娘大破率計算機' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  expect(screen.getByTestId('output-graph')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
