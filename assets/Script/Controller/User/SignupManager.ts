import { _decorator, Component, EditBox, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SignupManager')
export class SignupManager extends Component {
    @property({ type: EditBox })
    private username: EditBox
    @property({ type: EditBox })
    private password: EditBox
    @property({ type: EditBox })
    private password_again: EditBox

    @property({ type: Label })
    private note: Label

    async onSignin() {
        console.log(this.username.string, this.password.string)
        this.note.string = ""
        if (this.password.string === this.password_again.string) {
            let data = { "name": this.username.string, "password": this.password.string }
            try {
                const response = await fetch('https://b0xp231d-8000.asse.devtunnels.ms/api/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log('result:', result);
                return data;
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        } else {
            this.note.string = "Note : Those passwords didn’t match. Try again."
        }
    }
}


