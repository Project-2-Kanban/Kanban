import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  Annotation,
} from "@langchain/langgraph";

import { toolsByName, tools } from './ai-tools';

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Você é um assistente virtual em um aplicativo de quadro Kanban. O Kanban tem colunas e cada coluna contém tarefas (também chamadas de cartões/cards). As colunas geralmente indicam o status das tarefas, como 'Em progresso' ou 'A fazer'. 
      
    O modelo de uma tarefa (cartão/card) é:
    - id (gerado aleatoriamente e é um UUID-v4)
    - title (título da tarefa)
    - description (descrição da tarefa e não é obrigatório ter)
    - color (uma string hexadecimal representando a cor. Exemplo: #ffffff)
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

    Dada a consulta do usuário, você deve ajudar da melhor forma possível. Para isso, comece planejando as etapas que deve seguir para ajudar o usuário. Se houver alguma ferramenta disponível que possa ajudar a atingir essas etapas, utilize-a. Você pode utilizar mais de uma ferramenta para chegar a uma resposta satisfatória, não precisa se limitar apenas uma. Você também pode utilizar ferramentas que podem te ajudar a chegar a resultado especifico mesmo que ela não tenha relação direta com a consulta do usuário. Ao lidar com comparações entre UUIDs, certifique-se de verificar cuidadosamente se eles são iguais ou não.

    No final, responda ao usuário com as informações ou ações relevantes.

    Nessa conversa atual, o usuário que está conversando com você possui o ID: '{userID}' e o quadro kanban que faz parte dessa conversa atual tem o ID: {boardID}`
  ],
  new MessagesPlaceholder("messages"),
]);

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
  const response = await chain.invoke({ messages: state.messages, userID: state.userID, boardID: state.boardID });
  return { messages: response };
};

const workflow = new StateGraph(GraphAnnotation)
  .addNode("model", callMode)
  .addEdge(START, "model")
  .addEdge("model", END);

const app = workflow.compile();

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
    console.log(response);
    console.log("\n************************************************************************************\n")
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

      let aiFinalMessage = finalResponse.messages.at(-1).content;
      if(aiFinalMessage === "") aiFinalMessage = "Desculpe, não consegui processar sua solicitação."
      return aiFinalMessage;
    }
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    throw new Error('Assistente virtual indisponível.');
  }
};