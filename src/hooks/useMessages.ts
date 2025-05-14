import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Message, ApiResponse } from "../types/common";
import { useAuthStore } from "../store/useAuthStore";

const useMessages = (idKey: "clientMessageId" | "jobMessageId") => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  const fetchMessages = async () => {
    const token = getToken();
    setLoading(true);

    const endpoint = idKey === "jobMessageId" ? "/jobMessages" : "/clientsMessages";

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        useAuthStore.getState().handleUnauthorized();
      }

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data: any = await response.json();

      if (data && !Array.isArray(data) && Object.keys(data).length > 0 && data.success) {
        const messagesArray = Object.values(data).filter((item) => item !== true);

        const messageArray = messagesArray.map((message: any) => {
          const sentAtString = message.sentAt;
          let sentAtDate: Date | null = null;

          if (typeof sentAtString === "string") {
            sentAtDate = new Date(sentAtString);
          }

          const isValidDate = sentAtDate && !isNaN(sentAtDate.getTime()) ? sentAtDate : null;

          return {
            ...message,
            sentAt: isValidDate?.toISOString() ?? "Invalid Date",
          };
        });

        const sortedMessages = messageArray.sort((a, b) => {
          const dateA = new Date(a.sentAt).getTime();
          const dateB = new Date(b.sentAt).getTime();
          return dateA - dateB;
        });

        setMessages(sortedMessages);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch messages");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string | undefined) => {
    if (!messageId) {
      console.error("Error: messageId is undefined!");
      return;
    }

    const token = getToken();
    const endpoint = idKey === "jobMessageId" ? "/jobMessages" : "/clientsMessages";

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/");
        window.location.reload();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setMessages((prevMessages) => prevMessages.filter((msg) => msg[idKey] !== messageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [idKey]);

  return { messages, loading, error, fetchMessages, deleteMessage };
};

export default useMessages;
