// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

//import { AudioEnum } from "./utils/muisc/AudioEnum"
import { AudioClipUtil } from "./utils/muisc/AudioClipUtil"


/** 音乐的资源名称枚举 */
enum AudioEnum {
    /** 背景音乐 */
    BGM = 'bgMain',

    over = 'over',

    hit= 'hit',
    c0 = 'Combo1',
    c1 = 'Combo2',
    c2 = 'Combo3',
    c3 = 'Combo4',
    c4 = 'Combo5',
    c5 = 'Combo6',

    /** 点击音效 */
    //CLICK = 'click',
    /** 动作音效 */
    //ACTION = 'action',
    /** 金币音效 */
    //COIN = 'getcoin',
    /** 游戏结束音效 */
    //GAME_OVER = 'gameover',
}

@ccclass
export default class NewClass extends cc.Component {

    // @property({type:cc.AudioClip})
    // bgMusic: cc.AudioClip = null; //背景音乐

    // @property({type:cc.AudioClip})
    // hitMusic: cc.AudioClip = null; //点击特效

    // @property({type:cc.AudioClip})
    // public overMusic: cc.AudioClip = null; //游戏结束音效
 
    //@property({type:[cc.AudioClip]})
    public comboMusic: cc.AudioClip[] = []; //暴击特效[0-5] 一共6组音效


    @property
    isEffectMute = false;//特效音
    @property
    isBGMute = false;//背景音

    audioClipUtil: AudioClipUtil;

    onLoad(){
        this.audioClipUtil = AudioClipUtil.getInstance();

        this.isEffectMute = cc.sys.localStorage.getItem('effectMute');//获取
        this.isBGMute = cc.sys.localStorage.getItem('bgMute');//获取

        this.comboMusic[0] =  this.audioClipUtil.getAudioClip(AudioEnum.c0);
        this.comboMusic[1] =  this.audioClipUtil.getAudioClip(AudioEnum.c1);
        this.comboMusic[2] =  this.audioClipUtil.getAudioClip(AudioEnum.c2);
        this.comboMusic[3] =  this.audioClipUtil.getAudioClip(AudioEnum.c3);
        this.comboMusic[4] =  this.audioClipUtil.getAudioClip(AudioEnum.c4);
        this.comboMusic[5] =  this.audioClipUtil.getAudioClip(AudioEnum.c5);
    }

    public setting(effectMute_,bgMute_){
        console.log("#musicSwitch")

        this.isBGMute = bgMute_;
        this.isEffectMute = effectMute_;

        cc.sys.localStorage.setItem('bgMute', this.isBGMute);//存储
        cc.sys.localStorage.setItem('effectMute', this.isEffectMute);//存储

        const bgmAudioClip = this.audioClipUtil.getAudioClip(AudioEnum.BGM);

        if(cc.audioEngine.isMusicPlaying()){
            if(this.isBGMute){
                console.log("#关闭音乐")
                cc.audioEngine.stopAll();
            }else{
                console.log("#开启音乐")
                cc.audioEngine.playMusic(bgmAudioClip,true);
            }
        }else{
            if(!this.isBGMute){
                console.log("#开启音乐")
                cc.audioEngine.playMusic(bgmAudioClip,true);
            }
        }

        this.start();
    }


    start () {
        //启动背景音乐
        if(!cc.audioEngine.isMusicPlaying() && !this.isBGMute){
            //cc.audioEngine.playMusic(this.bgMusic,true);
            const bgmAudioClip = this.audioClipUtil.getAudioClip(AudioEnum.BGM);
            cc.audioEngine.playMusic(bgmAudioClip, true);
            cc.audioEngine.resumeMusic();
            LogUtil.debug("启动背景音乐 - 已开启");
        }else{
            LogUtil.debug("启动背景音乐 - 已关闭");
        }
    }

    //攻击音效
    public playHitMusic(){
        if(!this.isEffectMute){
            cc.audioEngine.playEffect(this.audioClipUtil.getAudioClip(AudioEnum.hit),false);
        }
    }
    //游戏结束音效
    public playOverMusic(){
        if(!this.isEffectMute){
            cc.audioEngine.playEffect(this.audioClipUtil.getAudioClip(AudioEnum.over),false);
        }
    }
    //暴击音效 
    public playComboMusic(id){
        if(id < 0) return;
        if(id >5) id = 5;
        if(!this.isEffectMute){
            cc.audioEngine.playEffect(this.comboMusic[id],false);
        }
    }
    // update (dt) {}
}
