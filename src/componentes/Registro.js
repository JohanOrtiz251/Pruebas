import React, { useState } from "react";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Registro = ({ darkMode, toggleDarkMode }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: '',
        celular: ''
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                title: 'Error al registrar el usuario',
                text: 'Las contraseñas no coinciden',
                icon: 'error'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/registro', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });

            const responseData = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Usuario registrado con éxito',
                    icon: 'success'
                });
                setFormData({
                    nombres: '',
                    apellidos: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    celular: ''
                });
            } else {
                throw new Error(responseData.error || 'Error al registrar el usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error al registrar el usuario',
                text: error.message || 'Por favor, intenta nuevamente más tarde',
                icon: 'error'
            });
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Registro de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            placeholder="Nombres"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            placeholder="Apellidos"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Correo electrónico"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmar contraseña"
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                        <input
                            type="text"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChange}
                            placeholder="Celular"
                            className="p-3 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-md w-full"
                    >
                        Registrar
                    </button>
                </form>
                <p className="mt-4 text-center">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500 hover:underline">Inicia sesión aquí</Link>
                </p>
            </div>
        </section>
    );
}

export default Registro;
