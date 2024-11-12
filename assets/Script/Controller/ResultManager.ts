import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame } from 'cc';
import { AudioManager } from './AudioManager';
import { SettingData } from '../Model/SetData';
import { SCENE_NAMES } from '../Model/Data';
const { ccclass, property } = _decorator;

@ccclass('ResultManager')
export class ResultManager extends Component {
    @property({ type: Label })
    private user_name: Label;
    @property({ type: Sprite })
    private avatar: Sprite;

    setUpWinner(name: string, avatar: SpriteFrame) {
        this.user_name.string = name
        this.avatar.spriteFrame = avatar
    }

    onClickHome() {
        AudioManager.getInstance().soundBravo(SettingData.getInstance().getSound())
        director.loadScene(SCENE_NAMES.Home)

    }

    onClickResume() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())

    }
}


