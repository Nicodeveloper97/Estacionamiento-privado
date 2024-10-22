const API_URL = '/fapi/auth/login/';

export const login = async (username, password) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Error en la autenticación');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la llamada a la API:', error);
    throw error;
  }
};