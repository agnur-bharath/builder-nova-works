# 📁 NFT Chat - Project Structure

> **Complete file organization and project structure documentation**

## 📋 Table of Contents

- [Root Directory](#root-directory)
- [Client Application](#client-application)
- [Smart Contracts](#smart-contracts)
- [Configuration Files](#configuration-files)
- [Documentation](#documentation)
- [Dependencies](#dependencies)
- [File Relationships](#file-relationships)
- [Build Process](#build-process)

## 🗂️ Root Directory

```
builder-nova-works/
├── 📁 client/                    # Frontend React application
├── 📁 contracts/                 # Solidity smart contracts
├── 📁 avatar-api/                # AI avatar generation service
├── 📁 public/                    # Static assets and images
├── 📁 scripts/                   # Utility and deployment scripts
├── 📁 tests/                     # Test files and test data
├── 📁 docs/                      # Additional documentation
├── 📄 .env                       # Environment variables
├── 📄 .env.example              # Environment template
├── 📄 .gitignore                 # Git ignore patterns
├── 📄 package.json               # Dependencies and scripts
├── 📄 package-lock.json          # Locked dependency versions
├── 📄 pnpm-lock.yaml             # pnpm lock file
├── 📄 vite.config.ts             # Vite build configuration
├── 📄 vite.config.server.ts      # Server build configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 README.md                  # Main project documentation
├── 📄 ARCHITECTURE.md            # Technical architecture guide
├── 📄 PROJECT_STRUCTURE.md       # This file
├── 📄 GEMINI_SETUP.md            # Gemini AI setup guide
├── 📄 ELON_MUSK_SETUP.md         # Elon Musk character guide
├── 📄 env.template               # Environment variables template
├── 📄 test-gemini.js             # Gemini API test script
├── 📄 test-chat.js               # Character chat test script
└── 📄 test-elon-image.js         # Elon image test script
```

## 🖥️ Client Application

### Main Application Structure

```
client/
├── 📁 components/                 # Reusable UI components
│   ├── 📁 ui/                    # Base UI components (shadcn/ui)
│   │   ├── 📄 button.tsx         # Button component
│   │   ├── 📄 card.tsx           # Card component
│   │   ├── 📄 input.tsx          # Input component
│   │   ├── 📄 textarea.tsx       # Textarea component
│   │   ├── 📄 badge.tsx          # Badge component
│   │   ├── 📄 tabs.tsx           # Tabs component
│   │   ├── 📄 dialog.tsx         # Dialog component
│   │   ├── 📄 avatar.tsx         # Avatar component
│   │   ├── 📄 scroll-area.tsx    # Scroll area component
│   │   ├── 📄 accordion.tsx      # Accordion component
│   │   ├── 📄 toast.tsx          # Toast notification
│   │   └── 📄 use-toast.ts       # Toast hook
│   ├── 📄 WalletConnect.tsx      # Wallet connection component
│   └── 📄 index.ts               # Component exports
├── 📁 hooks/                     # Custom React hooks
│   ├── 📄 useWeb3.ts             # Web3 wallet management
│   ├── 📄 useNFTContract.ts      # NFT contract interactions
│   ├── 📄 useCharacters.ts       # Character data management
│   ├── 📄 useChat.ts             # Chat functionality
│   └── 📄 index.ts               # Hook exports
├── 📁 lib/                       # Utility libraries
│   ├── 📄 ai.ts                  # AI configuration and validation
│   ├── 📄 contracts.ts           # Smart contract ABIs
│   ├── 📄 web3.ts                # Web3 configuration
│   ├── 📄 ipfs.ts                # IPFS integration
│   ├── 📄 avatar-generator.ts    # AI avatar generation
│   ├── 📄 utils.ts               # General utilities
│   └── 📄 index.ts               # Library exports
├── 📁 pages/                     # Application pages
│   ├── 📄 Index.tsx              # Homepage with character grid
│   ├── 📄 Chat.tsx               # Chat interface
│   └── 📄 index.ts               # Page exports
├── 📁 types/                     # TypeScript type definitions
│   ├── 📄 character.ts            # Character interface types
│   ├── 📄 message.ts              # Message interface types
│   ├── 📄 wallet.ts               # Wallet interface types
│   └── 📄 index.ts                # Type exports
├── 📁 styles/                     # CSS and styling
│   ├── 📄 globals.css             # Global CSS styles
│   ├── 📄 components.css          # Component-specific styles
│   └── 📄 utilities.css           # Utility classes
├── 📁 assets/                     # Static assets
│   ├── 📁 images/                 # Image assets
│   ├── 📁 icons/                  # Icon assets
│   └── 📁 fonts/                  # Font files
├── 📄 App.tsx                     # Main application component
├── 📄 main.tsx                    # Application entry point
├── 📄 index.html                  # HTML template
├── 📄 vite-env.d.ts               # Vite environment types
└── 📄 index.ts                    # Main exports
```

### Component Hierarchy

```
App.tsx
├── Router
│   ├── Index.tsx (Homepage)
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   └── WalletConnect
│   │   ├── Hero Section
│   │   │   ├── Title
│   │   │   ├── Description
│   │   │   └── CTA Buttons
│   │   ├── Character Creation Dialog
│   │   │   ├── Form Fields
│   │   │   ├── Image Selection
│   │   │   └── Submit Button
│   │   ├── Character Tabs
│   │   │   ├── Public Characters
│   │   │   └── Private Characters
│   │   ├── Character Grid
│   │   │   └── CharacterCard
│   │   └── Footer
│   └── Chat.tsx
│       ├── Chat Header
│       │   ├── Back Button
│       │   ├── Character Avatar
│       │   ├── Character Info
│       │   └── WalletConnect
│       ├── Message List
│       │   ├── User Messages
│       │   ├── Character Messages
│       │   └── Loading States
│       └── Message Input
│           ├── Text Input
│           └── Send Button
└── Global Components
    ├── Toast Notifications
    ├── Loading Spinners
    └── Error Boundaries
```

## ⛓️ Smart Contracts

### Contract Structure

```
contracts/
├── 📁 interfaces/                 # Contract interfaces
│   ├── 📄 IChatNFT.sol           # Main NFT contract interface
│   ├── 📄 IERC721.sol            # ERC721 interface
│   └── 📄 IERC165.sol            # ERC165 interface
├── 📁 libraries/                  # Contract libraries
│   ├── 📄 Strings.sol            # String utilities
│   ├── 📄 Counters.sol            # Counter utilities
│   └── 📄 SafeMath.sol            # Safe math operations
├── 📁 upgrades/                   # Upgradeable contracts
│   └── 📄 ChatNFTUpgradeable.sol # Upgradeable version
├── 📄 ChatNFT.sol                 # Main NFT contract
├── 📄 ChatNFTFactory.sol          # Factory contract
├── 📄 ChatNFTMarketplace.sol      # Marketplace contract
└── 📄 README.md                   # Contract documentation
```

### Contract Dependencies

```
ChatNFT.sol
├── IERC721.sol                    # ERC721 standard
├── IERC165.sol                    # ERC165 standard
├── Ownable.sol                    # Access control
├── Strings.sol                    # String utilities
├── Counters.sol                   # Counter utilities
└── SafeMath.sol                   # Safe math operations

ChatNFTFactory.sol
├── ChatNFT.sol                    # Main contract
├── IERC721.sol                    # ERC721 interface
└── Ownable.sol                    # Access control

ChatNFTMarketplace.sol
├── ChatNFT.sol                    # Main contract
├── IERC721.sol                    # ERC721 interface
├── ReentrancyGuard.sol            # Security
└── Pausable.sol                   # Pausable functionality
```

## ⚙️ Configuration Files

### Build Configuration

```
vite.config.ts                     # Main Vite configuration
├── React plugin configuration
├── Path alias configuration
├── Server configuration
└── Build optimization

vite.config.server.ts              # Server build configuration
├── Server-specific settings
├── API routes
└── Middleware configuration

tsconfig.json                      # TypeScript configuration
├── Compiler options
├── Path mapping
├── Include/exclude patterns
└── Strict type checking

tailwind.config.js                 # Tailwind CSS configuration
├── Content paths
├── Theme customization
├── Plugin configuration
└── Color palette

postcss.config.js                  # PostCSS configuration
├── Tailwind CSS plugin
├── Autoprefixer
└── CSS processing
```

### Environment Configuration

```
.env                               # Environment variables
├── VITE_GEMINI_API_KEY           # Gemini AI API key
├── VITE_AVALANCHE_RPC_URL        # Avalanche RPC endpoint
├── VITE_NFT_CONTRACT_ADDRESS     # NFT contract address
├── VITE_PINATA_API_KEY           # Pinata IPFS API key
└── VITE_PINATA_SECRET_KEY        # Pinata IPFS secret key

.env.example                       # Environment template
├── Template variables
├── Example values
└── Documentation

env.template                       # Environment template
├── Required variables
├── Optional variables
└── Setup instructions
```

## 📚 Documentation

### Documentation Structure

```
docs/
├── 📁 api/                        # API documentation
│   ├── 📄 smart-contracts.md      # Smart contract API
│   ├── 📄 ai-service.md           # AI service API
│   └── 📄 ipfs-service.md         # IPFS service API
├── 📁 guides/                     # User guides
│   ├── 📄 getting-started.md      # Getting started guide
│   ├── 📄 character-creation.md   # Character creation guide
│   ├── 📄 wallet-setup.md         # Wallet setup guide
│   └── 📄 troubleshooting.md      # Troubleshooting guide
├── 📁 development/                # Development guides
│   ├── 📄 setup.md                # Development setup
│   ├── 📄 contributing.md          # Contributing guidelines
│   ├── 📄 testing.md              # Testing guide
│   └── 📄 deployment.md           # Deployment guide
└── 📁 architecture/               # Architecture documentation
    ├── 📄 system-design.md        # System design
    ├── 📄 data-flow.md            # Data flow diagrams
    └── 📄 security.md             # Security considerations
```

### Main Documentation Files

```
README.md                          # Main project documentation
├── Project overview
├── Features
├── Getting started
├── Usage examples
└── Contributing guidelines

ARCHITECTURE.md                    # Technical architecture
├── System overview
├── Component architecture
├── Data flow
├── Security considerations
└── Performance optimization

PROJECT_STRUCTURE.md               # This file
├── File organization
├── Directory structure
├── Dependencies
└── Build process

GEMINI_SETUP.md                    # Gemini AI setup
├── API key setup
├── Configuration
├── Testing
└── Troubleshooting

ELON_MUSK_SETUP.md                 # Elon Musk character guide
├── Character creation
├── Image setup
├── Personality configuration
└── Testing
```

## 📦 Dependencies

### Package Dependencies

```
package.json                       # Main dependencies
├── 📦 @google/generative-ai      # Gemini AI SDK
├── 📦 ethers                     # Web3 library
├── 📦 react                      # React framework
├── 📦 react-dom                  # React DOM
├── 📦 react-router-dom           # Routing
├── 📦 lucide-react               # Icons
├── 📦 class-variance-authority   # Component variants
├── 📦 clsx                       # Class utilities
├── 📦 tailwind-merge             # Tailwind utilities
└── 📦 framer-motion              # Animations

Dev Dependencies
├── 📦 @types/react               # React types
├── 📦 @types/react-dom           # React DOM types
├── 📦 @vitejs/plugin-react-swc   # Vite React plugin
├── 📦 typescript                 # TypeScript compiler
├── 📦 tailwindcss                # CSS framework
├── 📦 postcss                    # CSS processor
├── 📦 autoprefixer               # CSS autoprefixer
├── 📦 prettier                   # Code formatter
├── 📦 eslint                     # Code linter
└── 📦 vitest                     # Testing framework
```

### Dependency Relationships

```
Core Dependencies
├── React Ecosystem
│   ├── react                     # Core framework
│   ├── react-dom                 # DOM rendering
│   └── react-router-dom          # Routing
├── Web3 Ecosystem
│   ├── ethers                    # Blockchain interaction
│   └── @google/generative-ai     # AI integration
└── UI Ecosystem
    ├── lucide-react              # Icon library
    ├── class-variance-authority  # Component variants
    └── framer-motion             # Animation library

Build Tools
├── Vite                          # Build tool
├── TypeScript                    # Type system
├── Tailwind CSS                  # CSS framework
└── PostCSS                       # CSS processor

Development Tools
├── ESLint                        # Code linting
├── Prettier                      # Code formatting
├── Vitest                        # Testing
└── SWC                           # Fast compiler
```

## 🔗 File Relationships

### Import Dependencies

```
Main Entry Points
├── main.tsx                      # Application entry
│   ├── App.tsx                   # Main app component
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts             # Vite types
└── App.tsx                       # App component
    ├── Router                    # Routing
    ├── Index.tsx                 # Homepage
    └── Chat.tsx                  # Chat page

Component Dependencies
├── Index.tsx                     # Homepage
│   ├── WalletConnect             # Wallet connection
│   ├── useCharacters             # Character data
│   ├── useNFTContract            # Contract interaction
│   └── CreateCharacterDialog     # Character creation
└── Chat.tsx                      # Chat page
    ├── useChat                   # Chat functionality
    ├── useCharacters             # Character data
    └── WalletConnect             # Wallet connection

Hook Dependencies
├── useWeb3                       # Web3 functionality
│   ├── ethers                    # Blockchain library
│   └── window.ethereum           # Wallet provider
├── useNFTContract                # Contract interaction
│   ├── ethers                    # Blockchain library
│   ├── contracts.ts              # Contract ABIs
│   └── web3.ts                   # Web3 configuration
├── useCharacters                 # Character management
│   ├── ethers                    # Blockchain library
│   ├── contracts.ts              # Contract ABIs
│   └── web3.ts                   # Web3 configuration
└── useChat                       # Chat functionality
    ├── ai.ts                     # AI configuration
    ├── useWeb3                   # Web3 functionality
    └── useCharacters             # Character data
```

### Data Flow Dependencies

```
Data Sources
├── Blockchain Data
│   ├── useWeb3                   # Wallet connection
│   ├── useNFTContract            # Contract interaction
│   └── useCharacters             # Character data
├── AI Services
│   ├── useChat                   # Chat functionality
│   ├── ai.ts                     # AI configuration
│   └── @google/generative-ai     # AI SDK
└── IPFS Storage
    ├── ipfs.ts                   # IPFS integration
    ├── avatar-generator.ts       # Avatar generation
    └── Pinata API                # IPFS pinning

State Management
├── Local State
│   ├── useState                  # Component state
│   ├── useRef                    # DOM references
│   └── useEffect                 # Side effects
├── Shared State
│   ├── useContext                # Global state
│   ├── useLocalStorage           # Persistent state
│   └── Custom hooks              # Business logic
└── External State
    ├── Blockchain state          # Contract data
    ├── AI state                  # Chat responses
    └── IPFS state                # File storage
```

## 🏗️ Build Process

### Development Build

```
Development Workflow
├── npm run dev                   # Start dev server
│   ├── Vite dev server           # Development server
│   ├── Hot module replacement    # Live reloading
│   ├── TypeScript compilation    # Type checking
│   └── Tailwind compilation      # CSS processing
├── File watching                 # Auto-rebuild
│   ├── Source file changes       # React components
│   ├── Configuration changes     # Config files
│   └── Asset changes             # Images, styles
└── Browser development           # Development tools
    ├── React DevTools            # Component inspection
    ├── Browser DevTools          # Console, network
    └── Hot reloading             # Instant updates
```

### Production Build

```
Production Build Process
├── npm run build                 # Build application
│   ├── npm run build:client      # Client build
│   │   ├── TypeScript compilation # Type checking
│   │   ├── React compilation      # Component bundling
│   │   ├── CSS optimization       # Tailwind processing
│   │   ├── Asset optimization     # Image compression
│   │   └── Code splitting         # Bundle optimization
│   └── npm run build:server      # Server build
│       ├── Server compilation     # Node.js build
│       ├── API routes             # Server endpoints
│       └── Middleware             # Server middleware
├── Build artifacts               # Generated files
│   ├── dist/client/              # Client build
│   │   ├── index.html            # HTML entry
│   │   ├── assets/               # Compiled assets
│   │   └── manifest.json         # PWA manifest
│   └── dist/server/              # Server build
│       ├── node-build.mjs        # Server entry
│       └── api/                  # API routes
└── Deployment                    # Production deployment
    ├── Static hosting             # Client files
    ├── Server deployment          # API server
    └── Environment configuration  # Production env
```

### Testing Process

```
Testing Workflow
├── npm run test                  # Run test suite
│   ├── Unit tests                # Component testing
│   ├── Hook testing              # Custom hook testing
│   ├── Integration tests         # Service testing
│   └── E2E tests                 # End-to-end testing
├── npm run test:gemini           # Test Gemini AI
│   ├── API key validation        # Key verification
│   ├── Response generation       # AI testing
│   └── Error handling            # Error scenarios
├── npm run test:chat             # Test character chat
│   ├── Character personalities   # Personality testing
│   ├── AI responses              # Response validation
│   └── Chat flow                 # Conversation flow
└── npm run test:elon             # Test Elon image
    ├── Image loading             # Image verification
    ├── File existence            # File validation
    └── Path resolution           # Path testing
```

## 🔄 Development Workflow

### Git Workflow

```
Git Repository Structure
├── main                          # Production branch
├── develop                       # Development branch
├── feature/*                     # Feature branches
├── bugfix/*                      # Bug fix branches
└── release/*                     # Release branches

Development Process
├── Feature Development
│   ├── Create feature branch     # git checkout -b feature/new-feature
│   ├── Implement feature         # Code development
│   ├── Test feature              # Run tests
│   ├── Commit changes            # git commit -m "feat: add new feature"
│   └── Push branch               # git push origin feature/new-feature
├── Code Review
│   ├── Create pull request       # GitHub PR
│   ├── Code review               # Peer review
│   ├── Address feedback          # Code updates
│   └── Merge feature             # Merge to develop
└── Release Process
    ├── Create release branch     # git checkout -b release/v1.0.0
    ├── Version bump              # Update version
    ├── Final testing             # Release testing
    ├── Merge to main             # Production merge
    └── Create tag                # git tag v1.0.0
```

### Continuous Integration

```
CI/CD Pipeline
├── Code Quality
│   ├── Linting                   # ESLint checks
│   ├── Formatting                # Prettier formatting
│   ├── Type checking             # TypeScript compilation
│   └── Security scanning         # Vulnerability checks
├── Testing
│   ├── Unit tests                # Component testing
│   ├── Integration tests         # Service testing
│   ├── E2E tests                 # End-to-end testing
│   └── Coverage reporting        # Test coverage
├── Building
│   ├── Client build              # React build
│   ├── Server build              # Node.js build
│   ├── Asset optimization        # File optimization
│   └── Bundle analysis           # Size analysis
└── Deployment
    ├── Staging deployment        # Test environment
    ├── Production deployment      # Live environment
    ├── Health checks             # Service monitoring
    └── Rollback capability       # Emergency rollback
```

---

**This project structure document provides a comprehensive overview of the NFT Chat application's file organization, dependencies, and build processes. For specific implementation details, refer to the individual files and their inline documentation.**
