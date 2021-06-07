function Block(img) {
    this.arr = [
        {row: 6, col: 3},
        {row: 6, col: 4},
        {row: 6, col: 5},
        {row: 6, col: 6},
        {row: 6, col: 7},
        {row: 6, col: 8}
    ]
    this.img = 'url(' + img + ')'
}
Block.prototype.add = function(row, col) {
    var obj = {
        row: row,
        col: col
    }
    this.arr.push(obj)
}