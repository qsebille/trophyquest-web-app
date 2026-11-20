import {Service, signal, TemplateRef} from '@angular/core';

export interface Notification {
  text?: string;
  classname?: string;
  delay?: number;
  template?: TemplateRef<unknown>;
}

@Service()
export class NotificationService {
  private readonly queue = signal<Notification[]>([]);

  get notifications(): readonly Notification[] {
    return this.queue();
  }

  show(text: string, options: Omit<Notification, 'text'> = {}): void {
    this.queue.update(notifications => [...notifications, {text, ...options}]);
  }

  remove(notification: Notification): void {
    this.queue.update(notifications => notifications.filter(toast => toast !== notification));
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
