import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame } from 'cc';
import { AudioManager } from './AudioManager';
import { SettingData } from '../Model/SetData';
import { Chooser, EVENT_NAMES, SCENE_NAMES, WINSTREAK } from '../Model/Data';
import { PopUpTween } from '../View/PopUpTween';
const { ccclass, property } = _decorator;

@ccclass('ResultManager')
export class ResultManager extends Component {
    @property({ type: Label })
    private result: Label;
    @property({ type: Label })
    private win_steak: Label;

    @property({ type: Node, group: "Button" })
    public resume_button: Node;
    @property({ type: Node, group: "Button" })
    public next_buttton: Node;

    setUpWinner(winner: Chooser, win_steak: number) {
        this.next_buttton.active = this.resume_button.active = false
        winner === Chooser.Player ? this.next_buttton.active = true : this.resume_button.active = true
        this.result.string = winner === Chooser.Player ? "YOU WIN" : "YOU LOSE"
        this.win_steak.string = WINSTREAK + win_steak
    }

    onClickHome() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        director.loadScene(SCENE_NAMES.Home)
    }

    async onClickResume() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        this.node.emit(EVENT_NAMES.RESET_GAME)
        await this.getComponent(PopUpTween).offIngrowth()
    }

    async onClickNext() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        this.node.emit(EVENT_NAMES.RESET_GAME)
        await this.getComponent(PopUpTween).offIngrowth()
    }
}


