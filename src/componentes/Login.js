import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Login = ({ darkMode, toggleDarkMode }) => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    let URL = process.env.REACT_APP_ENVIRONMENT;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                cookies.set('email', email, { path: '/' });
                cookies.set('token', data.token, { path: '/' });
                cookies.set('nombres', data.user.nombres, { path: '/' });
                cookies.set('apellidos', data.user.apellidos, { path: '/' });
                
                navigate('/dashboard');
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
        }
    };

    return (
        <section className="relative bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-md w-full"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p className="mt-4 text-center">
                    ¿No tienes una cuenta? <Link to="/registro" className="text-blue-500 hover:underline">Regístrate aquí</Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
