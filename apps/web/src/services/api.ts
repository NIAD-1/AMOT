export const API_BASE_URL = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (response.status === 401) {
    localStorage.removeItem('auth-storage');
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    let message = 'An error occurred';
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (e) {
      // Ignore
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function getHeaders(customHeaders: Record<string, string> = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...customHeaders,
  });

  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state.token) {
        headers.set('Authorization', `Bearer ${state.token}`);
      }
    } catch (e) {
      // Ignore
    }
  }
  return headers;
}

export const api = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  post: async (url: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  patch: async (url: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  downloadCsv: async (url: string, filename: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to download file');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
};
