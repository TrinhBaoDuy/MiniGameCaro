import { _decorator, Color, Component, Label, Node, Sprite, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {

    @property({ type: [Node] })
    private Level: Node[] = []
    private level: number = 0

    start() {
        this.onClickLevel()
    }

    onClickLevel() {
        this.level++
        if (this.level == 4)
            this.level = 1
        switch (this.level) {
            case 1:
                this.moveLevel(this.Level[0], this.Level[2], this.Level[1])
                break
            case 2:
                this.moveLevel(this.Level[1], this.Level[0], this.Level[2])
                break
            case 3:
                this.moveLevel(this.Level[2], this.Level[1], this.Level[0])
                break
        }
    }

    moveLevel(mid: Node, left: Node, right: Node) {
        mid.active = true
        mid.getComponent(Label).color = Color.WHITE;
        tween(mid).to(0.5, { position: Vec3.ZERO }).call(() => {
            // tween(mid)
            //     .repeatForever(
            //         tween()
            //             .by(0.5, { scale: new Vec3(0.2, 0.2, 1) })
            //             .by(0.5, { scale: new Vec3(-0.2, -0.2, 1) })
            //     )
            //     .start();
        }).start()
        left.active = right.active = false
        tween(left)
            .to(0.5, { position: new Vec3(180, 0, 0) })
            .start();

        tween(right)
            .to(0.5, { position: new Vec3(-180, 0, 0) })
            .start();
    }

    stopTween() {
        Tween.stopAllByTarget(this.Level[0])
        Tween.stopAllByTarget(this.Level[1])
        Tween.stopAllByTarget(this.Level[2])
    }
}


