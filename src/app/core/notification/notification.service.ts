import {Service, TemplateRef} from '@angular/core';

export interface Notification {
  text?: string;
  classname?: string;
  delay?: number;
  template?: TemplateRef<unknown>;
}

@Service()
export class NotificationService {
  notifications: Notification[] = [];

  show(text: string, options: Omit<Notification, 'text'> = {}): void {
    this.notifications.push({text, ...options});
  }

  remove(notification: Notification): void {
    this.notifications = this.notifications.filter(t => t !== notification);
  }

  sendSuccess(message: string): void {
    this.show(message, {
      classname: 'bg-success text-light',
      delay: 4000,
    });
  }

  sendError(message: string): void {
    this.show(message, {
      classname: 'bg-danger text-light',
      delay: 6000,
    });
  }

  sendInfo(message: string): void {
    this.show(message, {
      classname: 'bg-light text-dark',
      delay: 4000,
    });
  }
}
