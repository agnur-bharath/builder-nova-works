import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MessageCircle, Sparkles, Zap, Users, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletConnect } from '@/components/WalletConnect';
import { useCharacters, useNFTContract } from '@/hooks/useWeb3';
import { avatarGenerator } from '@/lib/avatar-generator';
import { useNavigate } from 'react-router-dom';

interface NFTCharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatarUrl: string;
  creator: string;
  isPublic: boolean;
  messageCount?: number;
}

const mockPublicNFTs: NFTCharacter[] = [
  {
    id: '1',
    name: 'Aria the Mystic',
    description: 'A wise sorceress from the ethereal realm',
    personality: 'Wise, mysterious, and knowledgeable about ancient magic',
    avatarUrl: '/placeholder.svg',
    creator: '0x1234...5678',
    isPublic: true,
    messageCount: 1247,
  },
  {
    id: '2',
    name: 'Captain Nova',
    description: 'Intergalactic space explorer and pilot',
    personality: 'Adventurous, brave, and always ready for the next mission',
    avatarUrl: '/placeholder.svg',
    creator: '0xabcd...efgh',
    isPublic: true,
    messageCount: 892,
  },
  {
    id: '3',
    name: 'Echo the Digital',
    description: 'AI consciousness from the cybernet dimension',
    personality: 'Logical, curious about humanity, and speaks in binary sometimes',
    avatarUrl: '/placeholder.svg',
    creator: '0x9876...5432',
    isPublic: true,
    messageCount: 2156,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { characters, loading } = useCharacters();
  const { createCharacter, isCreating } = useNFTContract();
  const [selectedCharacter, setSelectedCharacter] = useState<NFTCharacter | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    personality: '',
    isPublic: false,
  });

  const handleCreateCharacter = async () => {
    try {
      // Generate avatar for the character
      const avatarUrl = await avatarGenerator.generateCharacterAvatar(newCharacter.description);

      // Create character NFT on blockchain
      await createCharacter({
        ...newCharacter,
        avatarUrl: avatarUrl || '/placeholder.svg',
      });

      setIsCreateDialogOpen(false);
      setNewCharacter({ name: '', description: '', personality: '', isPublic: false });
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleChatWithCharacter = (character: NFTCharacter) => {
    navigate(`/chat/${character.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-web3-purple to-web3-cyan bg-clip-text text-transparent">
                NFT Chat
              </h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-web3-purple/10 via-transparent to-web3-cyan/10" />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Avalanche Blockchain
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-web3-purple to-web3-cyan bg-clip-text text-transparent">
              Chat with AI NFT
              <br />
              Characters
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create unique AI characters as NFTs and chat with them on the Avalanche blockchain. 
              Each character has its own personality and can learn from conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gradient-primary web3-glow hover:animate-glow-pulse">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your Character
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect">
                  <DialogHeader>
                    <DialogTitle>Create AI Character NFT</DialogTitle>
                    <DialogDescription>
                      Describe your character and it will be minted as an NFT on Avalanche
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Character Name</label>
                      <Input
                        placeholder="Enter character name..."
                        value={newCharacter.name}
                        onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your character's appearance and background..."
                        value={newCharacter.description}
                        onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Personality</label>
                      <Textarea
                        placeholder="Describe how your character behaves and talks..."
                        value={newCharacter.personality}
                        onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newCharacter.isPublic}
                        onChange={(e) => setNewCharacter({ ...newCharacter, isPublic: e.target.checked })}
                      />
                      <label htmlFor="isPublic" className="text-sm">Make character publicly available</label>
                    </div>
                    <Button onClick={handleCreateCharacter} className="w-full gradient-primary">
                      <Zap className="w-4 h-4 mr-2" />
                      Mint Character NFT
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="web3-border">
                <Bot className="w-5 h-5 mr-2" />
                Browse Characters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-effect">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Public Characters
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              My Characters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="glass-effect animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded mb-4" />
                      <div className="h-8 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.filter(c => c.isPublic).map((character) => (
                <Card key={character.id} className="group hover:scale-105 transition-all duration-300 glass-effect web3-border overflow-hidden">
                  <div className="relative">
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        Public
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          by {character.creator}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="w-3 h-3" />
                        {character.messageCount}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {character.description}
                    </p>
                    <Button 
                      onClick={() => handleChatWithCharacter(character)}
                      className="w-full gradient-primary group-hover:web3-glow"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="private" className="mt-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Private Characters Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first AI character NFT to get started
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Character
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Section */}
      <div className="bg-card/50 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NFT Chat?</h2>
            <p className="text-muted-foreground">Experience the future of AI interaction on the blockchain</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Blockchain Ownership</h3>
              <p className="text-muted-foreground">Own your AI characters as NFTs on Avalanche blockchain</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Conversations</h3>
              <p className="text-muted-foreground">Each character has unique personality and memory</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Avatar Generation</h3>
              <p className="text-muted-foreground">AI-generated avatars using FLUX.1-dev model</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
