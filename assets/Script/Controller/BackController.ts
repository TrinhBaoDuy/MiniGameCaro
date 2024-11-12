import { _decorator, Component, director, Node } from 'cc';
import { AudioManager } from './AudioManager';
import { SettingData } from '../Model/SetData';
import { SCENE_NAMES } from '../Model/Data';
const { ccclass, property } = _decorator;

@ccclass('BackController')
export class BackController extends Component {

    onClickBack() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        director.loadScene(SCENE_NAMES.Home)

    }
}


