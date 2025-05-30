import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, BotResponse } from '../../services/chatbot.service';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <div class="header-content">
          <h2 class="p-text-bold">AI Chatbot</h2>
          <div class="header-actions">
            <button 
              pButton 
              icon="pi pi-refresh" 
              (click)="clearConversation()"
              class="p-button-text"
              title="New conversation"
            ></button>
          </div>
        </div>
      </div>
      
      <div class="chat-messages" #messagesContainer>
        <div *ngIf="isTyping" class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
        <div *ngFor="let message of messages" class="message" [ngClass]="{ 
          'user-message': message.sender === 'user', 
          'bot-message': message.sender === 'bot',
          'image-message': message.type === 'image',
          'document-message': message.type === 'document'
        }">
          <div class="message-content">
            <p *ngIf="message.type === 'text'">{{ message.text }}</p>
            <img *ngIf="message.type === 'image'" [src]="message.text" alt="Shared image">
            <div *ngIf="message.type === 'document'" class="document-preview">
              <i class="pi pi-file"></i>
              <span>{{ message.text }}</span>
            </div>
          </div>
          <small class="message-timestamp">{{ message.timestamp }}</small>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-container">
          <div class="input-area">
            <input 
              type="text"
              [(ngModel)]="userMessage"
              (keypress.enter)="sendMessage()"
              placeholder="Type your message here..."
              class="p-inputtext p-component"
              [disabled]="isTyping"
            >
            <div class="input-actions">
              <button 
                pButton 
                icon="pi pi-paperclip" 
                class="p-button-text"
                title="Attach file"
              ></button>
              <button 
                pButton 
                icon="pi pi-camera"
                class="p-button-text"
                title="Send photo"
              ></button>
            </div>
          </div>
          <button 
            pButton 
            icon="pi pi-send" 
            (click)="sendMessage()"
            [disabled]="!userMessage || isTyping"
            class="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .chat-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #ffffff;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #ffffff;
    }

    .typing-indicator {
      display: flex;
      justify-content: center;
      gap: 5px;
      margin: 20px 0;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background: #007bff;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .message {
      max-width: 80%;
      margin-bottom: 15px;
    }

    .user-message {
      margin-left: auto;
      background: #007bff;
      color: white;
      border-radius: 20px 20px 0 20px;
    }

    .bot-message {
      margin-right: auto;
      background: #f8f9fa;
      color: #333;
      border-radius: 20px 20px 20px 0;
    }

    .message-content {
      padding: 15px 20px;
    }

    .message-timestamp {
      display: block;
      text-align: right;
      font-size: 12px;
      color: #6c757d;
      margin-top: 5px;
    }

    .chat-input {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      background: #ffffff;
    }

    .input-container {
      display: flex;
      gap: 10px;
    }

    .input-area {
      flex: 1;
      position: relative;
    }

    .input-actions {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 5px;
    }

    .send-button {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .send-button:hover {
      background: #0056b3;
    }

    .send-button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    /* Document preview styles */
    .document-preview {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: #e9ecef;
      border-radius: 4px;
    }

    .document-preview i {
      font-size: 1.2em;
      color: #6c757d;
    }

    /* Image message styles */
    .image-message {
      max-width: 90%;
    }

    .image-message img {
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ChatbotComponent {
  userMessage = '';
  messages: ChatMessage[] = [];
  isTyping = false;

  constructor(private chatbotService: ChatbotService) {
    this.chatbotService.message$.subscribe((message: ChatMessage) => {
      this.messages.push(message);
    });

    this.chatbotService.typing$.subscribe((typing: boolean) => {
      this.isTyping = typing;
    });
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.chatbotService.sendMessage(this.userMessage);
      this.userMessage = '';
    }
  }

  clearConversation(): void {
    this.chatbotService.clearConversation();
  }
}
