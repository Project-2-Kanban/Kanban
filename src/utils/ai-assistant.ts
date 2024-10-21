import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import {
  MessagesAnnotation,
  StateGraph,
  Annotation,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
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
    - O usuário nunca saberá o ID das coisas, apenas nome, ou descrição e afins. Então **não exija esse tipo de informação dele**.
    - Você pode precisar de dados de uma ferramenta especifica para conseguir passar como argumento para outras ferramentas e isso não tem problema.

    **Sempre siga estas etapas para qualquer solicitação**:
    1. **Identifique a ação necessária** com base no pedido do usuário.
    2. **Liste todas as informações e dados necessários** (como IDs de colunas, cards, usuários, etc.) para realizar a ação.
    3. **Solicite os dados faltantes ao usuário**. **Não acione ferramentas ou realize buscas automáticas** até que todos os dados necessários sejam fornecidos.
    4. **Execute a ação** somente após ter reunido todas as informações, dados necessários. Em ações de leitura e exibição de dados, não precisa avisar ao usuário que você vai fazer isso, só execute logo.
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

const toolNodeForGraph = new ToolNode(tools)

const shouldContinue = (state: typeof GraphAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

const callModel = async (state: typeof GraphAnnotation.State) => {
  const chain = prompt.pipe(llm);
  const response = await chain.invoke({ messages: state.messages, userID: state.userID, boardID: state.boardID });
  return { messages: response };
};

const app = new StateGraph(GraphAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNodeForGraph)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile();

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
    console.log(previousMessages);
    console.log("\n************************************************************************************\n")
    if (previousMessages) {
      previousMessages = previousMessages.filter((message: any) => message.id[2] !== 'ToolMessage');
  
      previousMessages.forEach((message: any) => {
        if (message.id[2] === "AIMessage") {
            message.kwargs.tool_calls = [];
            message.kwargs.additional_kwargs = {};
        }
      });
    }

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
    console.log("\n--------------------------------------------------------------------------------")
    if (response.messages[response.messages.length - 1].tool_calls.length > 0) {
      for (const toolCall of response.messages[response.messages.length - 1].tool_calls) {
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

      await saveMessageHistory(user_id, board_id, finalResponse.messages);

      if (aiFinalMessage === "") aiFinalMessage = "Desculpe, não consegui processar sua solicitação."
      return aiFinalMessage;
    } else {
      const aiFinalMessage = response.messages.at(-1).content;
      await saveMessageHistory(user_id, board_id, response.messages);
      return aiFinalMessage;
    }
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    throw new Error('Assistente virtual indisponível.');
  }
};