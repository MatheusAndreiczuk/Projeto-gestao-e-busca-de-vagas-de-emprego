import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor (Provider) do Contexto
// Este componente irá "envolver" nossa aplicação e prover o estado de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Pega o token do localStorage ao iniciar

  // Efeito para definir o token no header do Axios sempre que ele mudar
  useEffect(() => {
    if (token) {
      // Armazena o token para persistir a sessão entre reloads da página
      localStorage.setItem('authToken', token);
      // Define o header de autorização para todas as futuras requisições do apiClient
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Remove o token se ele for nulo (logout)
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);


  // A função de login
  const login = async (username, password) => {
    try {
      // Segue o protocolo: POST /login com username e password
      const response = await apiClient.post('/login', { username, password });
      
      // Pega o token da resposta
      const { token: authToken } = response.data;
      
      // Atualiza o estado do token, o que dispara o useEffect acima
      setToken(authToken);

      // (Opcional, mas recomendado) Buscar os dados do usuário após o login para ter no contexto
      // Para isso, precisaríamos decodificar o token ou fazer outra chamada à API
      // Por agora, vamos manter simples.

      return true; // Sucesso
    } catch (error) {
      console.error("Falha no login", error);
      // Limpa o token em caso de falha para garantir que não haja estado inválido
      setToken(null);
      // Propaga o erro para que a página de login possa exibi-lo
      throw error;
    }
  };

  // A função de logout
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // O valor que será provido para todos os componentes filhos
  const value = {
    token,
    user,
    isAuthenticated: !!token, // Um booleano simples para verificar se há um token
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Cria um hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};