(function () {
    class Player {   //玩家
        constructor($el) {
            this.$el = document.querySelector($el);
            this.$caret = this.$el.querySelector(".caret");
            this.active = false;
        }
        isActive(active) {
            this.active = !!active;  //轮到该玩家时，active为true，否则为false
            this.$caret.hidden = !active; //轮到该玩家时，显示头顶箭头，否则隐藏
        }
    };

    class Gamearea {    //游戏区域
        constructor() {
            this.$el = document.querySelector("#app .gamearea");
            this.$square = [].slice.call(this.$el.querySelectorAll(".square"));
            this.$overlay = this.$el.querySelector(".overlay");
            this.$start = this.$overlay.querySelector(".start");
            this.$gameover = this.$overlay.querySelector(".gameover");
            this.$winner = this.$gameover.querySelector(".winner");
            this.$nowin = this.$overlay.querySelector(".nowin")
            this.squares = this.$square.map(function (val) {
                return val = 0;
            });
        }

        setSquare(e, $p1, $p2) {  //点击游戏区域，在对应区域置入玩家LOGO并设置值
            let name = this.activePlayer($p1, $p2);
            this.$square[e.dataset.index].classList.add(name);
            this.squares[e.dataset.index] = name === "playerOne" ? 1 : -1;
        }
        clearSquare() {         //清空游戏区域，移除所有LOGO并清空所有值
            this.$square.forEach(function (square) {
                square.className = "square";
            })
            for(let i = 0;i<this.squares.length;i+=1){
                this.squares[i] = 0;
            }
        }
        clickStartBtn(active) {  //点击开始按钮，激活玩家1的状态
            this.$start.hidden = !!active;
            this.$overlay.hidden = !!active;
        }
        switchPlayer($p1, $p2) { //交换玩家1和2的状态
            let temp = $p1.active;
            $p1.isActive($p2.active);
            $p2.isActive(temp);
        }
        activePlayer(p1, p2) { //返回当前活跃的玩家的LOGO名
            return p1.active ? "playerOne" : "playerTwo";
        }
        isAllSet() {  //判断游戏区域是否已用完
            return !this.squares.includes(0);
        }
        hasWinner() {  //判断是否有赢家
            const arr = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                [0, 4, 8], [2, 4, 6]
                ];
            const result = arr.find(function ([x, y, z]) {  //遍历一切可赢情况，寻找并返回第一种满足胜利的情况，否则返回undefined
                const val = this.squares[x] + this.squares[y] + this.squares[z]
                return val === 3 || val === -3; 
            },this);
            if(result){ //如果存在胜利者，则返回一个对应胜者的标志
                return this.squares[result[0]] + this.squares[result[1]] + this.squares[result[2]]
            }else{
                return result;//无则将undenfied返回
            }
        }
        isOver() {  //判断游戏是否已经满足上述两种情况之一，先判定有无胜者，再判定游戏区域是否已经用完
            let hasWinner = this.hasWinner();
            if (hasWinner) {
                this.showGameover(false);
                this.showWinner(hasWinner);
                
                return ;
            } else if (this.isAllSet()) {
                this.noWinner();
                return ;
            }
        }
        showGameover(active){  //有赢家出现时，显示覆盖层，并显示游戏结束界面
            this.$overlay.hidden =!!active;
            this.$gameover.hidden =!!active;
        }
        showWinner(val) {  //显示玩家
            if(val === 3)
                this.$winner.classList.add("playerOne");
            else if(val === -3)
                this.$winner.classList.add("playerTwo");
        }
        noWinner() {
            this.$overlay.hidden = false;
            this.$nowin.hidden = false;
        }
        resetGamearea(){
            this.clickStartBtn(false); //显示开始按钮和覆盖层
            this.clearSquare();        //清空游戏区域
            this.$gameover.hidden = true;
            this.$winner.className = "winner";//清空胜者LOGO
            this.$nowin.hidden = true;
        }
    }
    class GameSwitch {  //游戏重置
        constructor() {
            this.$reset = document.querySelector("#app .gameSwitch .reset");
        }
        setBtnAble(active) {  //按钮能否使用
            this.$reset.disabled = !active;
        }
        resetGame($gamearea, $p1, $p2) {  //重置游戏
            $gamearea.resetGamearea();    
            $p1.isActive(false);            //清空玩家游戏状态
            $p2.isActive(false); 
            this.setBtnAble(false);         //使重置按钮不可用
        }


    }


    function _main() {
        const $p1 = new Player("#player-one");
        const $p2 = new Player("#player-two");
        const $gamearea = new Gamearea();
        const $gameSwitch = new GameSwitch();

        $gamearea.$el.addEventListener("click", e => { //监听游戏区域的鼠标点击
            let eTarget = e.target;
            while (eTarget !== e.currentTarget) { //当触发事件的元素不是绑定事件的元素
                if (eTarget.className === "square") { //若点击的区域是square
                    $gamearea.setSquare(eTarget, $p1, $p2);  //在指定区域添加LOGO和值
                    $gamearea.isOver()              //判断游戏是否结束
                    $gamearea.switchPlayer($p1, $p2); //交换玩家
                    break;
                } else if (eTarget.matches(".start")) { //若点击的是start按钮
                    $gamearea.clickStartBtn(true);  //隐藏overlay和start按钮
                    $gameSwitch.setBtnAble(true); //使reset可用
                    $p1.isActive(true); //激活玩家1
                    break;
                }
                else {
                    eTarget = eTarget.parentNode;
                }
            }
        });
        $gameSwitch.$reset.addEventListener("click", function () {//为reset按钮绑定事件
            $gameSwitch.resetGame($gamearea, $p1, $p2);
        });
    }
    document.addEventListener("DOMContentLoaded", function () {//DOM解析后再调用_main函数
        _main()
    });
})();