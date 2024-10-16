import { v4 as uuidv4 } from "uuid";
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { trimMessages } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

const parser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability.",
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
});

const callMode = async (state: typeof MessagesAnnotation.State) => {
  const chain = prompt.pipe(llm).pipe(parser);
  const trimmedMessage = await trimmer.invoke(state.messages);
  const response = await chain.invoke({messages: trimmedMessage});
  return { messages: [response] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callMode)
  .addEdge(START, "model")
  .addEdge("model", END);

const app = workflow.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: uuidv4() } };

export const ChatBot = async (query: string) => {
  try {
    const input = [
      {
        role: "user",
        content: query,
      },
    ];
    const response = await app.invoke({ messages: input }, config);
    const lastMessage = response.messages[response.messages.length - 1];
    const content = lastMessage.content;

    return content;
  } catch (error) {
    console.error('Erro na chamada da IA:', error);
    throw new Error('Assistente virtual indisponível.');
  }
};