import { useState, useEffect } from "react";

export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatarUrl: string;
  creator: string;
  createdAt: number;
  isPublic: boolean;
}

// Mock Web3 functionality for now
export function useWeb3() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>();

  const connectWallet = async () => {
    // Mock wallet connection
    setIsConnected(true);
    setAddress("0x1234567890123456789012345678901234567890");
  };

  const disconnectWallet = async () => {
    setIsConnected(false);
    setAddress(undefined);
  };

  return {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    writeContract: async () => {},
    isWritePending: false,
  };
}

export function useNFTContract() {
  const [isCreating, setIsCreating] = useState(false);

  const createCharacter = async (character: {
    name: string;
    description: string;
    personality: string;
    avatarUrl: string;
    isPublic: boolean;
  }) => {
    setIsCreating(true);
    // Mock character creation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Created character:", character);
    setIsCreating(false);
    return { hash: "0x1234..." };
  };

  return {
    createCharacter,
    isCreating,
  };
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockCharacters: Character[] = [
      {
        id: "1",
        name: "Aria the Mystic",
        description: "A wise sorceress from the ethereal realm",
        personality: "Wise, mysterious, and knowledgeable about ancient magic",
        avatarUrl: "/placeholder.svg",
        creator: "0x1234567890123456789012345678901234567890",
        createdAt: Date.now() - 86400000,
        isPublic: true,
      },
      {
        id: "2",
        name: "Captain Nova",
        description: "Intergalactic space explorer and pilot",
        personality:
          "Adventurous, brave, and always ready for the next mission",
        avatarUrl: "/placeholder.svg",
        creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        createdAt: Date.now() - 172800000,
        isPublic: true,
      },
      {
        id: "3",
        name: "Echo the Digital",
        description: "AI consciousness from the cybernet dimension",
        personality:
          "Logical, curious about humanity, and speaks in binary sometimes",
        avatarUrl: "/placeholder.svg",
        creator: "0x9876543210987654321098765432109876543210",
        createdAt: Date.now() - 259200000,
        isPublic: true,
      },
    ];

    setTimeout(() => {
      setCharacters(mockCharacters);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    characters,
    loading,
  };
}

export function useChat(characterId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with a welcome message
    const welcomeMessage = {
      id: "1",
      content:
        "Greetings, traveler. I sense you seek knowledge from beyond the veil. What mysteries would you have me illuminate?",
      isFromCharacter: true,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    };
    setMessages([welcomeMessage]);
  }, [characterId]);

  const sendMessage = async (content: string) => {
    setIsLoading(true);

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      isFromCharacter: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        isFromCharacter: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "*nods knowingly* Your question reveals a deep curiosity about the arcane arts...",
      "The ancient texts speak of such matters... *consults ethereal grimoire*",
      "Interesting... I sense great potential in your inquiry. Let me share what I know...",
      "*eyes glow with mystical energy* The answer lies within the cosmic patterns...",
      "Ah, a fascinating topic. In my travels through the ethereal realms...",
      "*traces glowing symbols in the air* The mysteries you seek are interconnected...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
