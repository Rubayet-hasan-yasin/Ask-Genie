import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { saveChat, saveChatMessage } from '@/services/chat';
import { google } from '@ai-sdk/google';
import { generateText, streamText } from "ai";

// export const runtime = "edge"


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, id } = body;
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      const isExistingChat = await prisma.chat.findUnique({
        where: { id, userId },
      });

      if (!isExistingChat) {
        const titlePrompt: { role: "user" | "assistant" | "system"; content: string }[] = [
          {
            role: "user",
            content: `Generate a short and relevant title (max 5 words) for the following conversation:\n\n` +
              messages.map(
                (msg: {
                  role: "user" | "assistant" | "system";
                  content: string;
                }) => `${msg.role.toUpperCase()}: ${msg.content}`
              ).join("\n"),
          },
        ];

        const titleResult = await generateText({
          model: google("gemini-1.5-flash-latest"),
          messages: titlePrompt,
        });

        const smartTitle = titleResult.text.trim();
        await saveChat({
          id,
          userId,
          title: smartTitle || "Untitled Chat",
        });
      }
    }

    // ✅ Save last user message
    const userMessage = messages[messages.length - 1];
    await saveChatMessage({
      chatId: id,
      role: "user",
      content: userMessage.content,
    });

    // ✅ Stream assistant response
    const result = streamText({
      model: google("gemini-1.5-flash-latest"),
      system: "You are a helpful assistant, yor are a chatbot, your name is Ask Genie",
      messages,
    });

    // Capture assistant’s final text after stream finishes
    result.text.then(async (responseText) => {
      await saveChatMessage({
        chatId: id,
        role: "assistant",
        content: responseText,
      });
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
