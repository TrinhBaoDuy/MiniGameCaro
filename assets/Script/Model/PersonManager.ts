import { _decorator, Animation, CCInteger, Color, color, Component, easing, Node, Sprite, Tween, tween, UITransform, Vec3, view } from 'cc';
import { Active_Status, EVENT_NAMES } from './Data';
const { ccclass, property } = _decorator;

@ccclass('PersonManager')
export class PersonManager extends Component {


    animation(status: Active_Status) {
        switch (status) {
            case Active_Status.Waiting:
                tween(this.node).to(0.3, { scale: new Vec3(0.20, 0.20, 1) }).start();
                this.node.getComponent(Sprite).color = new Color(145, 145, 145, 255)
                break
            case Active_Status.TimePlay:
                this.node.getComponent(Sprite).color = new Color(255, 255, 255, 255)
                tween(this.node)
                    .repeatForever(
                        tween()
                            .by(0.5, { scale: new Vec3(0.025, 0.025, 1) })
                            .by(0.5, { scale: new Vec3(-0.025, -0.025, 1) })
                    )
                    .start();
                break
        }
    }
}


