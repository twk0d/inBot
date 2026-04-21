import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api.client';
import type { Address } from '../types';

export function useAddressLookup(cep: string) {
  const cleanCep = cep.replace(/\D/g, '');
  const isValid = cleanCep.length === 8;

  const { data: address, isLoading, error } = useQuery<Address>({
    queryKey: ['address', cleanCep],
    queryFn: async () => {
      const response = await api.get(`/address/cep/${cleanCep}`);
      return response.data;
    },
    enabled: isValid,
    staleTime: 1000 * 60 * 60, // 1 hour cache
    retry: false, // Don't retry address lookups
  });

  return { 
    address: isValid ? address : null, 
    isLoading: isValid && isLoading, 
    error: error ? (error as any).response?.data?.message || 'Failed to fetch address' : null 
  };
}
