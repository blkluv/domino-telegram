export class PlatformUtils {
    static mobilePlatform(): boolean {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }

    static desktopPlatform(): boolean {
        return !PlatformUtils.mobilePlatform();
    }

    static openAppStore(): void {
        window.open("https://royal-belote.onelink.me/IXWI/q36q7cpx", "_blank");
        // MetricaService.sendEvent(MetricEvents.WEB_TO_APP, {});
    }

    static openGooglePlay(): void {
        window.open("https://royal-belote.onelink.me/0wuz/ypr8oqmp", "_blank");
        // MetricaService.sendEvent(MetricEvents.WEB_TO_APP, {});
    }
}