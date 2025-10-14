// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axios';
import './ProfilePage.css'; // Usaremos o mesmo CSS e adicionaremos novos estilos

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({}); // Estado para os dados do formulário de edição
  const [isEditing, setIsEditing] = useState(false); // Controla o modo de edição
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Para mensagens de sucesso

  // Efeito para buscar os dados do usuário ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      // ... (código de busca de dados permanece o mesmo)
      const decodedToken = parseJwt(token);
      if (!decodedToken || !decodedToken.sub) {
        setError("Token inválido.");
        setIsLoading(false);
        return;
      }
      
      const userId = decodedToken.sub;
      try {
        const response = await apiClient.get(`/users/${userId}`);
        setUserData(response.data);
        setEditData(response.data); // Preenche o formulário de edição com os dados atuais
      } catch (err) {
        setError("Não foi possível carregar os dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  // Função para lidar com a mudança nos campos do formulário de edição
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para salvar as alterações (UPDATE)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      experience: editData.experience,
      education: editData.education,
    };
    if (editData.newPassword) {
      payload.password = editData.newPassword;
    }

    try {
      await apiClient.put(`/users/${userData.id}`, payload);
      // Recarrega os dados do usuário para garantir consistência
      const response = await apiClient.get(`/users/${userData.id}`);
      setUserData(response.data);
      setEditData(response.data);

      setIsEditing(false);
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar:", err.response); // Log completo do erro no console

      // LÓGICA DE ERRO APRIMORADA
      if (err.response && err.response.status === 422) {
        // Se for um erro de validação (422)
        const errorDetails = err.response.data.details;
        const firstError = errorDetails[0];
        // Cria uma mensagem de erro mais específica
        setError(`Erro de validação no campo '${firstError.field}': ${firstError.error}`);
      } else {
        // Para outros tipos de erro
        setError("Falha ao atualizar o perfil. Verifique os dados e a conexão.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar a conta (DELETE)
  const handleDelete = async () => {
    // Pedido de confirmação é crucial para uma ação destrutiva
    if (window.confirm("Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      setIsLoading(true);
      setError(null);
      try {
        await apiClient.delete(`/users/${userData.id}`);
        alert("Conta excluída com sucesso.");
        logout(); // Limpa o contexto de autenticação
        navigate('/login'); // Redireciona para o login
      } catch (err) {
        setError("Não foi possível excluir a conta.");
        setIsLoading(false);
      }
    }
  };

  // Renderização condicional enquanto os dados carregam
  if (isLoading && !userData) {
    return <div>Carregando perfil...</div>;
  }

  // Renderização de erro
  if (error && !isEditing) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Perfil de Usuário</h2>
        {success && <p className="success-message">{success}</p>}

        {isEditing ? (
          // MODO DE EDIÇÃO: Formulário
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" name="name" value={editData.name || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Username</label>
                <input type="text" value={userData.username || ''} disabled title="O nome de usuário não pode ser alterado." />
            </div>
            <div className="form-group">
              <label>Nova Senha (deixe em branco para não alterar)</label>
              <input type="password" name="newPassword" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={editData.email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" name="phone" value={editData.phone || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Educação</label>
              <textarea name="education" value={editData.education || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Experiência</label>
              <textarea name="experience" value={editData.experience || ''} onChange={handleChange} />
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <div className="profile-actions">
              <button type="submit" className="btn-save" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</button>
              <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          // MODO DE VISUALIZAÇÃO: Dados do perfil
          <>
            <p><strong>Nome:</strong> {userData?.name}</p>
            <p><strong>Username:</strong> {userData?.username}</p>
            <p><strong>Email:</strong> {userData?.email || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {userData?.phone || 'Não informado'}</p>
            <p><strong>Educação:</strong> {userData?.education || 'Não informado'}</p>
            <p><strong>Experiência:</strong> {userData?.experience || 'Não informado'}</p>
            
            <div className="profile-actions">
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Editar Perfil</button>
              <button className="btn-delete" onClick={handleDelete} disabled={isLoading}>{isLoading ? 'Excluindo...' : 'Excluir Conta'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;