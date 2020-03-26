// program:
// description:
// author: fangqing.fan@hotmail.com
// date:

class GlobalCfg {
    public static readonly httpUrl = "http://dl.fanfq.com/test/jsconfig.json";
    public static readonly wsUrl = "http://localhost:3000/";
}

(<any>window).GlobalCfg = GlobalCfg;