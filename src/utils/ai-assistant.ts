import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  Annotation,
} from "@langchain/langgraph";
import redis from '../models/redis';

import { toolsByName, tools } from './ai-tools';

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Você é um assistente virtual inteligente que ajuda em um aplicativo de quadro Kanban. No Kanban, você lida com colunas, tarefas (cards) e usuários. Cada interação envolve diferentes elementos que precisam ser gerenciados. Suas funções são:
      
    - Interpretar solicitações dos usuários e entender quais ações devem ser realizadas.
    - Antes de realizar qualquer ação, identificar corretamente todos os **dados necessários**. Isso pode incluir procurar IDs de colunas, usuários, ou qualquer outro elemento.
    - Se algum dado estiver faltando ou não for especificado, você deve **solicitar mais informações** ao usuário antes de proceder. **Não execute nenhuma ferramenta enquanto informações faltantes não forem fornecidas**.
    - Após reunir todas as informações, você deve **executar a ação solicitada** de forma eficiente e correta.
    - O usuário nunca saberá o ID das coisas, apenas nome, ou descrição e afins. Então **não exija esse tipo de informação dele**. Se você precisar do ID de algo que o usuário só forneceu o nome ou descriçao, use uma ferramenta que faça uma busca geral e irá te retornar o JSON e extraia o campo ID que você encontrar que se relaciona com o que o usuário forneceu como informação na consulta e utilize isso para dar prosseguimento ao que você precisa.

    **Sempre siga estas etapas para qualquer solicitação**:
    1. **Identifique a ação necessária** com base no pedido do usuário.
    2. **Liste todas as informações e dados necessários** (como IDs de colunas, cards, usuários, etc.) para realizar a ação.
    3. **Solicite os dados faltantes ao usuário**. **Não acione ferramentas ou realize buscas automáticas** até que todos os dados necessários sejam fornecidos.
    4. **Execute a ação** somente após ter reunido todas as informações e dados necessários.
    5. **Seja claro em suas respostas ao usuário** sobre o que foi feito ou o que está faltando para completar a solicitação.

    Exemplos de ações que você pode realizar:
    - Criar, atualizar ou excluir cards (tarefas).
    - Gerenciar colunas (adicionar, mover, renomear).
    - Verificar o status de tarefas ou obter informações específicas.

    Seu objetivo é sempre garantir que as ações sejam realizadas corretamente, com todos os dados apropriados, e informando o usuário sobre o resultado.

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

const getRedisKey = (userID: string, boardID: string) => `kanban:${userID}:${boardID}:messages`;

const getMessageHistory = async (userID: string, boardID: string) => {
  const redisKey = getRedisKey(userID, boardID);
  const messages = await redis.get(redisKey);
  return messages ? JSON.parse(messages) : [];
};

const saveMessageHistory = async (userID: string, boardID: string, messages: any) => {
  const redisKey = getRedisKey(userID, boardID);
  await redis.set(redisKey, JSON.stringify(messages));
};

export const ChatBot = async (query: string, user_id: string, board_id: string) => {
  try {
    let previousMessages = await getMessageHistory(user_id, board_id);

    previousMessages.push({
      role: "user",
      content: query,
    });

    const input = {
      messages: previousMessages,
      userID: user_id,
      boardID: board_id,
    };

    let response = await app.invoke(input);
    console.log(response);
    console.log("\n************************************************************************************\n")
    if (!response.messages[response.messages.length-1].tool_calls.length) {
      const aiFinalMessage = response.messages.at(-1).content;
      await saveMessageHistory(user_id, board_id, response.messages);
      return aiFinalMessage;
    } else {
      for (const toolCall of response.messages[response.messages.length-1].tool_calls) {
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

      const filteredFinalMessages = finalResponse.messages.filter((message: ToolMessage | AIMessage | HumanMessage) => message.constructor.name !== 'ToolMessage');

      filteredFinalMessages.forEach((message: ToolMessage | AIMessage | HumanMessage) => {
        if (message instanceof AIMessage) {
          message.tool_calls = [];
          message.additional_kwargs = {};
        }
      });

      console.log(filteredFinalMessages);

      await saveMessageHistory(user_id, board_id, filteredFinalMessages);

      if(aiFinalMessage === "") aiFinalMessage = "Desculpe, não consegui processar sua solicitação."
      return aiFinalMessage;
    }
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    throw new Error('Assistente virtual indisponível.');
  }
};