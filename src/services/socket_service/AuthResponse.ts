import {Role} from "@azur-games/pixi-vip-framework";


export type AuthResponse = {
    id: number,
    role: Role
    androidGameServicesId: string | null,
    iosGameCenterId: string | null,
    facebookId: string | null,
    appleSignInId: string | null,
    googleSignInId: string | null
    accessKey: string,
    registrationId: string,
    destroyAt: null | string,
    createdAt: string,
    updatedAt: string
}