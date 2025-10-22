
### Backend
* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [JSON Web Token (JWT)](https://jwt.io/) para autenticação
* [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) para hashing de senhas
* [express-validator](https://express-validator.github.io/) для validação de dados

### Frontend
* [React](https://react.dev/)
* [Vite](https://vitejs.dev/) como ambiente de desenvolvimento
* [React Router DOM](https://reactrouter.com/) para gerenciamento de rotas
* [Axios](https://axios-http.com/) para requisições HTTP
* [React Context API](https://react.dev/reference/react/createContext) para gerenciamento de estado global (Autenticação e URL da API)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
* [npm](https://www.npmjs.com/) (geralmente instalado junto с Node.js)

## 🚀 Instalação e Configuração

Siga os passos abaixo para configurar e rodar o projeto localmente.

### 1. Configuração do Backend

Primeiro, vamos configurar o servidor.

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências
npm install
```

3.  **Crie o arquivo de ambiente.** O backend precisa de um arquivo `.env` para armazenar variáveis sensíveis. Crie um arquivo chamado `.env` dentro da pasta `backend` e adicione o seguinte conteúdo.

    **Arquivo: `/backend/.env`**
    # Porta e Host do servidor
    PORT=3000
    HOST=0.0.0.0

    # Segredo para a assinatura do JWT (use uma frase longa e aleatória)
    JWT_SECRET=h6m4b/tEKO&0N4WO+qAvJI5d?/Wb

    # Tempo de expiração do token em segundos (3600s = 1 hora)
    JWT_EXPIRES_IN=3600
    ```

### 2. Configuração do Frontend

Agora, vamos configurar a interface do usuário.

```bash
# 1. Em um NOVO terminal, navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install
```

O frontend não precisa de um arquivo `.env` obrigatório para iniciar. No entanto, navegue até a pasta src/api/axios.js e alterea baseURL adicionando o ip e porta a serem utilizados na conexão com o servidor. Ex.: baseURL: 'http://26.12.52.22:21150'

## ▶️ Como Rodar a Aplicação

Para que o sistema funcione, **ambos os servidores (backend e frontend) precisam estar rodando ao mesmo tempo**. Você precisará de **dois terminais** abertos.

**Terminal 1 - Rodando o Backend:**
```bash
# Dentro da pasta /backend
npm run dev
```
> O terminal deverá exibir: `Servidor rodando em http://0.0.0.0:22000`

**Terminal 2 - Rodando o Frontend:**
```bash
# Dentro da pasta /frontend
npm run dev
```
> O terminal te dará uma URL para acessar a aplicação no navegador, geralmente `http://localhost:5173`.

## 🕹️ Utilização Básica

1.  Abra o seu navegador e acesse a URL fornecida pelo Vite (ex: `http://localhost:5173`).
2.  Você será direcionado para a tela de **Login**.
4.  Como não há usuários, vá para a tela de **Cadastro** (utilize o link na Navbar) e crie uma nova conta.
5.  Após o cadastro, volte para a tela de Login e entre com suas credenciais.
6.  Uma vez logado, você terá acesso às rotas protegidas, como a página de **Perfil**, onde poderá visualizar, editar e excluir seus dados.
