import { _decorator, AssetManager, assetManager, AudioClip, AudioSource, Component, find, Node } from 'cc';
import { SettingData } from '../Model/SetData';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static instance: AudioManager;

    @property(AudioClip)
    private clickButon: AudioClip;
    @property(AudioClip)
    private enemyHit: AudioClip;
    @property(AudioClip)
    private userHit: AudioClip;
    @property(AudioClip)
    private lose: AudioClip;
    @property(AudioClip)
    private win: AudioClip;
    @property(AudioClip)
    private bmg: AudioClip;
    @property(AudioClip)
    private oneSecond: AudioClip;
    @property(AudioClip)
    private doneTime: AudioClip;
    @property(AudioClip)
    private bravo: AudioClip;

    private SOUND_PATH = {
        LOBBY_BACKGROUND: "bgm_maingame",
        BUTTON_CLICK: "sfx_clickbutton",
        USER_CLICK: "sfx_userhit",
        ANHPHU_CLICK: "sfx_enemyhit",
        LOSE: "sfx_lose",
        WIN: "sfx_win",
        BRAVO_EFFECT: "sfx_bravo"
    };

    private audioSource: AudioSource = new AudioSource();
    private audioBundle = null;

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    async getBundle() {
        try {
            return await this.loadBundleAsync("Audio", AudioSource);
        } catch (err) {
            console.error(err);
        }
    }

    loadBundleAsync(bundleName: string, assetType: unknown) {
        if (this.audioBundle) {
            return Promise.resolve(this.audioBundle);
        }

        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, assetType, (err, loadedBundle) => {
                if (err) {
                    reject(err);
                } else {
                    this.audioBundle = loadedBundle;
                    resolve(this.audioBundle);
                }
            });
        });
    }

    loadClipAsync(bundle: AssetManager.Bundle, dir: string) {
        return new Promise((resolve, reject) => {
            bundle.loadDir(dir, (err, clip) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(clip);
                }
            });
        });
    }

    async playLobbyBackgroundMusic() {
        try {
            const bundle = await this.getBundle();
            const clip = await this.loadClipAsync(
                bundle,
                this.SOUND_PATH.LOBBY_BACKGROUND
            );
            this.audioSource.clip = clip[0];
            this.audioSource.loop = true;
            SettingData.getInstance().getMusic() ? this.audioSource.play() : null;
        } catch (err) {
            console.error(err);
        }
    }

    clickButton(active: boolean) {
        if (active && this.audioSource) {
            this.loadClipAsync(this.audioBundle, this.SOUND_PATH.BUTTON_CLICK).then((clips) => {
                this.audioSource.playOneShot(clips[0])
            })
        }
    }

    clickXO(active: boolean, user: boolean) {
        if (active && this.audioSource) {
            if (user)
                this.loadClipAsync(this.audioBundle, this.SOUND_PATH.USER_CLICK).then((clips) => {
                    this.audioSource.playOneShot(clips[0])
                })

            else
                this.loadClipAsync(this.audioBundle, this.SOUND_PATH.ANHPHU_CLICK).then((clips) => {
                    this.audioSource.playOneShot(clips[0])
                })
        }
    }

    clickMusic(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.play();
        } else {
            this.audioSource.stop()
        }
    }

    soundWin(active: boolean) {
        if (active && this.audioSource) {
            this.loadClipAsync(this.audioBundle, this.SOUND_PATH.WIN).then((clips) => {
                this.audioSource.playOneShot(clips[0])
            })
        }
    }

    soundLose(active: boolean) {
        if (active && this.audioSource) {
            this.loadClipAsync(this.audioBundle, this.SOUND_PATH.LOSE).then((clips) => {
                this.audioSource.playOneShot(clips[0])
            })
        }
    }

    soundOneSecond(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.oneSecond);
        }
    }

    soundDoneTime(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.doneTime);
        }
    }
    soundBravo(active: boolean) {
        if (active && this.audioSource) {
            this.loadClipAsync(this.audioBundle, this.SOUND_PATH.BRAVO_EFFECT).then((clips) => {
                this.audioSource.playOneShot(clips[0])
            })
        }
    }
}


