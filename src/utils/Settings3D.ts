export class Settings3D {
    static corner: number = 30;
    static cosCorner: number = Math.cos(Settings3D.corner / 180 * Math.PI);
    static sinCorner: number = Math.sin(Settings3D.corner / 180 * Math.PI);
    static tgCorner: number = Settings3D.sinCorner / Settings3D.cosCorner;
}