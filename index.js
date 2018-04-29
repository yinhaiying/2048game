// 单体单例模式
// 之所以要传window和document是为了减少查找时间。
var _2048=(function(window,document){
    //私有变量
    var Game={
	    size:4,
	    data:[],
	    content:null,
        iScore:0,
        maxScore:0,
        isInit:false,
	    // gui是一个对象用来接收创建后返回的root

	    
	    // 初始化：

	    // 传入一个json形式的配置参数。里面用来初始化需要用到的一些
	    init:function(config){

	    	this.content=config.content;
	    	this.iScore=config.iScore;
	    	this.iScore.innerHTML=0;
	    	this.maxScore=config.maxScore;
	    	this.config=config;
	    	var gui={};
	    	// 生成二维矩阵
	        for(var i = 0;i<this.size;i++){
	        	this.data[i]=[];
	        	for(var j = 0;j<this.size;j++){
	        		this.data[i][j]=0;
	        	}
	        }

	        gui=initGUI(this.data);
	        this.root=gui.root;
	        // 将li保存到Game中
	        this.element=gui.list;
	        if ( getWindowSize().w > 640 ){
					this.wrapper.style.width = 40 + this.size *5 + 60*this.size + "px"
				}
	        this.content.appendChild(gui.root);

	         this.maxScore.innerHTML=getMaxScore("maxScore");
	         return this;
	    },
	    start:function(){
	    	var self=this;
	    	fillNumber.call(this,self.data,self.isInit);
	    	
	    	drawGUI(self.data,self.element);
	    	var handle=registerEvent.call(self,self.matrix,function(){
	    		
	    		// 使用回调函数来删除事件
	    		if(!isGameOver(self.data)){
				    window.removeEventListener("keydown",handle);
				    gameOver(self.content,function(ele){
				    	self.isInit=false;
				    	self.root.parentNode.removeChild(self.root)
				    	ele.parentNode.removeChild(ele);
				    	self.iScore.innerHTML=0;
				    	self.init(self.config).start();
				    })
				    // 游戏结束，弹出结束框。
			    }
	    	});
	    }

	    

    }

    // 生成游戏胜利对话框
    function gameWin(obj,callback){
    	
    	var wrapper=document.createElement("div");
    	wrapper.className="gameover-wrapper";
    	var h2=document.createElement("h2");
    	h2.className="gameover-title";
    	h2.innerHTML="游戏胜利"
    	var restartBtn=document.createElement("button");
    	restartBtn.className="restart-btn";
    	restartBtn.innerHTML="重新开始";
    	wrapper.appendChild(h2);
    	wrapper.appendChild(restartBtn);
        obj.appendChild(wrapper);
        restartBtn.addEventListener("click",function(){
        	// 点击后必须删除掉之前的wrapper。
        	callback&&callback.call(this,wrapper)
        })
    }


    // 游戏结束生成对话框
    function gameOver(obj,callback){
    	
    	var wrapper=document.createElement("div");
    	wrapper.className="gameover-wrapper";
    	var h2=document.createElement("h2");
    	h2.className="gameover-title";
    	h2.innerHTML="游戏结束"
    	var restartBtn=document.createElement("button");
    	restartBtn.className="restart-btn";
    	restartBtn.innerHTML="重新开始";
    	wrapper.appendChild(h2);
    	wrapper.appendChild(restartBtn);
        obj.appendChild(wrapper);
        restartBtn.addEventListener("click",function(){
        	// 点击后必须删除掉之前的wrapper。
        	callback&&callback.call(this,wrapper)
        })
    }

    // 获取window的宽高

    function getWindowSize(){
    	return {
    		w:document.documentElement.clientHidth,
    		h:document.documentElement.clientHeight
    	}
    }

    // 设置li的宽高

    function setItem(winW,size,item){
    	var itemSize=0;
        if(winW>640){
        	return;
        }else{
        	itemSize = (winW - 40 - size*5) / size + "px";
        	item.style.width=itemSize;
        	item.style.height=itemSize;
        	item.style.lineheight=itemSize;
        }
    }

     // 生成2048游戏界面。(根据矩阵的维数创建相应的元素)

    function initGUI(matrix){
    	var root=document.createElement("div"),
    	len=matrix.length,
    	ul=null,

    	// list用来保存li数组。创建时就将li保存起来，并将它添加到Game下，方便调用。
    	list=[],
    	item=null,
    	winW=getWindowSize().w;
    	for(var i=0;i<len;i++){
    		ul=document.createElement("ul");
    		ul.className+="clearfix";
    		root.appendChild(ul);
    		// 形成二维数组
    		list[i]=[];
    		for(var j=0;j<len;j++){
    			item=document.createElement("li");
    			// 给每一个li设置宽高
                setItem(winW,len,item);
    			item.appendChild(document.createElement("div"));
    			ul.appendChild(item);
    			// 把每一个li保存到list数组中
    			list[i][j]=item;
    		}
    	}

    	return {
    		root:root,
    		list:list

    	}	
    }

/*
    初始化以后应该做的事情。主要就是渲染。
    生成随机数 random2_4
			填充生成的随机数 fillNumbers
			找到所有可以填充数字的位置 findEmptyItemCoordnate
			找到数字后 添加都对应的这个li的div里面 drawGUI
			生成颜色 通过每一个 div 元素的innerHTML决定 createColorByNumber
*/

    // 生成随机数
    function random2_4(){
    	// 矩阵随机生成2和4
    	return  Math.random()>0.5?2:4;
    }

    // 填充生成的随机数 随机取出一个空坐标填充数组
    function fillNumber(matrix,isInt){
    	var self=this;
    	var length=matrix.length;
    	var x;
    	var y;
    	var len=self.isInit?1:length-2;
    	if(!self.isInit){
    		for(var i = 0;i<len;i++){
	    		var item=findEmptyItemCoordnate(matrix);
	           // 找到可以填充数字的空的位置，并把坐标位置返回来
	           // 必须进行判断。因为有可能返回的是一个空的数组。也就是无法填充。
	           if(item&&item.length===2){
		           	x=item[0];
		            y=item[1];
		            matrix[x][y]=random2_4();
	           }
           
    	   }
    	   self.isInit=true;
    	}else{
    		for(var i = 0;i<len;i++){
	    		var item=findEmptyItemCoordnate(matrix);
	           // 找到可以填充数字的空的位置，并把坐标位置返回来
	           // 必须进行判断。因为有可能返回的是一个空的数组。也就是无法填充。
	          
	           if(item&&item.length==2){
		           	x=item[0];
		            y=item[1];
		            matrix[x][y]=random2_4();
		            
	           }
           
    	   }
    	   
    	}
 
            
    	  
    	
    	

    }

// 找到所有可以填充数字的位置，随机返回一个位置。这个位置又是一个数组，数组中保存着这个位置的xy值。
	function findEmptyItemCoordnate(matrix){
		var len=matrix.length;
		// list用来保存坐标轴位置
		var list=[];
		var listLength=0;
		var flag=0;
        for(var i =0;i<len;i++){
        	for(var j=0;j<len;j++){
        		if(matrix[i][j]===0){
        			// 把每一个值得坐标保存为一个数组
        			list.push([i,j]);
        			listLength++;
        		}
        	}
        }
        // 随机选择list中的一个值。
        if ( listLength === 0 ) {
			return []
		}
		flag = Math.floor(Math.random() * listLength)
		return list[flag]
	}



// 找到数字后 添加都对应的这个li的div里面 drawGUI

	function drawGUI(matrix,list){
	var len=matrix.length;
	var item=null;
	for(var i =0;i<len;i++){
		for(var j=0;j<len;j++){
            item=list[i][j].children[0];

            // 这里用0表示无。0应该去掉
            item.innerHTML=matrix[i][j]==0?"":matrix[i][j];
            item.style.fontSize = "16px";
            if(item.innerHTML==0){
            	item.style.backgroundColor='#cbc2b2';
            	item.style.color='#333';
            }else{
            item.style.background=createColorByNumber(item.innerHTML).bgColor;
            item.style.color=createColorByNumber(item.innerHTML).color;
            }
            
       
		}

	}





}

// 生成颜色 通过每一个 div 元素的innerHTML决定 createColorByNumber
	function createColorByNumber(num){
	var flag;
    var color = {
			'0':  {bgColor: '#cbc2b2', color: '#333'},
            '1':  {bgColor: '#2051C8', color: '#333'},
            '2':  {bgColor: '#1E8AC8', color: '#333'},
            '3':  {bgColor: '#F2B179', color: '#fff'},
            '4':  {bgColor: '#f29c5c', color: '#fff'},
            '5':  {bgColor: '#ef8161', color: '#fff'},
            '6':  {bgColor: '#f16432', color: '#fff'},
            '7':  {bgColor: '#eed170', color: '#fff'},
            '8':  {bgColor: '#edce5d', color: '#fff'},
            '9':  {bgColor: '#edc850', color: '#fff'},
            '10': {bgColor: '#edc53f', color: '#fff'},
            '11': {bgColor: '#edc22e', color: '#fff'},
            '12': {bgColor: '#b884ac', color: '#fff'},
            '13': {bgColor: '#b06ca9', color: '#fff'},
            '14': {bgColor: '#7f3d7a', color: '#fff'},
            '15': {bgColor: '#6158b1', color: '#fff'},
            '16': {bgColor: '#3a337b', color: '#fff'},
            '17': {bgColor: '#0f4965', color: '#fff'},
            '18': {bgColor: '#666', color: '#fff'},
            '19': {bgColor: '#333', color: '#fff'},
            '20': {bgColor: '#000', color: '#fff'}
		}
	if(num){
       flag=Math.log2(num);
	}

	return color[String(flag)];
	}


/*
	第三步：游戏操作开始
	1、添加事件
	1、判断在各个方向上是否能够移动;两种情况进行判断
	    先需要找到matrix部位0的数
*/ 

// 回调函数和返回的函数是为了删除事件。
function registerEvent(matrix,callback){
	var self=this;
	
	function fn(ev,matrix){
		var ev=ev||window.event;
	    var code=ev.keyCode;
	    switch(code){
	    	case 37:
	    	    // 向左发生移动
	    	    go.call(self,self.data,"left");
	    	break;
	    	case 38:
	    		// 向上发生移动
	    		go.call(self,self.data,"up");
	    	break;
	    	case 39:
	    	    // 向右发生移动
	    	    go.call(self,self.data,"right");
	    	break;
	    	case 40:
	    		// 向下发生移动
	    		 go.call(self,self.data,"down");
	    	break;

	    }
	    drawGUI.call(self,self.data,self.element);
	    randomAfterGo.call(self,self.data);
	    drawGUI.call(self,self.data,self.element);
        callback&&callback.call(self);
	}
	
	addEventListener("keydown",fn,false);
    return fn;
	

}

function canGoLeft(matrix){
	
    var len=matrix.length;
    // 用一个对象来保存不为0的值的位置，和值得大小。
    for(i=0;i<len;i++){
    	for(j=1;j<len;j++){
    		// 前面是0 本身不是0 能够移动
            if(matrix[i][j-1]==0&&matrix[i][j]!==0){
            	return true;
            }  
            if(matrix[i][j-1]!==0&&matrix[i][j-1]==matrix[i][j]) {
            	return true;
            } 
    	}
    }
    return false;
}

function canGoRight(matrix){
	var len=matrix.length;
    // 用一个对象来保存不为0的值的位置，和值得大小。
    for(i=0;i<len;i++){
    	for(j=0;j<len-1;j++){
    		// 前面是0 本身不是0 能够移动
            if(matrix[i][j]!==0&&matrix[i][j+1]===0){
            	return true;
            }  
            if(matrix[i][j+1]!==0&&matrix[i][j]===matrix[i][j+1]) {
            	return true;
            } 
    	}
    }
    return false;
}

function canGoUp(matrix){
	var len=matrix.length;
	for(var i=0;i<len;i++){
		for(var j=1;j<len;j++){
			if(matrix[j-1][i]===0&&matrix[j][i]!==0){
				return true;
			}
			if(matrix[j-1][i]!==0&&matrix[j][i]==matrix[j-1][i]){
				return true;
			}
		}
	}
	return false;

}

function canGoDown(matrix){
	var len=matrix.length;
	for(var i=0;i<len;i++){
		for(var j=0;j<len-1;j++){
			if(matrix[j+1][i]===0&&matrix[j][i]!==0){
				return true;
			}
			if(matrix[j+1][i]!==0&&matrix[j][i]==matrix[j+1][i]){
				return true;
			}
		}
	}
	return false;

}

/*
	什么情况下发生移动。如何移动。
	如何移动？
		1、取出能够发生移动的数字及其位置

*/

// 取出非0的元素
    function getFilledItem(matrix){
		var len = matrix.length, filled = [];
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if ( matrix[i][j] > 0 ) {
					filled.push({
						flag: [i, j],
						value: matrix[i][j]
					});
				}

			}
		}
		
		return filled;
	}


	function go(matrix,keyword){
		var self=this;
       
		switch(keyword){
			case "left":
				if(canGoLeft(matrix)){
	                goLeft(matrix);
	                merge.call(self,matrix,"left");
			    };
			break;

			case "right":
				if(canGoRight(matrix)){
	                goRight(matrix);
	                 merge.call(self,matrix,"right");
			    };
			break;
			case "up":
				if(canGoUp(matrix)){
	                goUp(matrix);
	                 merge.call(self,matrix,"up");
			    };
			break;
			case "down":
				if(canGoDown(matrix)){
	                goDown(matrix);
	                merge.call(self,matrix,"down");
			    };
			break;
		}
	}
	// 实现左边移动的函数

	function goLeft(matrix){
        var filled=getFilledItem(matrix);
        
       
        // line用来保存存放在同一行的数据。然后再对同一行的数据进行处理
        var line=[];
        for(var i=0;i<matrix.length;i++){

        	line=filled.filter(function(item){
        		// 返回第i行的数据。是对象组成的数组
        		return item.flag[0]===i;
        	});
        	// 如果数组为空的话应该怎么办？好像没有处理
        	var len=line.length;
    		/*
        		对数据进行处理
				1.先将这一行非0位置的数据全部变成0
				2.再将line中的数据进行处理
    		*/
        	for(var j=0;j<len;j++){
        		// 获取筛选出来后的每一个元素的位置，并将其设置为0
        		var x=line[j].flag[0];
        		var y=line[j].flag[1];      	    
        		matrix[x][y]=0;
        		// 移动赋值。line长度为多少。matrix就有几个地方需要进行重新赋值
        		matrix[i][j]=line[j].value;       		
        	}
        
        }
        
        
	}

	// 实现右边移动的函数

	function goRight(matrix){
		var length=matrix.length;
		var filled=getFilledItem(matrix);
		var line=[];
		for(var i=0;i<length;i++){
			line=filled.filter(function(item){
				return item.flag[0]===i;
			})
			var len=line.length;

			/*
        向右移动时，必须先确定右边的数。确保不会对接下来的数产生影响。
        如果先确定左边的数，那么确定右边的数时。如果两个位置恰好重合。那么就会把
        已经确定好的数清除为0.

			*/
			for(var j=len-1;j>=0;j--){
				var x=line[j].flag[0];
				var y=line[j].flag[1];
				matrix[x][y]=0;
				matrix[i][length+j-len]=line[j].value;
			}
		}
	}

	// 实现向上移动的函数

    function goUp(matrix){
    	var length=matrix.length;
    	var filled=getFilledItem(matrix);
    	var col=[];
    	for(var i=0;i<length;i++){

			col=filled.filter(function(item){
        	    return item.flag[1]==i;
            })

            var len=col.length;
            for(var j=0;j<len;j++){
            	var x=col[j].flag[0];
            	var y=col[j].flag[1];
            	matrix[x][y]=0;
            	matrix[j][i]=col[j].value;
            }
    		
           
    	}

    }
// 实现向下移动的函数
    function goDown(matrix){
    	
    	var length=matrix.length;
    	var filled=getFilledItem(matrix);
    	var col=[];
    	for(var i=0;i<length;i++){

			col=filled.filter(function(item){
        	    return item.flag[1]==i;
            })

            var len=col.length;
            for(var j=len-1;j>=0;j--){
            	var x=col[j].flag[0];
            	var y=col[j].flag[1];
            	matrix[x][y]=0;
            	matrix[length+j-len][i]=col[j].value;
            }
    		
           
    	}

    }

    // 第四步：设置合并函数
    function merge(matrix,keyword){
    	var self=this;
    	switch(keyword){
    		case "left":
    		    mergeLeft.call(self,matrix,parseInt(self.iScore.innerHTML),setMax);
    		    if(isWin(matrix)){
    		    	gameWin(self.content,function(ele){
				    	self.isInit=false;
				    	self.root.parentNode.removeChild(self.root)
				    	ele.parentNode.removeChild(ele);
				    	self.iScore.innerHTML=0;
				    	self.init(self.config).start();
				    })
    		    }
    		break;
    		case "right":
    		    mergeRight.call(self,matrix,parseInt(self.iScore.innerHTML),setMax);
    		    if(isWin(matrix)){
    		    	gameWin(self.content,function(ele){
				    	self.isInit=false;
				    	self.root.parentNode.removeChild(self.root)
				    	ele.parentNode.removeChild(ele);
				    	self.iScore.innerHTML=0;
				    	self.init(self.config).start();
				    })
    		    }
    		break;
    		case "up":

    		    mergeUp.call(self,matrix,parseInt(self.iScore.innerHTML),setMax);
    		    if(isWin(matrix)){
    		    	gameWin(self.content,function(ele){
				    	self.isInit=false;
				    	self.root.parentNode.removeChild(self.root)
				    	ele.parentNode.removeChild(ele);
				    	self.iScore.innerHTML=0;
				    	self.init(self.config).start();
				    })
    		    }
    		break;
    		case "down":

    		    mergeDown.call(self,matrix,parseInt(self.iScore.innerHTML),setMax);
    		    if(isWin(matrix)){
    		    	gameWin(self.content,function(ele){
				    	self.isInit=false;
				    	self.root.parentNode.removeChild(self.root)
				    	ele.parentNode.removeChild(ele);
				    	self.iScore.innerHTML=0;
				    	self.init(self.config).start();
				    })
    		    }
    		break;

    	}
    	
    }

    // 左边方向合并

    function mergeLeft(matrix,score,callback){
    	var self=this;
    	var length=matrix.length;
        var filled=getFilledItem(matrix);
    	var line=[];
    	// 行合并
    	for(var i=0;i<length;i++){
    		line=filled.filter(function(item){
                return item.flag[0]==i;
    		})
    		var len=line.length;
    		
            for(var j=0;j<len-1;j++){
            	var diff=len-j-1;
            	if(matrix[i][diff]==matrix[i][diff-1]){	
            		matrix[i][diff-1]*=2;
            		score+=matrix[i][diff-1];
            		matrix[i][diff]=0;
            	}
            }
    	}
    	// 合并之后调用回调函数，回调函数用来设置分数
    self.iScore.innerHTML=score;
    callback&&callback.call(self)
    }

    // 右边方向合并

    function mergeRight(matrix,score,callback){
        var self=this;
    	var length=matrix.length;
        var filled=getFilledItem(matrix);
    	var line=[];
    	
    	// 行合并
    	for(var i=0;i<length;i++){
    		line=filled.filter(function(item){
                return item.flag[0]==i;
    		})
    		var len=line.length;
    		
            for(var j=0;j<len-1;j++){
            	var diff=length-len+j;
            	if(matrix[i][diff]===matrix[i][diff+1]){
            		
            		matrix[i][diff+1]*=2;
            		score+=matrix[i][diff+1];
            		matrix[i][diff]=0;
            	}

    	    }
    	
        }
        self.iScore.innerHTML=score;
        callback&&callback.call(self);
    }

    // 上方向合并

    function mergeUp(matrix,score,callback){
    	var self=this;
    	var length=matrix.length;
    	var col=[];
    	var filled=getFilledItem(matrix);
    	for(var i=0;i<length;i++){
    		col=filled.filter(function(item){
    			return item.flag[1]===i;
    		})
    		var len=col.length;
    		for(var j=0;j<len-1;j++){
    			var diff=len-j-1;	
    			if(matrix[diff][i]==matrix[diff-1][i]){
                    matrix[diff-1][i]*=2;
                    score+=matrix[diff-1][i];
                    matrix[diff][i]=0;
    			}
    		}
    	}
    	self.iScore.innerHTML=score;
    	callback&&callback.call(self);

    }

    // 下方向合并
    function mergeDown(matrix,score,callback){
    	var self=this;
    	var length=matrix.length;
    	var col=[];
    	var filled=getFilledItem(matrix);
    	for(var i=0;i<length;i++){
    		col=filled.filter(function(item){
    			return item.flag[1]===i;
    		})
    		var len=col.length;
    		// len的长度至少应该为2
    		for(var j=0;j<len-1;j++){
    			var diff=length-len+j;	
    			if(matrix[diff][i]==matrix[diff+1][i]){
                    matrix[diff+1][i]*=2;
                    score+=matrix[diff+1][i];
                    matrix[diff][i]=0;
                    // 如果是中间的发生合并，那么还需要进行移动。
    			}
    		}
    	}
    	self.iScore.innerHTML=score;
    	callback&&callback.call(self);

    }

    // 设置最大分值
    function setMax(){
    	var self=this;
    	var iScore=parseInt(self.iScore.innerHTML);
    	var maxScore=parseInt(self.maxScore.innerHTML);
    	
    	if(iScore>maxScore){
    		maxScore=iScore;
    		self.maxScore.innerHTML=maxScore;
    	}
    	saveMaxScore(maxScore)
    	
    }

    // 使用localStore保存分数
    function saveMaxScore(maxScore){
    	return window.localStorage.setItem("maxScore",maxScore)
    }
    // 获取保存后的分数

    function getMaxScore(){
    	return window.localStorage.getItem("maxScore")
    }

    // 移动之后再次生成一个随机数

    function randomAfterGo(matrix){
        var self=this;
        fillNumber.call(self,matrix,self.isInit);
       
    }

    // 判断游戏是否结束.如果结束就删除时间函数
    function isGameOver(matrix){
    	var self=this;

    	return canGoLeft(matrix)||canGoRight(matrix)||canGoUp(matrix)||canGoDown(matrix);
    }

    function isWin(matrix){
    	var num=0;
        for(var i=0;i<matrix.length;i++){
        	for(var j=0;j<matrix.length;j++){
        		num=matrix[i][j];
        		if(num===2048){
        			return true;
        		}
        	}
        }
        return false;

    }
 


    // 返回取值器对象。实现静态变量
    return {
    	Game:Game
    }
})(window,document)