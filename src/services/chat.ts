import prisma from '../lib/prisma'

export const saveChat = async (data: {
  id: string;
  userId: string;
  title: string;
}) => {
  return await prisma.chat.create({
    data: {
      ...data,
    }
  })
}

export const saveChatMessage = async (data: {
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
}) => {
  return await prisma.message.create({
    data: {
      ...data,
    }
  })
}

export const getChatHistory = async (userId: string) => {
  return await prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}