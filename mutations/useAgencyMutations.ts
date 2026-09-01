import { useState } from 'react';
import { agencyService } from '../services/agency.service';
import { CreateAgencyInput, AgencyResponse } from '../types/agency.types';
import { ApiErrorResponse } from '../types/api.types';
import { parseApiError } from '../utils/error.utils';

export function useAgencyMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const createAgencyMutation = async (data: CreateAgencyInput): Promise<AgencyResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await agencyService.createAgency(data);
      return response;
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      throw parsedError;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createAgencyMutation,
  };
}
