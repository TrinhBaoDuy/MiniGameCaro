import { _decorator, Component, find, instantiate, Label, Node, Prefab } from 'cc';
import { PopUpTween } from '../View/PopUpTween';
import { PopUpMachine } from './PopUpMachine';
import { AudioManager } from './AudioManager';
import { SettingData, UserData } from '../Model/SetData';
import { MapGame } from './MapGame';
import { Chooser, EVENT_NAMES } from '../Model/Data';
import gameMachine from './GameMachine';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Label })
    public user_name: Label;
    @property({ type: MapGame })
    public mapGame: MapGame;

    @property({ type: Prefab, group: "Popup" })
    public result_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public watchVideo_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public setting_popup: Prefab;

    async onWin() {
        // AudioManager.getInstance().soundBravo(SettingData.getInstance().getSound())
        // await PopUpMachine.getInstance().onShowPopup(this.result_popup)
    }

    async onWatchVideo() {
        await PopUpMachine.getInstance().onShowPopup(this.watchVideo_popup)
    }

    async onClickSetting() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        await PopUpMachine.getInstance().onShowPopup(this.setting_popup)
    }

    protected async onLoad(): Promise<void> {
        this.user_name.string = UserData.getInstance().name
        await this.onWatchVideo()
        await this.mapGame.createrMapGame()

        this.mapGame.node.on(EVENT_NAMES.CHECK_WIN, this.checkWin)
    }

    checkWin() {
        // let winner: Chooser = gameMachine.checkWinner(this.mapGame.getResultCurrent())
        // if (winner !== Chooser.Null) {
        this.onWin()
        // }
    }
}


