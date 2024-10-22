import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import columnsServices from "../services/columnsServices";
import boardServices from "../services/boardServices";
import cardsServices from "../services/cardsServices";

const getColumnTool = new DynamicStructuredTool({
  name: "getColumn",
  description: "Obtém uma coluna pelo ID fornecido.",
  schema: z.object({
    columnID: z.string().describe("O ID da coluna que deseja obter."),
  }),
  func: async ({ columnID }: { columnID: string }) => {
    try {
      const column = await columnsServices.getColumn(columnID);
      return `Coluna obtida com sucesso: ${JSON.stringify(column)}`;
    } catch (e: any) {
      return `Erro ao obter coluna: ${e.message}`;
    }
  },
});

export const getAllColumnsTool = new DynamicStructuredTool({
  name: "getAllColumns",
  description: "Obtém todos os dados (id, titulo, posição, id do quadro e quando foi criado) de todas as colunas de um quadro pelo ID do quadro fornecido.",
  schema: z.object({
    boardID: z.string().describe("O ID do quadro de onde as colunas serão obtidas."),
  }),
  func: async ({ boardID }: { boardID: string }) => {
    try {
      const columns = await columnsServices.getAllColumnsByBoardId(boardID);
      
      return `Colunas obtidas com sucesso: ${JSON.stringify(columns)}`;
    } catch (e: any) {
      return `Erro ao obter colunas: ${e.message}`;
    }
  },
});

const createColumnTool = new DynamicStructuredTool({
  name: "createColumn",
  description: "Cria uma nova coluna com o título fornecido.",
  schema: z.object({
    title: z.string().min(1).describe("O título da nova coluna."),
    boardID: z.string().describe("O ID do quadro onde a coluna será criada."),
  }),
  func: async ({ title, boardID }: { title: string; boardID: string }) => {
    try {
      const titleTrimmed = title.trim();
      const column = await columnsServices.createColumn(titleTrimmed, boardID);
      return `Coluna criada com sucesso: ${JSON.stringify(column)}`;
    } catch (e: any) {
      return `Erro ao criar coluna: ${e.message}`;
    }
  },
});

const deleteColumnTool = new DynamicStructuredTool({
  name: "deleteColumn",
  description: "Deleta uma coluna pelo ID fornecido.",
  schema: z.object({
    columnID: z.string().describe("O ID da coluna que deseja deletar."),
  }),
  func: async ({ columnID }: { columnID: string }) => {
    try {
      const column = await columnsServices.deleteColumn(columnID);
      return `Coluna deletada com sucesso: ${JSON.stringify(column)}`;
    } catch (e: any) {
      return `Erro ao deletar coluna: ${e.message}`;
    }
  },
});

const getMembersByBoardTool = new DynamicStructuredTool({
  name: "getMembersByBoard",
  description: "Obtém os dados (id, nome e email) dos membros de um quadro pelo ID do quadro.",
  schema: z.object({
    boardID: z.string().describe("O ID do quadro cujos membros deseja obter."),
  }),
  func: async ({ boardID }: { boardID: string }) => {
    try {
      const members = await boardServices.getMembersByBoard(boardID);
      return `Membros obtidos com sucesso: ${JSON.stringify(members)}`;
    } catch (e: any) {
      return `Erro ao obter membros: ${e.message}`;
    }
  },
});

const getCardTool = new DynamicStructuredTool({
  name: "getCard",
  description: "Obtém um card pelo ID fornecido.",
  schema: z.object({
    cardID: z.string().describe("O ID do card que deseja obter."),
  }),
  func: async ({ cardID }: { cardID: string }) => {
    try {
      const card = await cardsServices.getCard(cardID);
      return `Card obtido com sucesso: ${JSON.stringify(card)}`;
    } catch (e: any) {
      return `Erro ao obter card: ${e.message}`;
    }
  },
});

const createCardTool = new DynamicStructuredTool({
  name: "createCard",
  description: "Cria um novo card com o título, descrição, prioridade (Nenhuma, Baixa, Média, Alta) e ID da coluna fornecidos.",
  schema: z.object({
    title: z.string().min(1).default("Card").describe("O título do card. Padrão: Card"),
    description: z.string().default("").describe("A descrição do card. Valor padrão é ser vazio."),
    priority: z.string().default("Nenhuma").describe("A prioridade do card. Deve ser valores que estejam nessa lista: Nenhuma, Baixa, Média, Alta. Padrão: Nenhuma"),
    columnID: z.string().describe("O ID da coluna onde o card será criado."),
  }),
  func: async ({ title, description, priority, columnID }: { title: string; description: string; priority: string; columnID: string }) => {
    try {
      const titleTrimmed = title.trim();
      const descriptionTrimmed = description.trim();
      const newCard = await cardsServices.createCard(titleTrimmed, descriptionTrimmed, priority, columnID);
      return `Card criado com sucesso: ${JSON.stringify(newCard)}`;
    } catch (e: any) {
      return `Erro ao criar card: ${e.message}`;
    }
  },
});

const deleteCardTool = new DynamicStructuredTool({
  name: "deleteCard",
  description: "Deleta um card pelo ID fornecido.",
  schema: z.object({
    cardID: z.string().describe("O ID do card que deseja deletar."),
  }),
  func: async ({ cardID }: { cardID: string }) => {
    try {
      const deletedCard = await cardsServices.deleteCard(cardID);
      return `Card deletado com sucesso: ${JSON.stringify(deletedCard)}`;
    } catch (e: any) {
      return `Erro ao deletar card: ${e.message}`;
    }
  },
});

const getCardsByUserTool = new DynamicStructuredTool({
  name: "getCardsByUser",
  description: "Obtém os cards de um usuário pelo ID do usuário.",
  schema: z.object({
    userID: z.string().describe("O ID do usuário cujos cards deseja obter."),
  }),
  func: async ({ userID }: { userID: string }) => {
    try {
      const cards = await cardsServices.getCardsByUser(userID);
      return `Cards obtidos com sucesso: ${JSON.stringify(cards)}`;
    } catch (e: any) {
      return `Erro ao obter cards: ${e.message}`;
    }
  },
});

const getMembersByCardTool = new DynamicStructuredTool({
  name: "getMembersByCard",
  description: "Obtém os membros de um card pelo ID do card.",
  schema: z.object({
    cardID: z.string().describe("O ID do card cujos membros deseja obter."),
  }),
  func: async ({ cardID }: { cardID: string }) => {
    try {
      const members = await cardsServices.getMembersByCard(cardID);
      return `Membros do card obtidos com sucesso: ${JSON.stringify(members)}`;
    } catch (e: any) {
      return `Erro ao obter membros do card: ${e.message}`;
    }
  },
});

export const addMemberCardTool = new DynamicStructuredTool({
  name: "addMemberCard",
  description: "Adiciona um membro a um card pelo ID do card e e-mail do membro.",
  schema: z.object({
    cardID: z.string().describe("O ID do card."),
    emailUser: z.string().email().describe("O e-mail do usuário a ser adicionado."),
  }),
  func: async ({ cardID, emailUser }: { cardID: string; emailUser: string }) => {
    try {
      const newMember = await cardsServices.addMemberCard(cardID, emailUser);
      return `Membro adicionado com sucesso: ${JSON.stringify(newMember)}`;
    } catch (e: any) {
      return `Erro ao adicionar membro: ${e.message}`;
    }
  },
});

const removeMemberCardTool = new DynamicStructuredTool({
  name: "removeMemberCard",
  description: "Remove um membro de um card pelo ID do card e ID do membro.",
  schema: z.object({
    cardID: z.string().describe("O ID do card."),
    memberID: z.string().describe("O ID do membro a ser removido."),
  }),
  func: async ({ cardID, memberID }: { cardID: string; memberID: string }) => {
    try {
      const removedMember = await cardsServices.removeMemberCard(cardID, memberID);
      return `Membro removido com sucesso: ${JSON.stringify(removedMember)}`;
    } catch (e: any) {
      return `Erro ao remover membro: ${e.message}`;
    }
  },
});

const getAllCardsByColumnTool = new DynamicStructuredTool({
  name: "getAllCardsByColumn",
  description: "Obtém todos os cards de uma coluna pelo ID da coluna fornecido.",
  schema: z.object({
    columnID: z.string().describe("O ID da coluna cujos cards deseja obter."),
  }),
  func: async ({ columnID }: { columnID: string }) => {
    try {
      const cards = await cardsServices.getAllCardsByColumn(columnID);
      return `Cards obtidos com sucesso: ${JSON.stringify(cards)}`;
    } catch (e: any) {
      return `Erro ao obter cards: ${e.message}`;
    }
  },
});

const updateCardTool = new DynamicStructuredTool({
  name: "updateCard",
  description: "Atualiza um card com título, descrição e prioridade fornecidos.",
  schema: z.object({
    cardID: z.string().describe("O ID do card que deseja atualizar."),
    title: z.string().min(1).describe("O novo título do card."),
    description: z.string().describe("A nova descrição do card."),
    priority: z.string().describe("A nova prioridade do card (Nenhuma, Baixa, Média, Alta)."),
    column_id: z.string().describe("O ID da nova coluna para onde o card vai ser movido.")
  }),
  func: async ({ cardID, title, description, priority, column_id }: { cardID: string; title: string; description: string; priority: string; column_id: string }) => {
    try {
      const updatedCard = await cardsServices.updateCard(cardID, title, description, priority, column_id);
      return `Card atualizado com sucesso: ${JSON.stringify(updatedCard)}`;
    } catch (e: any) {
      return `Erro ao atualizar card: ${e.message}`;
    }
  },
});

const getColumnsAndCardsByBoardTool = new DynamicStructuredTool({
  name: "getColumnsAndCardsByBoard",
  description: "Obtém todas as colunas e seus respectivos cards de um quadro pelo ID do quadro fornecido.",
  schema: z.object({
    boardID: z.string().describe("O ID do quadro cujas colunas e cards deseja obter."),
  }),
  func: async ({ boardID }: { boardID: string }) => {
    try {
      const board = await boardServices.getColumnsAndCardsByBoard(boardID);
      return `Colunas e cards obtidos com sucesso: ${JSON.stringify(board)}`;
    } catch (e: any) {
      return `Erro ao obter colunas e cards: ${e.message}`;
    }
  },
});

export const tools = [
  createColumnTool,
  getColumnTool,
  getAllColumnsTool,
  deleteColumnTool,
  getMembersByBoardTool,
  getCardTool,
  createCardTool,
  deleteCardTool,
  getCardsByUserTool,
  getMembersByCardTool,
  addMemberCardTool,
  removeMemberCardTool,
  getAllCardsByColumnTool,
  updateCardTool,
  getColumnsAndCardsByBoardTool,
];

export const toolsByName = {
  createColumn: createColumnTool,
  getColumn: getColumnTool,
  getAllColumns: getAllColumnsTool,
  deleteColumn: deleteColumnTool,
  getMembersByBoard: getMembersByBoardTool,
  getCard: getCardTool,
  createCard: createCardTool,
  deleteCard: deleteCardTool,
  getCardsByUser: getCardsByUserTool,
  getMembersByCard: getMembersByCardTool,
  addMemberCard: addMemberCardTool,
  removeMemberCard: removeMemberCardTool,
  getAllCardsByColumn: getAllCardsByColumnTool,
  updateCard: updateCardTool,
  getColumnsAndCardsByBoard: getColumnsAndCardsByBoardTool,
};