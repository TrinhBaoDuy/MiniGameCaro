import { _decorator, Component, director, EditBox, find, instantiate, Label, Node, Prefab } from 'cc';
import { AudioManager } from '../AudioManager';
import { SettingData, UserData } from '../../Model/SetData';
import { PopUpTween } from '../../View/PopUpTween';
import { EVENT_NAMES, SCENE_NAMES, } from '../../Model/Data';
import { PopUpMachine } from '../PopUpMachine';
import APIRequest, { API_ADDRESS } from '../../Core/HttpRequest';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    @property({ type: EditBox })
    private username: EditBox
    @property({ type: EditBox })
    private password: EditBox

    @property({ type: Prefab })
    private note: Prefab
    @property({ type: Prefab })
    private signup: Prefab



    async onLogin() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        if (this.username.string !== "" || this.password.string !== "") {
            let data = { "name": this.username.string, "password": this.password.string }
            try {
                const response = await APIRequest.post(API_ADDRESS.LOGIN, data)
                const result = await response.json();
                if (response.status == 200) {
                    console.log("đăng nhập thành công")
                    UserData.getInstance().name = result.name
                    UserData.getInstance().token = result.token
                    APIRequest.setToken(result.token)
                    // this.node.emit(EVENT_NAMES.LOGIN_SUCCESFULL)
                    director.loadScene(SCENE_NAMES.Playing)
                } else {
                    this.createNote(result.message)
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        } else {
            this.createNote("Please enter complete data !!!")
        }

    }

    createNote(message: string) {
        let popup = instantiate(this.note)
        popup.parent = find("Canvas")
        popup.getComponentInChildren(Label).string = message
        popup.getComponent(PopUpTween).setUp()
        popup.getComponent(PopUpTween).onIngrowth(true)
    }

    async onClickSignup() {
        AudioManager.getInstance().clickButton(SettingData.getInstance().getSound())
        await PopUpMachine.getInstance().onShowPopup(this.signup)
    }


}


