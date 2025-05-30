import { Component } from '@angular/core';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ChatbotService } from './services/chatbot.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChatbotComponent,
    InputTextModule,
    ButtonModule
  ],
  template: `
    <div class="container">
      <app-chatbot></app-chatbot>
    </div>
  `,
  providers: [ChatbotService]
})
export class AppComponent {
  title = 'AI Chatbot';
}
