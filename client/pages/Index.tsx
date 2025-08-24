import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageCircle, Sparkles, Zap, Users, Bot, Activity, Server, Shield, Globe } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { WalletConnect } from "@/components/WalletConnect";
import { useCharacters, useNFTContract, useWeb3 } from "@/hooks/useWeb3";
import { useToast } from "@/components/ui/use-toast";
import { avatarGenerator } from "@/lib/avatar-generator";
import { uploadImageToIPFS, uploadMetadataToIPFS } from "@/lib/ipfs";
import { useNavigate } from "react-router-dom";

import type { Character } from "@/hooks/useWeb3";

export default function Index() {
  const navigate = useNavigate();
  const { characters, loading } = useCharacters();
  const { createCharacter, isCreating } = useNFTContract();
  const { address, isConnected, connectWallet } = useWeb3();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    personality: "",
    isPublic: false,
    useCustomImage: false,
    customImagePath: "",
  });

  // Hard-coded override for known public characters.
  // Replace these with your actual public/IPFS URLs or file paths in /public.
  const HARDCODED_AVATARS: Record<string, string> = {
    dog: "/images/dog.png",
    luffy: "/images/luffy.png",
    zoro: "/images/zoro.png",
    itachi: "/images/itachi.png",
    elon: "/images/Elon.png",
  };

  const handleCreateCharacter = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet before minting.",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }
    try {
      let avatarIpfsUrl: string;
      
      if (newCharacter.useCustomImage && newCharacter.customImagePath) {
        // Use custom image from public folder
        toast({ title: "Using custom image..." });
        avatarIpfsUrl = newCharacter.customImagePath;
      } else {
        // Generate AI avatar
        toast({ title: "Generating avatar..." });
        const avatarDataUrl = await avatarGenerator.generateCharacterAvatar(
          newCharacter.description
        );
        if (!avatarDataUrl) throw new Error("Avatar generation failed");
        toast({ title: "Uploading avatar to IPFS..." });
        avatarIpfsUrl = await uploadImageToIPFS(avatarDataUrl);
        if (!avatarIpfsUrl) throw new Error("Avatar IPFS upload failed");
      }
      
      toast({ title: "Uploading metadata to IPFS..." });
      const metadata = {
        name: newCharacter.name,
        description: newCharacter.description,
        personality: newCharacter.personality,
        image: avatarIpfsUrl,
        isPublic: newCharacter.isPublic,
      };
      const metadataIpfsUrl = await uploadMetadataToIPFS(metadata);
      if (!metadataIpfsUrl) throw new Error("Metadata IPFS upload failed");
      toast({ title: "Sending transaction to mint NFT..." });
      await createCharacter({
        ...newCharacter,
        avatarUrl: avatarIpfsUrl,
        tokenURI: metadataIpfsUrl,
      });
      toast({ title: "Character minted!", description: "Your NFT is on-chain." });
      setIsCreateDialogOpen(false);
      setNewCharacter({
        name: "",
        description: "",
        personality: "",
        isPublic: false,
        useCustomImage: false,
        customImagePath: "",
      });
    } catch (error: any) {
      console.error("Failed to create character:", error);
      toast({
        title: "Minting failed",
        description: error?.message || String(error),
        variant: "destructive",
      });
    }
  };

  const handleChatWithCharacter = (character: Character) => {
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
              Create unique AI characters as NFTs and chat with them on the
              Avalanche blockchain. Each character has its own personality and
              can learn from conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="gradient-primary web3-glow hover:animate-glow-pulse"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your Character
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect">
                  <DialogHeader>
                    <DialogTitle>Create AI Character NFT</DialogTitle>
                    <DialogDescription>
                      Describe your character and it will be minted as an NFT on
                      Avalanche
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Character Name
                      </label>
                      <Input
                        placeholder="Enter character name..."
                        value={newCharacter.name}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your character's appearance and background..."
                        value={newCharacter.description}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Personality</label>
                      <Textarea
                        placeholder="Describe how your character behaves and talks..."
                        value={newCharacter.personality}
                        onChange={(e) =>
                          setNewCharacter({
                            ...newCharacter,
                            personality: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="useCustomImage"
                          checked={newCharacter.useCustomImage}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Pre-fill Elon Musk details when custom image is selected
                              setNewCharacter({
                                ...newCharacter,
                                useCustomImage: true,
                                customImagePath: "/images/Elon.png",
                                name: "Elon Musk",
                                description: "Visionary entrepreneur and CEO of Tesla, SpaceX, and X (formerly Twitter). Known for revolutionizing electric vehicles, space exploration, and AI development. A forward-thinking innovator focused on sustainable energy and interplanetary colonization.",
                                personality: "Innovative, ambitious, and slightly eccentric. Uses technical jargon and references space, AI, electric vehicles, and the future. Optimistic about humanity's potential, occasionally humorous and direct. Passionate about solving global challenges through technology."
                              });
                            } else {
                              // Clear details when custom image is unchecked
                              setNewCharacter({
                                ...newCharacter,
                                useCustomImage: false,
                                customImagePath: "",
                                name: "",
                                description: "",
                                personality: ""
                              });
                            }
                          }}
                        />
                        <label htmlFor="useCustomImage" className="text-sm">
                          Use Elon Musk image (Elon.png) - Auto-fill details
                        </label>
                      </div>
                      
                      {newCharacter.useCustomImage && (
                        <div className="p-3 bg-muted/50 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <img 
                              src="/images/Elon.png" 
                              alt="Elon Musk" 
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium">Elon Musk Character</p>
                              <p className="text-xs text-muted-foreground">
                                This will use the Elon.png image from your public folder
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={newCharacter.isPublic}
                          onChange={(e) =>
                            setNewCharacter({
                              ...newCharacter,
                              isPublic: e.target.checked,
                            })
                          }
                        />
                        <label htmlFor="isPublic" className="text-sm">
                          Make character publicly available
                        </label>
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateCharacter}
                      disabled={isCreating}
                      className="w-full gradient-primary"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isCreating ? "Minting..." : "Mint Character NFT"}
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

  {/* Tokenomics and FAQ moved below features per request - placeholder here */}

      {/* CTA Banner */}
      <div className="container mx-auto px-4 py-12">
        <div className="gradient-primary rounded-xl p-8 text-center text-white web3-glow">
          <h3 className="text-3xl font-bold mb-2">Create your legend on Avalanche</h3>
          <p className="mb-6">Mint AI-powered characters as NFTs, build communities, and share stories.</p>
          <div className="flex items-center justify-center gap-4">
            <Button className="bg-white text-black" onClick={() => setIsCreateDialogOpen(true)}>
              Create Character
            </Button>
            <Button variant="outline">Join Discord</Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="glass-effect animate-pulse p-0">
                    <div className="h-80 md:h-96 lg:h-96 bg-muted rounded-t-lg" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {characters
                  .filter((c) => c.isPublic)
                  .map((character) => {
                    const key = (character.name || "").toLowerCase();
                    const avatarSrc = HARDCODED_AVATARS[key] ?? character.avatarUrl;
                    return (
                    <Card
                      key={character.id}
                      className="group hover:scale-105 transition-all duration-300 glass-effect web3-border overflow-hidden p-0"
                    >
                      <div className="relative">
                        <img
                          src={avatarSrc}
                          alt={character.name}
                          className="w-full h-80 md:h-96 lg:h-96 object-cover object-top"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="secondary"
                            className="bg-primary/20 text-primary border-primary/30"
                          >
                            Public
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-lg font-semibold">{character.name}</div>
                            <div className="text-xs text-muted-foreground">by {character.creator}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageCircle className="w-3 h-3" />
                            {Math.floor(Math.random() * 2000) + 100}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 mb-3 line-clamp-2">
                          {character.description}
                        </p>
                        <Button
                          onClick={() => handleChatWithCharacter(character)}
                          className="w-full gradient-primary group-hover:web3-glow py-2 text-sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </div>
                    </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="private" className="mt-8">
            {!isConnected ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Wallet to View Private Characters</h3>
                <p className="text-muted-foreground mb-6">Connect your wallet to see your private NFT characters</p>
                <Button onClick={connectWallet} className="gradient-primary">
                  <Bot className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : characters.filter(c => !c.isPublic && c.creator.toLowerCase() === address?.toLowerCase()).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Private Characters Yet</h3>
                <p className="text-muted-foreground mb-6">Create your first private AI character NFT to get started</p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gradient-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Character
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {characters
                  .filter((c) => !c.isPublic && c.creator.toLowerCase() === address?.toLowerCase())
                  .map((character) => {
                    const key = (character.name || "").toLowerCase();
                    const avatarSrc = HARDCODED_AVATARS[key] ?? character.avatarUrl;
                    return (
                    <Card
                      key={character.id}
                      className="group hover:scale-105 transition-all duration-300 glass-effect web3-border overflow-hidden p-0"
                    >
                      <div className="relative">
                        <img
                          src={avatarSrc}
                          alt={character.name}
                          className="w-full h-80 md:h-96 lg:h-96 object-cover object-top"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge
                            variant="secondary"
                            className="bg-amber-500/20 text-amber-600 border-amber-500/30"
                          >
                            Private
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-lg font-semibold">{character.name}</div>
                            <div className="text-xs text-muted-foreground">by {character.creator}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageCircle className="w-3 h-3" />
                            Private
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 mb-3 line-clamp-2">
                          {character.description}
                        </p>
                        <Button
                          onClick={() => handleChatWithCharacter(character)}
                          className="w-full gradient-primary group-hover:web3-glow py-2 text-sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </div>
                    </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Section */}
      <div className="bg-card/50 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NFT Chat?</h2>
            <p className="text-muted-foreground">
              Experience the future of AI interaction on the blockchain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Blockchain Ownership</h3>
              <p className="text-muted-foreground">
                Own your AI characters as NFTs on Avalanche blockchain
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                AI-Powered Conversations
              </h3>
              <p className="text-muted-foreground">
                Each character has unique personality and memory
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Avatar Generation</h3>
              <p className="text-muted-foreground">
                AI-generated avatars using FLUX.1-dev model
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Tokenomics & FAQ (visible below features) */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            {/* left intentionally blank for layout balance */}
          </div>

          <div className="w-full lg:w-96 space-y-4">
            <Card className="glass-effect p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Tokenomics</div>
                  <div className="text-xs text-muted-foreground">Balanced supply for creators and community rewards</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>Creators</div>
                  <div className="font-medium">40%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-web3-purple to-web3-cyan w-2/5" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>Community</div>
                  <div className="font-medium">35%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-web3-purple to-web3-cyan w-1/3" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>Reserve</div>
                  <div className="font-medium">25%</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-web3-purple to-web3-cyan w-1/4" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible>
              <AccordionItem value="q1">
                <AccordionTrigger>How do I mint a character?</AccordionTrigger>
                <AccordionContent>
                  Connect your Avalanche-compatible wallet, describe your character and click Mint. The character metadata will be stored on IPFS and the NFT minted on-chain.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Can characters learn over time?</AccordionTrigger>
                <AccordionContent>
                  Yes — we plan on adding optional on-chain memory and off-chain knowledge stores so characters can remember important events.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Where are avatars stored?</AccordionTrigger>
                <AccordionContent>
                  Avatars are uploaded to IPFS via Pinata (or your preferred gateway) and referenced in the NFT metadata.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="p-3 glass-effect rounded-md">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Luffy minted "Captain"</div>
                  <div className="text-xs text-muted-foreground">2m ago</div>
                </div>
              </div>
              <div className="p-3 glass-effect rounded-md">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Itachi updated personality</div>
                  <div className="text-xs text-muted-foreground">10m ago</div>
                </div>
              </div>
              <div className="p-3 glass-effect rounded-md">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Zoro started a duel chat</div>
                  <div className="text-xs text-muted-foreground">1h ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
