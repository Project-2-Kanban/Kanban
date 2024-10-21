import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import columnsServices from "../services/columnsServices";
import boardServices from "../services/boardServices";
import cardsServices from "../services/cardsServices";
import { broadcastToRoom } from "../websocket/websocket";

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
      broadcastToRoom(boardID, { action: "create_column", data: JSON.stringify(column) });
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
    board_id: z.string().describe("O id do board onde está sendo feito a exclusão.")
  }),
  func: async ({ columnID, board_id }: { columnID: string, board_id: string }) => {
    try {
      const column = await columnsServices.deleteColumn(columnID);
      broadcastToRoom(board_id, { action: "delete_column", data: JSON.stringify(columnID) });
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
    board_id: z.string().describe("O id do board onde está sendo feito a criação do card.")
  }),
  func: async ({ title, description, priority, columnID, board_id }: { title: string; description: string; priority: string; columnID: string, board_id: string}) => {
    try {
      const titleTrimmed = title.trim();
      const descriptionTrimmed = description.trim();
      const newCard = await cardsServices.createCard(titleTrimmed, descriptionTrimmed, priority, columnID);
      broadcastToRoom(board_id, {
        action: "create_card",
        data: JSON.stringify(newCard)
    });
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
    board_id: z.string().describe("O id do board onde está sendo feito a remoção do card.")
  }),
  func: async ({ cardID, board_id }: { cardID: string, board_id: string }) => {
    try {
      const deletedCard = await cardsServices.deleteCard(cardID);
      broadcastToRoom(board_id, {
        action: "delete_card",
        data: JSON.stringify(cardID)
    });
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
    board_id: z.string().describe("O id do board onde está sendo feito a adição de um membro em um card.")
  }),
  func: async ({ cardID, emailUser, board_id }: { cardID: string; emailUser: string, board_id: string }) => {
    try {
      const newMember = await cardsServices.addMemberCard(cardID, emailUser);
      const filteredUser = {
        id: newMember.user.id,
        name: newMember.user.name,
        email: newMember.user.email
    };
      broadcastToRoom(board_id, {
        action: "add_member_card",
        data: JSON.stringify(filteredUser)
    });
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
    board_id: z.string().describe("O id do board onde está sendo feito a remoção de um membro em um card.")
  }),
  func: async ({ cardID, memberID, board_id }: { cardID: string; memberID: string, board_id: string}) => {
    try {
      const removedMember = await cardsServices.removeMemberCard(cardID, memberID);
      broadcastToRoom(board_id, {
        action: "remove_member_card",
        data: memberID
    });
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
    column_id: z.string().describe("O ID da nova coluna para onde o card vai ser movido."),
    board_id: z.string().describe("O id do board onde está sendo feito a atualização de um card.")
  }),
  func: async ({ cardID, title, description, priority, column_id, board_id}: { cardID: string; title: string; description: string; priority: string; column_id: string, board_id: string }) => {
    try {
      const updatedCard = await cardsServices.updateCard(cardID, title, description, priority, column_id);
      broadcastToRoom(board_id, {
        action: "update_card",
        data: JSON.stringify(updatedCard)
    });
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