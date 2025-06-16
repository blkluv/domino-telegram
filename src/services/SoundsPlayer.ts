import {CoreSoundPlayer} from "@azur-games/pixi-vip-framework";
import {SocketGameRequestState} from "../dynamic_data/SocketGameRequestState";
import {DynamicData} from "../DynamicData";
import {ArrayUtils} from "@azur-games/pixi-vip-framework";
import {PlatformUtils} from "../utils/PlatformUtils";
import {Gender} from "./avatar_service/avatar_config/Gender";
import {AvatarService} from "./AvatarService";


export class SoundsPlayer extends CoreSoundPlayer {
    static gameMusics: string[] = ["game1", "game2"];
    static currentlyPlayingMusic: string = "menuMusic";
    static dominoTakeSounds: string[] = ["takeDomino/take_01", "takeDomino/take_02", "takeDomino/take_03"];
    static dominoPutSounds: string[] = ["putDomino/put_01", "putDomino/put_02", "putDomino/put_03", "putDomino/put_04"];
    static dominoPointsSounds: string[] = ["points/p1", "points/p2", "points/p3", "points/p4", "points/p5"];

    static playPointsSound(index: number): void {
        SoundsPlayer.play(SoundsPlayer.dominoPointsSounds[index]);
    }

    public static playTakeSound(): void {
        SoundsPlayer.play(ArrayUtils.getRandomElement(SoundsPlayer.dominoTakeSounds));
    }

    public static playPutSound(): void {
        SoundsPlayer.play(ArrayUtils.getRandomElement(SoundsPlayer.dominoPutSounds));
    }

    public static playPassSound(avatarTextureName: string): void {
        let gender: Gender = AvatarService.getGenderByTextureName(avatarTextureName);
        SoundsPlayer.play("pass" + (gender == Gender.M ? "Man" : "Woman"));
    }

    static playLobbyMusic() {
        let currentlyPlaying: boolean = SoundsPlayer.currentlyPlayingMusic == "menuMusic";
        let audioPlaying: boolean = SoundsPlayer.audio?.playing();
        if (currentlyPlaying && audioPlaying) {
            let settingValue: number = SoundsPlayer.musicOn ? .8 : 0;
            SoundsPlayer.audio.volume(settingValue);
        } else if (SoundsPlayer.musicOn) {
            SoundsPlayer.audio?.unload();
            SoundsPlayer.audio = new Howl({
                src: "./assets/music/menuMusic.mp3",
                loop: true,
                html5: PlatformUtils.desktopPlatform(),
                autoplay: true,
                volume: .8

            });
            SoundsPlayer.currentlyPlayingMusic = "menuMusic";
        }
    }

    static handleGameMusic(): void {
        if (!DynamicData.socketGameRequest?.state || [SocketGameRequestState.WON, SocketGameRequestState.LEFT, SocketGameRequestState.LOST].includes(DynamicData.socketGameRequest?.state)) {
            return;
        }
        if ([SocketGameRequestState.PREPARED, SocketGameRequestState.CREATED].includes(DynamicData.socketGameRequest?.state)) {
            SoundsPlayer.playWaitingMusic();
        } else {
            SoundsPlayer.playGameMusic();
        }
    }

    static playWaitingMusic(): void {
        if (SoundsPlayer.currentlyPlayingMusic == "waitingForPlayers" && SoundsPlayer.audio.playing()) {
            SoundsPlayer.audio.volume(SoundsPlayer.musicOn ? .8 : 0);
        } else if (SoundsPlayer.musicOn) {
            SoundsPlayer.audio?.unload();
            SoundsPlayer.audio = new Howl({
                src: "./assets/music/waitingForPlayers.mp3",
                loop: true,
                html5: PlatformUtils.desktopPlatform(),
                autoplay: true,
                volume: .8

            });
            SoundsPlayer.currentlyPlayingMusic = "waitingForPlayers";
        }
    }

    static playGameMusic() {
        if (SoundsPlayer.gameMusics.includes(SoundsPlayer.currentlyPlayingMusic) && SoundsPlayer.audio.playing()) {
            SoundsPlayer.audio.volume(SoundsPlayer.musicOn ? .8 : 0);
        } else if (SoundsPlayer.musicOn) {
            SoundsPlayer.audio?.unload();
            let random: string = ArrayUtils.getRandomElement(SoundsPlayer.gameMusics);
            SoundsPlayer.audio = new Howl({
                src: "./assets/music/" + random + ".mp3",
                loop: true,
                html5: PlatformUtils.desktopPlatform(),
                autoplay: true,
                volume: .8
            });
            SoundsPlayer.audio.play();
            SoundsPlayer.currentlyPlayingMusic = random;
        }
    }
}

