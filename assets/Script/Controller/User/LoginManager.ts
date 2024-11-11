import { _decorator, Component, EditBox, Label, Node } from 'cc';
import { HttpRequest } from '../../Core/HttpRequest';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    @property({ type: EditBox })
    private username: EditBox
    @property({ type: EditBox })
    private password: EditBox

    @property({ type: Label })
    private note: Label

    async onLogin() {
        console.log(this.username.string, this.password.string)
        let data = { "name": this.username.string, "password": this.password.string }
        try {
            const response = await fetch('https://b0xp231d-8000.asse.devtunnels.ms/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.status == 200) {
                console.log("đăng nhập thành công")
            } else {
                this.note.string = result.message
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
}


