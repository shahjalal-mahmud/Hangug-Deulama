/* src/api/client.js
   Centralized Axios instance — every HTTP call in the app goes through
   this client so JWT handling, base URL configuration, and error
   normalization stay in one place. */

import axios from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from './config';

/**
 * Read the latest token from storage. Always re-read on each request so
 * a login / logout in another tab is picked up immediately without
 * needing a full reload.
 */
const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    Accept: 'application/json',
  },
  // 15 s is generous for a small PHP backend and short enough that the
  // UI doesn't appear hung forever if the server is unreachable.
  timeout: 15000,
});

/* Request interceptor — attach Bearer token automatically. */
apiClient.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Lightweight event bus for cross-cutting concerns. The auth layer
   subscribes to this so a 401 from any request triggers an automatic
   logout + redirect without each component having to handle it. */
const listeners = new Set();
export const onUnauthorized = (handler) => {
  listeners.add(handler);
  return () => listeners.delete(handler);
};
const emitUnauthorized = (payload) => {
  listeners.forEach((handler) => {
    try {
      handler(payload);
    } catch {
      /* never let a listener crash the response chain */
    }
  });
};

/**
 * Normalize an Axios error into a plain object the UI can render directly:
 *
 *   {
 *     status,   // HTTP status code (or 0 for network errors)
 *     message,  // top-level human-readable message
 *     errors,   // per-field validation errors OR a domain code
 *   }
 *
 * The backend uses the standard envelope documented in docs/api.md, so
 * when Axios parses a JSON body we forward it as-is. Everything else
 * falls back to sensible defaults.
 */
export const normalizeError = (err) => {
  if (err?.response) {
    const { status, data } = err.response;
    return {
      status,
      message: data?.message || defaultMessageForStatus(status),
      errors: data?.errors || {},
    };
  }

  if (err?.request) {
    return {
      status: 0,
      message: 'Could not reach the server. Check your connection and try again.',
      errors: {},
    };
  }

  return {
    status: -1,
    message: err?.message || 'Unexpected error.',
    errors: {},
  };
};

const defaultMessageForStatus = (status) => {
  switch (status) {
    case 400:
      return 'The request was invalid.';
    case 401:
      return 'Please sign in to continue.';
    case 403:
      return 'You don\u2019t have permission to do that.';
    case 404:
      return 'We couldn\u2019t find what you were looking for.';
    case 409:
      return 'That action conflicts with the current state.';
    case 422:
      return 'Some fields need attention.';
    case 500:
      return 'The server hit an unexpected error. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

/* Response interceptor — translate 401 into a logout signal so the UI
   can react without each caller having to know about auth. */
apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      emitUnauthorized({ status, source: 'axios', message: err?.response?.data?.message });
    }
    return Promise.reject(normalizeError(err));
  }
);

export default apiClient;