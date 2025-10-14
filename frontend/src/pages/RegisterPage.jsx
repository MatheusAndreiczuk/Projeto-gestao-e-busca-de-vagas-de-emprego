import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário após o sucesso
import apiClient from '../api/axios'; // Nosso cliente Axios pré-configurado
import './RegisterPage.css'; // Um arquivo de CSS para estilização básica

const RegisterPage = () => {
  const navigate = useNavigate(); // Hook para navegação

  // Estado para armazenar todos os dados do formulário em um único objeto
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
  });

  // Estados para feedback ao usuário
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com a mudança em qualquer campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setError(null); // Limpa erros anteriores
    setIsLoading(true); // Indica que a requisição está em andamento

    // O protocolo diz que email, phone, etc., são opcionais.
    // Se um campo opcional não for preenchido, não o enviamos.
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
      // Fazendo a chamada POST para o endpoint /users com os dados do formulário
      const response = await apiClient.post('/users', payload);

      // Se a requisição for bem-sucedida (status 201)
      console.log('Usuário cadastrado:', response.data);
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login'); // Redireciona para a página de login

    } catch (err) {
      // Se o backend retornar um erro
      console.error("Erro no cadastro:", err);

      // Axios coloca a resposta de erro em 'err.response'
      if (err.response && err.response.data && err.response.data.message) {
        // Pega a mensagem de erro específica do nosso backend (ex: "Username already exists")
        setError(err.response.data.message);
      } else {
        // Erro genérico
        setError('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Crie sua Conta</h2>
        
        {/* Campo Nome (Obrigatório) */}
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

        {/* Campo Username (Obrigatório) */}
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

        {/* Campo Senha (Obrigatório) */}
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

        {/* Campo Email (Opcional) */}
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

        {/* Campo Telefone (Opcional) */}
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

        {/* Campo Experiência (Opcional) */}
        <div className="form-group">
          <label htmlFor="experience">Experiência (Opcional)</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        {/* Campo Educação (Opcional) */}
        <div className="form-group">
          <label htmlFor="education">Educação (Opcional)</label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        {/* Exibição de mensagem de erro */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;