import { _decorator, CCInteger, Component, instantiate, Layout, Node, Prefab, Size, UITransform, View, view } from 'cc';
import { InformaionIndex } from '../Model/InformaionIndex';
import { Chooser, EVENT_NAMES, GameValue, MatrixCaro, ResultWinner } from '../Model/Data';
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
            if (this.checkCanPlay) {
                if (squarebox.value == Chooser.Null) {
                    squarebox.setChooser(Chooser.Player)
                    if (!this.checkWIN()) {
                        let botmove = gameMachine.BotMove(this.getResultCurrent())
                        if (botmove) {
                            this.node.getComponentsInChildren(InformaionIndex).find((infor) => {
                                if (infor.columIndex === botmove.col && infor.rowIndex === botmove.row) {
                                    infor.setChooser(botmove.value)
                                    this.node.emit(EVENT_NAMES.CHECK_WIN)
                                }
                            })
                        }
                    } else {
                        this.node.emit(EVENT_NAMES.CHECK_WIN)
                    }
                }
            } else {
                await this.resetMapGame()
            }
        })
    }

    async resetMapGame() {
        this.node.removeAllChildren()
        await this.createrMapGame()
    }

    checkWIN(): boolean {
        let winner: Chooser = gameMachine.checkWinner(this.getResultCurrent()).winner
        return winner === Chooser.Null ? false : true
    }

    checkCanPlay(): boolean {
        this.node.getComponentsInChildren(InformaionIndex).forEach((infor) => {
            if (infor.value === Chooser.Null)
                return true
        })
        return false
    }

    getSquareBox(position: { row: number, column: number }): InformaionIndex | null {
        return this.node.getComponentsInChildren(InformaionIndex).find((infor: InformaionIndex) => {
            return infor.rowIndex === position.row && infor.columIndex === position.column;
        }) || null
    }

    hightLine(result: ResultWinner) {
        for (let index of result.positions) {
            this.getSquareBox({ row: index.row, column: index.column }).hightline(result.winner)
        }
    }
}


