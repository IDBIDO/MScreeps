'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
  * 把 obj2 的原型合并到 obj1 的原型上
  * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
  * @param obj1 要挂载到的对象
  * @param obj2 要进行挂载的对象
  */
const assignPrototype = function (obj1, obj2) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            });
        }
        else
            obj1.prototype[key] = obj2.prototype[key];
    });
};
function connectedComponents(adj) {
    var numVertices = adj.length;
    var visited = new Array(numVertices);
    for (var i = 0; i < numVertices; ++i) {
        visited[i] = false;
    }
    var components = [];
    for (var i = 0; i < numVertices; ++i) {
        if (visited[i]) {
            continue;
        }
        var toVisit = [i];
        var cc = [i];
        visited[i] = true;
        while (toVisit.length > 0) {
            var v = toVisit.pop();
            var nbhd = adj[v];
            for (var j = 0; j < nbhd.length; ++j) {
                var u = nbhd[j];
                if (!visited[u]) {
                    visited[u] = true;
                    toVisit.push(u);
                    cc.push(u);
                }
            }
        }
        components.push(cc);
    }
    return components;
}

function maxTwoNumber(x, y) {
    if (x >= y)
        return x;
    return y;
}
function translatePosToNode(pos) {
    return pos[0] * 50 + pos[1];
}
function translateNodeToPos(node) {
    return [Math.floor(node / 50), node % 50];
}
function distanceTwoPoints(pointA, pointB) {
    //return Math.sqrt( (pointA[0]-pointB[0]) **2 + (pointA[1]-pointB[1]) **2 )
    let x = Math.sqrt((pointA[0] - pointB[0]) ** 2);
    //console.log(x);
    let y = Math.sqrt((pointA[1] - pointB[1]) ** 2);
    //console.log(y);
    return maxTwoNumber(x, y);
}
/*
    punto de distancia minima del listPoint un punto 'point' dado
*/
function minDistance(point, listPoint) {
    listPoint[0];
    let disMin = distanceTwoPoints(point, listPoint[0]);
    let index = 0;
    for (let i = 1; i < listPoint.length; ++i) {
        let aux = distanceTwoPoints(point, listPoint[i]);
        if (aux < disMin) {
            disMin = aux;
            listPoint[i];
            index = i;
        }
    }
    //listPoint.splice(index, 1);
    return index;
    //return [pmim[0], pmim[1]];
}
/*
    puntos de distancia 1 de un punto dado a una lista de puntos
*/
function nearPoint(point, listPoint) {
    let near = [];
    for (let i = 0; i < listPoint.length; ++i) {
        if (distanceTwoPoints(point, listPoint[i]) == 1) {
            near.push(i);
        }
    }
    return near;
}
function nearPointOne(point, listPoint) {
    let near;
    for (let i = 0; i < listPoint.length; ++i) {
        if (distanceTwoPoints(point, listPoint[i]) == 1) {
            near = i;
            break;
        }
    }
    return near;
}
function transformRoadToAdjacentList(roadList) {
    let adjacentList = [];
    for (let i = 0; i < roadList.length; ++i) {
        adjacentList.push(nearPoint(roadList[i], roadList));
        //console.log(i , nearPoint(roadList[i], roadList));
    }
    //console.log(adjacentList);
    return adjacentList;
}
function reconstructPath(beginPoint, endPoint, prev) {
    let path = [];
    for (let at = endPoint; at != -1; at = prev[at]) {
        path.push(at);
    }
    path.reverse();
    if (path[0] == beginPoint) {
        return path;
    }
    return [];
}
function solveBFS(roadList, beginPoint) {
    //initialize visited array
    let visited = Array();
    for (let i = 0; i < roadList.length; ++i) {
        visited.push(false);
    }
    // Use an array as our queue representation:
    let q = new Array();
    visited[beginPoint] = true;
    q.push(beginPoint);
    //save path
    let path = new Array();
    path.push(beginPoint);
    let prev = new Array();
    for (let i = 0; i < roadList.length; ++i) {
        prev.push(-1);
    }
    while (q.length > 0) {
        const v = q.shift();
        for (let adjV of roadList[v]) {
            if (!visited[adjV]) {
                visited[adjV] = true;
                q.push(adjV);
                prev[adjV] = v;
            }
        }
    }
    return prev;
}
function roadPath(roadList, beginPoint, endPoint) {
    let prev = solveBFS(roadList, beginPoint);
    return reconstructPath(beginPoint, endPoint, prev);
}
//get object's ID by roomName, position and structure type
function getId(roomName, pos, structureType) {
    //console.log(structureType);
    const position = new RoomPosition(pos[0], pos[1], roomName);
    const object = position.lookFor(structureType);
    return object[0].id;
}
function inMapRange(pos) {
    if (pos[0] >= 0 && pos[0] < 50) {
        if (pos[1] >= 0 && pos[1] < 50) {
            return true;
        }
    }
    return false;
}
/*
    negative points will ignored
*/
function nearPosition(pos) {
    let nearPoints = [
        [pos[0] - 1, pos[1] + 1],
        [pos[0] - 1, pos[1]],
        [pos[0] - 1, pos[1] - 1],
        [pos[0], pos[1] + 1],
        [pos[0], pos[1] - 1],
        [pos[0] + 1, pos[1] + 1],
        [pos[0] + 1, pos[1]],
        [pos[0] + 1, pos[1] - 1],
    ];
    let validNearPoints = [];
    for (let i = 0; i < nearPoints.length; ++i) {
        if (inMapRange(nearPoints[i])) {
            validNearPoints.push(nearPoints[i]);
        }
    }
    return validNearPoints;
}
function isRampartPos(roomName, pos) {
    const rampartDataList = Memory['colony'][roomName]['roomPlanning']['model']['rampart'];
    for (let i = 0; i < rampartDataList.length; ++i) {
        if (pos[0] == rampartDataList[i]['pos'][0] && pos[1] == rampartDataList[i]['pos'][1]) {
            return true;
        }
    }
    return false;
}

/**
 * 63超级扣位置自动布局
 * 能覆盖95% 地地形布局的覆盖
 * 
 * author：6g3y,Scorpior,Scokranotes,ChenyangDu
 * version:1.0.8
 * 
 * 【使用方法（傻瓜版）】
 * 1.设置4个flag，分别为对应房间的
 *     pc 控制器
 *     pm 矿
 *     pa pb 能量源
 * 2.下载63大佬的超级扣位置自动布局，解压并导入wasm二进制模块，
 *   命名（不要后缀）：algo_wasm_priorityqueue，确保此时文件夹中应当增了以下两个文件
 *     + 63超级扣位置自动布局_改良版.js
 *     + algo_wasm_priorityqueue.wasm
 * 
 * 3.在主循环代码的末尾，也就是main.js的module.exports.loop中最后一行添加
 *      require("63超级扣位置自动布局_改良版").run()
 * 
 * 4.运行（注意截图）
 * 5.放一个flag名字为p，随便放哪，运行会自动检测，检测到有p这个flag就会运行，运行完成会自动删掉
 *   显示的时间非常短，注意截图，消失了再放一个p又会重新运行一遍，不要反复折腾完，很耗CPU
 * 
 * 【使用方法（高级版）】
 * 1.计算位置
 *  [flagController,flagMineral,flagSourceA,flagSourceB]
 *  必须包含.pos对象 {{{ p.pos.x|y }}}
 * >> roomStructsData = ManagerPlanner.computeManor(p.pos.roomName,[pc,pm,pa,pb])
 * 
 * 2.可视化显示
 * >> HelperVisual.showRoomStructures(roomStructsData.roomName,roomStructsData.structMap)
 * 
 * 【结果说明】
 * {
 *       roomName: roomName
 *       storagePos: {x,y} //storage集群中心位置
 *       labPos: {x,y} //lab中心位置
 *       structMap:{ "rampart" : [[x1,y1],[x2,y2] ...] ...} 
 *           "建筑类型，直接用没问题的":[[x1,y1]]
 *           //建造的时候按顺序就可以了 ，顺序是距离 storagePos 排序过后的（除了road）
 *           //具体建造多少个，使用 CONTROLLER_STRUCTURES 获取当前可以造多少
 * }
 * 
 * 
 * 【警告】
 * ！！警告！！ 确保你的bucket和可运行CPU超过100个 ！！警告！！
 * ！！警告！！ 确保你的bucket和可运行CPU超过100个 ！！警告！！
 * ！！警告！！ 确保你的bucket和可运行CPU超过100个 ！！警告！！
 * ！！警告！！ 确保你的bucket和可运行CPU超过100个 ！！警告！！
 * ！！警告！！ 确保你的bucket和可运行CPU超过100个 ！！警告！！
 * ！！警告！！ 确保你的bucket和可运行CPU超过100个 ！！警告！！
 * 
 * 
 * 【原理】：能跑就行有空 写篇简书
 * 【代码】：挺乱的 如果有机会在整理一下代码
 * 
 * 【更新说明】：
 * 1.优化了外矿的寻路
 * 2.优化了塔的布局
 * 3.更新了说明文档
 * 
 * 感谢63！
 * 
 */


 
/**
 *  wasm 优先队列
 *  帮你加速涉及优先级的调度算法
 *  
 *  author: Scorpior
 *  version: v1.1.0
 *  
 *  usage: 
 *  1. add .js and .wasm modules
 *  2. require .js module and use
 *
 *  本人有改动！
 */

 global.structuresShape= {
    "spawn": "◎",
    "extension": "ⓔ",
    "link": "◈",
    "road": "•",
    "constructedWall": "▓",
    "rampart": "⊙",
    "storage": "▤",
    "tower": "🔫",
    "observer": "👀",
    "powerSpawn": "❂",
    "extractor": "⇌",
    "terminal": "✡",
    "lab": "☢",
    "container": "□",
    "nuker": "▲",
    "factory": "☭"
};
global.structuresColor= {
    "spawn": "cyan",
    "extension": "#0bb118",
    "link": "yellow",
    "road": "#fa6f6f",
    "constructedWall": "#003fff",
    "rampart": "#003fff",
    "storage": "yellow",
    "tower": "cyan",
    "observer": "yellow",
    "powerSpawn": "cyan",
    "extractor": "cyan",
    "terminal": "yellow",
    "lab": "#d500ff",
    "container": "yellow",
    "nuker": "cyan",
    "factory": "yellow"
};
let helpervisual={
    //线性同余随机数
    rnd : function( seed ){
    return ( seed * 9301 + 49297 ) % 233280; //为何使用这三个数?
    },
    // seed 的随机颜色
    randomColor : function (seed){
        seed = parseInt(seed);
        let str = "12334567890ABCDEF";
        let out = "#";
        for(let i=0;i<6;i++){
            seed = helpervisual.rnd(seed+Game.time%100);
            out+=str[parseInt(seed)%str.length];
        }
        return out
    },
    // 大概消耗1 CPU！ 慎用！
    showRoomStructures : function (roomName,structMap){
        let roomStructs = new RoomArray().init();
        const visual = new RoomVisual(roomName);
        structMap["road"].forEach(e=>roomStructs.set(e[0],e[1],"road"));
        _.keys(CONTROLLER_STRUCTURES).forEach(struct=>{
            if(struct=="road"){
                structMap[struct].forEach(e=>{
                    roomStructs.forNear((x,y,val)=>{
                        if(val =="road"&&((e[0]>=x&&e[1]>=y)||(e[0]>x&&e[1]<y)))visual.line(x,y,e[0],e[1],{color:structuresColor[struct]});
                    },e[0],e[1]);
                    visual.text(structuresShape[struct], e[0],e[1]+0.25, {color: structuresColor[struct],opacity:0.75,fontSize: 7});
                });
            }
            else structMap[struct].forEach(e=>visual.text(structuresShape[struct], e[0],e[1]+0.25, {color: structuresColor[struct],opacity:0.75,fontSize: 7}));
        });
    },
};

let HelperVisual=helpervisual;


class UnionFind{

    constructor(size) {
        this.size  = size;
    }
    init() {
        if(!this.parent)
            this.parent = new Array(this.size);
        for(let i=0;i<this.size;i++){
            this.parent[i]=i;
        }
    }
    find(x) {
        let r = x;
        while (this.parent[r] != r) r = this.parent[r];
        while (this.parent[x] != x) {
            let t = this.parent[x];
            this.parent[x] = r;
            x = t;
        }
        return x;
    }
    union(a,b){
        a = this.find(a);
        b = this.find(b);
        if(a>b)this.parent[a]=b;
        else if(a!=b) this.parent[b]=a;
    }
    same(a,b){
        return this.find(a) ==  this.find(b)
    }
}


global.UnionFind = UnionFind;

let NodeCache= [];
function NewNode(k,x,y,v){
    let t;
    if(NodeCache.length){
        t = NodeCache.pop();
    }else {
        t = {};
    }
    t.k = k;
    t.x = x;
    t.y = y;
    t.v = v;
    return t
}


function ReclaimNode(node){
    if(NodeCache.length<10000)
        NodeCache.push(node);
}


// @ts-ignore
const binary = require('algo_wasm_priorityqueue');   // 读取二进制文件
const wasmModule = new WebAssembly.Module(binary);  // 初始化为wasm类

/**
 * 
 * @typedef {Object} node
 * @property {number} k 优先级实数（可负）
 * 
 * @typedef {{
 *      memory:{
 *          buffer: ArrayBuffer
 *      },
 *      init(is_min:number):void,
 *      push(priorty:number, id:number):void,
 *      pop():void,
 *      top():number,
 *      get_identifier(pointer:number):number,
 *      size():number,
 *      clear():void,
 *      is_empty():boolean
 *  }} cppQueue
 */

class BaseQueue {
    /**
     * 队列元素个数
     * @returns {number}
     */
    size() {
        // @ts-ignore
        return this.instance.size();
    }
    /**
     * 清空整个队列
     */
    clear() {
        // @ts-ignore
        this.instance.clear();
    }
    /**
     * 队列是否为空
     * @returns {boolean} 实际返回值是0或1
     */
    isEmpty() {
        // @ts-ignore
        return !this.instance.is_empty();
    }
}

/**
 *  c++优先队列
 *  最大容量 131072 个元素（2的17次方）
 *  每个元素是带有priority属性的任意对象
 *  连续pop 100k个元素时比js队列快 80% 以上，元素个数少时比js快 5~10 倍
 */
class PriorityQueue extends BaseQueue {
    /**
     * @param {boolean} isMinRoot 优先级方向，true则pop()时得到数字最小的，否则pop()出最大的
     */
    constructor(isMinRoot=false) {
        super();
        /**@type {cppQueue} */
        let instance;
        /**@type {node[]} */
        let cache = [];

        const imports = {   // 把wasm类实例化需要的接口函数
            env: {
                emscripten_notify_memory_growth() {
                }
            },
            wasi_snapshot_preview1: {
                proc_exit: () => { }
            }
        };
        // @ts-ignore
        instance = new WebAssembly.Instance(wasmModule, imports).exports;   // 实例化
        instance.init(+!!isMinRoot);  // !!转化为boolean, +转为数字

        /**
         * @param {node} node 
         */
        this.push = (node) => {
            try {
                instance.push(node.k, cache.length);
                cache.push(node);
            } catch (e) {
                if (e instanceof TypeError) {
                    throw e;
                } else {
                    throw Error(`priorityQueue is full.\n\t Current size is ${instance.size()}, buffer length is ${instance.memory.buffer.byteLength * 2 / 1024}KB.`);
                }
            }
        };
        /** 
         *  @returns {node|undefined}
         */
        this.pop = () => {
            if (instance.size() > 0) {
                let pointer = instance.top();
                let id = instance.get_identifier(pointer);
                let node = cache[id];
                instance.pop();
                // @ts-ignore
                cache[id] = undefined;
                return node;
            } else {
                return undefined;
            }
        };
        /**
         *  @returns {node|undefined}
         */
        this.top = () => {
            if (instance.size() > 0) {
                let pointer = instance.top();
                return cache[instance.get_identifier(pointer)];
            } else {
                return undefined;
            }
        };
        /**
         *  @returns {undefined}
         */
        this.whileNoEmpty = (func) => {
            while (!this.isEmpty()){
                let node = this.pop();
                func(node);
                ReclaimNode(node);
            }
        };

        Object.defineProperty(this, 'instance', {   // 不想被枚举到
            value: instance
        });
    }
    /**
     *  把节点插入队列
     * @param {node} node 待插入对象，至少含有priority:k属性
     */
    push(node) { }
    /** 
     *  查看顶端节点，空队列返回undefined
     *  @returns {node|undefined}
     */
    top() { return }
    /**
     *  取出顶端节点，空队列返回undefined
     *  @returns {node|undefined}
     */
    pop() { return }
}

global.PriorityQueue = PriorityQueue;
global.NewNode = NewNode;
global.ReclaimNode = ReclaimNode;
// module.exports = {
//     PriorityQueue: PriorityQueue
// }


let RoomArray_proto= {
    exec(x,y,val){
        let tmp = this.arr[x*50+y];
        this.set(x,y,val);
        return tmp
    },
    get(x,y){
        return this.arr[x*50+y];
    },
    set(x,y,value){
        this.arr[x*50+y]=value;
    },
    init(){
        if(!this.arr)
            this.arr = new Array(50*50);
        for(let i=0;i<2500;i++){
            this.arr[i]=0;
        }
        return this;
    },
    forEach(func){
        for(let y = 0; y < 50; y++) {
            for(let x = 0; x < 50; x++) {
                func(x,y,this.get(x,y));
            }
        }
    },
    for4Direction(func,x,y,range=1){
        for(let e of [[1,0],[-1,0],[0,1],[0,-1]]){
            let xt=x+e[0];
            let yt=y+e[1];
            if(xt>=0&&yt>=0&&xt<=49&&yt<=49)
                func(xt,yt,this.get(xt,yt));
        }
    },
    forNear(func,x,y,range=1){
        for(let i=-range;i<=range;i++){
            for(let j=-range;j<=range;j++){
                let xt=x+i;
                let yt=y+j;
                if((i||j)&&xt>=0&&yt>=0&&xt<=49&&yt<=49)
                    func(xt,yt,this.get(xt,yt));
            }
        }
    },
    forBorder(func,range=1){
        for(let y = 0; y < 50; y++) {
            func(0,y,this.get(0,y));
            func(49,y,this.get(49,y));
        }
        for(let x = 1; x < 49; x++) {
            func(x,0,this.get(x,0));
            func(x,49,this.get(x,49));
        }
    },
    initRoomTerrainWalkAble(roomName){
        let terrain = new Room.Terrain(roomName);
        this.forEach((x,y)=> this.set(x,y, terrain.get(x,y)==1?0:terrain.get(x,y)==0?1:2));
    }
};
class RoomArray {
    constructor(){
        this.__proto__ = RoomArray_proto;
    }
}


global.minPlaneCnt = 140; // 内部布局最小面积！ 试过了，140是 基本上最低配置了

let visited = new RoomArray();
let roomWalkable = new RoomArray();
let nearWall = new RoomArray();
let routeDistance = new RoomArray();
let roomObjectCache = new RoomArray();

let nearWallWithInterpolation= new RoomArray();
let interpolation = new RoomArray();

let queMin = new PriorityQueue(true);
let queMin2 = new PriorityQueue(true);
let startPoint = new PriorityQueue(true);

let unionFind = new UnionFind(50*50);

/**
 * controller mineral source posList
 */
let objects = [];

let pro={
    /**
     * https://www.bookstack.cn/read/node-in-debugging/2.2heapdump.md
     * 防止内存泄漏！！！！
     * 闭包太多，改不动了
     */
    init  (){
        visited = new RoomArray();
        roomWalkable = new RoomArray();
        nearWall = new RoomArray();
        routeDistance = new RoomArray();

        nearWallWithInterpolation= new RoomArray();
        interpolation = new RoomArray();
        roomObjectCache = new RoomArray();

        queMin = new PriorityQueue(true);
        queMin2 = new PriorityQueue(true);
        startPoint = new PriorityQueue(true);

        unionFind = new UnionFind(50*50);


        visited.init();
        nearWall.init();
        routeDistance.init();
        roomWalkable.init();

        nearWallWithInterpolation.init();
        interpolation.init();
        roomObjectCache.init();
        unionFind.init();

        queMin.clear();
        queMin2.clear();
        startPoint.clear();
    },
    /**
     * 防止内存泄漏！！！！
     */
    dismiss (){
        visited = null;
        roomWalkable = null;
        nearWall = null;
        routeDistance = null;
        roomObjectCache = null;

        nearWallWithInterpolation= null;
        interpolation = null;

        queMin = null;
        queMin2 = null;
        startPoint = null;

        unionFind = null;
        objects= [];
    },
    /**
     * 计算区块的最大性能指标 ，性能消耗的大头！
     * 优化不动了
     */
    getBlockPutAbleCnt (roomWalkable,visited,queMin,unionFind,tarRoot,putAbleCacheMap,AllCacheMap){
        if(putAbleCacheMap[tarRoot])return [putAbleCacheMap[tarRoot],AllCacheMap[tarRoot]]
        // let t = Game.cpu.getUsed() //这很吃性能，但是是必须的
        let roomManor = routeDistance;
        roomManor.init();
        roomManor.forEach((x, y, val)=>{if(tarRoot==unionFind.find(x*50+y)){roomManor.set(x,y,1);}});
        roomManor.forEach((x, y, val)=>{
            if(val){
                let manorCnt = 0;
                let wallCnt = 0;
                roomManor.for4Direction((x1,y1,val1)=>{
                    if(val1)manorCnt+=1;
                    if(!roomWalkable.get(x1,y1))wallCnt+=1;
                },x,y);
                if(manorCnt==1&&wallCnt == 0)roomManor.set(x,y,0);
            }
        });
        let dfsMoreManor = function (x,y,val){
            if(!val&&roomWalkable.get(x,y)){
                let manorCnt = 0;
                let wallCnt = 0;
                roomManor.for4Direction((x1,y1,val1)=>{
                    if(val1)manorCnt+=1;
                    if(!roomWalkable.get(x1,y1))wallCnt+=1;
                },x,y);
                if(manorCnt>=2||manorCnt==1&&wallCnt>=2){
                    roomManor.set(x,y,1);
                    roomManor.for4Direction((x1,y1,val1)=>{
                        dfsMoreManor(x1,y1,val1);
                    },x,y);
                }
            }
        };
        roomManor.forEach((x, y, val)=>{dfsMoreManor(x,y,val);});
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomManor.forNear((x,y,val)=>{
                    roomManor.set(x,y,0);
                },x,y);
                roomManor.set(x,y,0);
            }
        });

        let innerPutAbleList = [];
        let AllCacheList = [];


            // &&!roomObjectCache.get(x,y)
        visited.init();/*
        roomWalkable.forEach((x, y, val)=>{
            if(!roomManor.get(x,y)||roomObjectCache.get(x,y)) {
                // const visual = new RoomVisual("W3N6");
                // if(roomObjectCache.get(x,y))visual.text(val&&!roomObjectCache.get(x,y)?-4:-1, x,y+0.25, {color: 'red',opacity:0.99,font: 7})
                // queMin.push(NewNode(val&&!roomObjectCache.get(x,y)?-4:-1,x,y));
                let innerWall = false //在墙上的时候要退一格子
                if(roomObjectCache.get(x,y)){
                    roomManor.forNear((x,y,val)=>{if(!val&&roomWalkable.get(x,y))innerWall=true},x,y)
                }
                queMin.push(NewNode(val?((roomObjectCache.get(x,y)&&!innerWall)?-1:-4):-1,x,y));
                // visited.set(x,y,1) 这里不能设置visited 因为 -4 和-1 优先级不同 如果 -4距离和-1比较，-1会抢走-4 导致 rangeAttack打得到
            }
        })*/

        roomWalkable.forEach((x, y, val)=>{
            if(!roomManor.get(x,y)) {
                queMin.push(NewNode(val?-4:-1,x,y));
                // visited.set(x,y,1) 这里不能设置visited 因为 -4 和-1 优先级不同 如果 -4距离和-1比较，-1会抢走-4 导致 rangeAttack打得到
            }
        });

        // let t = Game.cpu.getUsed() //这很吃性能，真的优化不动了

        queMin.whileNoEmpty(nd=>{
            let func = function (x,y,val){
                let item = NewNode(nd.k+2,x,y);
                if(!visited.exec(x,y,1)){
                    queMin.push(NewNode(nd.k+1,x,y));
                    if(roomManor.get(x,y)){
                        if(nd.k+1>=0&&val){
                            innerPutAbleList.push(item);
                            // visual.text(nd.k+2, x,y+0.25, {color: 'red',opacity:0.99,font: 7})
                        }
                        if(val)
                            AllCacheList.push(item);
                    }
                }
            };
            visited.set(nd.x,nd.y,1);
            if(nd.k>=-1)
                roomWalkable.for4Direction(func,nd.x,nd.y);
            else
                roomWalkable.forNear(func,nd.x,nd.y);
        });

        // console.log(Game.cpu.getUsed()-t)

        putAbleCacheMap[tarRoot] = innerPutAbleList;
        AllCacheMap[tarRoot] = AllCacheList;
        return [putAbleCacheMap[tarRoot],AllCacheMap[tarRoot]]
    },
    /**
     * 插值，计算区块的预处理和合并需求
     * @param roomName
     */
    computeBlock (roomName){
        new RoomVisual(roomName);

        roomWalkable.initRoomTerrainWalkAble(roomName);
        roomWalkable.initRoomTerrainWalkAble(roomName);

        //计算距离山体要多远
        roomWalkable.forEach((x,y,val)=>{if(!val){queMin.push(NewNode(0,x,y));visited.set(x,y,1);}});
        queMin.whileNoEmpty(nd=>{
            roomWalkable.for4Direction((x,y,val)=>{
                if(!visited.exec(x,y,1)&&val){
                    queMin.push(NewNode(nd.k+1,x,y));
                }
            },nd.x,nd.y);
            nearWall.exec(nd.x,nd.y,nd.k);
        });

        //距离出口一格不能放墙
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomWalkable.forNear((x,y,val)=>{
                    if(val){
                        // roomWalkable.set(x,y,0);
                        nearWall.set(x,y,50);
                        queMin.push(NewNode(0,x,y));
                        // visited.set(x,y,1)
                    }
                },x,y);
                // roomWalkable.set(x,y,0);
                queMin.push(NewNode(0,x,y));
                nearWall.set(x,y,50);
                // visited.set(x,y,1)
            }
        });

        let roomPutAble = routeDistance;
        roomPutAble.initRoomTerrainWalkAble(roomName);
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomWalkable.forNear((x,y,val)=>{
                    if(val){
                        roomPutAble.set(x,y,0);
                    }
                },x,y);
                roomPutAble.set(x,y,0);
            }
        });
        // 计算 控制器，矿物的位置
        let getObjectPos =function(x,y,struct){
            let put = false;
            let finalX = 0;
            let finalY = 0;
            roomPutAble.for4Direction((x,y,val)=>{
                if(val&&!put&&!roomObjectCache.get(x,y)){
                    finalX = x;
                    finalY = y;
                    put = true;
                }
            },x,y);
            roomPutAble.forNear((x,y,val)=>{
                if(val&&!put&&!roomObjectCache.get(x,y)){
                    finalX = x;
                    finalY = y;
                    put = true;
                }
            },x,y);
            roomObjectCache.set(finalX,finalY,struct);
            return [finalX,finalY]
        };
        for(let i=0;i<objects.length;i++){
            let pos = objects[i];
            //container 位置
            let p = getObjectPos(pos.x,pos.y,"container");

            // link 位置
            if(i!=1){
                let linkPos = getObjectPos(p[0],p[1],"link");
                roomObjectCache.link = roomObjectCache.link || [];
                roomObjectCache.link.push(linkPos); // link controller 然后是  source
            }else {
                roomObjectCache.extractor = [[pos.x,pos.y]];
            }
            roomObjectCache.container = roomObjectCache.container || [];
            if(i!=1)roomObjectCache.container.unshift(p); //如果是 mineral 最后一个
            else roomObjectCache.container.push(p);
        }

        //插值，这里用拉普拉斯矩阵，对nearWall 插值 成 nearWallWithInterpolation
        nearWall.forEach((x,y,val)=>{
            let value = -4*val;
            nearWall.for4Direction((x,y,val)=>{
                value += val;
            },x,y);
            interpolation.set(x,y,value);
            if(value>0)value=0;
            if(val&&roomWalkable.get(x,y))nearWallWithInterpolation.set(x,y,val+value*0.1);
        });


        // 计算距离出口多远
        visited.init();
        routeDistance.init();
        queMin.whileNoEmpty(nd=>{
            roomWalkable.forNear((x,y,val)=>{
                if(!visited.exec(x,y,1)&&val){
                    queMin.push(NewNode(nd.k+1,x,y));
                }
            },nd.x,nd.y);
            routeDistance.set(nd.x,nd.y,nd.k);
        });

        // 对距离的格子插入到队列 ，作为分开的顺序
        routeDistance.forEach((x,y,val)=>{
            if(!roomWalkable.get(x,y))return
            if(val)startPoint.push(NewNode(-val,x,y));
        });


        let sizeMap = {};
        let posSeqMap = {};

        // 分块，将地图分成一小块一小块
        visited.init();
        for(let i=0;i<100000;i++){
            if(startPoint.isEmpty())break;
            let cnt = 0;
            // let color = randomColor(i)
            let nd = startPoint.pop();
            let currentPos = nd.x*50+nd.y;
            let posSeq = [];

            //搜索分块
            let dfsFindDown = function (roomArray,x,y){
                let currentValue = roomArray.get(x,y);
                if(!visited.exec(x,y,1)){
                    roomArray.for4Direction((x1,y1,val)=>{
                        if(val&&(x1==x||y1==y) &&val<currentValue){
                            dfsFindDown(roomArray,x1,y1);
                        }
                    },x,y);
                    cnt++;
                    // visual.circle(x,y, {fill: color, radius: 0.5 ,opacity : 0.5})
                    let pos = x*50+y;
                    posSeq.push(pos);
                    unionFind.union(currentPos,pos);
                }
            };

            // 跑到最高点
            let dfsFindUp = function (roomArray,x,y){
                let currentValue = roomArray.get(x,y);
                if(!visited.exec(x,y,1)){
                    roomArray.forNear((x1,y1,val)=>{
                        if(val>currentValue&&currentValue<6){ //加了一点优化，小于时分裂更过
                            dfsFindUp(roomArray,x1,y1);
                        }
                        else if(val&&val<currentValue){
                            dfsFindDown(roomArray,x1,y1);
                        }
                    },x,y);
                    cnt++;
                    // visual.circle(x,y, {fill: color, radius: 0.5 ,opacity : 0.5})
                    let pos = x*50+y;
                    posSeq.push(pos);
                    unionFind.union(currentPos,pos);
                }
            };
            dfsFindUp(nearWallWithInterpolation,nd.x,nd.y);

            //记录每一块的位置和大小 以 并查集的根节点 作为记录点
            if(cnt>0){
                let pos = unionFind.find(currentPos);
                // queMin.push({k:cnt,v:pos})
                queMin.push(NewNode(cnt,0,0,pos));
                sizeMap[pos] = cnt;
                posSeqMap[pos] = posSeq;
            }
        }

        // 将出口附近的块删掉
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomWalkable.forNear((x,y,val)=>{
                    if(val){
                        let pos = unionFind.find(x*50+y);
                        if(sizeMap[pos]) delete sizeMap[pos];
                    }
                },x,y);
                let pos = unionFind.find(x*50+y);
                if(sizeMap[pos]) delete sizeMap[pos];
            }
        });

        let putAbleCacheMap = {};
        let allCacheMap = {};
        // let i = 0
        // 合并小块成大块的
        queMin.whileNoEmpty(nd=>{
            let pos = nd.v;
            if(nd.k != sizeMap[pos])return;// 已经被合并了
            // i++;

            visited.init();
            let nearCntMap={};

            //搜索附近的块
            posSeqMap[pos].forEach(e=>{
                let y = e%50;
                let x = ((e-y)/50);//Math.round
                roomWalkable.forNear((x,y,val)=>{
                    if(val&&!visited.exec(x,y,1)){
                        let currentPos = unionFind.find(x*50+y);
                        if(currentPos == pos)return;
                        // if(i==104)
                        // visual.text(parseInt(1*10)/10, x,y+0.25, {color: "cyan",opacity:0.99,font: 7})
                        let currentSize = sizeMap[currentPos];
                        if(currentSize<300){
                            nearCntMap[currentPos]=(nearCntMap[currentPos]||0)+1;
                        }
                    }
                },x,y);
            });

            let targetPos = undefined;
            let nearCnt = 0;
            let maxRatio = 0;

            // 找出合并附近最优的块
            _.keys(nearCntMap).forEach(currentPos=>{
                let currentRatio = nearCntMap[currentPos]/Math.sqrt(Math.min(sizeMap[currentPos],nd.k));//实际/期望
                if( currentRatio == maxRatio ? sizeMap[currentPos]<sizeMap[targetPos]:currentRatio > maxRatio){
                    targetPos = currentPos;
                    maxRatio = currentRatio;
                    nearCnt = nearCntMap[currentPos];
                }
            });
            _.keys(nearCntMap).forEach(currentPos=>{
                if(nearCnt < nearCntMap[currentPos]){
                    targetPos = currentPos;
                    nearCnt = nearCntMap[currentPos];
                }
            });
            let minSize = sizeMap[targetPos];
            let cnt = nd.k+minSize;
            // let nearRatio =nearCntMap[targetPos]/allNearCnt;

            let targetBlockPutAbleCnt = 0;
            let ndkBlockPutAbleCnt = 0;
            if(minSize>minPlaneCnt)
                targetBlockPutAbleCnt = pro.getBlockPutAbleCnt(roomWalkable,visited,queMin2,unionFind,targetPos,putAbleCacheMap,allCacheMap)[0].length;
            if(nd.k>minPlaneCnt)
                ndkBlockPutAbleCnt = pro.getBlockPutAbleCnt(roomWalkable, visited, queMin2, unionFind, nd.v,putAbleCacheMap,allCacheMap)[0].length;

            // if(targetBlockPutAbleCnt||ndkBlockPutAbleCnt)clog(targetBlockPutAbleCnt,ndkBlockPutAbleCnt)
            // 打印中间变量
            // if(targetPos&&cnt>50&&(targetBlockPutAbleCnt||ndkBlockPutAbleCnt)){
            //     let y = pos%50
            //     let x = Math.round((pos-y)/50)
            //     let y1 = targetPos%50
            //     let x1 = Math.round((targetPos-y1)/50)
            //     visual.line(x,y,x1,y1)
            //     // visual.text(nd.k+"+"+minSize+"="+cnt, (x+x1)/2,(y+y1)/2-0.25, {color: "red",opacity:0.99,font: 7})
            //     // visual.text(allNearCnt+"_"+nearCntMap[targetPos]+" "+nearCnt+" "+parseInt(nearCnt/Math.sqrt(Math.min(minSize,nd.k))*100)/100+" "+parseInt(maxRatio-Math.sqrt(nd.k)/12*100)/100, (x+x1)/2,(y+y1)/2+0.25, {color: "yellow",opacity:0.99,font: 7})
            //     visual.text(parseInt(targetBlockPutAbleCnt*100)/100+" "+parseInt(ndkBlockPutAbleCnt*100)/100, (x+x1)/2,(y+y1)/2+0.25, {color: "yellow",opacity:0.99,font: 7})
            // }

            // if(targetPos&&((cnt<=250&&maxRatio>0.7)||(cnt<=300&&maxRatio>0.8)||(cnt<=350&&maxRatio>0.9)||(maxRatio>1&&cnt<400)||nd.k<=10)){//||maxRatio>1.5
            // if(targetPos&&(maxRatio-cnt/500>0.2&&cnt<400)){//||maxRatio>1.5

            // cnt = targetBlockPutAbleCnt+ndkBlockPutAbleCnt;
            // 合并
            if(targetPos&&Math.max(targetBlockPutAbleCnt,ndkBlockPutAbleCnt)<minPlaneCnt){//&&(maxRatio-Math.sqrt(cnt)/20>=0||(nearRatio>0.7&&nd.k<100))
            // if(targetPos&&(cnt<300||Math.min(nd.k,minSize)<150)&&(maxRatio-Math.sqrt(cnt)/20>=0||Math.max(nd.k,minSize)<200||(nearRatio>0.7&&nd.k<100))){//*Math.sqrt(nearRatio)


                unionFind.union(pos,targetPos);
                nd.v = unionFind.find(pos);

                if(pos != nd.v) delete sizeMap[pos];
                else delete sizeMap[targetPos];

                nd.k = cnt;
                sizeMap[nd.v] = cnt;
                posSeqMap[nd.v] = posSeqMap[targetPos].concat(posSeqMap[pos]);
                delete putAbleCacheMap[nd.v];
                delete putAbleCacheMap[targetPos];
                if(pos != nd.v) delete posSeqMap[pos];
                else delete posSeqMap[targetPos];
                queMin.push(NewNode(nd.k,nd.x,nd.y,nd.v));
            }

        });
        // 打印结果

        // const visual = new RoomVisual(roomName);
        // _.keys(sizeMap).forEach(e=>{
        //     let y = e%50
        //     let x = ((e-y)/50)//Math.round
        //     let color = "red"
        //     let cnt = pro.getBlockPutAbleCnt(roomWalkable,visited,queMin2,unionFind,e,putAbleCacheMap).length
        //     pro.getBlockPutAbleCnt(roomWalkable,visited,queMin2,unionFind,e,putAbleCacheMap).forEach(t=>{
        //         visual.circle(t.x, t.y, {fill: randomColor(e), radius: 0.5 ,opacity : 0.35})
        //     })
        //     // let cnt = sizeMap[e]
        //     if(sizeMap[e]>0)visual.text(parseInt(cnt*10)/10, x,y+0.25, {color: color,opacity:0.99,font: 7})
        // })

        // roomWalkable.forEach((x, y, val)=>{if(val>0&&sizeMap[unionFind.find(x*50+y)]>0)visual.circle(x, y, {fill: randomColor(unionFind.find(x*50+y)), radius: 0.5 ,opacity : 0.15})})


        // 打印中间变量
        // nearWallWithInterpolation.forEach((x, y, val)=>{if(val>0)visual.circle(x, y, {fill: "#ff9797", radius: 0.5 ,opacity : 0.05*val+0.01})})
        // nearWall.forEach((x, y, val)=>{if(val)visual.text(parseInt(val*10)/10, x,y+0.25, {color: "red",opacity:0.5,font: 7})})

        return [unionFind,sizeMap,roomWalkable,nearWall,putAbleCacheMap,allCacheMap]

    },
    /**
     * 计算 分布图
     * 计算建筑的位置
     * @param roomName,
     * @param points [flagController,flagMineral,flagSourceA,flagSourceB]
     * @return result { roomName:roomName,storagePos:{x,y},labPos:{x,y},structMap:{ "rampart" : [[x1,y1],[x2,y2] ...] ...} }
     */
    computeManor (roomName,points){
        pro.init();
        for(let p of points){
            if(p.pos&&p.pos.roomName==roomName)objects.push(p.pos);
        }
        // const visual = new RoomVisual(roomName);
        let blockArray = pro.computeBlock(roomName);
        let unionFind = blockArray[0];
        let sizeMap = blockArray[1];
        let wallMap = {};
        let roomWalkable = blockArray[2];
        let nearWall = blockArray[3];
        let putAbleCacheMap = blockArray[4];
        let allCacheMap = blockArray[5];

        let roomManor = interpolation;
        let roomStructs = nearWallWithInterpolation;


        roomManor.init();
        roomStructs.init();

        // let closeToWall = new RoomArray()
        nearWall.init();

        // let queMin = new PriorityQueue(true)
        queMin.clear();
        // let visited = new RoomArray()

        let finalPos = undefined;
        let wallCnt = 1e9;
        let innerPutAbleList = [];

        let centerX = undefined;
        let centerY = undefined;
        _.keys(sizeMap).forEach(pos=>{
            // if(sizeMap[pos]<150)return
            pro.getBlockPutAbleCnt(roomWalkable, visited, queMin, unionFind, pos,putAbleCacheMap,allCacheMap);
            let currentPutAbleList = putAbleCacheMap[pos];
            let allList = allCacheMap[pos];
            if(currentPutAbleList.length<minPlaneCnt)return

            wallMap[pos] = [];

            visited.init();
            roomWalkable.forBorder((x,y,val)=>{if(val){queMin.push(NewNode(0,x,y));visited.set(x,y,1);}});

            let roomManor = routeDistance; //当前的Manor
            roomManor.init();
            allList.forEach(e=>{
                roomManor.set(e.x,e.y,1);
            });
            // currentPutAbleList.forEach(e=>visual.text(e.k, e.x,e.y+0.25, {color: 'red',opacity:0.99,font: 7}))

            queMin.whileNoEmpty(nd=>{
                if(!roomManor.get(nd.x,nd.y))
                roomWalkable.forNear((x,y,val)=>{
                    if(!visited.exec(x,y,1)&&val){
                        if(!roomManor.get(x,y))
                            queMin.push(NewNode(nd.k+1,x,y));
                        else {
                            wallMap[pos].push(NewNode(0,x,y));
                            // visual.text('X', x,y+0.25, {color: 'red',opacity:0.99,font: 7})
                        }
                    }
                },nd.x,nd.y);
            });

            // wallMap[pos].forEach(xy=>queMin.push(NewNode(0,xy.x,xy.y)))

            let currentInnerPutAbleList = currentPutAbleList;

            let maxDist = 0;
            let filter2 = currentInnerPutAbleList.filter(e=>e.k>2);
            if (filter2.length < 30) {
                filter2.forEach(a=>{
                    filter2.forEach(b=>{
                        maxDist = Math.max(maxDist,Math.abs(a.x-b.x)+Math.abs(a.y-b.y));
                    });
                });
            }

            let currentWallCnt = wallMap[pos].length;
            // {
            //     let y = pos%50
            //     let x = ((pos-y)/50)//Math.round
            //     visual.text(parseInt((allList.length)*10)/10, x,y, {color: "yellow",opacity:0.99,font: 7})
            //     visual.text(parseInt((currentPutAbleList.length)*10)/10, x,y+0.5, {color: "red",opacity:0.99,font: 7})
            //     visual.text(parseInt((currentInnerPutAbleList.length)*10)/10, x,y+1, {color: "red",opacity:0.99,font: 7})
            // }
            if(minPlaneCnt<currentPutAbleList.length&&wallCnt>currentWallCnt&&(currentInnerPutAbleList.filter(e=>e.k>1).length>30||maxDist>5)){
                innerPutAbleList = currentInnerPutAbleList;
                wallCnt = currentWallCnt;
                finalPos = pos;
                centerX = currentPutAbleList.map(e=>e.x).reduce((a,b)=>a+b)/currentPutAbleList.length;
                centerY = currentPutAbleList.map(e=>e.y).reduce((a,b)=>a+b)/currentPutAbleList.length;
            }

            // allCacheMap[pos].forEach(t=>{
            //     visual.circle(t.x, t.y, {fill: randomColor(pos), radius: 0.5 ,opacity : 0.15})
            // })
        });

        if(!putAbleCacheMap[finalPos])
            return

        let walls = wallMap[finalPos];


        roomManor.init();
        allCacheMap[finalPos].forEach(e=>{
            roomManor.set(e.x,e.y,-1);
        });
        innerPutAbleList.forEach(e=>{
            roomManor.set(e.x,e.y,e.k);
        });

        // visited.init()
        // roomWalkable.forEach((x, y, val)=>{if(!roomManor.get(x,y)){queMin.push(NewNode(val?-3:-1,x,y));visited.set(x,y,1)}})



        let storageX = 0;
        let storageY = 0;
        let storageDistance = 100;

        // innerPutAbleList.forEach(e=>visual.text(e.k, e.x,e.y+0.25, {color: 'red',opacity:0.99,font: 7}))
        innerPutAbleList.filter(e=>e.k>2).forEach(e=>{
            let x =e.x;
            let y =e.y;
            let detX= centerX-x;
            let detY= centerY-y;
            let distance = Math.sqrt(detX*detX+detY*detY);
            if(storageDistance>distance){
                storageDistance = distance;
                storageX = x;
                storageY = y;
            }
        });


        if(Game.flags.storagePos){
            storageX = Game.flags.storagePos.pos.x;
            storageY = Game.flags.storagePos.pos.y;
        }

        let labX = 0;
        let labY = 0;
        let labDistance = 1e5;
        innerPutAbleList.filter(e=>e.k>4).forEach(e=>{
            let x =e.x;
            let y =e.y;
            let detX= centerX-x;
            let detY= centerY-y;
            let distance = Math.sqrt(detX*detX+detY*detY);

            if(labDistance>distance&&Math.abs(x-storageX)+Math.abs(y-storageY)>5){
                labDistance = distance;
                labX = x;
                labY = y;
            }
        });

        roomManor.forEach((x,y,val)=>{
            if(val>=2){
                // if(roomManor.get(x,y)>0&&Math.abs(x-storageX)+Math.abs(y-storageY)>2)
                    // visual.text(val, x,y+0.25, {color: 'cyan',opacity:0.99,font: 7})
                let distance = Math.sqrt(Math.pow(centerX-x-0.5,2)+Math.pow(centerY-y-0.5,2));
                if(labDistance<=distance) return;
                let checkCnt = 0;
                let check=function (x,y){
                    if(roomManor.get(x,y)>0&&Math.abs(x-storageX)+Math.abs(y-storageY)>2){
                        checkCnt+=1;
                    }
                };
                for(let i=-1;i<3;i++)
                    for(let j=-1;j<3;j++)
                        check(x+i,y+j);
                if(checkCnt==16){
                    labDistance = distance;
                    labX = x;
                    labY = y;
                }
            }
        });


        // visual.text("C", centerX,centerY+0.25, {color: 'green',opacity:0.99,font: 7})
        // visual.text("S", storageX,storageY+0.25, {color: 'blue',opacity:0.99,font: 7})
        // visual.text("L", labX+0.5,labY+0.75, {color: 'blue',opacity:0.99,font: 7})
        // clog(roomName)

        // clog(roomName,storageX,storageY,labX,labY,innerPutAbleList.length,wallCnt,finalPos)
        // clog(innerPutAbleList.filter(e=>e.k==1).length)

        // _.keys(sizeMap).forEach(e=>{
        //     let y = e%50
        //     let x = ((e-y)/50)//Math.round
        //     let color = "red"
        //     if(sizeMap[e]>0)visual.text(parseInt(sizeMap[e]*10)/10, x,y+1+0.25, {color: color,opacity:0.99,font: 7})
        // })

        // CONTROLLER_STRUCTURES: {
        //     "spawn": {0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3},
        //     "extension": {0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60},
        //     "link": {1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6},
        //     "road": {0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
        //     "constructedWall": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
        //     "rampart": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
        //     "storage": {1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1},
        //     "tower": {1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6},
        //     "observer": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
        //     "powerSpawn": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
        //     "extractor": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
        //     "terminal": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
        //     "lab": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10},
        //     "container": {0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5},
        //     "nuker": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
        //     "factory": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1}
        // }

        // nearWall.forEach((x, y, val)=>{if(val>2&&finalPos==unionFind.find(x*50+y))visual.text(nearWall.get(x,y),x, y+0.5, {color: "red",opacity:0.99,font: 7})})

        /**
         * 这里开始计算布局！
         * @type {{}}
         */
        let structMap = {};
        _.keys(CONTROLLER_STRUCTURES).forEach(e=>structMap[e] = []);

        // 资源点布局
        structMap["link"] = roomObjectCache.link;
        structMap["container"] = roomObjectCache.container;
        structMap["extractor"] = roomObjectCache.extractor;
        //中心布局
        structMap["storage"] .push([storageX-1,storageY]);
        structMap["terminal"] .push([storageX,storageY+1]);
        structMap["factory"] .push([storageX+1,storageY]);
        structMap["link"] .push([storageX,storageY-1]);
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++) {
                structMap["road"].push([storageX+i+j,storageY+i-j]); //仿射变换 [sin,cos,cos,-sin]
            }
        }
        // 这里修改lab布局
        let labs = [
            "☢☢-☢",
            "☢-☢-",
            "-☢-☢",
            "☢-☢☢"
            // "☢☢☢☢☢",
            // "-----",
            // "☢☢☢☢☢"
        ];
        let labChangeDirection = false;
        if ((storageX - labX) * (storageY - labY) < 0) {
            labChangeDirection = true;
        }

        let vis = {};
        for(let i=0;i<2;i++){
            for(let j=0;j<2;j++){
                vis[i+"_"+j] = 1; // 优先放置中间的label
                let jj = labChangeDirection?j:1-j;
                let structs = labs[i+1].charAt(j+1);
                if(structs == '☢')
                    structMap["lab"].push([labX+i,labY+jj]);
                else
                    structMap["road"].push([labX+i,labY+jj]);
            }
        }

        for(let i=-1;i<3;i++){
            for(let j=-1;j<3;j++){
                if(vis[i+"_"+j])continue;
                let jj = labChangeDirection?j:1-j;
                let structs = labs[i+1].charAt(j+1);
                if(structs == '☢')
                    structMap["lab"].push([labX+i,labY+jj]);
                else
                    structMap["road"].push([labX+i,labY+jj]);
            }
        }

        walls.forEach(e=>structMap["rampart"].push([e.x,e.y]));

        _.keys(CONTROLLER_STRUCTURES).forEach(struct=>structMap[struct].forEach(e=>roomStructs.set(e[0],e[1],struct)));

        structMap["road"].forEach(e=>roomStructs.set(e[0],e[1],1));
        //设置权值，bfs联通路径！
        let setModel = function (xx,yy){
            let checkAble = (x,y)=> (x>=0&&y>=0&&x<=49&&y<=49)&&roomManor.get(x,y)>0&&!roomStructs.get(x,y);
            for(let i=-1;i<=1;i++){
                for(let j=-1;j<=1;j++) {
                    let x = xx+i+j;
                    let y = yy+i-j;
                    if(checkAble(x,y)){
                        if(i||j){
                            // structMap["road"] .push([x,y]) //仿射变换 [sin,cos,cos,-sin]
                            roomStructs.set(x,y,1);
                        }else {
                            // structMap["spawn"] .push([x,y])
                            roomStructs.set(x,y,12);
                        }
                    }
                }
            }
            for(let e of [[1,0],[-1,0],[0,1],[0,-1]]){
                let x=xx+e[0];
                let y=yy+e[1];
                if(checkAble(x,y)){
                    // structMap["extension"] .push([x,y])
                    roomStructs.set(x,y,8);
                }
            }
        };

        for(let i=0;i<50;i+=4){
            for(let j=0;j<50;j+=4) {
                let x =storageX%4+i;
                let y =storageY%4+j;
                setModel(x,y);
                setModel(x+2,y+2);

            }
        }
        visited.init();
        visited.set(storageX,storageY,1);

        queMin.push(NewNode(1,storageX,storageY));
        let costRoad = routeDistance; //重复使用
        costRoad.init();
        queMin.whileNoEmpty(nd=>{
            roomStructs.forNear((x,y,val)=>{
                if(!visited.exec(x,y,1)&&val>0){
                    queMin.push(NewNode(nd.k+val,x,y));
                }
            },nd.x,nd.y);
            costRoad.set(nd.x,nd.y,nd.k);
            // visual.text(nd.k,nd.x,nd.y+0.25, {color: "pink",opacity:0.99,font: 7})
        });

        structMap["road"].forEach(e=>roomStructs.set(e[0],e[1],"road")); //这里把之前的road覆盖上去防止放在之前里road上了

        costRoad.forEach((x,y,val)=>{
            if(!val)return;
            let minVal =50;
            // let finalX = 0;
            // let finalY = 0;
            costRoad.forNear((x1,y1,val)=>{
                if(minVal>val&&val>0){
                    minVal = val;
                    // finalX = x1
                    // finalY = y1
                }
            },x,y);
            // 方案2 没那么密集
            costRoad.forNear((x1,y1,val)=>{
                if(minVal==val&&val>0){
                    // structMap["road"].push([x1,y1])
                    roomStructs.set(x1,y1,"road");
                }
            },x,y);
            // 方案1 密集
            // structMap["road"].push([finalX,finalY])
            // roomStructs.set(finalX,finalY,"road")
        });

        let spawnPos = [];
        let extensionPos = [];
        roomStructs.forEach((x,y,val)=>{
            if (val > 0) {
                let dist = 100;
                costRoad.forNear((x,y,val)=>{
                    if(val)dist = Math.min(dist,val);
                },x,y);
                // let dist = Math.sqrt(Math.pow(x-storageX,2)+Math.pow(y-storageY,2))
                if(val==12){// 8 && 12 上面有写，注意！！！
                    spawnPos.push([x,y,dist]);
                }
                else {
                    extensionPos.push([x,y,dist]);
                    // visual.text(dist,x, y+0.25, {color: "pink",opacity:0.99,font: 7})
                }
            }
        });
        let cmpFunc=(a,b)=>a[2]==b[2]?(a[1]==b[1]?a[0]-b[0]:a[1]-b[1]):a[2]-b[2];
        spawnPos = spawnPos.sort(cmpFunc);
        extensionPos = extensionPos.sort(cmpFunc);
        let oriStruct = [];
        let putList=[];
        ["spawn","powerSpawn","nuker","tower", "observer"].forEach(struct=>{
            for(let i=0;i<CONTROLLER_STRUCTURES[struct][8];i++){
                oriStruct.push(struct);
            }
        });
        oriStruct.forEach(struct=>{
            let e = spawnPos.shift();
            if(!e) e = extensionPos.shift();
            structMap[struct].push([e[0],e[1]]);
            putList.push([e[0],e[1],struct]);
        });
        extensionPos.push(...spawnPos);
        extensionPos = extensionPos.sort(cmpFunc);
        let extCnt= 60;
        extensionPos.forEach(e=>{
            if(extCnt>0){
                structMap["extension"].push([e[0],e[1]]);
                putList.push([e[0],e[1],"extension"]);
                extCnt-=1;
            }
        });


        // 更新roads
        roomStructs.init();
        _.keys(CONTROLLER_STRUCTURES).forEach(struct=>structMap[struct].forEach(e=>roomStructs.set(e[0],e[1],struct)));
        visited.init();
        structMap["road"].forEach(e=>visited.set(e[0],e[1],1));
        /**
         * 更新最近的roads 但是可能有残缺
         */
        putList.forEach(e=>{
            let x = e[0];
            let y = e[1];
            let minVal =50;
            costRoad.forNear((x1,y1,val)=>{
                if(minVal>val&&val>0){
                    minVal = val;
                }
            },x,y);
            // 方案2 没那么密集
            costRoad.forNear((x1,y1,val)=>{
                if(minVal==val&&val>0){
                    // 找到建筑最近的那个road
                    roomStructs.set(x1,y1,"road");
                }
            },x,y);
        });
        /**
         * 再roads的基础上，对rads进行补全，将残缺的连起来
         */
        roomStructs.forEach((x,y,val)=>{
            if(val == 'link'||val == 'container')return; // 资源点的不要 放路
            if(! val instanceof String||val>-1)return; // 附近有建筑 ，并且不是road
            // visual.text(val,x, y+0.25, {color: "pink",opacity:0.99,font: 7})
            let minVal =50;
            costRoad.forNear((x1,y1,val)=>{
                if(minVal>val&&val>0){
                    minVal = val;
                }
            },x,y);
            // 方案2 没那么密集
            costRoad.forNear((x1,y1,val)=>{
                if(minVal==val&&val>0){
                    // 找到建筑最近的那个road
                    if(!visited.exec(x1,y1,1))structMap["road"].push([x1,y1]);
                }
            },x,y);
        });

        // 处理塔的位置，让塔尽量靠外
        let getRange=function(a,b){
            return Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]))
        };
        let poses = [];
        let types = ["nuker","tower", "observer"];
        types.forEach(type=>{
            structMap[type].forEach(e=>{
                let dis = 0;
                structMap["rampart"].forEach(e_ramp=>{
                    dis += getRange(e_ramp,e);
                });
                poses.push({pos:e,type,dis});
            });
        });
        poses.sort((a,b)=>(a.dis-b.dis));
        
        for(let i=0;i<6;i++){
            if(poses[i].type == "tower")continue;
            for(let j=6;j<poses.length;j++){
                if(poses[j].type != "tower")continue;
                poses[j].type = poses[i].type;
                poses[i].type = "tower";
            }
        }
        types.forEach(type=>{structMap[type] = [];});
        poses.forEach(pos=>{
            structMap[pos.type].push(pos.pos);
        });

        //#region 新的连接外矿方式

        let costs = new PathFinder.CostMatrix;
        let terrain = new Room.Terrain(roomName);
        for(let i=0;i<50;i++){
            for(let j=0;j<50;j++){
                let te = terrain.get(i,j);
                costs.set(i,j,te==TERRAIN_MASK_WALL?255:(te==TERRAIN_MASK_SWAMP?4:2));
            }
        }
        for(let struct of OBSTACLE_OBJECT_TYPES){
            if(structMap[struct]){
                structMap[struct].forEach(e=>{
                    costs.set(e[0],e[1],255);
                });
            }
        }
        structMap["road"].forEach(e=>{
            costs.set(e[0],e[1],1);
        });
        structMap["container"].forEach(e=>{
            let ret = PathFinder.search(
                new RoomPosition(centerX,centerY,roomName),
                {pos:new RoomPosition(e[0],e[1],roomName),range:1}, 
                {
                    roomCallback:()=>{return costs},
                    maxRooms:1
                }
            );
            ret.path.forEach(pos=>{
                if(costs.get(pos.x,pos.y) != 1){
                    structMap['road'].push([pos.x,pos.y]);
                    costs.set(pos.x,pos.y,1);
                }
            });
            
        });
        //#endregion

        //#region 旧的连接外矿道路

        // // 连接外矿的全部道路
        // _.keys(CONTROLLER_STRUCTURES).forEach(struct=>structMap[struct].forEach(e=>roomStructs.set(e[0],e[1],struct)))

        // costRoad.forEach((x,y,val)=>costRoad.set(x,y,100))//初始化100
        // visited.init()
        // queMin.push(NewNode(0,storageX,storageY))//以 storage为中心
        // visited.exec(storageX,storageY,1)
        // queMin.whileNoEmpty(nd=>{
        //     roomStructs.forNear((x,y,val)=>{
        //         let roadCost = roomWalkable.get(x,y);
        //         if(!visited.exec(x,y,1)&&(!val||val=='road'||val=='rampart')&&roadCost){
        //             queMin.push(NewNode(nd.k+(val=='road'?0:roadCost==2?4:2),x,y))
        //         }
        //     },nd.x,nd.y)
        //     costRoad.set(nd.x,nd.y,nd.k)
        //     // visual.text(costRoad.get(nd.x,nd.y),nd.x,nd.y+0.25, {color: "pink",opacity:0.99,font: 7})
        // })

        // // 将dp的位置进行递归回去
        // let border = visited //边界不能放路
        // border.init()
        // visited.forBorder((x,y,val)=>{visited.set(x,y,1)})
        // structMap["container"].forEach(e=>{
        //     let dfsBack = function (x,y){
        //         let minVal =500;
        //         let finalX = 0;
        //         let finalY = 0;
        //         costRoad.forNear((x,y,val)=>{
        //             let struct = roomStructs.get(x,y)
        //             if(minVal>val&&!visited.get(x,y)&&val>=0&&roomWalkable.get(x,y)&&(!struct||struct=='road'||struct=='rampart')) {
        //                 minVal = val
        //                 finalX = x
        //                 finalY = y
        //             }
        //         },x,y)
        //         if(minVal){
        //             if("road"!=roomStructs.exec(finalX,finalY,"road")){
        //                 structMap["road"].push([finalX,finalY]);
        //                 dfsBack(finalX,finalY)
        //             }
        //         }
        //         // visual.text(minVal,finalX,finalY+0.25, {color: "pink",opacity:0.99,font: 7})
        //     }
        //     dfsBack(e[0],e[1])
        //     structMap["road"].forEach(e=>costRoad.set(e[0],e[1],0))
        // })

        //#endregion

        // 可视化部分
        // allCacheMap[finalPos].forEach(t=>{
        //     visual.circle(t.x, t.y, {fill: "#33ff00", radius: 0.5 ,opacity : 0.03})
        // })
        // putAbleList.forEach(t=>{
        //     visual.circle(t.x, t.y, {fill: "#b300ff", radius: 0.5 ,opacity : 0.1})
        // })

        // roomStructs.init()
        // _.keys(CONTROLLER_STRUCTURES).forEach(struct=>structMap[struct].forEach(e=>roomStructs.set(e[0],e[1],struct)))


        // let t = Game.cpu.getUsed()
        // console.log(Game.cpu.getUsed()-t)
        pro.dismiss();

        // HelperVisual.showRoomStructures(roomName,structMap)

        // clog(roomName,structMap["extension"].length,structMap["spawn"].length,wallCnt,innerPutAbleList.length)
        return {
            roomName:roomName,
            // storagePos:{storageX,storageY},
            // labPos:{labX,labY},
            structMap:structMap
        }

    },

};

let ManagerPlanner = pro;
module.exports = {
    run(){
        let roomStructsData = undefined; //放全局变量

        let p = Game.flags.p; // 触发器
        let pa = Game.flags.pa;
        let pb = Game.flags.pb;
        let pc = Game.flags.pc;
        let pm = Game.flags.pm;
        if(p) {
            roomStructsData = ManagerPlanner.computeManor(p.pos.roomName,[pc,pm,pa,pb]);
            Game.flags.p.remove();
        }
        if(roomStructsData){
            //这个有点消耗cpu 不看的时候记得关
            HelperVisual.showRoomStructures(roomStructsData.roomName,roomStructsData.structMap);
        }
    }
};
/*
module.exports = {
    HelperVisual:helpervisual,
    ManagerPlanner:pro,
    
}
*/

/* Return data to generate Model Planning*/
function getPlanningData(roomName) {
    let roomStructsData;
    let p = Game.flags.p;
    let pc = Game.flags.pc;
    let pm = Game.flags.pm;
    let pa = Game.flags.pa;
    let pb = Game.flags.pb;
    [pa.pos.x, pa.pos.y];
    [pb.pos.x, pb.pos.y];
    [pc.pos.x, pc.pos.y];
    [pm.pos.x, pm.pos.y];
    if (p) {
        roomStructsData = ManagerPlanner.computeManor(roomName, [pc, pm, pa, pb]);
        Game.flags.p.remove();
    }
    if (roomStructsData) {
        HelperVisual.showRoomStructures(roomName, roomStructsData['structMap']);
        return roomStructsData['structMap'];
    }
    return null;
}
function roomWalls(roomStructsData, roomName) {
    //const rampartList = roomStructsData['rampart'];
    const matrix = new Array(50).fill(true).map(() => new Array(50).fill(true));
    const terrain = new Room.Terrain(roomName);
    for (let i = 0; i < 50; ++i) {
        for (let j = 0; j < 50; ++j) {
            if (terrain.get(i, j) == TERRAIN_MASK_WALL || isRampartPos(roomName, [i, j])) {
                matrix[i][j] = false;
            }
        }
    }
    return matrix;
}
function nearConectedPos(pos, roomName) {
    const terrain = new Room.Terrain(roomName);
    Memory['colony'][roomName]['roomPlanning']['temp']['rampart'];
    const candidatePos = nearPosition(pos);
    let r = [];
    for (let i = 0; i < candidatePos.length; ++i) {
        if (terrain.get(candidatePos[i][0], candidatePos[i][1]) != TERRAIN_MASK_WALL && !isRampartPos(roomName, candidatePos[i])) {
            r.push([candidatePos[i][0], candidatePos[i][1]]);
        }
    }
    return r;
}
function roomWallToAdj(roomCanPass, roomName) {
    let adjList = [];
    for (let i = 0; i < roomCanPass.length; ++i) {
        for (let j = 0; j < roomCanPass[i].length; ++j) {
            const node = translatePosToNode([i, j]);
            //console.log(node);
            if (!roomCanPass[i][j]) {
                adjList[node] = [];
            }
            else {
                const nearPos = nearConectedPos([i, j], roomName);
                let actualNode = [];
                for (let i = 0; i < nearPos.length; ++i) {
                    actualNode.push(translatePosToNode(nearPos[i]));
                }
                adjList[node] = actualNode;
            }
        }
    }
    /*
     for (let i = 0; i < roomCanPass.length; ++i) {
         for (let j = 0; j < roomCanPass[i].length; ++j) {
             const node = .translatePosToNode([j, i]);
             //console.log(node);
             if (!roomCanPass[i][j]) adjList.push([]);
             else {
                 const nearPos = .nearConectedPos([j, i]);
                 let actualNode: number[] = [];
                 for (let i = 0; i < nearPos.length; ++i) {
                     actualNode.push( .translatePosToNode(nearPos[i]) )
                 }
                 adjList.push(actualNode);
             }

         }
     }
     */
    return adjList;
}
function searchCC(cc, obj) {
    for (let i = 0; i < cc.length; ++i) {
        for (let j = 0; j < cc[i].length; ++j) {
            if (cc[i][j] == obj) {
                return i;
            }
        }
    }
    return -1;
}
/* Return in rampart vector */
function getInRampartPos(roomStructsData, roomName) {
    //const matrix = new Array(50).fill(false).map(() => new Array(50).fill(false));
    //wall pos mask false
    const roomWall = roomWalls(roomStructsData, roomName);
    for (let i = 0; i < roomWall.length; ++i) {
        for (let j = 0; j < roomWall.length; ++j) {
            if (!roomWall[i][j])
                ;
        }
    }
    const adjacentList = roomWallToAdj(roomWall, roomName);
    const cc = connectedComponents(adjacentList);
    const spawn0Pos = Memory['colony'][roomName]['roomPlanning']['model']['spawn'][0]['pos'];
    const spawn0Node = translatePosToNode(spawn0Pos);
    const indexProtectedComponent = searchCC(cc, spawn0Node);
    //console.log(cc[indexProtectedComponent]);
    let sortedCC = cc[indexProtectedComponent];
    sortedCC.sort();
    //console.log(sortedCC);
    let protectedPos = [];
    for (let i = 0; i < sortedCC.length; ++i) {
        protectedPos.push(translateNodeToPos(sortedCC[i]));
    }
    // console.log(protectedPos);
    //Memory['colony'][roomName]['roomPlanning']['inRampartPos'] =
    return sortedCC;
}
/* Classify containers */
function getContainerReference(containerList, roomName) {
    let posSource1 = Memory['colony'][roomName]['roomPlanning']['model']['source'][0]['pos'];
    let posSource2 = Memory['colony'][roomName]['roomPlanning']['model']['source'][1]['pos'];
    let posMineral = Memory['colony'][roomName]['roomPlanning']['model']['source'][2]['pos'];
    let aux = Game.rooms[roomName].controller;
    let posController = [aux.pos.x, aux.pos.y];
    let containerSourcel = minDistance(posSource1, containerList);
    let containerSource2 = minDistance(posSource2, containerList);
    let containerMineral = minDistance(posMineral, containerList);
    let containerController = minDistance(posController, containerList);
    Memory['colony'][roomName]['roomPlanning']['containerReference'] = {
        'container_source1': containerSourcel,
        'container_source2': containerSource2,
        'container_mineral': containerMineral,
        'container_controller': containerController
    };
}
/* Classify links  */
function getLinkReference(linkList, roomName) {
    const containerReference = Memory['colony'][roomName]['roomPlanning']['containerReference'];
    let posSourceContainer1 = getPlanningStructurePos(roomName, 'container', containerReference['container_source1']);
    let posSourceContainer2 = getPlanningStructurePos(roomName, 'container', containerReference['container_source2']);
    let posControllerContainer = getPlanningStructurePos(roomName, 'container', containerReference['container_controller']);
    getPlanningStructurePos(roomName, 'container', containerReference['container_mineral']);
    let linkSourcel = minDistance(posSourceContainer1, linkList);
    let linkSource2 = minDistance(posSourceContainer2, linkList);
    let linkController = minDistance(posControllerContainer, linkList);
    let linkCenter;
    for (let i = 0; i < linkList.length; ++i) {
        if (i != linkSourcel && i != linkSource2 && i != linkController) {
            linkCenter = i;
        }
    }
    Memory['colony'][roomName]['roomPlanning']['linkReference'] = {
        'link_source1': linkSourcel,
        'link_source2': linkSource2,
        'link_controller': linkController,
        'link_center': linkCenter
    };
}
/* Save in memory initial roads */
function getRoadReference(roadList, mainRoom) {
    let roadListAdj = transformRoadToAdjacentList(roadList);
    const spawn0Pos = Memory['colony'][mainRoom]['roomPlanning']['model']['spawn'][0]['pos'];
    const posRoadNearSpawn0 = nearPointOne(spawn0Pos, roadList);
    //Spawn0 to source1 path
    const containerSource1Reference = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_source1'];
    const containerSource1Pos = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerSource1Reference]['pos'];
    const posRoadNearContainerSource1 = nearPointOne(containerSource1Pos, roadList);
    let spawn0ToSource1 = roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerSource1);
    //Spawn0 to source2 path
    const containerSource2Reference = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_source2'];
    const containerSource2Pos = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerSource2Reference]['pos'];
    const posRoadNearContainerSource2 = nearPointOne(containerSource2Pos, roadList);
    let spawn0ToSource2 = roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerSource2);
    //Spawn0 to controller
    const containerControllerReference = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_controller'];
    const containerControllerPos = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerControllerReference]['pos'];
    const posRoadNearContainerController = nearPointOne(containerControllerPos, roadList);
    let spawn0ToController = roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerController);
    //Spawn0 to mineral
    const containerMineralReference = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_mineral'];
    const containerMineralPos = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerMineralReference]['pos'];
    const posRoadNearContainerMineral = nearPointOne(containerMineralPos, roadList);
    let spawn0ToMineral = roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerMineral);
    Memory['colony'][mainRoom]['roomPlanning']['roadReference'] = {
        'spawn0ToSource1': spawn0ToSource1,
        'spawn0ToSource2': spawn0ToSource2,
        'spawn0ToController': spawn0ToController,
        'spawn0ToMineral': spawn0ToMineral
    };
}
function getPlanningStructurePos(roomName, structureType, index) {
    const pos = Memory['colony'][roomName]['roomPlanning']['model'][structureType][index]['pos'];
    return pos;
}
function tempExtension(roomName) {
    const temp = Memory['colony'][roomName]['roomPlanning']['temp'];
    const extensionList = Memory['colony'][roomName]['roomPlanning']['model']['extension'];
    temp['extension'] = {};
    const spawn0Pos = Memory['colony'][roomName]['roomPlanning']['model']['spawn'][0]['pos'];
    let array = Array(extensionList.length);
    for (let i = 0; i < extensionList.length; ++i) {
        //temp['extension'][i] = extensionList[i]['pos'];
        const distance = distanceTwoPoints(spawn0Pos, extensionList[i]['pos']);
        const temp = {
            'ref': i.toString(),
            'pos': extensionList[i]['pos'],
            'distance': distance
        };
        array[i] = temp;
    }
    array.sort(function (a, b) {
        if (a.distance > b.distance) { //si a es mayor, retornar 1
            return 1;
        }
        if (a.distance < b.distance) { //si a es memor, retornar -1
            return -1;
        }
        // a must be equal to b
        return 0;
    });
    for (let i = 0; i < extensionList.length; ++i) {
        temp['extension'][i] = array[i].pos;
    }
    //change model extension
    const modelExtension = Memory['colony'][roomName]['roomPlanning']['model']['extension'];
    for (let i = 0; i < modelExtension.length; ++i) {
        modelExtension[i]['pos'] = temp['extension'][i];
    }
}
function tempSpawn(roomName) {
    const temp = Memory['colony'][roomName]['roomPlanning']['temp'];
    const spawnList = Memory['colony'][roomName]['roomPlanning']['model']['spawn'];
    temp['spawn'] = {};
    const controllerRoomPos = Game.rooms[roomName].controller.pos;
    const controllerPos = [controllerRoomPos.x, controllerRoomPos.y];
    let array = Array(spawnList.length);
    for (let i = 0; i < spawnList.length; ++i) {
        //temp['extension'][i] = extensionList[i]['pos'];
        const distance = distanceTwoPoints(controllerPos, spawnList[i]['pos']);
        const temp = {
            'ref': i.toString(),
            'pos': spawnList[i]['pos'],
            'distance': distance
        };
        array[i] = temp;
    }
    array.sort(function (a, b) {
        if (a.distance < b.distance) { //si a es mayor, retornar 1
            return 1;
        }
        if (a.distance > b.distance) { //si a es memor, retornar -1
            return -1;
        }
        // a must be equal to b
        return 0;
    });
    for (let i = 0; i < spawnList.length; ++i) {
        temp['spawn'][i] = array[i].pos;
    }
    //change model extension
    const modelExtension = Memory['colony'][roomName]['roomPlanning']['model']['spawn'];
    for (let i = 0; i < modelExtension.length; ++i) {
        modelExtension[i]['pos'] = temp['spawn'][i];
    }
}
function generateTemporal(roomName) {
    Memory['colony'][roomName]['roomPlanning']['temp'] = {};
    Memory['colony'][roomName]['roomPlanning']['temp'];
    const model = Memory['colony'][roomName]['roomPlanning']['model'];
    //copy model to temp
    for (let structureName in model) {
        Memory['colony'][roomName]['roomPlanning']['temp'][structureName] = {};
        for (let i in model[structureName])
            Memory['colony'][roomName]['roomPlanning']['temp'][structureName][i] =
                model[structureName][i]['pos'];
    }
    //modify spawn order
    tempSpawn(roomName);
    //modify extension order
    tempExtension(roomName);
}

/* initialize colony planning mem block */
function iniRoomPlanning(roomName) {
    if (!Memory['colony'][roomName]) {
        Memory['colony'][roomName] = {};
    }
    Memory['colony'][roomName]['roomPlanning'] = {};
    let roomStructsData = getPlanningData(roomName);
    generateModel(roomStructsData, roomName); //model data
    generateTemp(roomName); //temp data
    generateInRampartPos(roomStructsData, roomName); //in rampart pos
    generateContainerReference(roomStructsData['container'], roomName); //container reference
    generateLinkReference(roomStructsData['link'], roomName); //link reference
    generateRoadReference(roomStructsData['road'], roomName); //road reference
}
function generateModel(model, roomName) {
    Memory['colony'][roomName]['roomPlanning']['model'] = {};
    for (let structureName in model) {
        Memory['colony'][roomName]['roomPlanning']['model'][structureName] = [];
        for (let i in model[structureName])
            Memory['colony'][roomName]['roomPlanning']['model'][structureName].push({ 'id': '', 'pos': model[structureName][i] });
    }
    const saPos = [Game.flags.pa.pos.x, Game.flags.pa.pos.y];
    const sbPos = [Game.flags.pb.pos.x, Game.flags.pb.pos.y];
    const mPos = [Game.flags.pm.pos.x, Game.flags.pm.pos.y];
    Memory['colony'][roomName]['roomPlanning']['model']['source'] = [];
    Memory['colony'][roomName]['roomPlanning']['model']['source'].push({ 'id': getId(roomName, saPos, 'source'), 'pos': saPos });
    Memory['colony'][roomName]['roomPlanning']['model']['source'].push({ 'id': getId(roomName, sbPos, 'source'), 'pos': sbPos });
    Memory['colony'][roomName]['roomPlanning']['model']['source'].push({ 'id': getId(roomName, mPos, 'mineral'), 'pos': mPos });
}
function generateTemp(roomName) {
    generateTemporal(roomName);
}
function generateInRampartPos(roomStructsData, roomName) {
    Memory['colony'][roomName]['roomPlanning']['inRampartPos'] = getInRampartPos(roomStructsData, roomName);
}
function generateContainerReference(containerList, roomName) {
    getContainerReference(containerList, roomName);
}
function generateLinkReference(linkList, roomName) {
    getLinkReference(linkList, roomName);
}
function generateRoadReference(roadList, roomName) {
    getRoadReference(roadList, roomName);
}

function iniDptHarvest(roomName) {
    Memory['colony'][roomName]['dpt_harvest'] = {};
    Memory['colony'][roomName]['dpt_harvest']['workStation'] = {};
    Memory['colony'][roomName]['dpt_harvest']['target'] = {};
    Memory['colony'][roomName]['dpt_harvest']['creepsDeadTick'] = {};
}

function iniCreepSpawning(roomName) {
    Memory['colony'][roomName]['creepSpawning'] = {};
    Memory['colony'][roomName]['creepSpawning']['spawnId'] = [];
    Memory['colony'][roomName]['creepSpawning']['spawnTask'] = {
        0: [],
        1: [],
        2: [],
    };
}

function iniColony(roomName) {
    iniRoomPlanning(roomName);
    iniDptHarvest(roomName);
    iniCreepSpawning(roomName);
}

global.mScreeps = {
    createColony(roomName) {
        //mScreeps.createColony('W7N9');
        iniColony(roomName);
        return 'Colony ' + roomName + ' created';
    },
    deleteColony(roomName) {
        delete Memory['colony'][roomName];
        return "Colony " + roomName + " deleted";
    },
    //************* DEBUG **************
};

const MemHack = {
    memory: null,
    parseTime: -1,
    register() {
        const start = Game.cpu.getUsed();
        this.memory = Memory;
        const end = Game.cpu.getUsed();
        this.parseTime = end - start; 
        this.memory = RawMemory._parsed;        
    },
    pretick() {
        delete global.Memory;
        global.Memory = this.memory; 
        RawMemory._parsed = this.memory;
    }
};

MemHack.register();

/*
ts版本

creep对穿+跨房间寻路+寻路缓存 
跑的比香港记者还快从你做起
应用此模块会导致creep.moveTo可选参数中这些项失效：reusePath、serializeMemory、noPathFinding、ignore、avoid、serialize
保留creep.moveTo中其他全部可选参数如visualizePathStyle、range、ignoreDestructibleStructures、ignoreCreeps、ignoreRoad等
新增creep.moveTo中可选参数ignoreSwamps，会无视swamp与road的移动力损耗差异，一律与plain相同处理，用于方便pc和眼，默认false
例：creep.moveTo(controller, {ignoreSwamps: true});
新增creep.moveTo中可选参数bypassHostileCreeps，被creep挡路时若此项为true则绕过别人的creep，默认为true，设为false用于近战攻击
例：creep.moveTo(controller, {bypassHostileCreeps: false});
新增creep.moveTo中可选参数bypassRange，被creep挡路准备绕路时的绕路半径，默认为5
例：creep.moveTo(controller, {bypassRange: 10});
新增creep.moveTo中可选参数noPathDelay，寻得的路是不完全路径时的再次寻路延迟，默认为10
例：creep.moveTo(controller, {noPathDelay: 5});
新增返回值ERR_INVALID_ARGS，表示range或者bypassRange类型错误

遇到己方creep自动进行对穿，遇到自己设置了不想被对穿的creep（或bypassHostileCreeps设为true时遇到他人creep）会自动绕过
会将新手墙和部署中的invaderCore处理为无法通过
会绕过非终点的portal，不影响creep.moveTo(portal)
不使用Memory及global，不会因此干扰外部代码
不会在Creep.prototype、PowerCreep.prototype上增加官方未有的键值，不会因此干扰外部代码
本模块不可用于sim，在sim会因为房间名格式不对返回ERR_INVALID_TARGET
模块参数见代码头部，模块接口见代码尾部
版本号规则：alpha test = 0.1.x，beta test = 0.9.x，publish >= 1.0.0

author: Scorpior
debug helpers: fangxm, czc
inspired by: Yuandiaodiaodiao
date: 2020/3/30
version: 0.9.4(beta test)

Usage:
import "./超级移动优化"


changelog:
0.1.0:  maybe not runnable
0.1.1： still maybe not runnable，修了一些typo，完成正向移动，修改isObstacleStructure
0.1.2： maybe runnable，some bugs are fixed
0.1.3:  修正工地位置寻路错误，调整打印格式
0.1.4:  补充pc对穿，打印中增加cache hits统计
0.9.0:  启用自动清理缓存，保留ignoreCreeps参数，调整对穿顺序+增加在storage附近检查对穿，
        正确识别敌对rampart，正确查询带range路径，打印中增加对穿频率统计
0.9.1:  增加正常逻辑开销统计，修改cache搜索开销统计为cache miss开销统计，绕路bugfix，跨房检测bugfix，other bugfix
0.9.2:  修改缓存策略减少查找耗时增加命中率，增加核心区对穿次数统计，对穿bugfix，other bugfix
0.9.3： 取消路径反向复用避免偶发的复用非最优路径的情况，改进识别被新手墙封闭的房间，增加avoidRooms设置，
        增加远距离跨房寻路成功率，房间出口处对穿bug fix
0.9.4:  优化路径复用避免偶发的复用非最优路径的情况，删除运行时参数中neutralCostMatrixClearDelay，
        自动根据挡路建筑情况设置中立房间costMatrix过期时间，增加ob寻路（检查房间是否可走），
        提供deletePathInRoom接口（使用方式见下方ps），print()中增加平均每次查找缓存时检查的路径数量统计，
        findRoute遇到过道新手墙时bugfix，偏移路径bugfix
0.9.5： TODO：ignoreSwamp避开路，提供deletePathFromRoom、deletePathToRoom接口，增加自动visual，betterMove


ps:
1.默认ignoreCreeps为true，主动设置ignoreCreeps为false会在撞到creep时重新寻路
2.对于不想被对穿的creep（比如没有脚的中央搬运工）, 设置memory：
creep.memory.dontPullMe = true;
3.修路后希望手动更新房间内路径，可执行如下代码：
require('超级移动优化').deletePathInRoom(roomName);
4.战斗中遇到敌方pc不断产生新rampart挡路的情况，目前是撞上建筑物才重新寻路（原版moveTo撞上也继续撞），如果觉得需要手动提前激活重新寻路则联系我讨论
5.在控制台输入require('超级移动优化').print()获取性能信息，鼓励发给作者用于优化
*/
// 运行时参数 
let pathClearDelay = 5000;  // 清理相应时间内都未被再次使用的路径，同时清理死亡creep的缓存，设为undefined表示不清除缓存
let hostileCostMatrixClearDelay = 500; // 自动清理相应时间前创建的其他玩家房间的costMatrix
let coreLayoutRange = 3; // 核心布局半径，在离storage这个范围内频繁检查对穿（减少堵路的等待
// let avoidRooms = ['E18S8', 'E19S9', 'E21S9', 'E24S8', 'E35N6', 'E25S9',
//     'E19N2', 'E18N3', 'E29N5', 'E29N3', 'E28N8', 'E33N9', 'E34N8',
//     'E37N6', 'E41N8', 'E39N11', 'E39N12', 'E39N13', 'E17S9']      // 永不踏入这些房间
let avoidRooms = ['W46S14', 'W46S11', 'W47S9', 'W46S9', 'W45S9', 'W44S9'];      // 永不踏入这些房间
let avoidExits = {
    // 'E35N7': 'E35N6',
    'W47S14': 'W46S14',
    'fromRoom': 'toRoom'
};   // 【未启用】单向屏蔽房间的一些出口，永不从fromRoom踏入toRoom
/** @type {{id:string, roomName:string, taskQueue:{path:MyPath, idx:number, roomName:string}[]}[]} */
// let observers = ['5e3646219c6dc78024fd7097', '5e55e9b8673548d9468a2d3d', '5e36372d00fab883d281d95e'];  // 如果想用ob寻路，把ob的id放这里
let observers = ['617ab31dd8dc485dfd4310d7'];  // 如果想用ob寻路，把ob的id放这里
/***************************************
 *  局部缓存
 */
/** @type {{ [time: number]:{path:MyPath, idx:number, roomName:string}[] }} */
let obTimer = {};   // 【未启用】用于登记ob调用，在相应的tick查看房间对象
let obTick = Game.time;
/** @type {Paths} */
let globalPathCache = {};     // 缓存path
/** @type {MoveTimer} */
let pathCacheTimer = {}; // 用于记录path被使用的时间，清理长期未被使用的path
/** @type {CreepPaths} */
let creepPathCache = {};    // 缓存每个creep使用path的情况
let creepMoveCache = {};    // 缓存每个creep最后一次移动的tick
let emptyCostMatrix = new PathFinder.CostMatrix;
/** @type {CMs} */
let costMatrixCache = {};    // true存ignoreDestructibleStructures==true的，false同理
/** @type {{ [time: number]:{roomName:string, avoids:string[]}[] }} */
let costMatrixCacheTimer = {}; // 用于记录costMatrix的创建时间，清理过期costMatrix
let autoClearTick = Game.time;  // 用于避免重复清理缓存

const obstacles = new Set(OBSTACLE_OBJECT_TYPES);
const originMove = Creep.prototype.move;
const originMoveTo = Creep.prototype.moveTo;
RoomPosition.prototype.findClosestByPath;

// 统计变量
let startTime;
let endTime;
let startCacheSearch;
let analyzeCPU = { // 统计相关函数总耗时
    move: { sum: 0, calls: 0 },
    moveTo: { sum: 0, calls: 0 },
    findClosestByPath: { sum: 0, calls: 0 }
};
let pathCounter = 0;
let testCacheHits = 0;
let testCacheMiss = 0;
let testNormal = 0;
let testNearStorageCheck = 0;
let testNearStorageSwap = 0;
let testTrySwap = 0;
let testBypass = 0;
let normalLogicalCost = 0;
let cacheHitCost = 0;
let cacheMissCost = 0;

/***************************************
 *  util functions
 */
let reg1 = /^([WE])([0-9]+)([NS])([0-9]+)$/;    // parse得到['E28N7','E','28','N','7']
/**
 *  统一到大地图坐标，平均单次开销0.00005
 * @param {RoomPosition} pos 
 */
function formalize(pos) {
    let splited = reg1.exec(pos.roomName);
    if (splited && splited.length == 5) {
        return { // 如果这里出现类型错误，那么意味着房间名字不是正确格式但通过了parse，小概率事件
            x: (splited[1] === 'W' ? -splited[2] : +splited[2] + 1) * 50 + pos.x,
            y: (splited[3] === 'N' ? -splited[4] : +splited[4] + 1) * 50 + pos.y
        }
    } // else 房间名字不是正确格式
    return {}
}

/**
 *  阉割版isEqualTo，提速
 * @param {RoomPosition} pos1 
 * @param {RoomPosition} pos2 
 */
function isEqual(pos1, pos2) {
    return pos1.x == pos2.x && pos1.y == pos2.y && pos1.roomName == pos2.roomName;
}

/**
 *  兼容房间边界
 *  参数具有x和y属性就行
 * @param {RoomPosition} pos1 
 * @param {RoomPosition} pos2 
 */
function isNear(pos1, pos2) {
    if (pos1.roomName == pos2.roomName) {    // undefined == undefined 也成立
        return -1 <= pos1.x - pos2.x && pos1.x - pos2.x <= 1 && -1 <= pos1.y - pos2.y && pos1.y - pos2.y <= 1;
    } else if (pos1.roomName && pos2.roomName) {    // 是完整的RoomPosition
        if (pos1.x + pos2.x != 49 && pos1.y + pos2.y != 49) return false;    // 肯定不是两个边界点, 0.00003 cpu
        // start
        let splited1 = reg1.exec(pos1.roomName);
        let splited2 = reg1.exec(pos2.roomName);
        if (splited1 && splited1.length == 5 && splited2 && splited2.length == 5) {
            // 统一到大地图坐标
            let formalizedEW = (splited1[1] === 'W' ? -splited1[2] : +splited1[2] + 1) * 50 + pos1.x - (splited2[1] === 'W' ? -splited2[2] : +splited2[2] + 1) * 50 - pos2.x;
            let formalizedNS = (splited1[3] === 'N' ? -splited1[4] : +splited1[4] + 1) * 50 + pos1.y - (splited2[3] === 'N' ? -splited2[4] : +splited2[4] + 1) * 50 - pos2.y;
            return -1 <= formalizedEW && formalizedEW <= 1 && -1 <= formalizedNS && formalizedNS <= 1;
        }
        // end - start = 0.00077 cpu
    }
    return false
}

/** 
* @param {RoomPosition} pos1 
* @param {RoomPosition} pos2 
*/
function inRange(pos1, pos2, range) {
    if (pos1.roomName == pos2.roomName) {
        return -range <= pos1.x - pos2.x && pos1.x - pos2.x <= range && -range <= pos1.y - pos2.y && pos1.y - pos2.y <= range;
    } else {
        pos1 = formalize(pos1);
        pos2 = formalize(pos2);
        return pos1.x && pos2.x && inRange(pos1, pos2);
    }
}

/**
 *  fromPos和toPos是pathFinder寻出的路径上的，只可能是同房相邻点或者跨房边界点
 * @param {RoomPosition} fromPos 
 * @param {RoomPosition} toPos 
 */
function getDirection(fromPos, toPos) {
    if (fromPos.roomName == toPos.roomName) {
        if (toPos.x > fromPos.x) {    // 下一步在右边
            if (toPos.y > fromPos.y) {    // 下一步在下面
                return BOTTOM_RIGHT;
            } else if (toPos.y == fromPos.y) { // 下一步在正右
                return RIGHT;
            }
            return TOP_RIGHT;   // 下一步在上面
        } else if (toPos.x == fromPos.x) { // 横向相等
            if (toPos.y > fromPos.y) {    // 下一步在下面
                return BOTTOM;
            } else if (toPos.y < fromPos.y) {
                return TOP;
            }
        } else {  // 下一步在左边
            if (toPos.y > fromPos.y) {    // 下一步在下面
                return BOTTOM_LEFT;
            } else if (toPos.y == fromPos.y) {
                return LEFT;
            }
            return TOP_LEFT;
        }
    } else {  // 房间边界点
        if (fromPos.x == 0 || fromPos.x == 49) {  // 左右相邻的房间，只需上下移动（左右边界会自动弹过去）
            if (toPos.y > fromPos.y) {   // 下一步在下面
                return BOTTOM;
            } else if (toPos.y < fromPos.y) { // 下一步在上
                return TOP
            } // else 正左正右
            return fromPos.x ? RIGHT : LEFT;
        } else if (fromPos.y == 0 || fromPos.y == 49) {    // 上下相邻的房间，只需左右移动（上下边界会自动弹过去）
            if (toPos.x > fromPos.x) {    // 下一步在右边
                return RIGHT;
            } else if (toPos.x < fromPos.x) {
                return LEFT;
            }// else 正上正下
            return fromPos.y ? BOTTOM : TOP;
        }
    }
}
let isHighWay = (roomName) => {
        // E0 || E10 || E1S0 || [E10S0|E1S10] || [E10S10] 比正则再除快
        return roomName[1] == 0 || roomName[2] == 0 || roomName[3] == 0 || roomName[4] == 0 || roomName[5] == 0;
    };

/**
 *  缓存的路径和当前moveTo参数相同
 * @param {MyPath} path 
 * @param {*} ops 
 */
function isSameOps(path, ops) {
    return path.ignoreRoads == !!ops.ignoreRoads &&
        path.ignoreSwamps == !!ops.ignoreSwamps &&
        path.ignoreStructures == !!ops.ignoreDestructibleStructures;
}

function hasActiveBodypart(body, type) {
    if (!body) {
        return true;
    }

    for (var i = body.length - 1; i >= 0; i--) {
        if (body[i].hits <= 0)
            break;
        if (body[i].type === type)
            return true;
    }

    return false;

}

function isClosedRampart(structure) {
    return structure.structureType == STRUCTURE_RAMPART && !structure.my && !structure.isPublic;
}

/**
 *  查看是否有挡路建筑
 * @param {Room} room
 * @param {RoomPosition} pos 
 * @param {boolean} ignoreStructures
 */
function isObstacleStructure(room, pos, ignoreStructures) {
    let consSite = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos);
    if (0 in consSite && consSite[0].my && obstacles.has(consSite[0].structureType)) {  // 工地会挡路
        return true;
    }
    for (let s of room.lookForAt(LOOK_STRUCTURES, pos)) {
        if (!s.hits || s.ticksToDeploy) {     // 是新手墙或者无敌中的invaderCore
            return true;
        } else if (!ignoreStructures && (obstacles.has(s.structureType) || isClosedRampart(s))) {
            return true
        }
    }
    return false;
    // let possibleStructures = room.lookForAt(LOOK_STRUCTURES, pos);  // room.lookForAt比pos.lookFor快
    // 万一有人把路修在extension上，导致需要每个建筑都判断，最多重叠3个建筑（rap+road+其他）
    // return obstacles.has(possibleStructures[0]) || obstacles.has(possibleStructures[1]) || obstacles.has(possibleStructures[2]);    // 条件判断平均每次0.00013cpu
}

/**
 *  登记ob需求
 * @param {MyPath} path 
 * @param {number} idx 
 */
function addObTask(path, idx) {
    let roomName = path.posArray[idx].roomName;
    //console.log('准备ob ' + roomName);
    for (let obData of observers) {
        if (Game.map.getRoomLinearDistance(obData.roomName, roomName) <= 10) {
            obData.taskQueue.push({ path: path, idx: idx, roomName: roomName });
            break;
        }
    }
}

/**
 *  尝试用ob检查路径
 */
function doObTask() {
    for (let obData of observers) { // 遍历所有ob
        let queue = obData.taskQueue;
        while (queue.length) {  // 没有task就pass
            let task = queue[queue.length - 1];
            let roomName = task.roomName;
            if (roomName in costMatrixCache) {  // 有过视野不用再ob
                if (!task.path.directionArray[task.idx]) {
                    //console.log(roomName + ' 有视野了无需ob');
                    checkRoom({ name: roomName }, task.path, task.idx - 1);
                }
                queue.pop();
                continue;
            }
            /** @type {StructureObserver} */
            let ob = Game.getObjectById(obData.id);
            if (ob) {
                //console.log('ob ' + roomName);
                ob.observeRoom(roomName);
                if (!(Game.time + 1 in obTimer)) {
                    obTimer[Game.time + 1] = [];
                }
                obTimer[Game.time + 1].push({ path: task.path, idx: task.idx, roomName: roomName });    // idx位置无direction
            } else {
                observers.splice(observers.indexOf(obData), 1);
            }
            break;
        }
    }
}

/**
 *  查看ob得到的房间
 */
function checkObResult() {
    for (let tick in obTimer) {
        if (tick < Game.time) {
            delete obTimer[tick];
            continue;   // 后面可能还有要检查的
        } else if (tick == Game.time) {
            for (let result of obTimer[tick]) {
                if (result.roomName in Game.rooms) {
                    //console.log('ob得到 ' + result.roomName);
                    checkRoom(Game.rooms[result.roomName], result.path, result.idx - 1);    // checkRoom要传有direction的idx
                }
            }
            delete obTimer[tick];
        } // else 没有要检查的
        break;  // 检查完了或者没有要检查的
    }
}

/**
 *  为房间保存costMatrix，ignoreDestructibleStructures这个参数的两种情况各需要一个costMatrix
 *  设置costMatrix缓存的过期时间
 * @param {Room} room 
 * @param {RoomPosition} pos
 */
function generateCostMatrix(room, pos) {
    let noStructureCostMat = new PathFinder.CostMatrix; // 不考虑可破坏的建筑，但是要考虑墙上资源点和无敌的3种建筑，可能还有其他不能走的？
    let structureCostMat = new PathFinder.CostMatrix;   // 在noStructrue的基础上加上所有不可行走的建筑
    let totalStructures = room.find(FIND_STRUCTURES);
    let 修路也没用的墙点 = [].concat(room.find(FIND_SOURCES), room.find(FIND_MINERALS), room.find(FIND_DEPOSITS));
    let x, y, noviceWall, deployingCore, centralPortal;
    let clearDelay = Infinity;
    for (let object of 修路也没用的墙点) {
        x = object.pos.x; y = object.pos.y;
        noStructureCostMat.set(x, y, 255);
    }
    if (room.controller && (room.controller.my || room.controller.safeMode)) {  // 自己的工地不能踩
        for (let consSite of room.find(FIND_CONSTRUCTION_SITES)) {
            if (obstacles.has(consSite.structureType)) {
                x = consSite.pos.x; y = consSite.pos.y;
                noStructureCostMat.set(x, y, 255);
                structureCostMat.set(x, y, 255);
            }
        }
    }
    for (let s of totalStructures) {
        if (s.structureType == STRUCTURE_INVADER_CORE) {  // 第1种可能无敌的建筑
            if (s.ticksToDeploy) {
                deployingCore = true;
                clearDelay = clearDelay > s.ticksToDeploy ? s.ticksToDeploy : clearDelay;
                noStructureCostMat.set(s.pos.x, s.pos.y, 255);
            }
            structureCostMat.set(s.pos.x, s.pos.y, 255);
        } else if (s.structureType == STRUCTURE_PORTAL) {  // 第2种无敌建筑
            if (!isHighWay(room.name)) {
                centralPortal = true;
                clearDelay = clearDelay > s.ticksToDecay ? s.ticksToDecay : clearDelay;
            }
            x = s.pos.x; y = s.pos.y;
            structureCostMat.set(x, y, 255);
            noStructureCostMat.set(x, y, 255);
        } else if (s.structureType == STRUCTURE_WALL) {    // 第3种可能无敌的建筑
            if (!s.hits) {
                noviceWall = true;
                noStructureCostMat.set(s.pos.x, s.pos.y, 255);
            }
            structureCostMat.set(s.pos.x, s.pos.y, 255);
        } else if (s.structureType == STRUCTURE_ROAD) {    // 路的移动力损耗是1，此处设置能寻到墙上的路
            x = s.pos.x; y = s.pos.y;
            if (noStructureCostMat.get(x, y) == 0) {  // 不是在3种无敌建筑或墙中资源上
                noStructureCostMat.set(x, y, 1);
                if (structureCostMat.get(x, y) == 0) {     // 不是在不可行走的建筑上
                    structureCostMat.set(x, y, 1);
                }
            }
        } else if (obstacles.has(s.structureType) || isClosedRampart(s)) {   // HELP：有没有遗漏其他应该设置 noStructureCostMat 的点
            structureCostMat.set(s.pos.x, s.pos.y, 255);
        }
    }

    costMatrixCache[room.name] = {
        roomName: room.name,
        true: noStructureCostMat,   // 对应 ignoreDestructibleStructures = true
        false: structureCostMat     // 对应 ignoreDestructibleStructures = false
    };

    let avoids = [];
    if (room.controller && room.controller.owner && !room.controller.my && hostileCostMatrixClearDelay) {  // 他人房间，删除costMat才能更新被拆的建筑位置
        if (!(Game.time + hostileCostMatrixClearDelay in costMatrixCacheTimer)) {
            costMatrixCacheTimer[Game.time + hostileCostMatrixClearDelay] = [];
        }
        costMatrixCacheTimer[Game.time + hostileCostMatrixClearDelay].push({
            roomName: room.name,
            avoids: avoids
        });   // 记录清理时间
    } else if (noviceWall || deployingCore || centralPortal) { // 如果遇到可能消失的挡路建筑，这3种情况下clearDelay才可能被赋值为非Infinity
        if (noviceWall) {    // 如果看见新手墙
            let neighbors = Game.map.describeExits(room.name);
            for (let direction in neighbors) {
                let status = Game.map.getRoomStatus(neighbors[direction]);
                if (status.status == 'closed') {
                    avoidRooms[neighbors[direction]] = 1;
                } else if (status.status != 'normal' && status.timestamp != null) {
                    let estimateTickToChange = (status.timestamp - new Date().getTime()) / 10000; // 10s per tick
                    clearDelay = clearDelay > estimateTickToChange ? Math.ceil(estimateTickToChange) : clearDelay;
                }
            }
            if (pos) {  // 如果知道自己的pos
                for (let direction in neighbors) {
                    if (!(neighbors[direction] in avoidRooms)) {
                        let exits = room.find(+direction);
                        if (PathFinder.search(pos, exits, { maxRooms: 1, roomCallback: () => noStructureCostMat }).incomplete) {    // 此路不通
                            avoidRooms[neighbors[direction]] = 1;
                            avoids.push(neighbors[direction]);
                        }
                    }
                }
            }
        }
        //console.log(room.name + ' costMat 设置清理 ' + clearDelay);
        if (!(Game.time + clearDelay in costMatrixCacheTimer)) {
            costMatrixCacheTimer[Game.time + clearDelay] = [];
        }
        costMatrixCacheTimer[Game.time + clearDelay].push({
            roomName: room.name,
            avoids: avoids  // 因新手墙导致的avoidRooms需要更新
        });   // 记录清理时间
    }
    //console.log('生成costMat ' + room.name);

}

/**
 *  把路径上有视野的位置的正向移动方向拿到，只有在找新路时调用，找新路时会把有视野房间都缓存进costMatrixCache
 * @param {MyPath} path 
 */
function generateDirectionArray(path) {
    let posArray = path.posArray;
    let directionArray = new Array(posArray.length);
    let incomplete = false;
    for (let idx = 1; idx in posArray; idx++) {
        if (posArray[idx - 1].roomName in costMatrixCache) {    // 有costMat，是准确路径，否则需要在有视野时checkRoom()
            directionArray[idx] = getDirection(posArray[idx - 1], posArray[idx]);
        } else if (!incomplete) {   // 记录第一个缺失准确路径的位置
            incomplete = idx;
        }
    }
    if (observers.length && incomplete) {
        addObTask(path, incomplete); // 这格没有direction
    }
    path.directionArray = directionArray;
}

/**
 *  第一次拿到该room视野，startIdx是新房中唯一有direction的位置
 * @param {Room} room 
 * @param {MyPath} path 
 * @param {number} startIdx 
 */
function checkRoom(room, path, startIdx) {
    if (!(room.name in costMatrixCache)) {
        generateCostMatrix(room, path.posArray[startIdx]);
    }
    let thisRoomName = room.name;
    /** @type {CostMatrix} */
    let costMat = costMatrixCache[thisRoomName][path.ignoreStructures];
    let posArray = path.posArray;
    let directionArray = path.directionArray;
    let i;
    for (i = startIdx; i + 1 in posArray && posArray[i].roomName == thisRoomName; i++) {
        if (costMat.get(posArray[i].x, posArray[i].y) == 255) {   // 路上有东西挡路
            return false;
        }
        directionArray[i + 1] = getDirection(posArray[i], posArray[i + 1]);
    }
    if (observers.length && i + 1 in posArray) {
        while (i + 1 in posArray) {
            if (!directionArray[i + 1]) {
                addObTask(path, i + 1);     // 这格没有direction
                break;
            }
            i += 1;
        }
    }
    return true;
}

/**
 *  尝试对穿，有2种不可穿情况
 * @param {Creep} creep 
 * @param {RoomPosition} pos  
 * @param {boolean} bypassHostileCreeps
 */
function trySwap(creep, pos, bypassHostileCreeps, ignoreCreeps) {     // ERR_NOT_FOUND开销0.00063，否则开销0.0066
    let obstacleCreeps = creep.room.lookForAt(LOOK_CREEPS, pos).concat(creep.room.lookForAt(LOOK_POWER_CREEPS, pos));
    if (obstacleCreeps.length) {
        if (!ignoreCreeps) {
            return ERR_INVALID_TARGET;
        }
        for (let c of obstacleCreeps) {
            if (c.my) {
                if (c.memory.dontPullMe) {    // 第1种不可穿情况：挡路的creep设置了不对穿
                    return ERR_INVALID_TARGET;
                }
                if (creepMoveCache[c.name] != Game.time && originMove.call(c, getDirection(pos, creep.pos)) == ERR_NO_BODYPART && creep.pull) {
                    creep.pull(c);
                    originMove.call(c, creep);
                }
            } else if (bypassHostileCreeps && (!c.room.controller || !c.room.controller.my || !c.room.controller.safeMode)) {  // 第二种不可穿情况：希望绕过敌对creep
                return ERR_INVALID_TARGET;
            }
        }
        testTrySwap++;
        return OK;    // 或者全部操作成功
    }
    return ERR_NOT_FOUND // 没有creep
}

let temporalAvoidFrom, temporalAvoidTo;
function routeCallback(nextRoomName, fromRoomName) {    // 避开avoidRooms设置了的
    if (nextRoomName in avoidRooms) {
        //console.log('Infinity at ' + nextRoomName);
        return Infinity;
    }
    return isHighWay(nextRoomName) ? 1 : 1.15;
}
function bypassRouteCallback(nextRoomName, fromRoomName) {
    if (fromRoomName == temporalAvoidFrom && nextRoomName == temporalAvoidTo) {
        //console.log(`Infinity from ${fromRoomName} to ${nextRoomName}`);
        return Infinity;
    }
    return routeCallback(nextRoomName);
}
/**
 *  遇到跨房寻路，先以房间为单位寻route，再寻精细的path
 * @param {string} fromRoomName 
 * @param {string} toRoomName 
 * @param {boolean} bypass
 */
function findRoute(fromRoomName, toRoomName, bypass) {  // TODO 以后跨shard寻路也放在这个函数里
    //console.log('findRoute', fromRoomName, toRoomName, bypass);
    return Game.map.findRoute(fromRoomName, toRoomName, { routeCallback: bypass ? bypassRouteCallback : routeCallback });
}

/**
 * @param {RoomPosition} pos
 * @param {Room} room 
 * @param {CostMatrix} costMat 
 */
function checkTemporalAvoidExit(pos, room, costMat) {    // 用于记录因creep堵路导致的房间出口临时封闭
    let neighbors = Game.map.describeExits(room.name);
    temporalAvoidFrom = temporalAvoidTo = '';   // 清空旧数据
    for (let direction in neighbors) {
        if (!(neighbors[direction] in avoidRooms)) {
            for (let direction in neighbors) {
                let exits = room.find(+direction);
                if (PathFinder.search(pos, exits, {
                    maxRooms: 1,
                    roomCallback: () => costMat
                }).incomplete) {    // 此路不通
                    temporalAvoidFrom = room.name;
                    temporalAvoidTo = neighbors[direction];
                }
            }
        }
    }
}
function routeReduce(temp, item) {
    temp[item.room] = 1;
    return temp;
}
function bypassHostile(creep) {
    return !creep.my || creep.memory.dontPullMe;
}
function bypassMy(creep) {
    return creep.my && creep.memory.dontPullMe;
}
let bypassRoomName, bypassCostMat, bypassIgnoreCondition, userCostCallback, costMat, route;
function bypassRoomCallback(roomName) {
    if (roomName in avoidRooms) {
        return false;
    }
    if (roomName == bypassRoomName) {     // 在findTemporalRoute函数里刚刚建立了costMatrix
        costMat = bypassCostMat;
    } else {
        costMat = roomName in costMatrixCache ? costMatrixCache[roomName][findPathIgnoreCondition] : emptyCostMatrix;
    }

    if (userCostCallback) {
        let resultCostMat = userCostCallback(roomName, roomName in costMatrixCache ? costMat.clone() : new PathFinder.CostMatrix);
        if (resultCostMat instanceof PathFinder.CostMatrix) {
            costMat = resultCostMat;
        }
    }
    return costMat;
}
function bypassRoomCallbackWithRoute(roomName) {
    if (roomName in route) {
        if (roomName == bypassRoomName) {     // 在findTemporalRoute函数里刚刚建立了costMatrix
            costMat = bypassCostMat;
        } else {
            costMat = roomName in costMatrixCache ? costMatrixCache[roomName][findPathIgnoreCondition] : emptyCostMatrix;
        }

        if (userCostCallback) {
            let resultCostMat = userCostCallback(roomName, roomName in costMatrixCache ? costMat.clone() : new PathFinder.CostMatrix);
            if (resultCostMat instanceof PathFinder.CostMatrix) {
                costMat = resultCostMat;
            }
        }
        return costMat;
    }
    return false;
}
/**
 *  影响参数：bypassHostileCreeps, ignoreRoads, ignoreDestructibleStructures, ignoreSwamps, costCallback, range, bypassRange
 *  及所有PathFinder参数：plainCost, SwampCost, masOps, maxRooms, maxCost, heuristicWeight
 * @param {Creep} creep 
 * @param {RoomPosition} toPos 
 * @param {MoveToOpts} ops 
 */
function findTemporalPath(creep, toPos, ops) {
    let nearbyCreeps;
    if (ops.ignoreCreeps) { // 有ignoreCreep，只绕过无法对穿的creep
        nearbyCreeps = creep.pos.findInRange(FIND_CREEPS, ops.bypassRange, {
            filter: ops.bypassHostileCreeps ? bypassHostile : bypassMy
        }).concat(creep.pos.findInRange(FIND_POWER_CREEPS, ops.bypassRange, {
            filter: ops.bypassHostileCreeps ? bypassHostile : bypassMy
        }));
    } else {    // 绕过所有creep
        nearbyCreeps = creep.pos.findInRange(FIND_CREEPS, ops.bypassRange).concat(
            creep.pos.findInRange(FIND_POWER_CREEPS, ops.bypassRange)
        );
    }
    if (!(creep.room.name in costMatrixCache)) { // 这个房间的costMatrix已经被删了
        generateCostMatrix(creep.room, creep.pos);
    }
    bypassIgnoreCondition = !!ops.ignoreDestructibleStructures;
    /** @type {CostMatrix} */
    bypassCostMat = costMatrixCache[creep.room.name][bypassIgnoreCondition].clone();
    for (let c of nearbyCreeps) {
        bypassCostMat.set(c.pos.x, c.pos.y, 255);
    }
    bypassRoomName = creep.room.name;
    userCostCallback = typeof ops.costCallback == 'function' ? ops.costCallback : undefined;

    /**@type {PathFinderOpts} */
    let PathFinderOpts = {
        maxRooms: ops.maxRooms,
        maxCost: ops.maxCost,
        heuristicWeight: ops.heuristicWeight || 1.2
    };
    if (ops.ignoreSwamps) {   // HELP 这里有没有什么不增加计算量的简短写法
        PathFinderOpts.plainCost = ops.plainCost;
        PathFinderOpts.swampCost = ops.swampCost || 1;
    } else if (ops.ignoreRoads) {
        PathFinderOpts.plainCost = ops.plainCost;
        PathFinderOpts.swampCost = ops.swampCost || 5;
    } else {
        PathFinderOpts.plainCost = ops.plainCost || 2;
        PathFinderOpts.swampCost = ops.swampCost || 10;
    }

    if (creep.pos.roomName != toPos.roomName) { // findRoute会导致非最优path的问题
        checkTemporalAvoidExit(creep.pos, creep.room, bypassCostMat);   // 因为creep挡路导致的无法通行的出口
        route = findRoute(creep.pos.roomName, toPos.roomName, true);
        if (route == ERR_NO_PATH) {
            return false;
        }
        PathFinderOpts.maxRooms = PathFinderOpts.maxRooms || route.length + 1;
        PathFinderOpts.maxOps = ops.maxOps || 2000 + route.length ** 2 * 100;  // 跨10room则有2000+10*10*100=12000
        route = route.reduce(routeReduce, { [creep.pos.roomName]: 1 });     // 因为 key in Object 比 Array.includes(value) 快，但不知道值不值得reduce
        PathFinderOpts.roomCallback = bypassRoomCallbackWithRoute;
    } else {
        PathFinderOpts.maxOps = ops.maxOps;
        PathFinderOpts.roomCallback = bypassRoomCallback;
    }

    let result = PathFinder.search(creep.pos, { pos: toPos, range: ops.range }, PathFinderOpts).path;
    if (result.length) {
        let creepCache = creepPathCache[creep.name];
        creepCache.path = {     // 弄个新的自己走，不修改公用的缓存路，只会用于正向走所以也不需要start属性，idx属性会在startRoute中设置
            end: formalize(result[result.length - 1]),
            posArray: result,
            ignoreStructures: !!ops.ignoreDestructibleStructures
        };
        generateDirectionArray(creepCache.path);
        return true;
    }
    return false;
}

let findPathIgnoreCondition;
/**
 * @param {{[roomName:string]:1}} temp 
 * @param {{room:string}} item 
 * @returns {{[roomName:string]:1}}
 */
function roomCallback(roomName) {
    if (roomName in avoidRooms) {
        return false;
    }

    costMat = roomName in costMatrixCache ? costMatrixCache[roomName][findPathIgnoreCondition] : emptyCostMatrix;
    if (userCostCallback) {
        let resultCostMat = userCostCallback(roomName, roomName in costMatrixCache ? costMat.clone() : new PathFinder.CostMatrix);
        if (resultCostMat instanceof PathFinder.CostMatrix) {
            costMat = resultCostMat;
        }
    }
    return costMat;
}
function roomCallbackWithRoute(roomName) {
    if (roomName in route) {
        costMat = roomName in costMatrixCache ? costMatrixCache[roomName][findPathIgnoreCondition] : emptyCostMatrix;
        //console.log('in route ' + roomName);
        if (userCostCallback) {
            let resultCostMat = userCostCallback(roomName, roomName in costMatrixCache ? costMat.clone() : new PathFinder.CostMatrix);
            if (resultCostMat instanceof PathFinder.CostMatrix) {
                costMat = resultCostMat;
            }
        }
        return costMat;
    }
    //console.log('out route ' + roomName);
    return false;   // 不在route上的不搜索
}
/**
 *  影响参数：ignoreRoads, ignoreDestructibleStructures, ignoreSwamps, costCallback, range
 *  及所有PathFinder参数：plainCost, SwampCost, masOps, maxRooms, maxCost, heuristicWeight
 * @param {RoomPosition} fromPos 
 * @param {RoomPosition} toPos 
 * @param {MoveToOpts} ops 
 */
function findPath(fromPos, toPos, ops) {

    if (!(fromPos.roomName in costMatrixCache) && fromPos.roomName in Game.rooms) {   // 有视野没costMatrix
        generateCostMatrix(Game.rooms[fromPos.roomName], fromPos);
    }

    findPathIgnoreCondition = !!ops.ignoreDestructibleStructures;
    userCostCallback = typeof ops.costCallback == 'function' ? ops.costCallback : undefined;

    /**@type {PathFinderOpts} */
    let PathFinderOpts = {
        maxRooms: ops.maxRooms,
        maxCost: ops.maxCost,
        heuristicWeight: ops.heuristicWeight || 1.2
    };
    if (ops.ignoreSwamps) {   // HELP 这里有没有什么不增加计算量的简短写法
        PathFinderOpts.plainCost = ops.plainCost;
        PathFinderOpts.swampCost = ops.swampCost || 1;
    } else if (ops.ignoreRoads) {
        PathFinderOpts.plainCost = ops.plainCost;
        PathFinderOpts.swampCost = ops.swampCost || 5;
    } else {
        PathFinderOpts.plainCost = ops.plainCost || 2;
        PathFinderOpts.swampCost = ops.swampCost || 10;
    }

    if (fromPos.roomName != toPos.roomName) {   // findRoute会导致非最优path的问题
        route = findRoute(fromPos.roomName, toPos.roomName);
        if (route == ERR_NO_PATH) {
            return { path: [] };
        }
        PathFinderOpts.maxOps = ops.maxOps || 2000 + route.length ** 2 * 100;  // 跨10room则有2000+10*10*50=7000
        PathFinderOpts.maxRooms = PathFinderOpts.maxRooms || route.length + 1;
        route = route.reduce(routeReduce, { [fromPos.roomName]: 1 });   // 因为 key in Object 比 Array.includes(value) 快，但不知道值不值得reduce
        //console.log(fromPos + ' using route ' + JSON.stringify(route));
        PathFinderOpts.roomCallback = roomCallbackWithRoute;
    } else {
        PathFinderOpts.maxOps = ops.maxOps;
        PathFinderOpts.roomCallback = roomCallback;
    }

    return PathFinder.search(fromPos, { pos: toPos, range: ops.range }, PathFinderOpts);
}

let combinedX, combinedY;
/**
 * @param {MyPath} newPath 
 */
function addPathIntoCache(newPath) {
    combinedX = newPath.start.x + newPath.start.y;
    combinedY = newPath.end.x + newPath.end.y;
    if (!(combinedX in globalPathCache)) {
        globalPathCache[combinedX] = {
            [combinedY]: []  // 数组里放不同ops的及其他start、end与此对称的
        };
    } else if (!(combinedY in globalPathCache[combinedX])) {
        globalPathCache[combinedX][combinedY] = [];      // 数组里放不同ops的及其他start、end与此对称的
    }
    globalPathCache[combinedX][combinedY].push(newPath);
}

function invalidate() {
    return 0;
}
/**
 * @param {MyPath} path 
 */
function deletePath(path) {
    if (path.start) {     // 有start属性的不是临时路
        let pathArray = globalPathCache[path.start.x + path.start.y][path.end.x + path.end.y];
        pathArray.splice(pathArray.indexOf(path), 1);
        path.posArray = path.posArray.map(invalidate);
    }
}

let minX, maxX, minY, maxY;
/**
 *  寻找房内缓存路径，起始位置两步限制避免复用非最优路径
 * @param {RoomPosition} formalFromPos 
 * @param {RoomPosition} formalToPos
 * @param {RoomPosition} fromPos
 * @param {CreepPaths} creepCache 
 * @param {MoveToOpts} ops 
 */
function findShortPathInCache(formalFromPos, formalToPos, fromPos, creepCache, ops) {     // ops.range设置越大找的越慢
    startCacheSearch = Game.cpu.getUsed();
    minX = formalFromPos.x + formalFromPos.y - 2;
    maxX = formalFromPos.x + formalFromPos.y + 2;
    minY = formalToPos.x + formalToPos.y - 1 - ops.range;
    maxY = formalToPos.x + formalToPos.y + 1 + ops.range;
    for (combinedX = minX; combinedX <= maxX; combinedX++) {
        if (combinedX in globalPathCache) {
            for (combinedY = minY; combinedY <= maxY; combinedY++) {
                if (combinedY in globalPathCache[combinedX]) {
                    for (let path of globalPathCache[combinedX][combinedY]) {     // 这个数组应该会很短
                        pathCounter++;
                        if (isNear(path.start, formalFromPos) && isNear(fromPos, path.posArray[1]) && inRange(path.end, formalToPos, ops.range) && isSameOps(path, ops)) {     // 找到路了
                            creepCache.path = path;
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

/**
 *  寻找跨房缓存路径，允许起始位置少量的误差
 * @param {RoomPosition} formalFromPos
 * @param {RoomPosition} formalToPos
 * @param {CreepPaths} creepCache
 * @param {MoveToOpts} ops
 */
function findLongPathInCache(formalFromPos, formalToPos, creepCache, ops) {     // ops.range设置越大找的越慢
    startCacheSearch = Game.cpu.getUsed();
    minX = formalFromPos.x + formalFromPos.y - 2;
    maxX = formalFromPos.x + formalFromPos.y + 2;
    minY = formalToPos.x + formalToPos.y - 1 - ops.range;
    maxY = formalToPos.x + formalToPos.y + 1 + ops.range;
    for (combinedX = minX; combinedX <= maxX; combinedX++) {
        if (combinedX in globalPathCache) {
            for (combinedY = minY; combinedY <= maxY; combinedY++) {
                if (combinedY in globalPathCache[combinedX]) {
                    for (let path of globalPathCache[combinedX][combinedY]) {     // 这个数组应该会很短
                        pathCounter++;
                        if (isNear(path.start, formalFromPos) && inRange(path.end, formalToPos, ops.range) && isSameOps(path, ops)) {     // 找到路了
                            creepCache.path = path;
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

let startRoomName, endRoomName;
/**
 *  起止点都在自己房间的路不清理
 * @param {CreepPaths['name']} creepCache 
 */
function setPathTimer(creepCache) {
    if (pathClearDelay) {
        let posArray = creepCache.path.posArray;
        startRoomName = posArray[0].roomName;
        endRoomName = posArray[posArray.length - 1].roomName;
        if (startRoomName != endRoomName || (startRoomName in Game.rooms && Game.rooms[startRoomName].controller && !Game.rooms[startRoomName].controller.my)) {    // 跨房路或者敌方房间路
            if (!(Game.time + pathClearDelay in pathCacheTimer)) {
                pathCacheTimer[Game.time + pathClearDelay] = [];
            }
            pathCacheTimer[Game.time + pathClearDelay].push(creepCache.path);
            creepCache.path.lastTime = Game.time;
        }
    }
}

/**@type {RoomPosition[]} */
let tempArray = [];
/**
 *  
 * @param {Creep} creep 
 * @param {RoomPosition} toPos 
 * @param {RoomPosition[]} posArray 
 * @param {number} startIdx 
 * @param {number} idxStep 
 * @param {PolyStyle} visualStyle 
 */
function showVisual(creep, toPos, posArray, startIdx, idxStep, visualStyle) {
    tempArray.length = 0;
    tempArray.push(creep.pos);
    let thisRoomName = creep.room.name;
    _.defaults(visualStyle, defaultVisualizePathStyle);
    for (let i = startIdx; i in posArray && posArray[i].roomName == thisRoomName; i += idxStep) {
        tempArray.push(posArray[i]);
    }
    if (toPos.roomName == thisRoomName) {
        tempArray.push(toPos);
    }
    creep.room.visual.poly(tempArray, visualStyle);
}

/**
 *  按缓存路径移动
 * @param {Creep} creep 
 * @param {PolyStyle} visualStyle 
 * @param {RoomPosition} toPos 
 */
function moveOneStep(creep, visualStyle, toPos) {
    let creepCache = creepPathCache[creep.name];
    if (visualStyle) {
        showVisual(creep, toPos, creepCache.path.posArray, creepCache.idx, 1, visualStyle);
    }
    if (creep.fatigue) {
        return ERR_TIRED;
    }
    creepCache.idx++;
    creepMoveCache[creep.name] = Game.time;
    testNormal++;
    let t = Game.cpu.getUsed() - startTime;
    if (t > 0.2) {  // 对穿导致的另一个creep的0.2不计在内
        normalLogicalCost += t - 0.2;
    } else {
        normalLogicalCost += t;
    }
    //creep.room.visual.circle(creepCache.path.posArray[creepCache.idx]);
    return originMove.call(creep, creepCache.path.directionArray[creepCache.idx]);
}

/**
 * 
 * @param {Creep} creep 
 * @param {{
        path: MyPath,
        dst: RoomPosition,
        idx: number
    }} pathCache 
 * @param {PolyStyle} visualStyle 
 * @param {RoomPosition} toPos 
 * @param {boolean} ignoreCreeps
 */
function startRoute(creep, pathCache, visualStyle, toPos, ignoreCreeps) {
    let posArray = pathCache.path.posArray;

    let idx = 0;
    while (idx in posArray && isNear(creep.pos, posArray[idx])) {
        idx += 1;
    }
    idx -= 1;
    pathCache.idx = idx;

    if (visualStyle) {
        showVisual(creep, toPos, posArray, idx, 1, visualStyle);
    }
    creepMoveCache[creep.name] = Game.time;

    let nextStep = posArray[idx];
    if (ignoreCreeps) {
        trySwap(creep, nextStep, false, true);
    }
    return originMove.call(creep, getDirection(creep.pos, posArray[idx]));
}

/**
 * @param {Function} fn 
 */
function wrapFn(fn, name) {
    return function () {
        startTime = Game.cpu.getUsed();     // 0.0015cpu
        if (obTick < Game.time) {
            obTick = Game.time;
            checkObResult();
            doObTask();
        }
        let code = fn.apply(this, arguments);
        endTime = Game.cpu.getUsed();
        if (endTime - startTime >= 0.2) {
            analyzeCPU[name].sum += endTime - startTime;
            analyzeCPU[name].calls++;
        }
        return code;
    }
}

function clearUnused() {
    if (Game.time % pathClearDelay == 0) { // 随机清一次已死亡creep
        for (let name in creepPathCache) {
            if (!(name in Game.creeps)) {
                delete creepPathCache[name];
            }
        }
    }
    for (let time in pathCacheTimer) {
        if (time > Game.time) {
            break;
        }
        //console.log('clear path');
        for (let path of pathCacheTimer[time]) {
            if (path.lastTime == time - pathClearDelay) {
                deletePath(path);
            }
        }
        delete pathCacheTimer[time];
    }
    for (let time in costMatrixCacheTimer) {
        if (time > Game.time) {
            break;
        }
        //console.log('clear costMat');
        for (let data of costMatrixCacheTimer[time]) {
            delete costMatrixCache[data.roomName];
            for (let avoidRoomName of data.avoids) {
                delete avoidRooms[avoidRoomName];
            }
        }
        delete costMatrixCacheTimer[time];
    }
}

/***************************************
 *  功能实现
 */

const defaultVisualizePathStyle = { fill: 'transparent', stroke: '#fff', lineStyle: 'dashed', strokeWidth: .15, opacity: .1 };
/**@type {[MoveToOpts, RoomPosition, CreepPaths['1'], MyPath, number, RoomPosition[], boolean]}
*/
let [ops, toPos, creepCache, path, idx, posArray, found] = [];
/**
 *  把moveTo重写一遍
 * @param {Creep} this
 * @param {number | RoomObject} firstArg 
 * @param {number | MoveToOpts} secondArg 
 * @param {MoveToOpts} opts 
 */
function betterMoveTo(firstArg, secondArg, opts) {
    if (!this.my) {
        return ERR_NOT_OWNER;
    }

    if (this.spawning) {
        return ERR_BUSY;
    }

    if (typeof firstArg == 'object') {
        toPos = firstArg.pos || firstArg;
        ops = secondArg || {};
    } else {
        toPos = { x: firstArg, y: secondArg, roomName: this.room.name };
        ops = opts || {};
    }
    ops.bypassHostileCreeps = ops.bypassHostileCreeps === undefined || ops.bypassHostileCreeps;    // 设置默认值为true
    ops.ignoreCreeps = ops.ignoreCreeps === undefined || ops.ignoreCreeps;

    if (typeof toPos.x != "number" || typeof toPos.y != "number") {   // 房名无效或目的坐标不是数字，不合法
        //this.say('no tar');
        return ERR_INVALID_TARGET;
    } else if (inRange(this.pos, toPos, ops.range || 1)) {   // 已到达
        if (isEqual(toPos, this.pos) || ops.range) {  // 已到达
            return OK;
        } // else 走一步
        if (this.pos.roomName == toPos.roomName && ops.ignoreCreeps) {    // 同房间考虑一下对穿
            trySwap(this, toPos, false, true);
        }
        creepMoveCache[this.name] = Game.time;      // 用于防止自己移动后被误对穿
        testNormal++;
        let t = Game.cpu.getUsed() - startTime;
        normalLogicalCost += t > 0.2 ? t - 0.2 : t;
        return originMove.call(this, getDirection(this.pos, toPos));
    }
    ops.range = ops.range || 1;

    if (!hasActiveBodypart(this.body, MOVE)) {
        return ERR_NO_BODYPART;
    }

    if (this.fatigue) {
        if (!ops.visualizePathStyle) {    // 不用画路又走不动，直接return
            return ERR_TIRED;
        } // else 要画路，画完再return
    }

    // HELP：感兴趣的帮我检查这里的核心逻辑orz
    creepCache = creepPathCache[this.name];
    if (creepCache) {  // 有缓存
        path = creepCache.path;
        idx = creepCache.idx;
        if (path && idx in path.posArray && path.ignoreStructures == !!ops.ignoreDestructibleStructures) {  // 缓存路条件相同
            posArray = path.posArray;
            if (isEqual(toPos, creepCache.dst) || inRange(posArray[posArray.length - 1], toPos, ops.range)) {   // 正向走，目的地没变
                if (isEqual(this.pos, posArray[idx])) {    // 正常
                    if ('storage' in this.room && inRange(this.room.storage.pos, this.pos, coreLayoutRange) && ops.ignoreCreeps) {
                        testNearStorageCheck++;
                        if (trySwap(this, posArray[idx + 1], false, true) == OK) {
                            testNearStorageSwap++;
                        }
                    }
                    //this.say('正常');
                    return moveOneStep(this, ops.visualizePathStyle, toPos);
                } else if (idx + 1 in posArray && idx + 2 in posArray && isEqual(this.pos, posArray[idx + 1])) {  // 跨房了
                    creepCache.idx++;
                    if (!path.directionArray[idx + 2]) {  // 第一次见到该房则检查房间
                        if (checkRoom(this.room, path, creepCache.idx)) {   // 传creep所在位置的idx
                            //this.say('新房 可走');
                            //console.log(`${Game.time}: ${this.name} check room ${this.pos.roomName} OK`);
                            return moveOneStep(this, ops.visualizePathStyle, toPos);  // 路径正确，继续走
                        }   // else 检查中发现房间里有建筑挡路，重新寻路
                        //console.log(`${Game.time}: ${this.name} check room ${this.pos.roomName} failed`);
                        deletePath(path);
                    } else {
                        //this.say('这个房间见过了');
                        return moveOneStep(this, ops.visualizePathStyle, toPos);  // 路径正确，继续走
                    }
                } else if (isNear(this.pos, posArray[idx])) {  // 堵路了
                    let code = trySwap(this, posArray[idx], ops.bypassHostileCreeps, ops.ignoreCreeps);  // 检查挡路creep
                    if (code == OK) {
                        let posString = posArray[idx].roomName + '-' + posArray[idx].x + '-' + posArray[idx].y;
                        if (creepCache.jamPos[0] == posString) {
                            creepCache.jamPos[1]++;
                            if (creepCache.jamPos[1] > 3) { // 异常堵路，一律绕行
                                testBypass++;
                                ops.bypassRange = ops.bypassRange || 5; // 默认值
                                ops.ignoreCreeps = false;   // 强制绕路
                                if (typeof ops.bypassRange != "number" || typeof ops.range != 'number') {
                                    return ERR_INVALID_ARGS;
                                }
                                if (findTemporalPath(this, toPos, ops)) { // 有路，creepCache的内容会被这个函数更新
                                    this.say('强制绕路');
                                    return startRoute(this, creepCache, ops.visualizePathStyle, toPos, ops.ignoreCreeps);
                                } else {  // 没路
                                    //this.say('没路啦');
                                    return ERR_NO_PATH;
                                }
                            }
                        } else {
                            creepCache.jamPos = [posString, 1];
                        }
                        // 让这个逻辑掉下去，正常对穿
                    } else if (code == ERR_INVALID_TARGET) {   // 是被设置了不可对穿的creep或者敌对creep挡路，临时绕路
                        testBypass++;
                        ops.bypassRange = ops.bypassRange || 5; // 默认值
                        if (typeof ops.bypassRange != "number" || typeof ops.range != 'number') {
                            return ERR_INVALID_ARGS;
                        }
                        if (findTemporalPath(this, toPos, ops)) { // 有路，creepCache的内容会被这个函数更新
                            //this.say('开始绕路');
                            return startRoute(this, creepCache, ops.visualizePathStyle, toPos, ops.ignoreCreeps);
                        } else {  // 没路
                            //this.say('没路啦');
                            return ERR_NO_PATH;
                        }
                    } else if (code == ERR_NOT_FOUND && isObstacleStructure(this.room, posArray[idx], ops.ignoreDestructibleStructures)) {   // 发现出现新建筑物挡路，删除costMatrix和path缓存，重新寻路
                        //console.log(`${Game.time}: ${this.name} find obstacles at ${this.pos}`);
                        delete costMatrixCache[this.pos.roomName];
                        deletePath(path);
                    } // else 上tick移动失败但也不是建筑物和creep/pc挡路。有2个情况：1.下一格路本来是穿墙路并碰巧消失了；2.下一格是房间出口，有另一个creep抢路了然后它被传送到隔壁了。不处理第1个情况，按第2个情况对待。
                    //this.say('对穿' + getDirection(this.pos, posArray[idx]) + '-' + originMove.call(this, getDirection(this.pos, posArray[idx])));
                    if (ops.visualizePathStyle) {
                        showVisual(this, toPos, posArray, idx, 1, ops.visualizePathStyle);
                    }
                    creepMoveCache[this.name] = Game.time;
                    return originMove.call(this, getDirection(this.pos, posArray[idx]));  // 有可能是第一步就没走上路or通过略过moveTo的move操作偏离路线，直接call可兼容
                } else if (idx - 1 >= 0 && isNear(this.pos, posArray[idx - 1])) {  // 因为堵路而被自动传送反向跨房了
                    //this.say('偏离一格');
                    if (this.pos.roomName == posArray[idx - 1].roomName && ops.ignoreCreeps) {    // 不是跨房而是偏离，检查对穿
                        trySwap(this, posArray[idx - 1], false, true);
                    }
                    if (ops.visualizePathStyle) {
                        showVisual(this, toPos, posArray, idx, 1, ops.visualizePathStyle);
                    }
                    creepMoveCache[this.name] = Game.time;
                    return originMove.call(this, getDirection(this.pos, posArray[idx - 1]));    // 同理兼容略过moveTo的move
                } // else 彻底偏离，重新寻路
            } // else 目的地变了
        } // else 缓存中没路或者条件变了
    } // else 需要重新寻路，先找缓存路，找不到就寻路

    if (!creepCache) {    // 初始化cache
        creepCache = {
            dst: { x: NaN, y: NaN },
            path: undefined,
            idx: 0,
            jamPos: []
        };
        creepPathCache[this.name] = creepCache;
    } else {
        creepCache.path = undefined;
    }

    if (typeof ops.range != 'number') {
        return ERR_INVALID_ARGS
    }

    found = this.pos.roomName == toPos.roomName ? findShortPathInCache(formalize(this.pos), formalize(toPos), this.pos, creepCache, ops) : findLongPathInCache(formalize(this.pos), formalize(toPos), creepCache, ops);
    if (found) {
        //this.say('cached');
        //console.log(this, this.pos, 'hit');
        testCacheHits++;
    } else {  // 没找到缓存路
        testCacheMiss++;

        if (autoClearTick < Game.time) {  // 自动清理
            autoClearTick = Game.time;
            clearUnused();
        }

        let result = findPath(this.pos, toPos, ops);
        if (!result.path.length || (result.incomplete && result.path.length == 1)) {     // 一步也动不了了
            //this.say('no path')
            return ERR_NO_PATH;
        }
        result = result.path;
        result.unshift(this.pos);

        //this.say('start new');
        let newPath = {
            start: formalize(result[0]),
            end: formalize(result[result.length - 1]),
            posArray: result,
            ignoreRoads: !!ops.ignoreRoads,
            ignoreStructures: !!ops.ignoreDestructibleStructures,
            ignoreSwamps: !!ops.ignoreSwamps
        };
        generateDirectionArray(newPath);
        addPathIntoCache(newPath);
        //console.log(this, this.pos, 'miss');
        creepCache.path = newPath;
    }

    creepCache.dst = toPos;
    setPathTimer(creepCache);

    found ? cacheHitCost += Game.cpu.getUsed() - startCacheSearch : cacheMissCost += Game.cpu.getUsed() - startCacheSearch;

    return startRoute(this, creepCache, ops.visualizePathStyle, toPos, ops.ignoreCreeps);
}

/***************************************
 *  初始化
 *  Creep.prototype.move()将在v0.9.x版本加入
 *  ob寻路、自动visual将在v0.9.x或v1.0.x版本加入
 *  RoomPosition.prototype.findClosestByPath()将在v1.1加入
 *  Creep.prototype.flee()、RoomPosition.prototype.findSquadPathTo()函数将在v1.1或v1.2加入
 *  checkSquadPath()有小概率会写
 */
avoidRooms = avoidRooms.reduce((temp, roomName) => {
    temp[roomName] = 1;
    return temp;
}, {});

observers = observers.reduce((temp, id) => {
    let ob = Game.getObjectById(id);
    if (ob && ob.observeRoom && ob.my) {
        temp.push({ id, roomName: ob.room.name, taskQueue: [] });
    }
    return temp;
}, []);

// Creep.prototype.move = wrapFn(config.changeMove? betterMove : originMove, 'move');
Creep.prototype.moveTo = wrapFn(betterMoveTo , 'moveTo');

module.exports = {
    setChangeMove: function (bool) {
        //Creep.prototype.move = wrapFn(bool? betterMove : originMove, 'move');
        analyzeCPU.move = { sum: 0, calls: 0 };
        return OK;
    },
    setChangeMoveTo: function (bool) {
        Creep.prototype.moveTo = wrapFn(bool ? betterMoveTo : originMoveTo, 'moveTo');
        analyzeCPU.moveTo = { sum: 0, calls: 0 };
        testCacheHits = 0;
        testCacheMiss = 0;
        testNormal = 0;
        testNearStorageCheck = 0;
        testNearStorageSwap = 0;
        testTrySwap = 0;
        testBypass = 0;
        normalLogicalCost = 0;
        cacheHitCost = 0;
        cacheMissCost = 0;
        return OK;
    },
    setChangeFindClostestByPath: function (bool) {
        // RoomPosition.prototype.findClosestByPath = wrapFn(bool? betterFindClosestByPath : originFindClosestByPath, 'findClosestByPath');
        analyzeCPU.findClosestByPath = { sum: 0, calls: 0 };
        return OK;
    },
    setPathClearDelay: function (number) {
        if (typeof number == "number" && number > 0) {
            pathClearDelay = Math.ceil(number);
            return OK;
        } else if (number === undefined) {
            pathClearDelay = undefined;
        }
        return ERR_INVALID_ARGS;
    },
    setHostileCostMatrixClearDelay: function (number) {
        if (typeof number == "number" && number > 0) {
            hostileCostMatrixClearDelay = Math.ceil(number);
            return OK;
        } else if (number === undefined) {
            hostileCostMatrixClearDelay = undefined;
            return OK;
        }
        return ERR_INVALID_ARGS;
    },
    deleteCostMatrix: function (roomName) {
        delete costMatrixCache[roomName];
        return OK;
    },
    deltePath: function (fromPos, toPos, opts) {   // TODO
        //if(!(fromPos instanceof RoomPosition))
        return 'not implemented'
    },
    addAvoidRooms: function (roomName) {
        let splited = reg1.exec(roomName);
        if (splited && splited.length == 5) {
            avoidRooms[roomName] = 1;
            return OK;
        } else {
            return ERR_INVALID_ARGS;
        }
    },
    deleteAvoidRooms: function (roomName) {
        let splited = reg1.exec(roomName);
        if (splited && splited.length == 5) {
            delete avoidRooms[roomName];
            return OK;
        } else {
            return ERR_INVALID_ARGS;
        }
    },
    deletePathInRoom: function (roomName) {
        let splited = reg1.exec(roomName);
        if (splited && splited.length == 5) {
            this.deleteCostMatrix(roomName);
            let fromalCentralPos = formalize({ x: 25, y: 25, roomName: roomName });
            minX = fromalCentralPos.x + fromalCentralPos.y - 48;
            maxX = fromalCentralPos.x + fromalCentralPos.y + 48;
            minY = minX;
            maxY = maxX;
            for (combinedX = minX; combinedX <= maxX; combinedX++) {
                if (combinedX in globalPathCache) {
                    for (combinedY = minY; combinedY <= maxY; combinedY++) {
                        if (combinedY in globalPathCache[combinedX]) {
                            for (let path of globalPathCache[combinedX][combinedY]) {     // 这个数组应该会很短
                                let posArray = path.posArray;
                                if (posArray[0].roomName == roomName && posArray[posArray.length - 1].roomName == roomName) {     // 是这个房间的路
                                    deletePath(path);
                                }
                            }
                        }
                    }
                }
            }
            return OK;
        } else {
            return ERR_INVALID_ARGS;
        }
    },
    addAvoidExits: function (fromRoomName, toRoomName) {    // 【未启用】
        let splited1 = reg1.exec(fromRoomName);
        let splited2 = reg1.exec(toRoomName);
        if (splited1 && splited1.length == 5 && splited2 && splited2.length == 5) {
            avoidExits[fromRoomName] ? avoidExits[fromRoomName][toRoomName] = 1 : avoidExits[fromRoomName] = { [toRoomName]: 1 };
            return OK;
        } else {
            return ERR_INVALID_ARGS;
        }
    },
    deleteAvoidExits: function (fromRoomName, toRoomName) { // 【未启用】
        let splited1 = reg1.exec(fromRoomName);
        let splited2 = reg1.exec(toRoomName);
        if (splited1 && splited1.length == 5 && splited2 && splited2.length == 5) {
            if (fromRoomName in avoidExits && toRoomName in avoidExits[fromRoomName]) {
                delete avoidExits[fromRoomName][toRoomName];
            }
            return OK;
        } else {
            return ERR_INVALID_ARGS;
        }
    },
    print: function () {
        let text = '\navarageTime\tcalls\tFunctionName';
        for (let fn in analyzeCPU) {
            text += `\n${(analyzeCPU[fn].sum / analyzeCPU[fn].calls).toFixed(5)}\t\t${analyzeCPU[fn].calls}\t\t${fn}`;
        }
        let hitCost = cacheHitCost / testCacheHits;
        let missCost = cacheMissCost / testCacheMiss;
        let missRate = testCacheMiss / (testCacheMiss + testCacheHits);
        text += `\nnormal logical cost: ${(normalLogicalCost / testNormal).toFixed(5)}, total cross rate: ${(testTrySwap / analyzeCPU.moveTo.calls).toFixed(4)}, total bypass rate:  ${(testBypass / analyzeCPU.moveTo.calls).toFixed(4)}`;
        text += `\nnear storage check rate: ${(testNearStorageCheck / analyzeCPU.moveTo.calls).toFixed(4)}, near storage cross rate: ${(testNearStorageSwap / testNearStorageCheck).toFixed(4)}`;
        text += `\ncache search rate: ${((testCacheMiss + testCacheHits) / analyzeCPU.moveTo.calls).toFixed(4)}, total hit rate: ${(1 - missRate).toFixed(4)}, avg check paths: ${(pathCounter / (testCacheMiss + testCacheHits)).toFixed(3)}`;
        text += `\ncache hit avg cost: ${(hitCost).toFixed(5)}, cache miss avg cost: ${(missCost).toFixed(5)}, total avg cost: ${(hitCost * (1 - missRate) + missCost * missRate).toFixed(5)}`;
        return text;
    },
    clear: () => { }
    // clear: clearUnused
};

class ExtendRoomPosition extends RoomPosition {
    // public isWalkable(): boolean {
    //     if (this.lookFor(LOOK_TERRAIN)[0] == 'wall') {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
    getAdjacentPositions() {
        const positions = [];
        const x = this.x;
        const y = this.y;
        const roomName = this.roomName;
        if (x > 0) {
            positions.push(new RoomPosition(x - 1, y, roomName));
        }
        if (x < 49) {
            positions.push(new RoomPosition(x + 1, y, roomName));
        }
        if (y > 0) {
            positions.push(new RoomPosition(x, y - 1, roomName));
        }
        if (y < 49) {
            positions.push(new RoomPosition(x, y + 1, roomName));
        }
        if (x > 0 && y > 0) {
            positions.push(new RoomPosition(x - 1, y - 1, roomName));
        }
        if (x < 49 && y > 0) {
            positions.push(new RoomPosition(x + 1, y - 1, roomName));
        }
        if (x > 0 && y < 49) {
            positions.push(new RoomPosition(x - 1, y + 1, roomName));
        }
        if (x < 49 && y < 49) {
            positions.push(new RoomPosition(x + 1, y + 1, roomName));
        }
        return positions;
    }
    isWalkable() {
        if (this.lookFor(LOOK_TERRAIN)[0] == 'wall') {
            return false;
        }
        else {
            return true;
        }
    }
    isWalkableAndNotOccupied() {
        if (this.isWalkable() && this.lookFor(LOOK_CREEPS).length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    isWalkableAndNotOccupiedAndNotReserved() {
        if (this.isWalkableAndNotOccupied() && this.lookFor(LOOK_FLAGS).length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    isWalkableAndNotOccupiedAndNotReservedAndNotReservedByCreep() {
        if (this.isWalkableAndNotOccupiedAndNotReserved() && this.lookFor(LOOK_CREEPS).length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    isWalkableAndNotOccupiedAndNotReservedAndNotReservedByCreepAndNotReservedByFlag() {
        if (this.isWalkableAndNotOccupiedAndNotReservedAndNotReservedByCreep() && this.lookFor(LOOK_FLAGS).length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

var mountExtensions = () => {
    assignPrototype(RoomPosition, ExtendRoomPosition);
};

class RoomPlanningMem {
    constructor(mainRoom) {
        this.dpt_name = 'roomPlanning';
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name]['model'];
    }
    static getStructureList(roomName, structureType) {
        return Memory['colony'][roomName]['roomPlanning']['model'][structureType];
    }
    static getSource1Id(roomName) {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][0]['id'];
    }
    static getSource2Id(roomName) {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][1]['id'];
    }
    static getMineralId(roomName) {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][2]['id'];
    }
}

class DptHarvesterMem {
    constructor(mainRoom) {
        this.dpt_name = 'dpt_harvest';
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }
    getWorkStation(id) {
        //console.log(this.rootMem['workStation'][id])
        //console.log(id);
        return this.rootMem['workStation'][id];
    }
    addWorkStation(workStationId, data) {
        this.rootMem['workStation'][workStationId] = data;
    }
    deleteWorkPosition(pos) {
        let index = this.rootMem['workPosition'].indexOf(pos);
        this.rootMem['workPosition'].splice(index, 1);
    }
    getTargets() {
        return this.rootMem['target'];
    }
    setTargets(targets) {
        this.rootMem['target'] = targets;
    }
    getCreepsDeadTick() {
        return this.rootMem['creepsDeadTick'];
    }
    addCreepsDeadTick(creepName, tick) {
        this.rootMem['creepsDeadTick'][creepName] = tick;
    }
    deleteCreepsDeadTick(creepName) {
        delete this.rootMem['creepsDeadTick'][creepName];
    }
}

class CreepSpawningMem {
    constructor(roomName) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['creepSpawning'];
    }
    getSpawnId() {
        return this.rootMem['spawnId'];
    }
    getSpawnTask(priority) {
        return this.rootMem['spawnTask'][priority];
    }
    addSpawnTask(spawnTask, priority) {
        this.rootMem['spawnTask'][priority].push(spawnTask);
    }
    deleteSpawnTask(spawnTask, priority) {
        let index = this.rootMem['spawnTask'][priority].indexOf(spawnTask);
        this.rootMem['spawnTask'][priority].splice(index, 1);
    }
    addSpawnId(spawnId) {
        this.rootMem['spawnId'].push(spawnId);
    }
    deleteSpawnId(spawnId) {
        let index = this.rootMem['spawnId'].indexOf(spawnId);
        this.rootMem['spawnId'].splice(index, 1);
    }
}

class WorkStation {
    /********** mutator ********/
    //to create new work station
    /*
        1. give roomName
        2. give id, roomName
    */
    constructor(roomName, id) {
        this.roomName = roomName;
        if (id) {
            this.id = id;
            //let auxMem = new DptHarvesterMem('')
            //this.mem = Memory['colony'][roomName]['']['workStations'][id];
        }
        else {
            this.id = this.randomID();
            this.type = null;
            this.orders = [];
            this.creepList = [];
            this.sourceInfo = null;
            this.targetInfo = null;
            this.creepConfig = null;
            /*
            if (pos && roomName) {
                this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);
            }
            else {
                this.distanceToSpawn = 0;
            }
            */
            this.needTransporterCreep = false;
            this.transporterSetting = undefined;
        }
    }
    randomID() {
        return Math.random().toString(36).substr(2, 9);
    }
    exeOrder() {
        let mem = this.getMemObject();
        let order = mem['orders'].shift();
        return order;
    }
    sendSpawnTaskx(creepName, creepBodyOption, departmentName, workStationId, priority) {
    }
    sendSpawnTask(spawnTask, priority) {
        let creepSpawningMem = new CreepSpawningMem(this.roomName);
        creepSpawningMem.addSpawnTask(spawnTask, priority);
    }
    executeOrders() {
        let mem = this.getMemObject();
        mem['orders'][0];
    }
    //to create work station from memor
    getData() {
        let mem = new DptHarvesterMem(this.sourceInfo.roomName);
        return mem.getWorkStation(this.id);
    }
    addOrder(order) {
        this.mem['orders'].push(order);
    }
    getStationId() {
        return this.id;
    }
    /********* end of consultor ********/
    getDistanceToNearSpawn(pos, roomName) {
        let spawnList = RoomPlanningMem.getStructureList(roomName, 'spawn');
        let positionList = [];
        for (let spawn of spawnList) {
            positionList.push(spawn.pos);
        }
        return minDistance(pos, positionList);
    }
    /******** setter ********/
    createSourceInfo(sourceId, roomName, pos) {
        return {
            sourceId: sourceId,
            roomName: roomName,
            pos: pos
        };
    }
    createTargetInfo(targetId, roomName, pos) {
        return {
            targetId: targetId,
            roomName: roomName,
            pos: pos
        };
    }
    createCreepSpawnConfig(role, option, priority, memory) {
        return {
            body: option,
            priority: priority,
            memory: memory
        };
    }
    createTransporterSetting(needWithdraw, amount, resourceType) {
        return {
            stationId: this.id,
            needWithdraw: needWithdraw,
            amount: amount,
            resourceType: resourceType
        };
    }
    /******** end of setter ********/
    sendOrder(order) {
    }
}

class HarvesterWorkStation extends WorkStation {
    constructor(roomName, id) {
        super(roomName, id);
        this.sourceInfo = {
            sourceId: null,
            roomName: roomName,
            pos: null,
        };
        /*
        let auxMem = new DptHarvesterMem(this.sourceInfo.roomName);
        let auxData = auxMem.getWorkStation(this.id);
        //console.log(auxData)

        //console.log(auxMem.getWorkStation(this.id))
        this.mem = auxData;
        //console.log(this.mem)

         */
    }
    getMemObject() {
        let mem = new DptHarvesterMem(this.sourceInfo.roomName);
        return mem.getWorkStation(this.id);
    }
    getSource1ID() {
        return RoomPlanningMem.getSource1Id(this.sourceInfo.roomName);
    }
    getSource2ID() {
        return RoomPlanningMem.getSource2Id(this.sourceInfo.roomName);
    }
    getMineralID() {
        return RoomPlanningMem.getMineralId(this.sourceInfo.roomName);
    }
    getRoomSourceID(stationType) {
        if (stationType == 'source1') {
            return this.getSource1ID();
        }
        else if (stationType == 'source2') {
            return this.getSource2ID();
        }
        else if (stationType == 'mineral') {
            return this.getMineralID();
        }
    }
    // only to create new work station
    //sourceId only for highway
    initializeHarvesterWorkStation(stationType, sourceId, pos) {
        this.type = stationType;
        //this.orders = [];
        //this.creepList = [];
        if (sourceId) {
            this.sourceInfo.sourceId = sourceId;
        }
        else
            this.sourceInfo.sourceId = this.getRoomSourceID(stationType);
        this.targetInfo = {
            targetId: null,
            roomName: this.sourceInfo.roomName,
            pos: null,
        };
        this.creepConfig = {
            body: 'default',
            priority: 0,
            memory: {
                working: false,
                ready: false,
                role: 'initializer',
                workStationID: this.id,
                departmentName: 'dpt_harvest',
                roomName: this.sourceInfo.roomName,
                dontPullMe: false,
            }
        };
        //this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);
        this.needTransporterCreep = true; //need transporter creep to transport energy to spawn
        this.transporterSetting = {
            stationId: this.id,
            needWithdraw: true,
            amount: -1,
            resourceType: RESOURCE_ENERGY,
        };
        this.sourceInfo.pos = pos;
        let roomName = this.sourceInfo.roomName;
        //let pos = this.sourceInfo.pos;
        this.workPositions = [];
        if (pos && roomName) {
            let auxRoomPos = new RoomPosition(pos[0], pos[1], roomName);
            let adjPosList = auxRoomPos['getAdjacentPositions']();
            for (let i in adjPosList) {
                let auxPos = adjPosList[i];
                if (auxPos['isWalkable']())
                    this.workPositions.push([auxPos.x, auxPos.y, 0]);
            }
        }
    }
    getStationData() {
        return {
            type: this.type,
            orders: this.orders,
            workPositions: this.workPositions,
            creepList: this.creepList,
            sourceInfo: this.sourceInfo,
            targetInfo: this.targetInfo,
            creepConfig: this.creepConfig,
            distanceToSpawn: this.distanceToSpawn,
            needTransporterCreep: this.needTransporterCreep,
            transporterSetting: this.transporterSetting
        };
    }
    saveToMemory() {
        let dptHarvestMem = new DptHarvesterMem(this.sourceInfo.roomName);
        dptHarvestMem.addWorkStation(this.id, this.getStationData());
        console.log('Harvester WS ' + this.id + ' save to memory');
    }
}

// 游戏入口函数
function mount() {
    MemHack.pretick();
    mountExtensions();
}
module.exports.loop = function () {
    mount();
    //let p: RoomPosition = new RoomPosition(5, 18, "W8N7");
    let harvesterStation = new HarvesterWorkStation("W8N7");
    // get reference for workStation o6vrzxlzq
    //let t = new HarvesterWorkStation("W8N7", "o6vrzxlzg");
    //let creepSpawning = new CreepSpawning("W8N7");
    //console.log(t.getData())
    //console.log(x)
    console.log(Game.time % 10);
    if (Game.time % 10 == 0) {
        harvesterStation.initializeHarvesterWorkStation('source1', '5bbcaeb9099fc012e186a3c3', [5, 18]);
        harvesterStation.saveToMemory();
        //console.log(harvesterStation.id)
        let mem = harvesterStation.getMemObject();
        console.log(mem.workPositions);
        mem.type = 'source2';
        mem.orders.push('addCreep');
        console.log(mem.type);
        console.log('SHIFT FIRST ELEMENT ' + harvesterStation.exeOrder());
        console.log('length afeter shift: ' + mem.orders.length);
        //harvesterStation.addOrder('ADD_CREEP');
    }
    //console.log(p['getAdjacentPositions']());
    //console.log('hello world')
    //console.log('hhhh')
};

exports.mount = mount;
//# sourceMappingURL=main.js.map
