// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import ScoreMgmt from './ScoreMgmt';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    isGameOver = false;

    @property(cc.Node)
    popup:cc.Node = null;

    @property(cc.Node)
    mMenuMgmt: cc.Node = null;

    @property(ScoreMgmt)
    mScoreMgmt: ScoreMgmt = null;

    @property(cc.Label)
    best: cc.Label = null;

    @property
    bestTxt: string = 'BEST SCORE:';


    @property(cc.Label)
    score: cc.Label = null;

    @property
    scoreTxt: string = 'THIS ROUND:';


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.popup.active = this.isGameOver;
    }

    start () {
        //this.popup.active = false;
    }

    gameOver(status){
        this.isGameOver = status;
        this.popup.active = status;
        this.score.string = this.scoreTxt+this.mScoreMgmt.scoreValue;
        this.best.string = this.bestTxt+this.mScoreMgmt.goalValue;
        //cc.log("activeInHierarchy: " + this.popup.activeInHierarchy);
        //cc.log("isValid: " + this.popup.isValid);
        if(status){
            this.mMenuMgmt.getComponent('MenuMgmt').off();
        }
    }

    onCloseBtn(){
        console.log("关闭按钮");
        this.gameOver(false);
        this.mMenuMgmt.getComponent('MenuMgmt').onRefreshBtn();
    }



    // update (dt) {}
}
