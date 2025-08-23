import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { cn } from "@/lib/utils";

export function WalletConnect() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openInExplorer = () => {
    if (address) {
      window.open(`https://snowtrace.io/address/${address}`, "_blank");
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        className="gradient-primary web3-glow hover:animate-glow-pulse"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="web3-border gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="hidden sm:inline">{formatAddress(address!)}</span>
          <Wallet className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-effect" align="end">
        <Card className="border-0 bg-transparent">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Wallet Connected</h3>
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-400 border-green-500/30"
              >
                Avalanche
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Address</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 font-mono text-sm">
                <span className="flex-1 truncate">{address}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyAddress}
                  className={cn("h-6 w-6 p-0", copied && "text-green-500")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openInExplorer}
                className="flex-1"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Explorer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <LogOut className="w-3 h-3 mr-2" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
