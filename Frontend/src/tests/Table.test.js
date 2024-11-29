// Table.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { Table } from '../Components/table';

jest.mock('axios');

const mockUserId = 'user123';
const mockTables = [
  { number: 1, accommodation: '4', reserved: false, availableTimeSlots: ['8am-9am', '9am-10am'] },
  { number: 2, accommodation: '4', reserved: false, availableTimeSlots: ['8am-9am', '9am-10am'] },
];

test('renders initial table data correctly', () => {
  render(
    <Router>
      <Table userId={mockUserId} updateBookedTables={() => {}} toggleVisibilityTable={() => {}} />
    </Router>
  );
  const tableElements = screen.getAllByRole('row');
  expect(tableElements).toHaveLength(10); // 9 tables + 1 header row
});

test('reserves a table and updates the UI', async () => {
  axios.post.mockResolvedValue({ data: { success: true } });
  render(
    <Router>
      <Table userId={mockUserId} updateBookedTables={() => {}} toggleVisibilityTable={() => {}} />
    </Router>
  );

  const reserveButtons = screen.getAllByText('Reserve');
  fireEvent.click(reserveButtons[0]);

  const selectElement = screen.getByRole('combobox');
  fireEvent.change(selectElement, { target: { value: '8am-9am' } });

  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  await waitFor(() => {
    const reservedRows = screen.getAllByText(/Reserved/);
    expect(reservedRows).toHaveLength(1);
  });
});

test('shows available time slots in the select dropdown', async () => {
  render(
    <Router>
      <Table userId={mockUserId} updateBookedTables={() => {}} toggleVisibilityTable={() => {}} />
    </Router>
  );

  const reserveButtons = screen.getAllByText('Reserve');
  fireEvent.click(reserveButtons[0]);

  const selectElement = screen.getByRole('combobox');
  const options = screen.getAllByRole('option');

  expect(options).toHaveLength(3); // 2 available time slots + 1 placeholder option
});

test('disables the Confirm button when no time slot is selected', async () => {
  render(
    <Router>
      <Table userId={mockUserId} updateBookedTables={() => {}} toggleVisibilityTable={() => {}} />
    </Router>
  );

  const reserveButtons = screen.getAllByText('Reserve');
  fireEvent.click(reserveButtons[0]);

  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  await waitFor(() => {
    expect(confirmButton).toBeDisabled();
  });
});

test('handles API errors gracefully', async () => {
  axios.post.mockRejectedValue(new Error('Failed to reserve table'));
  render(
    <Router>
      <Table userId={mockUserId} updateBookedTables={() => {}} toggleVisibilityTable={() => {}} />
    </Router>
  );

  const reserveButtons = screen.getAllByText('Reserve');
  fireEvent.click(reserveButtons[0]);

  const selectElement = screen.getByRole('combobox');
  fireEvent.change(selectElement, { target: { value: '8am-9am' } });

  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  await waitFor(() => {
    const errorMessage = screen.queryByText('Failed to reserve table');
    expect(errorMessage).toBeInTheDocument();
  });
});
