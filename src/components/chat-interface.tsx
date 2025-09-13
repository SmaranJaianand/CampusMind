'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getAiResponse } from '@/app/actions';
import { Logo } from './logo';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: React.ReactNode;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: (
        <div>
          <p>
            Hello! I'm CampusMind, your on-campus companion for mental wellness.
            How are you feeling today?
          </p>
        </div>
      ),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiResponse = await getAiResponse(inputValue);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: (
        <div>
          <p>{aiResponse.response}</p>
        </div>
      ),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
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
              {messages.map(message => (
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
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                       <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
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
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
