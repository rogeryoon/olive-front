import { MessageSeverity } from '@quick/services/alert.service';

/**
 * User에게 에러를 표시할때 사용
 */
export class UserMessage {
    title: string;
    message: string;
    messageSeverity: MessageSeverity;
}
