# 🚀 NFT Chat - AI-Powered Character NFTs on Avalanche

> **Create, mint, and chat with unique AI characters as NFTs on the Avalanche blockchain**

[![Avalanche](https://img.shields.io/badge/Avalanche-FF6B6B?style=for-the-badge&logo=avalanche&logoColor=white)](https://www.avax.network/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

NFT Chat is a revolutionary Web3 application that combines the power of AI, blockchain technology, and NFT ownership. Users can create unique AI characters with distinct personalities, mint them as NFTs on the Avalanche blockchain, and engage in meaningful conversations with their digital companions.

### 🎯 Key Concepts

- **AI Characters**: Each character has a unique personality, background, and conversational style
- **NFT Ownership**: Characters are minted as non-fungible tokens on Avalanche
- **Blockchain Storage**: Character metadata and images are stored on IPFS
- **AI Conversations**: Powered by Google's Gemini AI for realistic character interactions
- **Private & Public**: Choose between private ownership or public sharing

## ✨ Features

### 🎭 Character Creation
- **Custom Personalities**: Define character traits, backgrounds, and behaviors
- **Image Options**: Use AI-generated avatars or upload custom images
- **Metadata Storage**: IPFS-based metadata storage for decentralization
- **Smart Contract Integration**: Avalanche blockchain integration for NFT minting

### 💬 AI Chat System
- **Gemini AI Integration**: Powered by Google's latest AI model
- **Character Consistency**: AI maintains character personality across conversations
- **Context Awareness**: Characters remember conversation context
- **Fallback Responses**: Graceful handling when AI is unavailable

### 🔐 Web3 Integration
- **Wallet Support**: Core Wallet and MetaMask integration
- **Avalanche Network**: Built for Avalanche Fuji testnet and mainnet
- **Smart Contracts**: Solidity-based NFT contracts
- **Gas Optimization**: Efficient transaction handling

### 🎨 User Interface
- **Modern Design**: Glassmorphism and Web3 aesthetic
- **Responsive Layout**: Mobile-first design approach
- **Dark Mode**: Built-in theme support
- **Real-time Updates**: Live character status and chat updates

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Backend      │    │   Blockchain    │
│   (React)      │◄──►│   (Vite)       │◄──►│   (Avalanche)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gemini AI    │    │   IPFS Storage  │    │   Smart        │
│   (Google)     │    │   (Pinata)      │    │   Contracts    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── WalletConnect   # Wallet connection component
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useWeb3         # Web3 wallet management
│   ├── useNFTContract  # NFT contract interactions
│   ├── useCharacters   # Character data management
│   └── useChat         # Chat functionality
├── lib/                 # Utility libraries
│   ├── ai.ts           # AI configuration
│   ├── contracts.ts    # Smart contract ABIs
│   ├── web3.ts         # Web3 configuration
│   ├── ipfs.ts         # IPFS integration
│   └── avatar-generator.ts # AI avatar generation
├── pages/               # Application pages
│   ├── Index.tsx       # Homepage with character grid
│   └── Chat.tsx        # Chat interface
└── types/               # TypeScript type definitions
```

### Data Flow

1. **Character Creation**
   ```
   User Input → AI Avatar Generation → IPFS Upload → Smart Contract → NFT Minted
   ```

2. **Character Loading**
   ```
   Smart Contract → Character Data → IPFS Metadata → Frontend Display
   ```

3. **Chat Interaction**
   ```
   User Message → Character Context → Gemini AI → AI Response → Chat Display
   ```

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI component library
- **Lucide React**: Beautiful icon library

### Backend & Infrastructure
- **Node.js**: JavaScript runtime
- **Express**: Web framework (for future API endpoints)
- **IPFS**: Decentralized file storage
- **Pinata**: IPFS pinning service

### Blockchain & Web3
- **Avalanche**: High-performance blockchain platform
- **Ethers.js**: Ethereum library for Web3 interactions
- **Solidity**: Smart contract language
- **Hardhat**: Development environment for Ethereum

### AI & Machine Learning
- **Google Gemini AI**: Advanced language model
- **FLUX.1-dev**: AI avatar generation model
- **Custom Prompts**: Character personality engineering

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **SWC**: Fast TypeScript/JavaScript compiler

## 📁 Project Structure

```
builder-nova-works/
├── client/                     # Frontend application
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── WalletConnect.tsx # Wallet connection
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   │   ├── useWeb3.ts        # Web3 functionality
│   │   ├── useNFTContract.ts # NFT contract hooks
│   │   ├── useCharacters.ts  # Character management
│   │   └── useChat.ts        # Chat functionality
│   ├── lib/                  # Utility libraries
│   │   ├── ai.ts             # AI configuration
│   │   ├── contracts.ts      # Contract ABIs
│   │   ├── web3.ts           # Web3 config
│   │   ├── ipfs.ts           # IPFS integration
│   │   └── avatar-generator.ts # Avatar generation
│   ├── pages/                # Application pages
│   │   ├── Index.tsx         # Homepage
│   │   └── Chat.tsx          # Chat interface
│   ├── types/                # TypeScript types
│   └── styles/               # CSS and styling
├── contracts/                 # Smart contracts
│   ├── ChatNFT.sol           # Main NFT contract
│   └── interfaces/            # Contract interfaces
├── public/                    # Static assets
│   ├── images/               # Character images
│   │   ├── dog.png           # Public character
│   │   ├── luffy.png         # Public character
│   │   ├── zoro.png          # Public character
│   │   ├── itachi.png        # Public character
│   │   └── Elon.png          # Private character
│   └── ...
├── avatar-api/                # AI avatar generation service
│   └── app.py                # Python Flask API
├── scripts/                   # Utility scripts
├── tests/                     # Test files
├── docs/                      # Documentation
├── .env                       # Environment variables
├── .env.example              # Environment template
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Core Wallet** or **MetaMask** browser extension
- **Avalanche Fuji testnet** configured in wallet
- **Google Gemini API** key
- **Pinata IPFS** account (optional, for IPFS pinning)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd builder-nova-works
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory:

```bash
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Blockchain Configuration
VITE_AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_NFT_CONTRACT_ADDRESS=your_contract_address_here

# IPFS Configuration (Optional)
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

## ⚙️ Configuration

### Smart Contract Deployment

1. **Deploy to Avalanche Fuji testnet**
   ```bash
   npm run deploy:testnet
   ```

2. **Update contract address**
   Update `VITE_NFT_CONTRACT_ADDRESS` in your `.env` file

3. **Verify contract**
   ```bash
   npm run verify:testnet
   ```

### AI Model Configuration

The application uses Google's Gemini 1.5 Flash model by default. You can customize the AI behavior in `client/lib/ai.ts`:

```typescript
export const AI_CONFIG = {
  GEMINI_MODEL: 'gemini-1.5-flash',
  MAX_RESPONSE_LENGTH: 200,
  TEMPERATURE: 0.9,
  // ... other settings
};
```

### Character Personalities

Customize character personalities in `client/hooks/useWeb3.ts`:

```typescript
const CHARACTER_OVERRIDES = {
  elon: {
    style: "Speak as Elon Musk: visionary, innovative, slightly eccentric...",
  },
  // ... other characters
};
```

## 📱 Usage

### Creating Characters

1. **Connect your wallet** to Avalanche Fuji testnet
2. **Click "Create Your Character"** on the homepage
3. **Fill in character details**:
   - Name, description, and personality
   - Choose between AI-generated or custom image
   - Set public or private visibility
4. **Mint the NFT** and approve the transaction

### Chatting with Characters

1. **Navigate to a character** from the homepage
2. **Click "Start Chat"** to open the chat interface
3. **Send messages** and receive AI-powered responses
4. **Experience character personality** through conversation

### Managing Characters

- **Public Characters**: Visible to all users
- **Private Characters**: Only visible to the creator
- **Character Grid**: Browse all available characters
- **Search & Filter**: Find specific characters

## 🔌 API Reference

### Smart Contract Functions

#### `createCharacter`
```solidity
function createCharacter(
    string memory name,
    string memory description,
    string memory personality,
    string memory avatarUrl,
    string memory tokenURI,
    bool isPublic
) external returns (uint256 tokenId)
```

#### `getCharacter`
```solidity
function getCharacter(uint256 tokenId) external view returns (Character memory)
```

#### `getPublicCharacters`
```solidity
function getPublicCharacters() external view returns (uint256[] memory)
```

### React Hooks

#### `useWeb3()`
```typescript
const { address, isConnected, connectWallet, disconnectWallet } = useWeb3();
```

#### `useNFTContract()`
```typescript
const { createCharacter, isCreating } = useNFTContract();
```

#### `useCharacters()`
```typescript
const { characters, loading } = useCharacters();
```

#### `useChat(characterId)`
```typescript
const { messages, sendMessage, isLoading } = useChat(characterId);
```

### AI Configuration

#### Character Overrides
```typescript
const CHARACTER_OVERRIDES = {
  characterName: {
    style: "Character-specific personality instructions",
    note: "Optional additional notes"
  }
};
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service**
   - Vercel, Netlify, or any static hosting
   - Configure environment variables
   - Set up custom domain

### Smart Contract Deployment

1. **Deploy to Avalanche mainnet**
   ```bash
   npm run deploy:mainnet
   ```

2. **Update production environment**
   ```bash
   VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
   VITE_NFT_CONTRACT_ADDRESS=your_mainnet_contract_address
   ```

### IPFS Configuration

1. **Set up IPFS gateway**
   ```bash
   VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   ```

2. **Configure Pinata (optional)**
   ```bash
   VITE_PINATA_API_KEY=your_api_key
   VITE_PINATA_SECRET_KEY=your_secret_key
   ```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Test Gemini AI integration
npm run test:gemini

# Test character chat
npm run test:chat

# Test Elon image
npm run test:elon
```

### Test Coverage
- **Unit Tests**: Component and hook testing
- **Integration Tests**: AI and blockchain integration
- **E2E Tests**: Full user workflow testing

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build:client     # Build client only
npm run build:server     # Build server only
npm run start            # Start production server
npm run test             # Run test suite
npm run typecheck        # TypeScript type checking
npm run format.fix       # Format code with Prettier
```

### Code Style

- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Git commit message format

### Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests** for new functionality
5. **Submit a pull request**

## 🚨 Troubleshooting

### Common Issues

#### Wallet Connection
- **Problem**: Wallet not connecting
- **Solution**: Ensure wallet is installed and connected to Avalanche Fuji testnet

#### AI Responses Not Working
- **Problem**: Characters giving fallback responses
- **Solution**: Check Gemini API key in `.env` file

#### Character Images Not Loading
- **Problem**: White circular placeholders
- **Solution**: Verify image files exist in `public/images/`

#### Smart Contract Errors
- **Problem**: Transaction failures
- **Solution**: Check network configuration and gas settings

### Debug Mode

Enable debug logging in the browser console:

```typescript
// Add to your component
useEffect(() => {
  console.log('Debug info:', { character, messages, isLoading });
}, [character, messages, isLoading]);
```

## 📚 Additional Resources

### Documentation
- [Elon Musk Setup Guide](./ELON_MUSK_SETUP.md)
- [Gemini AI Setup](./GEMINI_SETUP.md)
- [Smart Contract Documentation](./contracts/README.md)

### External Links
- [Avalanche Documentation](https://docs.avax.network/)
- [Google Gemini AI](https://ai.google.dev/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Ethers.js Documentation](https://docs.ethers.org/)

### Community
- [Avalanche Discord](https://chat.avax.network/)
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Server](https://discord.gg/your-server)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Avalanche Foundation** for blockchain infrastructure
- **Google AI** for Gemini language model
- **shadcn/ui** for beautiful UI components
- **Open Source Community** for various libraries and tools

---

**Built with ❤️ for the Web3 community**

*For support and questions, please open an issue on GitHub or join our Discord community.*
