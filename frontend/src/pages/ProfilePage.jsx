import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axios';
import './ProfilePage.css';

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
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
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
        setEditData(response.data); 
      } catch (err) {
        setError("Não foi possível carregar os dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.sub) {
      setError("Sessão inválida. Por favor, faça login novamente.");
      setIsLoading(false);
      return;
    }
    const userId = decodedToken.sub;

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
      await apiClient.patch(`/users/${userId}`, payload);
      const response = await apiClient.get(`/users/${userId}`);
      setUserData(response.data);
      setEditData(response.data);

      setIsEditing(false);
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar:", err.response); 

      if (err.response && err.response.status === 422) {
        const errorDetails = err.response.data.details;
        const firstError = errorDetails[0];
        setError(`Erro de validação no campo '${firstError.field}': ${firstError.error}`);
      } else {
        setError("Falha ao atualizar o perfil. Verifique os dados e a conexão.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
     const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.sub) {
      setError("Sessão inválida. Por favor, faça login novamente.");
      setIsLoading(false);
      return;
    }
    const userId = decodedToken.sub;
    if (window.confirm("Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      setIsLoading(true);
      setError(null);
      try {
        await apiClient.delete(`/users/${userId}`);
        alert("Conta excluída com sucesso.");
        logout();
        navigate('/login'); 
      } catch (err) {
        setError("Não foi possível excluir a conta.");
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !userData) {
    return <div>Carregando perfil...</div>;
  }

  if (error && !isEditing) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Perfil de Usuário</h2>
        {success && <p className="success-message">{success}</p>}

        {isEditing ? (
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
              <label>Nova Senha</label>
              <input 
                type="password" 
                name="newPassword" 
                value={editData.newPassword || ''} 
                onChange={handleChange} 
                required 
                minLength="3"
                maxLength="20"
                pattern="[a-zA-Z0-9_.\\-]{3,20}"
                title="A senha deve ter entre 3 e 20 caracteres e não pode conter espaços ou caracteres especiais (permitidos: letras, números, _, ., -)"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={editData.email || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input 
                type="tel" 
                name="phone" 
                value={editData.phone || ''} 
                onChange={handleChange} 
                inputMode="numeric"
                title="Informe apenas números (10 a 14 dígitos)"
              />
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