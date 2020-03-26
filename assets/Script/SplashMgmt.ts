// program:
// description:
// author: fangqing.fan@hotmail.com
// date:

const {ccclass, property} = cc._decorator;

//import { AudioEnum } from "./utils/muisc/AudioEnum"
import { AudioClipUtil } from "./utils/muisc/AudioClipUtil";


@ccclass
export default class NewClass extends cc.Component {

    audioClipUtil: AudioClipUtil;

    onLoad () {
        this.audioClipUtil = AudioClipUtil.getInstance();
    }

    start () {
        

        this.audioClipUtil.preLoadAllAudioClips((progress, isCompleted) => {
            if (isCompleted) {
                cc.log('预加载完成，进入游戏')


                cc.director.loadScene('main')


                // 缓存完了，可以进入游戏了
                //

                //const bgmAudioClip = this.audioClipUtil.getAudioClip(AudioEnum.BGM);
                //cc.audioEngine.playMusic(bgmAudioClip, true);

                console.log(GlobalCfg.httpUrl,GlobalCfg.wsUrl);

                ///console.log(this.mGlobalCfg.url);
                //console.log(window.httpUrl);
                // LogUtil.debug("xx",2,"xxa");

                //网络请求 get
                //HttpReq.get(GlobalCfg.httpUrl,this.httpCallback);

                // let x = "abc.123";
                // var bs = md5.hex_md5(x);
                // LogUtil.debug(bs);

                // let bb = sha1.hash("23");

                // LogUtil.debug(bb);

                //websocet connection
                // 使用
                //const ws = new WebSocketClient('ws://192.168.3.149:9902/hall') // 如: ws://localhost:4000/ws
                

            } else {
                cc.log(`回调进度: ${progress}`)
            }
        })
    }

    httpCallback(jsonData){
        LogUtil.debug(jsonData);
    }

    
}
