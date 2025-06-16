import {LocalNotificationMessage} from "./LocalNotificationMessage";
import {LocalNotificationTrigger} from "./LocalNotificationTrigger";


export type LocalNotificationConfig = {
    id: string,
    trigger: LocalNotificationTrigger,
    messages: LocalNotificationMessage[],
    offsetSec: number
}