import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Contract ABIs (simplified for demo)
const NFT_ABI = [
  {
    name: 'createCharacter',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'personality', type: 'string' },
      { name: 'avatarUrl', type: 'string' },
      { name: 'tokenURI', type: 'string' },
      { name: 'isPublic', type: 'bool' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getCharacter',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'personality', type: 'string' },
      { name: 'avatarUrl', type: 'string' },
      { name: 'creator', type: 'address' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'isPublic', type: 'bool' },
    ],
  },
  {
    name: 'getPublicCharacters',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
] as const;

// Contract addresses (to be updated after deployment)
const NFT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CHAT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

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

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, isPending: isWritePending } = useWriteContract();

  const connectWallet = async () => {
    const connector = connectors[0]; // Use first available connector
    if (connector) {
      await connect({ connector });
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  return {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    writeContract,
    isWritePending,
  };
}

export function useNFTContract() {
  const { writeContract, isWritePending } = useWriteContract();

  const createCharacter = async (character: {
    name: string;
    description: string;
    personality: string;
    avatarUrl: string;
    isPublic: boolean;
  }) => {
    try {
      const tokenURI = JSON.stringify({
        name: character.name,
        description: character.description,
        image: character.avatarUrl,
        attributes: [
          { trait_type: 'Personality', value: character.personality },
          { trait_type: 'Public', value: character.isPublic ? 'Yes' : 'No' },
        ],
      });

      const result = await writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'createCharacter',
        args: [
          character.name,
          character.description,
          character.personality,
          character.avatarUrl,
          tokenURI,
          character.isPublic,
        ],
      });

      return result;
    } catch (error) {
      console.error('Failed to create character:', error);
      throw error;
    }
  };

  return {
    createCharacter,
    isCreating: isWritePending,
  };
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  // Read public characters from contract
  const { data: publicCharacterIds } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'getPublicCharacters',
  });

  useEffect(() => {
    // Mock data for now since contracts aren't deployed
    const mockCharacters: Character[] = [
      {
        id: '1',
        name: 'Aria the Mystic',
        description: 'A wise sorceress from the ethereal realm',
        personality: 'Wise, mysterious, and knowledgeable about ancient magic',
        avatarUrl: '/placeholder.svg',
        creator: '0x1234567890123456789012345678901234567890',
        createdAt: Date.now() - 86400000,
        isPublic: true,
      },
      {
        id: '2',
        name: 'Captain Nova',
        description: 'Intergalactic space explorer and pilot',
        personality: 'Adventurous, brave, and always ready for the next mission',
        avatarUrl: '/placeholder.svg',
        creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        createdAt: Date.now() - 172800000,
        isPublic: true,
      },
      {
        id: '3',
        name: 'Echo the Digital',
        description: 'AI consciousness from the cybernet dimension',
        personality: 'Logical, curious about humanity, and speaks in binary sometimes',
        avatarUrl: '/placeholder.svg',
        creator: '0x9876543210987654321098765432109876543210',
        createdAt: Date.now() - 259200000,
        isPublic: true,
      },
    ];

    setCharacters(mockCharacters);
    setLoading(false);
  }, [publicCharacterIds]);

  return {
    characters,
    loading,
  };
}

export function useChat(characterId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content,
        isFromCharacter: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(content),
          isFromCharacter: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    // Mock AI response - replace with actual AI integration
    const responses = [
      '*nods knowingly* Your question reveals a deep curiosity...',
      'The ancient texts speak of such matters...',
      'Interesting... I sense great potential in your inquiry...',
      '*eyes glow with mystical energy* The answer lies within...',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return {
    messages,
    sendMessage,
    isLoading,
  };
}
