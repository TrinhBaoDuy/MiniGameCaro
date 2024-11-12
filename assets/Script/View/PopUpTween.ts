import { _decorator, Canvas, CCFloat, CCInteger, Component, find, Node, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopUpTween')
export class PopUpTween extends Component {

    @property({ type: CCFloat })
    private time: number = 0.5
    @property({ type: CCFloat })
    private auto_time_off: number = 2

    @property({ type: Node })
    private popup: Node = null
    @property({ type: Vec3 })
    private position_move: Vec3 = null
    @property({ type: Vec3 })
    private position_base: Vec3 = null


    setUp() {
        this.node.parent = find("Canvas")
        this.popup.setPosition(this.position_base)
    }

    async onIngrowth(autoOff: boolean = false) {
        this.node.active = true
        tween(this.popup).to(this.time, { position: this.position_move }).start()
        tween(this.node.getComponent(UIOpacity)).to(this.time, { opacity: 255 }).start()
        await Promise.wait(this.time)
        if (autoOff) {
            await Promise.wait(this.auto_time_off)
            await this.offIngrowth()
        }
    }

    async offIngrowth() {
        tween(this.popup).to(this.time, { position: this.position_base }).start()
        tween(this.node.getComponent(UIOpacity)).to(this.time, { opacity: 0 }).call(() => {
            this.node.active = false
        }).start()
        await Promise.wait(this.time)
        this.node.destroy()
    }

}


