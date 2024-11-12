import { _decorator, Component, find, instantiate, Label, Node, Prefab } from 'cc';
import { PopUpTween } from '../View/PopUpTween';
import { PopUpMachine } from './PopUpMachine';
import { AudioManager } from './AudioManager';
import { SettingData, UserData } from '../Model/SetData';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Label })
    public user_name: Label;

    @property({ type: Prefab, group: "Popup" })
    public result_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public watchVideo_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public setting_popup: Prefab;

    async onWin() {
        AudioManager.getInstance().soundBravo(SettingData.getInstance().getSound())
        await PopUpMachine.getInstance().onShowPopup(this.result_popup)
    }

    async onWatchVideo() {
        await PopUpMachine.getInstance().onShowPopup(this.watchVideo_popup)
    }

    async onClickSetting() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        await PopUpMachine.getInstance().onShowPopup(this.setting_popup)
    }

    protected onLoad(): void {
        this.user_name.string = UserData.getInstance().name
        this.onWatchVideo()
    }
}


