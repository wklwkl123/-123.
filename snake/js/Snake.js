function Snake(head, body, tail) {
    this.head = head;
    this.tail = tail;
    // 身体数组
    this.arr = [
        // 头
        {row: 4 , col: 7},
        // 身体
        {row: 4 , col: 6},
        // 尾巴
        {row: 4 , col: 5}
    ]
    this.direction = 39;
    this.headImage = this.head[this.direction - 37];
    this.bodyImage = body;
    this.tailImage = this.tail[this.direction - 37];
}
Snake.prototype.move = function() {
    var tail = this.arr.pop();
    tail.row = this.arr[0].row;
    tail.col = this.arr[0].col;
    switch (this.direction) {
        case 37:
                tail.col--
            break;
        case 38:
                tail.row--;
            break;
        case 39:
                tail.col++;
            break;
        case 40:
                tail.row++
            break;
        default: ;
    }
    this.arr.unshift(tail);
    // 尾巴
    var tail = this.arr[this.arr.length -1];
    // 最后身体
    var body = this.arr[this.arr.length - 2];
    // 同一行
    if (tail.row === body.row) {
        if (tail.col < body.col) {
            this.tailImage = this.tail[2]
        } else {
            this.tailImage = this.tail[0]
        }
    } else if (tail.col === body.col) {
        if (tail.row < body.row) {
            this.tailImage = this.tail[3]
        } else {
            this.tailImage = this.tail[1]
        }

    }
}
Snake.prototype.changeDirection = function(e) {
    if (Math.abs(e - this.direction) === 2) {
        return;
    }
    this.direction = e;
    // 头
    this.headImage = this.head[e - 37]
}
// 增长
Snake.prototype.grow = function() {
    var tail = this.arr[this.arr.length - 1] 
    var obj = {
        row: tail.row,
        col: tail.col
    }
    this.arr.push(obj)

    
}