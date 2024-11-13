import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { PopUpTween } from '../View/PopUpTween';
import { Chooser } from '../Model/Data';
import { ResultManager } from './ResultManager';
const { ccclass, property } = _decorator;

@ccclass('PopUpMachine')
export class PopUpMachine extends Component {
    private static instance: PopUpMachine;

    public static getInstance(): PopUpMachine {
        if (!PopUpMachine.instance) {
            PopUpMachine.instance = new PopUpMachine();
        }
        return PopUpMachine.instance;
    }

    async onShowPopup(popup: Prefab, autoAgain: boolean = false) {
        let page = instantiate(popup)
        page.parent = find("Canvas")
        page.getComponent(PopUpTween).setUp()
        await page.getComponent(PopUpTween).onIngrowth(autoAgain)
    }

    async onShowPopupResult(popup: Prefab, winner: Chooser, number: number) {
        let page = instantiate(popup)
        page.parent = find("Canvas")
        page.getComponent(PopUpTween).setUp()
        page.getComponent(ResultManager).setUpWinner(winner, number)
        await page.getComponent(PopUpTween).onIngrowth()
    }
}


