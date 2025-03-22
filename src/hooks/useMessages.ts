import { useState, useEffect } from "react";
import { Message } from "../types/common";



const useMessages = (idKey: "clientMessageId" | "jobMessageId") => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  const fetchMessages = async () => {
    const token = getToken();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clientsMessages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        const messageArray = Object.values(data).map((message: any) => {
          const sentAtString = message.sentAt;
          let sentAtDate: Date | null = null;

          if (typeof sentAtString === "string") {
            sentAtDate = new Date(sentAtString);
          }

          const isValidDate = sentAtDate && !isNaN(sentAtDate.getTime()) ? sentAtDate : null;

          return {
            ...message,
            sentAt: isValidDate ? sentAtDate.toISOString() : "Invalid Date",
          };
        });

        setMessages(messageArray);
      } else {
        throw new Error("Invalid response structure: Data is not an object");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (clientMessageId: string | undefined) => {
    if (!clientMessageId) {
      console.error("Error: clientMessageId is undefined!"); 
      return;
    }
    const token = getToken();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/clientsMessages/${clientMessageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.clientMessageId !== clientMessageId));
    } catch (err) {
      setError(err.message || "Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return { messages, loading, error, fetchMessages, deleteMessage };
};

export default useMessages;
