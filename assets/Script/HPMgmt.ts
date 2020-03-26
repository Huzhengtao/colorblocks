// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    hpRoot: cc.Node = null;

    @property
    hpValue = 5;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.hpValue = 5;
    }
    
     //跟新hp视图
     public updHP(){
        if(this.hpValue < 0) this.hpValue = 0;
        if(this.hpValue > 5) this.hpValue = 5;
        for (let i = 0; i < 5; i++) {
            this.hpRoot.children[i].opacity = 0;
        }
        for (let i = 0; i < this.hpValue; i++) {
            this.hpRoot.children[i].opacity = 255;
        }

    }

    // update (dt) {}
}
