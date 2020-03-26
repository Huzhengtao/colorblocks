const {ccclass, property} = cc._decorator;

import BlockMgmt from './BlockMgmt';
import MusicMgmt from './MusicMgmt';
import ScoreMgmt from './ScoreMgmt';
import HPMgmt from './HPMgmt';
import PopupMgmt from './PopupMgmt';
//import MenuMgmt from './MenuMgmt';
//import Admob from './Admob';

///import { AudioEnum } from "./utils/muisc/AudioEnum"
//import { AudioClipUtil } from "./utils/muisc/AudioClipUtil"


@ccclass
export default class Helloworld extends cc.Component {

    @property(BlockMgmt)
    mBlockMgmt: BlockMgmt = null;

    @property(MusicMgmt)
    mMusicMgmt: MusicMgmt = null;

    @property(ScoreMgmt)
    mScoreMgmt: ScoreMgmt = null;

    @property(PopupMgmt)
    mPopupMgmt: PopupMgmt = null;

    //@property(Admob)
    //mAdmob: Admob = null;

    //@property(MenuMgmt)
    //mMenuMgmt: MenuMgmt = null;

    @property(HPMgmt)
    mHPMgmt: HPMgmt= null;

    //audioClipUtil: AudioClipUtil

    onLoad () {
        //this.audioClipUtil = AudioClipUtil.getInstance();

         // 如果是微信小游戏，打开分享
         if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.showShareMenu({withShareTicket: true});
            wx.onShareAppMessage(() => {
                return {
                    title: '这个游戏蛮解压的，你可以试试看',
                    imageUrl: "https://img.4398.com/fc/cb/0.png",
                }
            });
        }
    }

    start () {

        // this.audioClipUtil.preLoadAllAudioClips((progress, isCompleted) => {
        //     if (isCompleted) {
        //     } else {
        //         cc.log(`回调进度: ${progress}`)
        //     }
        // });

        this.openTouch();
        this.mScoreMgmt.initScore();
        this.mHPMgmt.updHP();

        //const bgmAudioClip = this.audioClipUtil.getAudioClip(AudioEnum.BGM);
        //cc.audioEngine.playMusic(bgmAudioClip, true);
        //this.hScoreLabel.string = "high score:"+1;
        //this.cScoreLabel.string = "curret score:"+"0";
    }

 

   
    //重新开局
    renew(){
        this.mScoreMgmt.scoreValue = 0;
        this.mHPMgmt.hpValue = 5;
        this.start();
        this.mBlockMgmt.renew();
    }

    // update (dt) {}

   

    //event
    touchEnd(e){
        this.mMusicMgmt.playHitMusic();
        //获取位置
        let pos = this.node.convertToNodeSpaceAR(e.getLocation());
        // 每个方块 空间为 130 * 130 5个方块连一排为 650 宽
        // 所以在坐标转化时是 325  col 行  row 列
        // 加一是因为 5 * 5的空间，我准备采用 7 * 7 的二维数组
        let i = Math.floor((325 + pos.x)/130) + 1;
        let j = Math.floor((325 - pos.y)/130) + 1;
 
        console.log(pos.x,pos.y,i, j,this.mBlockMgmt.map[i][j]);

        // 如果出界
        if (i < 1 || i > 5 || j < 1 || j > 5) {
            console.log('不在范围内');
            return;
        }
        //
        if(!this.mBlockMgmt.blockAddOne(i,j)){
            return;
        }

        this.mHPMgmt.hpValue -= 1;
        // if (this.mHPMgmt.hpValue < 0) {
        //     console.log('游戏结束@@@@@111');
        //     this.mMusicMgmt.playOverMusic();
        //     this.mPopupMgmt.gameOver(true);
        //     this.closeTouch();
        // }
        

        this.mHPMgmt.updHP();
        this.closeTouch();

        // 每次检测前都应归零book, count也需要归零
        this.mBlockMgmt.count = 0;
        this.mBlockMgmt.setZeroBook();
        let num = this.mBlockMgmt.map[i][j];
        this.mBlockMgmt.mapForCount(i, j, num);

        if (this.mHPMgmt.hpValue <= 0) {
            console.log('游戏结束@@@@@222');
            this.mMusicMgmt.playOverMusic();
            this.mPopupMgmt.gameOver(true);
            this.closeTouch();
            //this.mMenuMgmt.refreshBtn.active = false;
            return;
        }

        if (this.mBlockMgmt.count < 3) {
            this.openTouch();
            return;
        }
        this.mBlockMgmt.hits = 0;
        // this.updateScoreLabel(this.blockManager.count, this.blockManager.map[col][row]);
        this.mBlockMgmt.doActionForBook(i, j);
        

        
    }

     /**
     * 打开触摸
     */
    openTouch () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }
 
    /**
     * 关闭触摸
     */
    closeTouch () {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

}
