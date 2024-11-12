import { _decorator, Color, Component, director, instantiate, JsonAsset, Label, native, Node, Prefab, Sprite, sys } from 'cc';
import { AudioManager } from './AudioManager';
import { Scene_NAMES } from '../Model/Data';
import { SettingData } from '../Model/SetData';
import { PopUpTween } from '../View/PopUpTween';
const { ccclass, property } = _decorator;

@ccclass('SettingManager')
export class SettingManager extends Component {
    @property({ type: PopUpTween, group: " Popup" })
    public warning: PopUpTween;

    @property({ type: Node })
    public sound: Node;
    @property({ type: Node })
    public music: Node;

    private static warningWifi

    onLoad() {
        this.sound.getComponent(Sprite).color = SettingData.getInstance().getSound() ? Color.WHITE : Color.GRAY
        this.music.getComponent(Sprite).color = SettingData.getInstance().getMusic() ? Color.WHITE : Color.GRAY
    }

    onClickSound() {
        if (SettingData.getInstance().getSound()) {
            SettingData.getInstance().setSound(false);
            this.sound.getComponent(Sprite).color = Color.GRAY
        }
        else {
            SettingData.getInstance().setSound(true);
            this.sound.getComponent(Sprite).color = Color.WHITE
        }
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())

    }

    onClickMusic() {
        if (SettingData.getInstance().getMusic()) {
            SettingData.getInstance().setMusic(false)
            this.music.getComponent(Sprite).color = Color.GRAY
        }
        else {
            SettingData.getInstance().setMusic(true)
            this.music.getComponent(Sprite).color = Color.WHITE
        }
        AudioManager.getInstance().clickMusic(SettingData.getInstance().getMusic())
    }

    reLoadAdmob() {
        if (sys.os === sys.OS.ANDROID) {
            let a = native.reflection.callStaticMethod(
                "com/cocos/game/AppActivity",
                "initializeAdmob",
                "()V"
            );
        } else {
            console.log("Platform is not Android");
        }
    }

    onReLoad() {
        SettingManager.warningWifi.active = false
        this.reLoadAdmob()
        // var json = this.loading.json;
    }


    static isActiveWarning(active: boolean) {
        SettingManager.warningWifi.active = active
    }
}

declare global {
    interface Window {
        SettingManager: typeof SettingManager;
    }
}

window.SettingManager = SettingManager;

window.addEventListener('online', () => {
    SettingManager.isActiveWarning(false)
    console.log('Kết nối mạng đã được khôi phục');
});

window.addEventListener('offline', () => {
    SettingManager.isActiveWarning(true)
    console.log('Mất kết nối mạng');
});