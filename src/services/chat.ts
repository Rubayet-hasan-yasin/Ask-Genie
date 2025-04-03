import prisma from '../lib/prisma'

export const saveChatMessage = async (data: {
  userId: string
  message: string
  response: string
  model: string
  tokensUsed: number
}) => {
  return await prisma.chatMessage.create({
    data: {
      ...data,
      timestamp: new Date()
    }
  })
}

export const getChatHistory = async (userId: string) => {
  return await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' }
  })
}