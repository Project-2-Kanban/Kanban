# TOTH

## O que é?

O **Toth** é uma aplicação de gerenciamento de projetos no estilo **Kanban**, desenvolvida para ajudar equipes a organizar e acompanhar o andamento de tarefas de forma simples e eficiente. Com **Toth**, você pode criar quadros para diferentes projetos, adicionar membros e colaborar em tempo real. Além disso, o projeto utiliza a biblioteca **LangChain** para integrar uma **IA** que facilita a criação e edição de listas e cards, tornando o gerenciamento ainda mais ágil e inteligente.

## Funcionalidades

- Criar quadros para diferentes projetos
- Adicionar membros aos quadros
- Criar, editar e gerenciar listas e cards
- Atribuir **prioridades** aos cards: **nenhuma**, **baixa**, **média** ou **alta**
- Adicionar membros responsáveis a cada card
- Mover cards entre colunas para organizar o progresso das tarefas
- **Não** é possível mover as colunas, garantindo que a estrutura dos quadros seja fixa
- Suporte à colaboração em equipe
- **Atualizações em tempo real** com **WebSocket**, permitindo que os colaboradores vejam as mudanças no board instantaneamente
- Integração com IA, utilizando **LangChain**, para facilitar a criação de listas e cards

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Yarn](https://yarnpkg.com/)

## Como rodar o projeto?

Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento:

1. Clone este repositório:

   ```bash
   git clone https://github.com/Project-2-Kanban/kanban.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd kanban
   ```

3. Execute o Docker Compose na raiz do projeto para subir os containers:

   ```bash
   docker-compose up
   ```

   Isso vai iniciar os serviços necessários, como o **Node.js**, **PostgreSQL** e **Redis**.

4. Em outro terminal, navegue até o diretório `client` para iniciar o frontend da aplicação:

   ```bash
   cd client
   yarn install
   yarn start
   ```

## Estrutura do Projeto

- **Backend**: Um servidor Node.js gerencia a lógica de negócio e as interações com o banco de dados PostgreSQL.
- **Frontend**: Uma aplicação React para a interface do usuário, que se comunica com o backend.
- **Banco de Dados**: PostgreSQL é usado para armazenar os dados dos quadros, listas, cards e usuários.
- **Cache**: Redis é utilizado para otimizar o desempenho e lidar com atualizações em tempo real.
- **Atualizações em Tempo Real**: Utilizamos **WebSocket** para que todas as modificações feitas nos boards e listas sejam visíveis instantaneamente para todos os colaboradores.
- **IA**: Utilizamos a biblioteca **LangChain** para adicionar funcionalidades inteligentes à aplicação, permitindo a criação e edição facilitada de listas e cards através de comandos de IA.
