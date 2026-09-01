import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api.types';

/**
 * Normalise les erreurs issues d'Axios ou d'un échec réseau pour l'interface utilisateur.
 */
export function parseApiError(error: unknown): ApiErrorResponse {
  if ((error as AxiosError)?.isAxiosError) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data;

    return {
      message: responseData?.message || axiosError.message || 'Une erreur est survenue.',
      errors: responseData?.errors || undefined,
      statusCode: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Une erreur inconnue est survenue.',
  };
}
