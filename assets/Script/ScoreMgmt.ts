// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    goal: cc.Label = null;

    @property
    goalTxt: string = 'GOAL:';

    @property
    goalValue = 0;

    @property(cc.Label)
    score: cc.Label = null;

    @property
    scoreTxt: string = 'SCORE:';

    @property
    scoreValue = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        let t = cc.sys.localStorage.getItem("goal");
        console.log("@@1",t);
        this.goalValue = 0;
        if(t > 0) {
            this.goalValue = t;
        }
        this.goal.string = this.goalTxt+this.goalValue;

        this.scoreValue=0;
        this.score.string = this.scoreTxt+this.scoreValue;
    }

    start () {
        this.updScore();
    }

    initScore(){
        this.updScore();
    }

   

    private updScore(){
        this.score.string = this.scoreTxt+this.scoreValue;
        if(this.scoreValue > this.goalValue){
            this.goalValue = this.scoreValue;
            this.goal.string = this.goalTxt+this.goalValue;
            cc.sys.localStorage.setItem("goal",this.goalValue);
        }
    }

    public updScoreByGame(num,k){
        cc.tween(this.score)
            .sequence(
                cc.scaleTo(0.1,1.2),
                cc.callFunc(()=>{
                    this.scoreValue += (k + 1) * num;
                    this.updScore();
                },this
                ),
                cc.scaleTo(0.1,1)
        ).start();
    }

    // update (dt) {}
}
