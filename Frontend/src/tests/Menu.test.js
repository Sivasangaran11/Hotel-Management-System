// Menu.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from '../Components/Menu';

jest.mock('axios');

// Mock import.meta.env
beforeAll(() => {
  process.env.VITE_BACKEND_URI = 'http://mock-backend-uri'; // Use your actual backend URI for testing
});
const mockFoodItems = [
  { _id: '1', ItemName: 'Pizza', price: 200, source: 'pizza.jpg' },
  { _id: '2', ItemName: 'Burger', price: 100, source: 'burger.jpg' },
];

test('renders loading gif while fetching data', () => {
  axios.get.mockImplementationOnce(() => new Promise(() => {}));
  render(
    <Router>
      <Menu selectedFood={() => {}} VisibleCart={() => {}} />
    </Router>
  );
  const loadingGif = screen.getByAltText('Loading...');
  expect(loadingGif).toBeInTheDocument();
});

test('renders food items after fetching data', async () => {
  axios.get.mockResolvedValue({ data: mockFoodItems });
  render(
    <Router>
      <Menu selectedFood={() => {}} VisibleCart={() => {}} />
    </Router>
  );
  await waitFor(() => {
    const pizza = screen.getByText('Pizza');
    const burger = screen.getByText('Burger');
    expect(pizza).toBeInTheDocument();
    expect(burger).toBeInTheDocument();
  });
});

test('adds item to cart when "Add" button is clicked', async () => {
  axios.get.mockResolvedValue({ data: mockFoodItems });
  render(
    <Router>
      <Menu selectedFood={() => {}} VisibleCart={() => {}} />
    </Router>
  );
  await waitFor(() => {
    const addButton = screen.getAllByText('Add')[0];
    fireEvent.click(addButton);
    const addedButton = screen.getByText('Added');
    expect(addedButton).toBeInTheDocument();
  });
});
