import { _decorator, CCInteger, Component, instantiate, Layout, Node, Prefab, Size, UITransform, View, view } from 'cc';
import { InformaionIndex } from '../Model/InformaionIndex';
const { ccclass, property } = _decorator;

@ccclass('MapGame')
export class MapGame extends Component {
    @property({ type: Prefab })
    private square_box: Prefab
    @property({ type: CCInteger })
    private column: number = 10
    @property({ type: CCInteger })
    private row: number = 10

    async createrMapGame() {
        let size = (view.getVisibleSize().width) / this.column
        let layout = this.node.getComponent(Layout)
        layout.enabled = true
        layout.constraint = Layout.Constraint.FIXED_COL
        layout.constraintNum = this.column

        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {
                let squarebox = instantiate(this.square_box);
                squarebox.getComponent(InformaionIndex).setIndex(i, j)
                squarebox.getComponent(UITransform).width = squarebox.getComponent(UITransform).height = size
                this.node.addChild(squarebox)
            }
        }

        await Promise.wait(0.1)
        layout.enabled = false
    }

    protected async start(): Promise<void> {
        await this.createrMapGame()
    }

}


