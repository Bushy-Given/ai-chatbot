import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

export interface BotResponse {
  text: string;
  typingTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messages: ChatMessage[] = [];
  private messageSubject = new Subject<ChatMessage>();
  message$ = this.messageSubject.asObservable();
  private typingSubject = new Subject<boolean>();
  typing$ = this.typingSubject.asObservable();

  constructor() {}

  sendMessage(message: string): void {
    const userMessage: ChatMessage = {
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    };

    this.messages.push(userMessage);
    this.messageSubject.next(userMessage);

    // Show typing indicator
    this.typingSubject.next(true);

    // Simulate bot response with typing delay
    const response = this.generateBotResponse(message);
    
    timer(response.typingTime).pipe(
      map(() => {
        this.typingSubject.next(false);
        const botMessage: ChatMessage = {
          text: response.text,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          type: 'text'
        };
        this.messages.push(botMessage);
        this.messageSubject.next(botMessage);
      })
    ).subscribe();
  }

  private generateBotResponse(message: string): BotResponse {
    // Basic response logic - in a real app, this would be replaced with an AI API call
    const responses = [
      {
        text: "I'm here to help! What would you like to know?",
        typingTime: 1500
      },
      {
        text: "Let me look that up for you...",
        typingTime: 2000
      },
      {
        text: "I'm not sure about that. Could you please rephrase your question?",
        typingTime: 1000
      },
      {
        text: "Interesting question! Let me think about that...",
        typingTime: 1800
      }
    ];

    // Simple logic to choose response based on message length
    const responseIndex = Math.floor(message.length / 10) % responses.length;
    return responses[responseIndex];
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  clearMessages(): void {
    this.messages = [];
  }

  clearConversation(): void {
    this.messages = [];
    this.messageSubject.next({
      text: 'New conversation started',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    });
  }
}
