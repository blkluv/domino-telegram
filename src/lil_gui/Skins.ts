import GUI from "lil-gui";


export class Skins {
    private static data = {
        // default: () => SkinsService.setSkinType(SkinType.DEFAULT),
        // wood: () => SkinsService.setSkinType(SkinType.WOOD),
        // green: () => SkinsService.setSkinType(SkinType.GREEN),
    };

    static addToGui(gui: GUI) {
        // const folder = gui.addFolder("Skins");
        // folder.add(Skins.data, "default");
        // folder.add(Skins.data, "wood");
        // folder.add(Skins.data, "green");
        // folder.close();
    }

}