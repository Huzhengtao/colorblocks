// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import MainMgmt from './MainMgmt';
import MusicMgmt from './MusicMgmt';
import HPMgmt from './HPMgmt';
import ScoreMgmt from './ScoreMgmt';

@ccclass
export default class NewClass extends cc.Component {

    @property(MainMgmt)
    public mMainMgmt : MainMgmt = null;

    @property(MusicMgmt)
    public mMusicMgmt: MusicMgmt = null;

    @property(HPMgmt)
    mHPMgmt: HPMgmt= null;

    @property(ScoreMgmt)
    mScoreMgmt: ScoreMgmt = null;

    @property
    public map =[];//二维矩阵数组用来承载数据结构的
 
    @property
    public book =[];//二维矩阵数组用来承载标志位
 
    @property([cc.Node])
    public mapNode: cc.Node[][] = [[]];//二维矩阵数组用来承载节点
 
    @property
    cols = 6;

    @property
    rows = 6;//

    @property
    hits = 0;
    @property
    count = 0;
 
    @property(cc.NodePool)
    blockPool:cc.NodePool = null;
 
    @property(cc.Prefab)
    blockPF:cc.Prefab = null;
 
    @property([cc.SpriteFrame])
    blockSF:cc.SpriteFrame[] = [];



    onLoad () {
        this.init();
        
        this.blockPool = new cc.NodePool();
        for(let i=0;i<30;i++){
            this.blockPool.put(cc.instantiate(this.blockPF));
        }

    }

    start () {
        this.gameStart();
    }

    renew(){
        this.node.removeAllChildren();
        this.onLoad();
        this.start();
    }

    init(){
        this.map = [];
        this.mapNode =[];
        this.book = [];
        // 让我们创建二维数组 在JavaScript中只有1维数组，二维数组就是[[],[],[],,,,,]数组中装入数组
        for (let i = 0; i <this.rows+1; i++) {
            this.map[i] = [];
            this.mapNode[i] = [];
            this.book[i] = [];
            for (let j = 0; j <this.cols+1; j++) {
                this.map[i][j] = null;
                this.mapNode[i][j] = null;
                this.book[i][j] = 0;
            }
        }
    }

    /**
     * 点击方块加一
     * @param {*} col 
     * @param {*} row 
     */
    blockAddOne (i, j) {
        if (this.map[i][j] === 8) {
            console.log('到9了');
            return false;
        }
        this.map[i][j] += 1;
        let num = this.map[i][j];
        this.mapNode[i][j].getComponent(cc.Sprite).spriteFrame = this.blockSF[num];
        return true;
    }

    gameStart(){
        // 我们需要随机的创建25个方块
        console.log(this.cols,this.rows);
        for (let i = 1; i < this.rows; i++) {
            for (let j = 1; j < this.cols; j++) {
                // 这里我们要注意坐标转化问题
                // 我们鼠标点击的区域是正方形，而方块的坐标是在那个方形区域中心
                // 宽为 650 左右坐标为 -325 325 那么边界的方块坐标为 -325 + 130/2。。。
                let x = -260 + (i - 1) * 130;
                let y = 260 - (j - 1) * 130;
                // 这样就能遍历到所有方块 ， 随机0-4
                let num = this.randNum(0,4);
                this.map[i][j] = num;
                // 上下左右均不相同即可
                while (this.map[i][j] === this.map[i-1][j] ||
                    this.map[i][j] === this.map[i][j-1] ||
                    this.map[i][j] === this.map[i+1][j] ||
                    this.map[i][j] === this.map[i][j+1]) {
                        num = Math.floor(Math.random()*4);
                        this.map[i][j] = num;
                    }
                // 这样就不会连着相同了, 创建完的节点存入节点数组
                this.mapNode[i][j] = this.createBlock(x, y, num);
            }
        }
    }

    /**
     * 通过给定坐标和数字创建一个方块
     * @param {number} x 
     * @param {number} y 
     * @param {number} num 
     */
    createBlock (x, y, num) {
        let b = null;
        // 获取前判断对象池是否为空
        if (this.blockPool.size() > 0) {
            b = this.blockPool.get(); 
        } else {
            b = cc.instantiate(this.blockPF);
        }
        b.parent = this.node;
        b.x = x;
        b.y = y;
        b.getComponent(cc.Sprite).spriteFrame = this.blockSF[num];
        return b;
    }

    /**
     * 检测方块周围相同方块，记录于book
     * @param {*} i_ 
     * @param {*} j_ 
     * @param {*} num 
     */
    mapForCount (i_, j_, num) {
        let dir = [[0,1],[1,0],[0,-1],[-1,0]];
        for (let k = 0; k < 4; k++) {
            let i = i_ + dir[k][0];
            let j = j_ + dir[k][1];
            // 0 - 6 1-5
            if (i < 1 || i > 5 || j < 1 || j > 5) {
                continue;
            }
            if (this.map[i][j] === num && this.book[i][j] === 0) {
                // console.log('找到相同方块', i, j);
                this.book[i][j] = 1;
                this.count += 1;
                // console.log(this.count);
                this.mapForCount(i, j, num);
            }
        }
    }

    /**
     * 将已经标记的方块消除
     * @param {*} i 
     * @param {*} j 
     */
    doActionForBook (i_, j_) {
        // 分数
        this.mScoreMgmt.updScoreByGame(this.count, this.map[i_][j_]);
        for (let i = 1; i < this.rows; i++) {
            for (let j = 1; j < this.cols; j++) {
                if (i === i_ && j === j_) {
                    continue;
                } else if (this.book[i][j] === 1) {
                    cc.tween(this.mapNode[i][j])
                    .sequence(
                            cc.scaleTo(0.15, 0),
                            cc.callFunc(() => {
                                this.blockPool.put(this.mapNode[i][j]);
                                this.map[i][j] = null;
                                this.mapNode[i][j] = null;
                            }, this)
                    ).start();

                }
            }
        }

        cc.tween(this.mapNode[i_][j_])
        .sequence(
            cc.scaleTo(0.15, 1.2),
            cc.callFunc(() => {
                this.blockAddOne(i_, j_);
            }, this),
            cc.scaleTo(0.15, 1),
            cc.callFunc(() => {
                // 进行下落
                this.blockDown();
            }, this)
        ).start();


        // 每一次消除，hp += 1；
        this.mHPMgmt.hpValue += 1;
        this.mHPMgmt.updHP();
        // 连击加一
        this.mMusicMgmt.playComboMusic(this.hits);
        this.hits += 1;
    }

    /**
     * 方块下落
     */
    blockDown () {
        let downFlag = true;
        while (downFlag) {
            downFlag = false;
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (this.mapNode[i][j] !== null && this.mapNode[i][j+1] === null) {
                        // console.log('找到', i, j);
                        this.mapNode[i][j].runAction(cc.moveBy(0.1, 0, -130));
                        // cc.tween(this.mapNode[i][j])
                        // .by(0.1,{position:cc.v2(0,-130)}) 
                        // .start();
                        // .sequence(
                        //     cc.moveBy(0.1, 0, -130),
                        //     cc.scaleTo(1, 1)
                        // ).start();

                        this.mapNode[i][j+1] = this.mapNode[i][j];
                        this.map[i][j+1] = this.map[i][j];

                        this.mapNode[i][j] = null;
                        this.map[i][j] = null;
                        downFlag = true;
                    }
                }
            }
        }
        // 下落之后，我们需要把空补上。
        this.scheduleOnce(this.checkNullBlock, 0.2);
    }

    checkNullBlock () {
        for (let i = 1; i < 6; i++) {
            for (let j = 1; j < 6; j++) {
                if (this.mapNode[i][j] === null) {
                    let num = this.randNum(0, 4);
                    let x = -260 + (i - 1) * 130;
                    let y = 260 - (j - 1) * 130;
                    this.map[i][j] = num;
                    this.mapNode[i][j] = this.createBlock(x, y, num);
                    // 消除时 缩小 0
                    // pool get 
                    this.mapNode[i][j].scale = 0.5;
                     //this.mapNode[i][j].runAction(cc.scaleTo(0.1, 1));
                    cc.tween(this.mapNode[i][j])
                    .to(0.2,{scale:1})
                    .start();

                }
            }
        }
        // 新建方块时间0.1秒
        this.scheduleOnce(this.checkCount, 0.2);
    }

    /**
     * 新建方块后继续检测是否有超过3个方块连接
     */
    checkCount () {
        let checkFlag = true;
        for (let i = 1; i < this.rows; i++) {
            for (let j = 1; j < this.cols; j++) {
                if (checkFlag === false) break;
                this.count = 0;
                this.setZeroBook();
                this.mapForCount(i, j, this.map[i][j]);
                if (this.count >= 3) {
                    this.doActionForBook(i, j);
                    checkFlag = false;
                }
            }
        }
        if (checkFlag === true) {
            this.mMainMgmt.openTouch();
        }
    }

    setZeroBook () {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                this.book[i][j] = 0;
            }
        }
    }

    /**
     * 返回min - max 的随机值
     * @param {number} min 
     * @param {number} max 
     */
    public randNum (min, max) {
        let value = min + (max - min + 1) * Math.random();
        return Math.floor(value);
    }
}
