import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactList } from './ContactList';
import { AuthProvider } from '../../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Contacts Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('@inbot:token', 'fake-token');
    localStorage.setItem('@inbot:user', JSON.stringify({ id: '1', name: 'Test User', email: 'test@example.com' }));
  });

  it('should list contacts', async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <AuthProvider>
          <BrowserRouter>
            <ContactList />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should fill address automatically when CEP is entered', async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <ContactList />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.click(await screen.findByRole('button', { name: /Add Contact/i }));

    const cepInput = screen.getByLabelText(/CEP/i);
    fireEvent.change(cepInput, { target: { value: '01001000' } });

    await waitFor(() => {
      expect((screen.getByLabelText(/Street/i) as HTMLInputElement).value).toBe('Praça da Sé');
      expect((screen.getByLabelText(/City/i) as HTMLInputElement).value).toBe('São Paulo');
    });
  });

  it('should create a new contact', async () => {
    render(
      <QueryClientProvider client={createQueryClient()}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <ContactList />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.click(await screen.findByRole('button', { name: /Add Contact/i }));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '11988887777' } });
    fireEvent.change(screen.getByLabelText(/CEP/i), { target: { value: '01001000' } });
    
    await waitFor(() => {
      expect((screen.getByLabelText(/Street/i) as HTMLInputElement).value).toBe('Praça da Sé');
    });

    fireEvent.change(screen.getByLabelText(/Number/i), { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /Create Contact/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Contact created!/i)).toBeInTheDocument();
    });
  });
});
