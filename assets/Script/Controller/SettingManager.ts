import { _decorator, Color, Component, director, instantiate, JsonAsset, Label, native, Node, Prefab, Sprite, sys } from 'cc';
import { AudioManager } from './AudioManager';
import { Scene_NAMES } from '../Model/Data';
import { SettingData } from '../Model/SetData';
import { PopUpTween } from '../View/PopUpTween';
const { ccclass, property } = _decorator;

@ccclass('SettingManager')
export class SettingManager extends Component {
    @property({ type: PopUpTween, group: " Popup" })
    public setting: PopUpTween;
    @property({ type: PopUpTween, group: " Popup" })
    public warning: PopUpTween;
    @property({ type: PopUpTween, group: " Popup" })
    public login: PopUpTween;
    @property({ type: PopUpTween, group: " Popup" })
    public signup: PopUpTween;

    @property({ type: Node, group: " Button" })
    public back: Node;
    @property({ type: Node, group: " Button" })
    public start_button: Node;
    @property({ type: Node, group: " Button" })
    public login_button: Node;

    @property({ type: Prefab, group: " Loading" })
    public laoding: Prefab;

    @property({ type: Node })
    public sound: Node;
    @property({ type: Node })
    public music: Node;

    @property({ type: AudioManager })
    public audio: AudioManager;
    private static warningWifi

    start() {
        SettingManager.warningWifi = this.warning
        director.addPersistRootNode(this.node);
        this.back.active = false
    }

    onclickStart() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        this.onShowLoading(2)
        director.loadScene(Scene_NAMES.Playing)
        this.back.active = true
        this.start_button.active = false
        this.login_button.active = false
    }
    onClickBack() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        director.loadScene(Scene_NAMES.Home)
        this.back.active = false
        this.start_button.active = true
        this.login_button.active = true
    }

    async onClickSetting() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        await this.setting.onIngrowth();
    }
    async onCloseSetting() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        await this.setting.offIngrowth();
    }


    async onClickLogin() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        await this.login.onIngrowth();
    }
    async onCloseLogin() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        await this.login.offIngrowth();
    }

    async onClickSignup() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        await this.login.offIngrowth();
        await this.signup.onIngrowth();
    }
    async onCloseSignup() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        await this.signup.offIngrowth();
        await this.login.onIngrowth();
    }


    onShowLoading(time: number) {
        let page = instantiate(this.laoding)
        this.node.addChild(page)
        this.scheduleOnce(() => {
            if (page) {
                console.log("xóa đi")
                page.destroy();
            }
        }, time);
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
        this.audio.clickButton(SettingData.getInstance().getSound())

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
        this.audio.clickButton(SettingData.getInstance().getSound())
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