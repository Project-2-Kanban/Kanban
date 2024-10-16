import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import columnsServices from "../services/columnsServices";

export const getColumnTool = new DynamicStructuredTool({
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

export const createColumnTool = new DynamicStructuredTool({
  name: "createColumn",
  description: "Cria uma nova coluna com o título e a posição fornecidos.",
  schema: z.object({
    title: z.string().min(1).describe("O título da nova coluna."),
    position: z.number().describe("A posição da nova coluna no quadro."),
    boardID: z.string().describe("O ID do quadro onde a coluna será criada."),
  }),
  func: async ({ title, position, boardID }: { title: string; position: number; boardID: string }) => {
    try {
      const titleTrimmed = title.trim();
      const column = await columnsServices.createColumn(titleTrimmed, position, boardID);
      return `Coluna criada com sucesso: ${JSON.stringify(column)}`;
    } catch (e: any) {
      return `Erro ao criar coluna: ${e.message}`;
    }
  },
});

export const deleteColumnTool = new DynamicStructuredTool({
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