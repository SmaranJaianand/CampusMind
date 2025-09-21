
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { getAiResponse, getMessages, type ChatMessage } from '@/app/actions';
import { Logo } from './logo';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';

export function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    if (user) {
      setIsHistoryLoading(true);
      getMessages(user.uid)
        .then(history => {
          setMessages(history);
        })
        .finally(() => {
          setIsHistoryLoading(false);
        });
    }
  }, [user]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div');
      if (scrollableView) {
        scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isAiLoading || !user) return;

    const userInput = inputValue;
    setInputValue('');

    // Optimistically update UI with user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput,
      timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any, // Temporary timestamp
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsAiLoading(true);
    
    // Call server action to get AI response and save messages
    const aiResponse = await getAiResponse(userInput, user.uid);
    
    // Fetch latest messages to ensure UI is in sync
    const updatedMessages = await getMessages(user.uid);
    setMessages(updatedMessages);

    setIsAiLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-2xl h-full max-h-[80vh] flex flex-col shadow-2xl rounded-xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <Logo className="h-10 w-10 text-primary" />
          <div>
            <h2 className="font-headline text-2xl tracking-tight">AI First-Aid</h2>
            <p className="text-sm text-muted-foreground">
              A safe space to talk and get guidance.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-6 pr-4">
              {isHistoryLoading ? (
                 <div className="space-y-4">
                    <Skeleton className="h-16 w-3/4" />
                    <Skeleton className="h-16 w-3/4 ml-auto" />
                    <Skeleton className="h-24 w-4/5" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4" />
                    <p>
                        Hello! I'm CampusMind, your on-campus companion for mental wellness.
                        <br />
                        How are you feeling today?
                    </p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8 border-2 border-primary/50">
                        <AvatarFallback>
                          <Bot className="text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-3 max-w-[80%] text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                         <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              {isAiLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                        <AvatarFallback>
                            <Bot className="text-primary" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-3 max-w-[80%] text-sm bg-secondary">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isAiLoading || !user}
            />
            <Button type="submit" size="icon" disabled={isAiLoading || !user}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
