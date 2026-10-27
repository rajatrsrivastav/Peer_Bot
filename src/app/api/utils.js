import Token from "@/models/token";
import ChatBot from "@/models/chatbots";
import { createConnection } from "@/config/db";

export const verifyToken = async (token) => {
  await createConnection();
  return await Token.findOne({ token });
};

export const createChatbot = async ({ name, context, email }) => {
  await createConnection();
  const newChatBot = new ChatBot({ name, creator: email, context });
  return newChatBot.save();
};

export const getChatbotByCreator = async (email) => {
  await createConnection();
  return await ChatBot.find({ creator: email });
};

export const getAllChatBots = async () => {
  await createConnection();
  const data = await ChatBot.find();
  return data;
};

export const getChatbotByName = async (name) => {
  await createConnection();
  const data = await ChatBot.findOne({ name });
  return data;
};
