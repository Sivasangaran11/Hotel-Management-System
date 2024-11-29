
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Cart from '../Components/Menu';

jest.mock('axios');

const mockCartItems = [
  { _id: '1', ItemName: 'Pizza', price: 200, source: 'pizza.jpg', quantity: 1 },
  { _id: '2', ItemName: 'Burger', price: 100, source: 'burger.jpg', quantity: 2 },
];

beforeEach(() => {
  sessionStorage.setItem('selectedItems', JSON.stringify(mockCartItems));
});

afterEach(() => {
  sessionStorage.clear();
});

test('renders cart items from session storage', () => {
  render(
    <Router>
      <Cart VisibleCart={() => {}} userId="123" />
    </Router>
  );
  const pizza = screen.getByText('Pizza');
  const burger = screen.getByText('Burger');
  expect(pizza).toBeInTheDocument();
  expect(burger).toBeInTheDocument();
});

test('increases item quantity when "+" button is clicked', () => {
  render(
    <Router>
      <Cart VisibleCart={() => {}} userId="123" />
    </Router>
  );
  const plusButton = screen.getAllByText('+')[0];
  fireEvent.click(plusButton);
  const updatedQuantity = screen.getAllByText('2')[0];
  expect(updatedQuantity).toBeInTheDocument();
});

test('decreases item quantity when "-" button is clicked', () => {
  render(
    <Router>
      <Cart VisibleCart={() => {}} userId="123" />
    </Router>
  );
  const minusButton = screen.getAllByText('-')[0];
  fireEvent.click(minusButton);
  const updatedQuantity = screen.getAllByText('0')[0];
  expect(updatedQuantity).toBeInTheDocument();
});

test('removes item from cart when "trash" button is clicked', () => {
  render(
    <Router>
      <Cart VisibleCart={() => {}} userId="123" />
    </Router>
  );
  const trashButton = screen.getAllByLabelText('bx bxs-trash-alt')[0];
  fireEvent.click(trashButton);
  const pizza = screen.queryByText('Pizza');
  expect(pizza).not.toBeInTheDocument();
});

test('submits cart items and navigates to "congrats" page', async () => {
  axios.post.mockResolvedValue({ data: { success: true } });
  const { container } = render(
    <Router>
      <Cart VisibleCart={() => {}} userId="123" />
    </Router>
  );
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      `${backendUri}/api/cart`,
      expect.any(Array)
    );
  });
});
