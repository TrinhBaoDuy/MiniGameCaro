import { _decorator, CCInteger, Component, instantiate, Layout, Node, Prefab, Size, UITransform, View, view } from 'cc';
import { InformaionIndex } from '../Model/InformaionIndex';
import { Chooser, EVENT_NAMES, GameValue, MatrixCaro } from '../Model/Data';
import gameMachine, { GameMachine } from './GameMachine';
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
                this.addEventSquareBox(squarebox.getComponent(InformaionIndex))
                this.node.addChild(squarebox)
            }
        }

        await Promise.wait(0.1)
        layout.enabled = false
    }

    getResultCurrent(): GameValue {
        let array = this.node.getComponentsInChildren(InformaionIndex)
        let matrix: MatrixCaro[] = []
        for (let i = 0; i < this.column; i++) {
            for (let j = 0; j < this.row; j++) {
                array.find((infor) => {
                    if (infor.columIndex === i && infor.rowIndex === j) {
                        matrix.push({ col: i, row: j, value: infor.value })
                    }
                })
            }
        }
        return { column: this.column, row: this.row, matrix: matrix }
    }

    addEventSquareBox(squarebox: InformaionIndex) {
        squarebox.node.on(Node.EventType.TOUCH_START, async () => {
            if (squarebox.value == Chooser.Null) {
                squarebox.setChooser(Chooser.Player)
                this.node.emit(EVENT_NAMES.CHECK_WIN)
                let botmove = gameMachine.BotMove(this.getResultCurrent())
                console.log("botmove", botmove)
                if (botmove) {
                    this.node.getComponentsInChildren(InformaionIndex).find((infor) => {
                        if (infor.columIndex === botmove.col && infor.rowIndex === botmove.row) {
                            infor.setChooser(botmove.value)
                            this.node.emit(EVENT_NAMES.CHECK_WIN)
                        }
                    })
                }
            }
        })
    }

    chek() {
        console.log(gameMachine.checkWinner(this.getResultCurrent()))
    }

}


