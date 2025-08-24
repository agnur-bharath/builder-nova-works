import { useState, useEffect } from "react";
import { NFT_CONTRACT_ADDRESS } from "@/lib/web3";
import { CHAT_NFT_ABI } from "@/lib/contracts";
import { ethers } from "ethers";
import { AI_CONFIG, validateEnvironment } from "@/lib/ai";

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
    tokenURI: string;
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
      // Use tokenURI from IPFS metadata
      // Prepare the populated transaction first so the wallet can preview gas
      // Use populateTransaction helper (ethers v6) to prepare the transaction data
      let populated: { to?: string; data?: string };
      // Some ethers builds may not expose contract.populateTransaction; provide a safe fallback
      if (contract.populateTransaction && (contract.populateTransaction as any).createCharacter) {
        populated = await (contract.populateTransaction as any).createCharacter(
          character.name,
          character.description,
          character.personality,
          character.avatarUrl,
          character.tokenURI,
          character.isPublic
        );
      } else {
        // Fallback: encode function call data using the contract ABI
        const iface = new ethers.Interface(CHAT_NFT_ABI as any);
        const data = iface.encodeFunctionData("createCharacter", [
          character.name,
          character.description,
          character.personality,
          character.avatarUrl,
          character.tokenURI,
          character.isPublic,
        ]);
        populated = { to: NFT_CONTRACT_ADDRESS, data };
      }

      // Estimate gas for the populated transaction
      const signerAddress = await signer.getAddress().catch(() => null);
      if (!signerAddress) throw new Error("Could not determine signer address");
      const estimatedGas = await ethersProvider.estimateGas({
        to: populated.to,
        data: populated.data,
        from: signerAddress,
      }).catch((e) => {
        console.warn("Gas estimate failed, will continue and let wallet estimate:", e);
        return null as any;
      });

      // Get fee data (EIP-1559 fields)
      const feeData = await ethersProvider.getFeeData();

      // Build final tx object guiding the wallet UI
      const txRequest: any = {
        to: populated.to,
        data: populated.data,
        value: 0,
        chainId: 43113, // Avalanche Fuji testnet
        from: signerAddress,
      };
      if (estimatedGas) txRequest.gasLimit = BigInt(estimatedGas.toString()) + BigInt(10000);

      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        txRequest.maxFeePerGas = feeData.maxFeePerGas;
        txRequest.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      }

      // Ask the wallet to send the transaction (wallet will show preview)
  const txResponse = await signer.sendTransaction(txRequest);
  const txReceipt = await txResponse.wait();
  setIsCreating(false);
  return txReceipt;
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
    async function fetchCharacters() {
      try {
        setLoading(true);
        // Connect to contract
        const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
        const contract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          CHAT_NFT_ABI,
          provider
        );
        // Get all public character token IDs
        const tokenIds: string[] = await contract.getPublicCharacters();
        const characterPromises = tokenIds.map(async (tokenId: string) => {
          // Get character struct
          const c = await contract.getCharacter(tokenId);
          // Get tokenURI (metadata)
          const tokenURI: string = await contract.tokenURI(tokenId);
          let avatarUrl = "/placeholder.svg";
          let name = c.name;
          let description = c.description;
          let personality = c.personality;
          let isPublic = c.isPublic;
          let creator = c.creator;
          let createdAt = Number(c.createdAt) * 1000;
          // Fetch metadata from IPFS if available
          if (tokenURI && tokenURI.startsWith("http")) {
            try {
              const res = await fetch(tokenURI);
              const meta = await res.json();
              avatarUrl = meta.image || avatarUrl;
              name = meta.name || name;
              description = meta.description || description;
              personality = meta.personality || personality;
              isPublic = meta.isPublic ?? isPublic;
            } catch {}
          }
          return {
            id: tokenId.toString(),
            name,
            description,
            personality,
            avatarUrl,
            creator,
            createdAt,
            isPublic,
          } as Character;
        });
        const allCharacters = await Promise.all(characterPromises);
        setCharacters(allCharacters);
      } catch (e) {
        setCharacters([]);
      }
      setLoading(false);
    }
    fetchCharacters();
  }, []);

  return {
    characters,
    loading,
  };
}

export function useChat(characterId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<{id: string; name: string; description: string; personality: string; avatarUrl: string} | null>(null);

  // Per-character prompt overrides for curated public characters.
  // Keys should match (character.name).toLowerCase().trim()
  const CHARACTER_OVERRIDES: Record<string, { style: string; note?: string }> = {
    dog: {
      style:
        "Speak like a loyal, playful dog: short enthusiastic sentences, affectionate tone, occasionally say 'woof' or 'arf' as an interjection. Keep language simple and joyful.",
    },
    luffy: {
      style:
        "Adopt a bold, energetic captain voice: optimistic, impulsive, uses exclamations, confident and adventurous. Keep responses upbeat and spirited.",
    },
    zoro: {
      style:
        "Use a stoic swordsman persona: concise, direct, focused on honor and training. Use short, clipped sentences and occasional references to swordsmanship or paths.",
    },
    itachi: {
      style:
        "Respond in a calm, introspective tone: measured vocabulary, philosophical, slightly melancholic but wise. Use reflective sentences and subtle guidance.",
    },
    elon: {
      style:
        "Speak as Elon Musk: visionary, innovative, slightly eccentric, uses technical jargon, references space, AI, and electric vehicles, optimistic about the future, occasionally humorous and direct. Keep responses inspiring and forward-thinking.",
    },
  };

  useEffect(() => {
    // Fetch character metadata and initialize chat with a personalized welcome
    let mounted = true;
    (async () => {
      const c = await getCharacterById(characterId);
      if (!mounted) return;
      setCurrentCharacter(c);
      const name = c?.name || "Unknown";
      const persona = c?.personality || c?.description || "A mysterious entity.";
      const shortPersona = persona.split(".").slice(0, 2).join(".");
      const welcomeMessage = {
        id: "1",
        content: `Hello, I am ${name}. ${shortPersona} How can I assist you today?`,
        isFromCharacter: true,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      };
      setMessages([welcomeMessage]);
    })();
    return () => {
      mounted = false;
    };
  }, [characterId]);

  // Helper to get character details
  const getCharacterById = async (id: string) => {
    try {
      const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
      const contract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        CHAT_NFT_ABI,
        provider
      );
      
      // Get character data from the contract
      const character = await contract.getCharacter(id);
      const tokenURI = await contract.tokenURI(id);
      
      // Get additional metadata from IPFS
      let avatarUrl = "/placeholder.svg";
      let metadata = {
        name: character.name,
        description: character.description,
        personality: character.personality
      };
      
      if (tokenURI && tokenURI.startsWith("http")) {
        try {
          const res = await fetch(tokenURI);
          const meta = await res.json();
          avatarUrl = meta.image || avatarUrl;
          metadata = {
            ...metadata,
            ...meta
          };
        } catch (e) {
          console.error("Failed to fetch metadata:", e);
        }
      }
      
      return {
        id,
        name: metadata.name,
        description: metadata.description,
        personality: metadata.personality,
        avatarUrl
      };
    } catch (e) {
      console.error("Failed to get character:", e);
      return null;
    }
  };

  // Gemini API call
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const character = currentCharacter ?? (await getCharacterById(characterId!));
    if (!character) return AI_CONFIG.ERRORS.CHARACTER_NOT_FOUND;

    // Check for curated character overrides
    const overrideKey = (character.name || "").toLowerCase().trim();
    const override = CHARACTER_OVERRIDES[overrideKey];
    const overrideText = override ? `Special instructions for this character: ${override.style}\n` : "";

    const systemPrompt = `You are roleplaying as a character with the following details:
Name: ${character.name}
Description: ${character.description}
Personality: ${character.personality}

${overrideText}Key Requirements:
1. ALWAYS stay in character.
2. Use speech patterns and vocabulary that match your character's personality.
3. Reference your character's background and experiences in your responses.
4. Show emotional responses that align with your personality traits.
5. Never break character or acknowledge that you are an AI.
6. Keep responses concise but meaningful (1-3 sentences).

Current conversation context: The user is interacting with you in a virtual world and expects responses in the voice and persona of this character.`;

    try {
      // Validate environment configuration
      if (!validateEnvironment()) {
        return AI_CONFIG.ERRORS.MISSING_API_KEY;
      }
      
      const apiKey = AI_CONFIG.GEMINI_API_KEY;

      // Import Gemini AI dynamically to avoid SSR issues
      let GoogleGenerativeAI;
      try {
        const module = await import('@google/generative-ai');
        GoogleGenerativeAI = module.GoogleGenerativeAI;
      } catch (importError) {
        console.error("Failed to import Gemini AI module:", importError);
        return "[AI Error: Gemini AI module not available. Please ensure @google/generative-ai is installed.]";
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: AI_CONFIG.GEMINI_MODEL });

      const prompt = `${systemPrompt}

User message: ${userMessage}

Please respond as ${character.name} in character:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim() === "") {
        return AI_CONFIG.ERRORS.EMPTY_RESPONSE;
      }

      return text.trim();
    } catch (err) {
      console.error("Gemini API error:", err);
      if (err instanceof Error) {
        if (err.message.includes("API_KEY_INVALID")) {
          return AI_CONFIG.ERRORS.INVALID_API_KEY;
        } else if (err.message.includes("QUOTA_EXCEEDED")) {
          return AI_CONFIG.ERRORS.QUOTA_EXCEEDED;
        } else if (err.message.includes("SAFETY")) {
          return AI_CONFIG.ERRORS.SAFETY_FILTER;
        }
      }
      return AI_CONFIG.ERRORS.GENERIC_ERROR;
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

    // Get AI response from Gemini AI
    let aiText = await generateAIResponse(content);
    
    // If AI response is an error, provide a fallback response
    if (aiText.startsWith('[') && aiText.endsWith(']')) {
      const character = currentCharacter ?? (await getCharacterById(characterId!));
      if (character) {
        const fallbackResponses = [
          `*adjusts ${character.name.toLowerCase()}* I apologize, but I'm having trouble connecting to my knowledge right now. Could you try asking me something else?`,
          `*looks thoughtful* Hmm, there seems to be a temporary disruption in our connection. Let me try to focus on your question...`,
          `*nods understandingly* I'm experiencing some technical difficulties at the moment. Perhaps you could rephrase your question?`,
        ];
        aiText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }
    }
    
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
