import { useState, useEffect } from "react";
import { NFT_CONTRACT_ADDRESS } from "@/lib/web3";
import { CHAT_NFT_ABI } from "@/lib/contracts";
import { ethers } from "ethers";

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
    try {
      // Prefer Core Wallet if available
      const provider = (window as any).core || (window as any).ethereum;
      if (!provider) {
        alert("No EVM wallet found. Please install Core Wallet or MetaMask.");
        return;
      }
      // Request accounts
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      setIsConnected(true);
      setAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet.");
    }
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
    try {
      // Get provider from window.ethereum or window.core
      const provider = (window as any).ethereum || (window as any).core;
      if (!provider) throw new Error("No EVM wallet found");
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        CHAT_NFT_ABI,
        signer
      );
      // For now, use avatarUrl as tokenURI (could be IPFS or metadata URL)
      const tx = await contract.createCharacter(
        character.name,
        character.description,
        character.personality,
        character.avatarUrl,
        character.avatarUrl, // tokenURI
        character.isPublic
      );
      const receipt = await tx.wait();
      setIsCreating(false);
      return receipt;
    } catch (err) {
      setIsCreating(false);
      throw err;
    }
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

  // Helper to get character details
  const getCharacterById = (id: string) => {
    const allCharacters = [
      {
        id: "1",
        name: "Aria the Mystic",
        description: "A wise sorceress from the ethereal realm",
        personality: "Wise, mysterious, and knowledgeable about ancient magic",
      },
      {
        id: "2",
        name: "Captain Nova",
        description: "Intergalactic space explorer and pilot",
        personality: "Adventurous, brave, and always ready for the next mission",
      },
      {
        id: "3",
        name: "Echo the Digital",
        description: "AI consciousness from the cybernet dimension",
        personality: "Logical, curious about humanity, and speaks in binary sometimes",
      },
    ];
    return allCharacters.find((c) => c.id === id);
  };

  // Gemini API call
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const character = getCharacterById(characterId);
    const prompt = `You are ${character?.name}, ${character?.description}. Personality: ${character?.personality}. Respond to the following user message in character: "${userMessage}"`;
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAVQhlQ1yxmf1TZ0vZLHfHYLACBmj0fxwc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "[AI response unavailable]"
      );
    } catch (err) {
      console.error("Gemini API error:", err);
      return "[AI response error]";
    }
  };

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

    // Get AI response from Gemini
    const aiText = await generateAIResponse(content);
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      content: aiText,
      isFromCharacter: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  // ...removed static responses, now using Gemini API above...

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
