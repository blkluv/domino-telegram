export class HotkeyService {
    static listen(callback: Function, key: string = "ArrowUp"): void {
        document.addEventListener('keyup', (e) => e.code === key && callback());
    }
}