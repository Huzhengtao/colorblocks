// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import MusicMgmt from './MusicMgmt';
import MainMgmt from './MainMgmt';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    moreBtn: cc.Node = null;
    
    @property(cc.Node)
    musicBtn: cc.Node = null;

    @property(cc.Node)
    refreshBtn: cc.Node = null;

    @property(MusicMgmt)
    mMusicMgmt: MusicMgmt = null;

    @property(MainMgmt)
    mMainMgmt: MainMgmt = null;

    @property([cc.Node])
    muteSF: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.moreBtn.active = true;
        }else{
            this.moreBtn.active = false;
        }

    }

    start () {
        if(!this.mMusicMgmt.isBGMute){
            //启动音乐
            this.muteSF[1].active = false;
            this.muteSF[0].active = true;
        }else{
            //暂停音乐
            this.muteSF[0].active = false;
            this.muteSF[1].active = true;
        }
    }

      /*
    {
        "icon": "https://img.4398.com/wegame/icon/kdjl.png",
        "appid": "wx5dc4c131d24c9415",
        "name": "空当接龙",

        wxaee84a3f34201a92 //蜘蛛纸牌
    }
     */

    randomNumber (min: number, max: number): number {
        return min + parseInt(""+Math.random() * (max - min));
    }

    onMoreBtn(){
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let xs = new Array("wx5dc4c131d24c9415","wxaee84a3f34201a92");//空当接龙 //蜘蛛纸牌
            let index = this.randomNumber(0,xs.length);
            let x = xs[index];

            LogUtil.debug(index,x);

            wx.navigateToMiniProgram({
                appId: x,
                path: "",
                extraData: {
                    appid: "wx99145c6f0846f697",
                    appname: "color_block",
                },
                envVersion: 'release',
                success(res) {
                    LogUtil.debug("success");
                },
                fail(res) {
                    LogUtil.debug("fail");
                },
                cancel(res) {
                    LogUtil.debug("cancel");
                },
            });
        }
    }

    onMusicBtn(){
        this.mMusicMgmt.setting(!this.mMusicMgmt.isBGMute,!this.mMusicMgmt.isBGMute);

        if(!this.mMusicMgmt.isBGMute){
            //启动音乐
            console.log("启动音乐1");
            this.muteSF[1].active = false;
            this.muteSF[0].active = true;
        }else{
            //暂停音乐
            console.log("暂停音乐2");
            this.muteSF[0].active = false;
            this.muteSF[1].active = true;
        }
    }

    onRefreshBtn(){
        console.log("重新开始3");

        cc.tween(this.refreshBtn.getChildByName("renew"))
        .by(0.5,{rotation:360}).start();

        

        this.mMainMgmt.renew();

        this.on();
        // this.musicBtn.
    }

    off(){
        this.musicBtn.active = false;
        this.refreshBtn.active = false;
        
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.moreBtn.active = false;
        }
    }

    on(){
        this.musicBtn.active = true;
        this.refreshBtn.active = true;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.moreBtn.active = true;
        }
    }

    // update (dt) {}
}
