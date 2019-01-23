import { MessageSeverity } from '@quick/services/alert.service';

export class UserMessage {
    title: string;
    message: string;
    messageSeverity: MessageSeverity;
}
