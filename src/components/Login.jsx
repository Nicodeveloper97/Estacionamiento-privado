import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Api';
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
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen">
        <div className="w-full max-w-md space-y-8 animate-fade-up">
          <div className="text-center">
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900">¡Qué bueno <br /> verte de nuevo!</h2>
            <p className="mt-2 text-sm text-gray-500">Nos alegra que estés aquí.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              
              <div>
                <label htmlFor="username" className="sr-only">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                    <FaUser className="h-6 w-6 text-blue-600" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="email"
                    required
                    className={`w-full px-4 py-3 pl-14 border ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7] focus:border-transparent transition-all duration-300`}
                    placeholder="ejemplo@correo.com"
                    value={username}
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && <p className="mt-2 text-sm text-red-500">{emailError}</p>}
              </div>

              
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                    <FaLock className="h-6 w-6 text-blue-600" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`w-full px-4 py-3 pl-14 border ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B00B7] focus:border-transparent transition-all duration-300`}
                    placeholder="********"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                {passwordError && <p className="mt-2 text-sm text-red-500">{passwordError}</p>}
              </div>
            </div>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            {successMessage && <p className="text-center text-sm text-green-500">{successMessage}</p>}

            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 text-white bg-blue-600 rounded-md "
              >
                Acceder
              </button>
            </div>
          </form>
        </div>
      </div>

      
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={loginImage}
          alt="Estacionamiento privado"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}