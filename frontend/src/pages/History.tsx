import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MessageSquare, Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { API_CONFIG } from "@/config/api";
import { format } from "date-fns";

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
  source?: 'backend' | 'supabase';
};

const History = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { walletAddress, isConnected } = useWallet();

  // Reload conversations when component mounts, wallet changes, or location changes
  useEffect(() => {
    // Force reload when navigating to this page
    loadConversations();
  }, [walletAddress, isConnected, location.pathname]); // Reload when navigating to this page

  // Also reload when page gains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === '/history') {
        loadConversations();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [walletAddress, isConnected, location.pathname]);

  const loadConversations = async () => {
    try {
      // Load from backend if wallet is connected
      if (isConnected && walletAddress) {
        const response = await fetch(`${API_CONFIG.BACKEND_URL}/chat/history?wallet_address=${walletAddress}`, {
          headers: {
            'Authorization': `Wallet ${walletAddress}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const backendConversations = data.conversations || [];
          // Mark conversations as from backend so we know where to delete them
          setConversations(backendConversations.map((conv: Conversation) => ({
            ...conv,
            source: 'backend' as const
          })));
          return;
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Backend returned error:', response.status, errorData);
          // Don't fall through to Supabase if wallet is connected - backend should be the source of truth
          setConversations([]);
          return;
        }
      }
      
      // Fallback to Supabase (only if configured and wallet not connected)
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.debug('Supabase load error:', error);
        setConversations([]);
        return;
      }

      // Mark conversations as from Supabase
      setConversations((data || []).map((conv: Conversation) => ({
        ...conv,
        source: 'supabase' as const
      })));
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Don't clear conversations on error - keep existing ones
      // setConversations([]);
    }
  };

  const deleteConversation = async (id: string) => {
    // Find the conversation to determine its source
    const conversation = conversations.find(c => c.id === id);
    
    // Delete from backend if wallet is connected OR conversation is from backend
    if ((isConnected && walletAddress) || conversation?.source === 'backend') {
      try {
        const response = await fetch(`${API_CONFIG.BACKEND_URL}/chat/conversation/${id}?wallet_address=${walletAddress}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Wallet ${walletAddress}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          toast({ title: "Conversation deleted" });
          loadConversations();
          return;
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to delete conversation:', response.status, errorData);
          toast({ 
            title: "Error deleting conversation", 
            description: errorData.error || `Server returned ${response.status}`,
            variant: "destructive" 
          });
          return;
        }
      } catch (error) {
        console.error('Failed to delete from backend:', error);
        toast({ title: "Error deleting conversation", variant: "destructive" });
        return;
      }
    }
    
    // Fallback to Supabase (only if conversation is from Supabase or wallet not connected)
    if (conversation?.source === 'supabase' || (!isConnected && !walletAddress)) {
      try {
        const { error } = await supabase.from("conversations").delete().eq("id", id);

        if (error) {
          toast({ title: "Error deleting conversation", variant: "destructive" });
          return;
        }

        toast({ title: "Conversation deleted" });
        loadConversations();
      } catch (error) {
        toast({ title: "Error deleting conversation", variant: "destructive" });
      }
    } else {
      // If we get here, we tried backend but it failed, and conversation isn't from Supabase
      toast({ title: "Error deleting conversation", variant: "destructive" });
    }
  };

  const clearAllHistory = async () => {
    // Clear from backend if wallet is connected
    if (isConnected && walletAddress) {
      try {
        // Delete all conversations for this wallet
        const deletePromises = conversations.map(async (conv) => {
          const response = await fetch(`${API_CONFIG.BACKEND_URL}/chat/conversation/${conv.id}?wallet_address=${walletAddress}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Wallet ${walletAddress}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error(`Failed to delete conversation ${conv.id}:`, response.status, errorData);
            throw new Error(`Failed to delete ${conv.id}: ${errorData.error || response.status}`);
          }
          return response;
        });
        
        await Promise.all(deletePromises);
        toast({ title: "All conversations cleared" });
        setConversations([]);
        setShowClearDialog(false);
        return;
      } catch (error) {
        console.error('Failed to clear from backend:', error);
        toast({ 
          title: "Error clearing history", 
          description: error instanceof Error ? error.message : 'Some conversations may not have been deleted',
          variant: "destructive" 
        });
        // Still reload to show current state
        loadConversations();
        return;
      }
    }
    
    // Fallback to Supabase (delete all conversations)
    try {
      // Get all conversation IDs first, then delete them one by one
      const { data: allConvs, error: selectError } = await supabase
        .from("conversations")
        .select("id");
      
      if (selectError) {
        console.debug('Supabase select error:', selectError);
        toast({ title: "Error clearing history", variant: "destructive" });
        return;
      }
      
      if (allConvs && allConvs.length > 0) {
        // Delete each conversation individually (more reliable than .in())
        const deletePromises = allConvs.map(conv =>
          supabase.from("conversations").delete().eq("id", conv.id)
        );
        
        const results = await Promise.all(deletePromises);
        const hasError = results.some(r => r.error);
        
        if (hasError) {
          toast({ title: "Error clearing some conversations", variant: "destructive" });
          return;
        }
      }

      toast({ title: "All conversations cleared" });
      setConversations([]);
      setShowClearDialog(false);
    } catch (error) {
      console.debug('Supabase clear error:', error);
      toast({ title: "Error clearing history", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat History</h1>
            {!isConnected && (
              <p className="text-sm text-muted-foreground mt-1">
                Connect your wallet to access cross-platform chat history
              </p>
            )}
          </div>
          <Button 
            variant="destructive" 
            onClick={() => setShowClearDialog(true)}
            disabled={conversations.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Chat history not saved without wallet connection
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Connect your MetaMask or Core wallet to save and access your chat history across devices. Without a wallet connection, your conversations will not be persisted and you may only see conversations from Supabase (if configured).
              </p>
            </div>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-200px)]">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No conversations yet</p>
              <p className="text-sm mt-2">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/chat?id=${conv.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{conv.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(conv.updated_at), "PPp")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all chat history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your conversations. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default History;