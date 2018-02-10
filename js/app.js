(function(){
    class Player {
    constructor($el) {
        this.$el = document.querySelector($el);
        this.$caret = this.$el.querySelector(".caret");
        this.active = false;
    }
    isActive(active) {
        this.active = !!active;
        this.$caret.hidden = !active;
    }
};

// class Square {
//     constructor() {
//         this.val = 0;
//     }
// }

class Gamearea {
    constructor() {
        this.$el = document.querySelector("#app .gamearea");
        this.$square = this.$el.querySelectorAll(".square");
        this.$overlay = this.$el.querySelector(".overlay");
        this.$start = this.$overlay.querySelector(".start");
        // this.$gameover = this.$overlay.querySelector(".gameover");
        // this.squares = $gamearea.$square.map(function (square) {
        //     return new Square();
        // });
    }
    setLogo(e, $p1, $p2) {
        this.$square[e.dataset.index].classList.add(this.activePlayer($p1, $p2));
    }

    // clearLogo() {
    //     this.$square.forEach(function (square) {
    //         square.className = "square";
    //     })
    // }
    clickStartBtn(active) {
        this.$overlay.hidden = !!active;
    }
    switchPlayer($p1, $p2) {
        let temp = $p1.active;
        $p1.isActive($p2.active);
        $p2.isActive(temp);
    }
    activePlayer(p1, p2) {
        return p1.active ? "playerOne" : "playerTwo";
    }
    // isOver() {

    // }
}
class GameSwitch {
    constructor() {
        this.$reset = document.querySelector("#app .gameSwitch .reset");
    }
    setBtnAble(active) {
        this.$reset.disabled = !active;
    }
    // resetGame($gamearea, $p1, $p2) {
    //     $gamearea.clickStartBtn(false);
    //     $gamearea.clearSquare();
    //     $p1.isActive(false);
    //     $p2.isActive(false);
    //     this.setBtnAble(false);
    // }


}


function _main() {
    const $p1 = new Player("#player-one");
    const $p2 = new Player("#player-two");
    const $gamearea = new Gamearea();
    const $gameSwitch = new GameSwitch();

    $gamearea.$el.addEventListener("click", e => {
        let eTarget = e.target;
        while (eTarget !== e.currentTarget) {
            if (eTarget.className === "square") {
                $gamearea.setLogo(eTarget, $p1, $p2);
                $gamearea.switchPlayer($p1, $p2);
                break;
            } else if (eTarget.matches(".start")) {
                $gamearea.clickStartBtn(true);
                $gameSwitch.setBtnAble(true);
                $p1.isActive(true);
                break;
            }
            else {
                eTarget = eTarget.parentNode;
            }
        }
    });
    $gameSwitch.$reset.addEventListener("click", function () {
        $gameSwitch.resetGame($gamearea, $p1, $p2);
    });
}
document.addEventListener("DOMContentLoaded",function(){
    _main()
});
})();