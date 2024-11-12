import { _decorator, Component, director, EditBox, instantiate, Label, Node, Prefab } from 'cc';
import { PopUpTween } from '../../View/PopUpTween';
import APIRequest, { API_ADDRESS } from '../../Core/HttpRequest';
import { UserData } from '../../Model/SetData';
import { SCENE_NAMES } from '../../Model/Data';
const { ccclass, property } = _decorator;

@ccclass('SignupManager')
export class SignupManager extends Component {
    @property({ type: EditBox })
    private username: EditBox
    @property({ type: EditBox })
    private password: EditBox
    @property({ type: EditBox })
    private password_again: EditBox

    @property({ type: Prefab })
    private note: Prefab

    async onSignin() {
        console.log(this.username.string, this.password.string)
        if (this.password.string === this.password_again.string) {
            let data = { "name": this.username.string, "password": this.password.string }
            try {
                const response = await APIRequest.post(API_ADDRESS.SIGNUP, data)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log('result:', result);
                if (response.status == 201) {
                    UserData.getInstance().name = result.name
                    UserData.getInstance().token = result.token
                    APIRequest.setToken(result.token)
                    director.loadScene(SCENE_NAMES.Playing)
                } else {
                    this.createNote(result.message)
                }
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        } else {
            this.createNote("Note : Those passwords didn’t match. Try again.")
        }
    }

    createNote(message: string) {
        let popup = instantiate(this.note)
        popup.getComponentInChildren(Label).string = message
        popup.getComponent(PopUpTween).setUp()
        popup.getComponent(PopUpTween).onIngrowth(true)
    }
}


