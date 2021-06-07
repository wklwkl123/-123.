function Game(block, food, map, snake) {
    this.block = block;
    this.food = food;
    this.map = map
    this.snake = snake;
    this.timebar = null;
    this.time = 1000;
    this.state = false;

    // suo
    this.lock = false;
    // fenshu
    this.score = 0;
    // 身体长度
    this.num = 3;
}
// 初始化
Game.prototype.init = function() {
    // 渲染地图
    this.renderMap();
    // 渲染食物
    this.renderFood();
    // 障碍物
    this.renderBlock();
    // 渲染蛇
    this.randerSnake();
    // 开始游戏
    this.startGame();
    // 事件
    this.bindEvent()

}
Game.prototype.renderMap = function() {
    this.map.init()
}
Game.prototype.renderFood = function() {
    this.map.arr[this.food.row][this.food.col].style.backgroundImage = this.food.img;
};
Game.prototype.renderBlock = function() {
    for (var i = 0; i < this.block.arr.length; i++) {
        var block = this.block.arr[i];
        this.map.arr[block.row][block.col].style.backgroundImage = this.block.img;
    }
}
Game.prototype.randerSnake = function() {
    // 头
    var head = this.snake.arr[0];
    this.map.arr[head.row][head.col].style.backgroundImage = 'url(' + this.snake.headImage + ')';
    3

    // 身体
    for (var i = 1; i < this.snake.arr.length - 1; i++) {
        var body = this.snake.arr[i];
        this.map.arr[body.row][body.col].style.backgroundImage = 'url(' + this.snake.bodyImage + ')';
    }

    // 尾巴
    var tail = this.snake.arr[this.snake.arr.length - 1];
    this.map.arr[tail.row][tail.col].style.backgroundImage = 'url(' + this.snake.tailImage + ')';
}

// 画布
Game.prototype.clear = function() {
    for (var i = 0; i < this.map.arr.length; i++) {
        for (var j = 0; j < this.map.arr[i].length; j++) {
            this.map.arr[i][j].style.backgroundImage = '';
        }
    }
}
Game.prototype.startGame = function() {
        var me = this;

        this.timebar = setInterval(function() {
            me.lock = true;
            me.snake.move();
            me.checkGame();
            me.EatFood();
            me.checkSnake();
            if (!me.state) {
                me.clear();
                // 渲染食物
                me.renderFood();
                // 障碍物
                me.renderBlock();
                me.randerSnake();
            }
            me.lock = false;
            me.snakeLength();
        }, this.time)

    }
    // 游戏结束
Game.prototype.checkGame = function() {
        if (this.snake.arr[0].row < 0 || this.snake.arr[0].row >= this.map.row || this.snake.arr[0].col < 0 || this.snake.arr[0].col >= this.map.col) {
            this.state = true;
            // console.log(11);
            clearInterval(this.timebar)
            document.getElementById('box2').innerHTML = this.score;
        }
        // 碰到障碍物
        for (var i = 0; i < this.block.arr.length; i++) {

            if (this.snake.arr[0].row === this.block.arr[i].row && this.snake.arr[0].col === this.block.arr[i].col) {
                this.state = true;
                clearInterval(this.timebar)
                document.getElementById('box2').innerHTML = this.score;
            }

        }
    }
    // 绑定事件
Game.prototype.bindEvent = function() {
        var me = this;
        document.addEventListener('keydown', function(e) {
            if (me.lock) {
                return;
            }
            var key = e.keyCode;
            switch (key) {
                case 37:
                case 38:
                case 39:
                case 40:
                    me.snake.changeDirection(key);
                    break;
                default:
                    ;
            }
        })
    }
    // 吃食物
Game.prototype.EatFood = function() {
        if (this.snake.arr[0].row === this.food.row && this.snake.arr[0].col === this.food.col) {
            this.score += 10;
            this.snake.grow();
            // 身体增长就增加障碍物
            this.num++;
            if (this.num > 3) {
                this.addBlock()
            }
            this.restFood();

        }
    }
    // 随机一个事物
Game.prototype.restFood = function() {
        var row = parseInt(this.map.row * Math.random());
        var col = parseInt(this.map.col * Math.random());
        for (var i = 0; i < this.block.arr.length; i++) {
            var block = this.block.arr[i]
            if (row === block.row && col === block.col) {
                return this.restFood();
            }
        }

        for (var i = 0; i < this.snake.arr.length; i++) {
            var snake = this.snake.arr[i];
            if (row === snake.row && col === snake.col) {
                return this.restFood();
            }
        }
        this.food.rest(row, col)
    }
    // 判断头碰到身体游戏结束
Game.prototype.checkSnake = function() {
        // 头
        var header = this.snake.arr[0];
        for (var i = 1; i < this.snake.arr.length; i++) {
            var tail = this.snake.arr[i]
            if (header.row === tail.row && header.col === tail.col) {
                // 游戏结束
                this.state = true;
                clearInterval(this.timebar);
                document.getElementById('box2').innerHTML = this.score;
            }
        }
    }
    // 伸长增加，游戏加快
Game.prototype.snakeLength = function() {
        if (this.snake.arr.length > 5) {
            this.time = 800;
            clearInterval(this.timebar);
            this.startGame();
        }
        if (this.snake.arr.length > 8) {
            this.time = 500;
            clearInterval(this.timebar);
            this.startGame();
        }
        if (this.snake.arr.length > 12) {
            this.time = 300;
            clearInterval(this.timebar);
            this.startGame();
        }
        if (this.snake.arr.length > 15) {
            this.time = 100;
            clearInterval(this.timebar);
            this.startGame();
        }

    }
    // 伸长增加，增加障碍物
Game.prototype.addBlock = function() {
    var row = parseInt(this.map.row * Math.random());
    var col = parseInt(this.map.col * Math.random());
    // 排除自己原来的位置
    for (var i = 0; i < this.block.arr.length; i++) {
        var block = this.block.arr[i];
        if (row == block.row && col == block.col) {
            return this.addBlock();
        }
    }
    // 排除
    for (var i = 0; i < this.snake.arr.length; i++) {
        var snake = this.snake.arr[i];
        if (row === snake.row && col === snake.col) {
            return this.addBlock();
        }
    }
    // 排除食物
    if (row === this.food.row && col === this.food.col) {
        return this.addBlock();

    }
    this.block.add(row, col);

}