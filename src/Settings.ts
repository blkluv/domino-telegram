export class Settings {
    static RESOURCES_WIDTH: number = 1080;
    static RESOURCES_HEIGHT: number = 1920;
    static RESOURCES_RATIO: number = Settings.RESOURCES_WIDTH / Settings.RESOURCES_HEIGHT;
    static COMMISSIONER: string = "Commissioner";
    static LEFT_WHILE_DISCONNECTED: string = "LEFT_WHILE_DISCONNECTED";
    static DESTROY_DAYS: number = 21;
    static DESTROY_MSEC: number = 1000 * 60 * 60 * 24 * Settings.DESTROY_DAYS;
}