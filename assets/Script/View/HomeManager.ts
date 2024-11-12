import { _decorator, Component, director, find, instantiate, Label, Node, Prefab } from 'cc';
import { AudioManager } from '../Controller/AudioManager';
import { SettingData, UserData } from '../Model/SetData';
import { PopUpMachine } from '../Controller/PopUpMachine';
import { SCENE_NAMES } from '../Model/Data';
const { ccclass, property } = _decorator;

@ccclass('HomeManager')
export class HomeManager extends Component {
    @property({ type: Prefab, group: " Loading" })
    public laoding: Prefab;

    @property({ type: Prefab, group: "Popup" })
    public setting_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public login_popup: Prefab;

    @property({ type: Node, group: "Login Succes" })
    public start_node: Node;
    @property({ type: Node, group: "Login Succes" })
    public login_node: Node;
    @property({ type: Label, group: "Login Succes" })
    public label_name: Label;

    async onclickStart() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        // if (UserData.getInstance().token) {
        this.onShowLoading(2)
        director.loadScene(SCENE_NAMES.Playing)
        // } else {
        //     await PopUpMachine.getInstance().onShowPopup(this.login_popup)
        // }
    }

    async onClickSetting() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        await PopUpMachine.getInstance().onShowPopup(this.setting_popup)
    }

    async onClickLogin() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        await PopUpMachine.getInstance().onShowPopup(this.login_popup)
    }

    onShowLoading(time: number) {
        let page = instantiate(this.laoding)
        this.node.addChild(page)
        this.scheduleOnce(() => {
            if (page) {
                page.destroy();
            }
        }, time);
    }


    onLoginSucces() {
        this.label_name.node.active = true
        this.start_node.active = true
        this.login_node.active = false

        this.label_name.string = UserData.getInstance().name
    }

    async onLoad(): Promise<void> {
        await AudioManager.getInstance().playLobbyBackgroundMusic()

    }
}


