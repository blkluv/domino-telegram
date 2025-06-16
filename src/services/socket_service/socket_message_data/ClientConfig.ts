import {LocalNotificationConfig} from "./client_config/LocalNotificationConfig";


export type ClientConfig = {
    shareUrl: string,
    feedbackUrl: string,
    appleSignInRedirectUrl: string,
    googleSignInRedirectUrl: string,
    localNotificationPeriodSec: number,
    localNotifications: LocalNotificationConfig[]
}