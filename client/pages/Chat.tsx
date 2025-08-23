import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Sparkles, Zap, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacters, useChat } from '@/hooks/useWeb3';
import { WalletConnect } from '@/components/WalletConnect';

interface Message {
  id: string;
  content: string;
  isFromCharacter: boolean;
  timestamp: Date;
}

interface ChatCharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatarUrl: string;
  creator: string;
  isPublic: boolean;
}

const mockCharacter: ChatCharacter = {
  id: '1',
  name: 'Aria the Mystic',
  description: 'A wise sorceress from the ethereal realm',
  personality: 'Wise, mysterious, and knowledgeable about ancient magic',
  avatarUrl: '/placeholder.svg',
  creator: '0x1234...5678',
  isPublic: true,
};

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Greetings, traveler. I sense you seek knowledge from beyond the veil. What mysteries would you have me illuminate?',
    isFromCharacter: true,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    content: 'Hello Aria! I\'m curious about ancient magic. Can you tell me about elemental spells?',
    isFromCharacter: false,
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: '3',
    content: 'Ah, the elemental arts... *traces glowing symbols in the air* The four cardinal elements - Fire, Water, Earth, and Air - each hold profound secrets. Fire burns with passion and transformation, while Water flows with adaptability and healing. Would you learn of their deeper mysteries?',
    isFromCharacter: true,
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
  },
];

export default function Chat() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const { characters } = useCharacters();
  const { messages, sendMessage, isLoading } = useChat(characterId!);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const character = characters.find(c => c.id === characterId) || mockCharacter;

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isFromCharacter: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(newMessage),
        isFromCharacter: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage: string): string => {
    // Mock AI response - replace with actual AI integration
    const responses = [
      '*nods knowingly* Your question reveals a deep curiosity about the arcane arts...',
      'The ancient texts speak of such matters... *consults ethereal grimoire*',
      'Interesting... I sense great potential in your inquiry. Let me share what I know...',
      '*eyes glow with mystical energy* The answer lies within the cosmic patterns...',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarImage src={mockCharacter.avatarUrl} />
              <AvatarFallback>
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg truncate">{mockCharacter.name}</h1>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  NFT
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {mockCharacter.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="container mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.isFromCharacter ? "justify-start" : "justify-end"
                )}
              >
                {message.isFromCharacter && (
                  <Avatar className="w-8 h-8 ring-2 ring-primary/20 shrink-0">
                    <AvatarImage src={mockCharacter.avatarUrl} />
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[70%] space-y-2",
                    message.isFromCharacter ? "order-2" : "order-1"
                  )}
                >
                  <Card
                    className={cn(
                      "relative",
                      message.isFromCharacter
                        ? "glass-effect web3-border"
                        : "bg-primary text-primary-foreground border-primary/30"
                    )}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </CardContent>
                  </Card>
                  <div
                    className={cn(
                      "flex items-center gap-2 text-xs text-muted-foreground",
                      message.isFromCharacter ? "justify-start" : "justify-end"
                    )}
                  >
                    {message.isFromCharacter && (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>

                {!message.isFromCharacter && (
                  <Avatar className="w-8 h-8 ring-2 ring-primary/20 shrink-0">
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 ring-2 ring-primary/20 shrink-0">
                  <AvatarImage src={mockCharacter.avatarUrl} />
                  <AvatarFallback>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="glass-effect web3-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {mockCharacter.name} is typing...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder={`Message ${mockCharacter.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12 web3-border"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="absolute right-1 top-1 bottom-1 gradient-primary hover:web3-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>Powered by Avalanche & AI</span>
            </div>
            <div>
              {newMessage.length}/500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
