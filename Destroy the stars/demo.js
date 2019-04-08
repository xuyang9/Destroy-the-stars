let oWra = document.getElementsByClassName('wrapper')[0];
let dangQ = document.getElementsByClassName('dangQian')[0];         //html里当前分数
let xuanZ = document.getElementsByClassName('xuanZe')[0];          //html里选择分数
let starsArr = [];              //所有的星星都会被存在这个数组里
let Hang = 10;      //星星有10行
let Lie = 10;       //星星有10列
let starsWH = 50;   //星星宽高都是50
let choose = [];    //鼠标移入事件需要的数组
let timer = null;   
let Cfen = 10;   //初始分数
let Dfen = 15;  //递增分数
let Zfen = 0;   //总分数
let Mfen = 2000;    //目标分数
let flag = true;    //锁
let biaoJi = null;  //标记鼠标点击后悬停的小方块
//消灭星星思路:

    //         初始化目标分数
    // 初始化： 初始化当前分数
    //         初始化选择时的分数
    //         初始化小星星：创建小星星
    //                      添加并随机颜色位置

    //            还原鼠标移进去效果
    // 鼠标移入：  预判：检查星星之间的连接
    //            星星闪烁
    //            显示分数

    // 点击： 加分数
    //       消灭星星
    //       移动 
    //       判断是否失败或成功 

//初始化每一个div，并放到starsArr里
function zhiZaoStars( value, i, j ) {      // i是在第几行， j是在第几列
    let oDiv = document.createElement('div');
    oDiv.style.width = starsWH + 'px';
    oDiv.style.height = starsWH + 'px';
    oDiv.style.boxSizing = 'border-box';
    oDiv.style.position = 'absolute';
    // oDiv.style.left = starsWH * j + 'px';
    // oDiv.style.bottom = starsWH * i + 'px';
    oDiv.num = value;       //记住颜色值和一个数值
    oDiv.Hang = i;  //记住行数
    oDiv.Lie = j;   //记住列数
    oDiv.style.display = 'inline-block';
    oDiv.style.transform = 'scale(0.95)';
    oDiv.style.borderRadius = '12px';
    oDiv.style.cursor = 'pointer';
    return oDiv
}

//把starsArr里的每一个div插入oWra里面
function zaoStars(){
    for( let i = 0; i < starsArr.length; i++ ){
        for( let j = 0; j <starsArr[i].length; j++ ){
            if( starsArr[i][j] == null ){
                continue
            }
            starsArr[i][j].Hang = i;
            starsArr[i][j].Lie = j;     //以上都是为了代码的严谨性，做一个纠正
            starsArr[i][j].style.left = starsWH * starsArr[i][j].Lie + 'px';
            starsArr[i][j].style.bottom = starsWH * starsArr[i][j].Hang + 'px';
            starsArr[i][j].style.backgroundImage = "url(./img/" + starsArr[i][j].num + ".png)";
            starsArr[i][j].style.backgroundSize = 'cover';
            oWra.appendChild( starsArr[i][j] );
        }
    }
}

//检查鼠标移入的小方块所能链接的其他小方块，并push进choose里
function jianCha( obj, arr ){
    if( obj == null ){
        return
    }
    arr.push(obj);
    // 1.不能是最左边的
    // 2.左边不能为空
    // 3.左边的颜色跟‘我’的一样
    // 4.左边没有在choose里面
    if( obj.Lie > 0 && starsArr[obj.Hang][obj.Lie - 1] != null && starsArr[obj.Hang][obj.Lie - 1].num == obj.num && arr.indexOf(starsArr[obj.Hang][obj.Lie - 1]) == -1 ){
        jianCha( starsArr[obj.Hang][obj.Lie - 1], arr );
    }
    // 1.不能是最右边的
    // 2.右边不能为空
    // 3.右边的颜色跟‘我’的一样
    // 4.右边没有在choose里面
    if( obj.Lie < Lie - 1 && starsArr[obj.Hang][obj.Lie + 1] != null && starsArr[obj.Hang][obj.Lie + 1].num == obj.num && arr.indexOf(starsArr[obj.Hang][obj.Lie + 1]) == -1 ){
        jianCha( starsArr[obj.Hang][obj.Lie + 1], arr );
    }
    // 1.不能是最下边的
    // 2.下边不能为空
    // 3.下边的颜色跟‘我’的一样
    // 4.下边没有在choose里面
    if( obj.Hang > 0 && starsArr[obj.Hang - 1][obj.Lie] != null && starsArr[obj.Hang - 1][obj.Lie].num == obj.num && arr.indexOf(starsArr[obj.Hang - 1][obj.Lie]) == -1 ){
        jianCha( starsArr[obj.Hang - 1][obj.Lie], arr );
    }
    // 1.不能是最上边的
    // 2.上边不能为空
    // 3.上边的颜色跟‘我’的一样
    // 4.上边没有在choose里面
    if( obj.Hang < Hang - 1 && starsArr[obj.Hang + 1][obj.Lie] != null && starsArr[obj.Hang + 1][obj.Lie].num == obj.num && arr.indexOf(starsArr[obj.Hang + 1][obj.Lie]) == -1 ){
        jianCha( starsArr[obj.Hang + 1][obj.Lie], arr );
    }
    return arr
}

//闪烁函数
function shanShuo ( arr ) {
    let num = 0;
    
    timer = setInterval( function(){
        for( let i = 0; i < arr.length; i++ ){//用循环让他们闪烁
            if(arr[i] == null){
                return
            }
            arr[i].style.border = '3px solid #fff';
            arr[i].style.transform = 'scale('+ (0.90 + 0.05 * Math.pow(-1, num)) + ')';
        }
        num++;
    } ,300)

}

//还原函数
function huanYuan() {
    if(timer != null){
       clearInterval(timer);
    }
    for( let i = 0; i < starsArr.length; i++ ) {
        for( let j = 0; j < starsArr[i].length; j++ ){
            if( starsArr[i][j] == null ){
                return
            }
            starsArr[i][j].style.border = '0px solid #fff';
            starsArr[i][j].style.transform = 'scale(0.95)';
        }
    }
}


// 把小方块的分数加起来显示出去
function xianShi() {
    let fenShu = 0;
    fenShu = Cfen + choose.length * Dfen;
    if( fenShu <= 0 ){
        return
    }
    xuanZ.innerHTML = choose.length + '块 ' + fenShu + '分';
    xuanZ.style.transition = null;
    xuanZ.style.opacity = 1;
    setTimeout(function() {
        xuanZ.style.transition = "opacity 1s";
        xuanZ.style.opacity = 0;
    },2000)
}

//鼠标移入触发的事件
function mouseOver ( obj ) {
    if( !flag ){
        tempSquare = obj;
        return
    }
    huanYuan(); //调用还原函数
    choose = [];
    jianCha( obj, choose ); //调用检查链接的函数
    if( choose.length <= 1){
        choose = [];
        return
    }
    shanShuo( choose ); //把链接的div让他们闪烁起来
    xianShi();  //显示分数
}

function move() {
    //向下移动
    for( let i = 0; i < Hang; i++ ){
        let pointer = 0;
        for( let j = 0; j < Lie; j++ ){
            if( starsArr[j][i] != null ){
                if( j != pointer ){
                    starsArr[pointer][i] = starsArr[j][i];
                    starsArr[j][i].Hang = pointer;
                    starsArr[j][i] = null;
                }
                pointer ++;
            }
        }
    }
    //横向移动
    for( let i = 0; i < starsArr[0].length; ){
        if(  starsArr[0][i] == null ){
            for( let j = 0; j < Lie; j++ ){
                starsArr[j].splice( i, 1);
            }
            continue
        }
        i++
    }
    zaoStars();
}

function isPanDuan(){
    for( let i = 0; i < Hang; i++){
        for( let j = 0; j < Lie; j++ ){
            let arr = [];
            jianCha( starsArr[i][j] , arr);
            if( arr.length > 1 ){
                return false
            }
        }
    }

    return true
}


//入口函数
function init() {
    for( let i = 0; i < Hang; i++ ){
        starsArr[i] = [];
        for( let j = 0; j < Lie; j++ ){
            let value = Math.floor(Math.random() * 5);
            let star = zhiZaoStars( value, i, j );
            star.onmouseenter = function () {//鼠标移入触发       
                mouseOver( this );
            }
            star.onclick = function () {
                //  加分数
                if( !flag || choose.length == 0){
                    return
                }
                tempSquare = null;
                flag = false;
                Zfen += Cfen + choose.length * Dfen;
                if( Zfen != 0 ){
                    dangQ.innerHTML = "当前分数: " + Zfen + ' 分';
                }
                //  消灭星星
                for( let i = 0; i < choose.length; i++ ){
                    (function(i){
                        setTimeout(function(){
                            starsArr[choose[i].Hang][choose[i].Lie] = null;
                            oWra.removeChild(choose[i]);
                            callback(); //允许一个回调函数
                        },i * 100)
                    })(i) 
                }
                //  移动 
                setTimeout(function(){
                    move();
                    //判断是否失败或成功
                    let is = isPanDuan();
                    if( is ){
                        if( Zfen >= Mfen ){
                            alert( '游戏成功!' );
                        }else{
                            alert( '游戏失败!' );
                        }
                    }else {
                        flag = true;
                        choose = [];
                        mouseOver(tempSquare);
                    }
                },choose.length * 100)
            }
            starsArr[i][j] = star; 
        }
    }

    zaoStars();  //ZaoStars是一个创建星星的函数
}

//回调函数
function callback() {
 
}
window.onload = function() {
    init();
}