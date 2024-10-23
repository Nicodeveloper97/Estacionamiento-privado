import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import loginImage from '../assets/imagen-login.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setEmailError('');
    setPasswordError('');

    if (!validateEmail(username)) {
      setEmailError('No encontramos una cuenta asociada con este correo');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const data = await login(username, password);
      localStorage.setItem('userData', JSON.stringify(data));
      setSuccessMessage('¡Inicio de sesión exitoso!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setError('Error en la autenticación. Por favor, verifica tus credenciales.');
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUsername(email);
    if (validateEmail(email)) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    if (validatePassword(password)) {
      setPasswordError('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sección de imagen */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={loginImage}
          alt="Estacionamiento privado"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B00B7] to-[#3D00FF] opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8 max-w-lg">
            <h1 className="text-5xl font-bold mb-4 shadow-text">Estacionamiento Privado</h1>
            <p className="text-xl shadow-text">Gestiona tu espacio de forma inteligente</p>
          </div>
        </div>
      </div>

      {/* Sección de formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Bienvenido de vuelta</h2>
            <p className="mt-2 text-sm text-gray-600">Inicia sesión en tu cuenta para continuar</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              {/* Campo de correo electrónico */}
              <div>
                <label htmlFor="username" className="sr-only">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                    <FaUser className="h-6 w-6 text-[#1B00B7]" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="email"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-14 border ${
                      emailError ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1B00B7] focus:border-[#1B00B7] focus:z-0 sm:text-sm`}
                    placeholder="ejemplo@correo.com"
                    value={username}
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
              </div>

              {/* Campo de contraseña */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                    <FaLock className="h-6 w-6 text-[#1B00B7]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-14 border ${
                      passwordError ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1B00B7] focus:border-[#1B00B7] focus:z-0 sm:text-sm`}
                    placeholder="********"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>
            </div>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-center text-sm text-green-600">{successMessage}</p>}

            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B00B7] hover:bg-[#3D00FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B00B7]"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaArrowRight className="h-5 w-5 text-[#3D00FF] group-hover:text-[#1B00B7]" />
                </span>
                Acceder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
