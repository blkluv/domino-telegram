import {Language} from "@azur-games/pixi-vip-framework";
import {SettingsService} from "../services/SettingsService";
import {DeclensionType} from "./declension/declension_config/DeclensionType";
import {DeclensionConfig} from "./declension/DeclensionConfig";


export class Declension {

    static getRussianPluralDeclension(number: number, one: string, two: string, five: string) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    }

    static getPluralDeclension(number: number, config: DeclensionConfig) {
        let currentLanguage: Language = SettingsService.currentLanguage;
        let currentConfig: DeclensionType = config.get(currentLanguage);

        if (currentLanguage == Language.RU) {
            return number.toString() + " " + Declension.getRussianPluralDeclension(number, currentConfig.one, currentConfig.two, currentConfig.five);
        }

        let pluralText = number == 1 ? currentConfig.one : (currentConfig.many || currentConfig.one);
        return number.toString() + " " + pluralText;
    }

    static getPluralDeclensionForDays(daysAmount: number) {
        let config: DeclensionConfig = new Map();
        config.set(Language.EN, {one: "day", many: "days"});
        config.set(Language.RU, {one: "день", two: "дня", five: "дней"});
        config.set(Language.FR, {one: "journée", many: "jours"});
        config.set(Language.AR, {one: "أيام"});

        return Declension.getPluralDeclension(daysAmount, config);
    };

    static getPluralDeclensionForHours(hoursAmount: number) {
        let config: DeclensionConfig = new Map();
        config.set(Language.EN, {one: "hour", many: "hours"});
        config.set(Language.RU, {one: "час", two: "часа", five: "часов"});

        return Declension.getPluralDeclension(hoursAmount, config);
    }

    static getPluralDeclensionForMinutes(minutesAmount: number) {
        let config: DeclensionConfig = new Map();
        config.set(Language.EN, {one: "minute", many: "minutes"});
        config.set(Language.RU, {one: "минуту", two: "минуты", five: "минут"});
        config.set(Language.FR, {one: "minute", many: "minutes"});
        config.set(Language.ES, {one: "minuto", many: "minutoes"});
        config.set(Language.TH, {one: "นาที"});
        config.set(Language.VI, {one: "phút nữa"});
        config.set(Language.IN, {one: "menit"});
        config.set(Language.MS, {one: "minit"});
        config.set(Language.AR, {one: " دقيقة", many: " من الدقائق"});

        return Declension.getPluralDeclension(minutesAmount, config);
    }

}