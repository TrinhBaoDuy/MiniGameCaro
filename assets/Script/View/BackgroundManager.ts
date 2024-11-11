import { _decorator, Component, Node, UITransform, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackgroundManager")
export class BackgroundManager extends Component {
    update(deltaTime: number) {
        this.onResized();
    }

    onResized() {
        const backgroundTransform = this.node.getComponent(UITransform);
        const screenSize = view.getVisibleSize();

        const scaleX = screenSize.width / backgroundTransform.width;
        const scaleY = screenSize.height / backgroundTransform.height;

        // const scale = Math.min(scaleX, scaleY);
        const scale = Math.min(scaleY, scaleY);
        this.node.setScale(scale, scale);
        this.node.children.forEach(c => {
            c.setScale(scale, scale);
        });
    }
}