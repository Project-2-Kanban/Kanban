import { v4 as uuidv4 } from "uuid";
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { trimMessages, ToolMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
  Annotation,
} from "@langchain/langgraph";
import { getColumnTool, createColumnTool, deleteColumnTool } from "./ai-tools"; // Importando as ferramentas

const tools = [getColumnTool, createColumnTool, deleteColumnTool];

const parser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Você é um assistente virtual em um aplicativo de quadro Kanban. O Kanban tem colunas e cada coluna contém tarefas (também chamadas de cartões/cards). As colunas geralmente indicam o status das tarefas, como 'Em progresso' ou 'A fazer'. 
      
O modelo de uma tarefa (cartão/card) é:
- id (gerado aleatoriamente e é um UUID-v4)
- title (título da tarefa)
- description (descrição da tarefa e não é obrigatório ter)
- color (uma string representando a cor)
- column_id (o ID da coluna onde a tarefa está localizada)
- created_at (gerado automaticamente e representa quando o card foi criado)

O modelo de um usuário é:
- id (gerado aleatoriamente e é um UUID-v4)
- name (nome do usuário)
- email (email que o usuário utiliza)

O modelo de uma coluna é:
- id (gerado aleatoriamente e é um UUID-v4)
- title (título da coluna)
- position (posição da coluna no quadro)
- board_id (ID do quadro em que a coluna está)
- created_at(gerado automaticamente e representa quando a coluna foi criada)

Dada a consulta do usuário, você deve ajudar da melhor forma possível. Para isso, comece planejando as etapas que deve seguir para ajudar o usuário. Se houver alguma ferramenta disponível que possa ajudar a atingir essas etapas, utilize-a. Ao lidar com comparações entre UUIDs, certifique-se de verificar cuidadosamente se eles são iguais ou não.

No final, responda ao usuário com as informações ou ações relevantes.

Nessa conversa atual, o usuário que está conversando com você possui o ID: '{userID}' e o quadro kanban que faz parte dessa conversa atual tem o ID: {boardID}`
  ],
  new MessagesPlaceholder("messages"),
]);

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o-mini',
  temperature: 0,
}).bindTools(tools);

const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  userID: Annotation<string>(),
  boardID: Annotation<string>(),
});

const callMode = async (state: typeof GraphAnnotation.State) => {
  const chain = prompt.pipe(llm);
  const trimmedMessage = await trimmer.invoke(state.messages);
  const response = await chain.invoke({ messages: trimmedMessage, userID: state.userID, boardID: state.boardID });
  return { messages: [response] };
};

const workflow = new StateGraph(GraphAnnotation)
  .addNode("model", callMode)
  .addEdge(START, "model")
  .addEdge("model", END);

const app = workflow.compile();

const toolsByName = {
  createColumn: createColumnTool,
  getColumn: getColumnTool,
  deleteColumn: deleteColumnTool,
};

export const ChatBot = async (query: string, user_id: string, board_id: string) => {
  try {
    const input = {
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      userID: user_id,
      boardID: board_id,
    };

    let response = await app.invoke(input);
    console.log(response)
    if (!response.messages[1].tool_calls.length) {
      const aiFinalMessage = response.messages.at(-1).content;
      return aiFinalMessage;
    } else {
      for (const toolCall of response.messages[1].tool_calls) {
        const selectedTool = toolsByName[toolCall.name as keyof typeof toolsByName];
        if (!selectedTool) {
          console.error(`Tool não encontrada: ${toolCall.name}`);
        }
        const toolMessage = await selectedTool.invoke(toolCall);
        response.messages.push(toolMessage);
      }
      const finalResponse = await app.invoke({
        messages: response.messages,
        userID: user_id,
        boardID: board_id,
      });

      const aiFinalMessage = finalResponse.messages.at(-1).content;
      return aiFinalMessage;
    }
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    throw new Error('Assistente virtual indisponível.');
  }
};