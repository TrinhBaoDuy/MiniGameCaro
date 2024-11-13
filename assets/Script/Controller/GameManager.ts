import { _decorator, Component, find, instantiate, Label, Node, Prefab } from 'cc';
import { PopUpTween } from '../View/PopUpTween';
import { PopUpMachine } from './PopUpMachine';
import { AudioManager } from './AudioManager';
import { SettingData, UserData } from '../Model/SetData';
import { MapGame } from './MapGame';
import { Chooser, EVENT_NAMES, ResultWinner, WINSTREAK } from '../Model/Data';
import gameMachine from './GameMachine';
import { ResultManager } from './ResultManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Label })
    public user_name: Label;
    @property({ type: Label })
    public win_steak: Label;
    @property({ type: MapGame })
    public mapGame: MapGame;

    @property({ type: Prefab, group: "Popup" })
    public result_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public watchVideo_popup: Prefab;
    @property({ type: Prefab, group: "Popup" })
    public setting_popup: Prefab;

    private win_steak_number: number = 0

    async onWin(result: ResultWinner) {
        result.winner === Chooser.Player ? this.win_steak_number++ : this.win_steak_number = 0
        this.win_steak.string = WINSTREAK + this.win_steak_number
        AudioManager.getInstance().soundBravo(SettingData.getInstance().getSound())
        this.mapGame.hightLine(result)
        await Promise.wait(1.5)
        await PopUpMachine.getInstance().onShowPopupResult(this.result_popup, result.winner, this.win_steak_number)
        this.node.parent.getComponentInChildren(ResultManager).node.on(EVENT_NAMES.RESET_GAME, this.resetMapGame, this)
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
        this.win_steak.string = WINSTREAK + this.win_steak_number
        await this.mapGame.createrMapGame()
        this.mapGame.node.on(EVENT_NAMES.CHECK_WIN, this.checkWin, this)
    }

    async checkWin() {
        let result: ResultWinner = gameMachine.checkWinner(this.mapGame.getResultCurrent())
        if (result.winner !== Chooser.Null) {
            await this.onWin(result)
        }
    }

    async resetMapGame() {
        await this.mapGame.resetMapGame()
    }
}


