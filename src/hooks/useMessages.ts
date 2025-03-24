import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Message, ApiResponse } from "../types/common";

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
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("adminId");

        alert("Session expired. Redirecting to login...");
        navigate("/");

        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data: ApiResponse = await response.json();

      if (data && typeof data === "object") {
        const { success, ...messageData } = data;

        const messageArray = Object.values(messageData).map((message: Message) => {
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
        sessionStorage.removeItem("adminId");

        alert("Session expired. Redirecting to login...");
        navigate("/");

        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      setMessages((prevMessages) => prevMessages.filter((msg) => msg[idKey] !== messageId));
    } catch (err) {
      setError(err.message || "Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [idKey]);

  return { messages, loading, error, fetchMessages, deleteMessage };
};

export default useMessages;
