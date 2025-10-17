import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import apiClient from '../api/axios'; 
import './RegisterPage.css'; 

const RegisterPage = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 
    setIsLoading(true); 

    const payload = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
    };

    if (formData.email) payload.email = formData.email;
    if (formData.phone) payload.phone = formData.phone;
    if (formData.experience) payload.experience = formData.experience;
    if (formData.education) payload.education = formData.education;


    try {
      const response = await apiClient.post('/users', payload);

      console.log('Usuário cadastrado:', response.data);
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login'); 

    } catch (err) {
      console.error("Erro no cadastro:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Crie sua Conta</h2>
        
        <div className="form-group">
          <label htmlFor="name">Nome Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (Opcional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefone (Opcional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experiência (Opcional)</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="education">Educação (Opcional)</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;