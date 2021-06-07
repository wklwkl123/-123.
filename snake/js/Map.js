function Map(width, height, row, col, box) {
    this.width = width;
    this.height = height;
    this.row = row;
    this.col = col;
    this.colWidth = this.width / this.col;
    this.colHeight = this.height / this.row;
    this.arr = [];
    this.box = box;
    
}
Map.prototype.init = function() {
   
    for (var i = 0; i < this.row; i++) {
        // 创键行元素
        var rowDom = document.createElement('div');
        var rowArr = [];
        for (var j = 0; j < this.col; j++) {
            // 创建列元素
            var colDom = document.createElement('div');
            this.css(colDom, {
                width: this.colWidth + 'px',
                height: this.colHeight + 'px',
                border: '1px solid #ccc',
                backgroundSize: 'cover',
                boxSizing: 'border-box'
            })
            rowDom.appendChild(colDom);
            rowArr.push(colDom);
           
            this.css(rowDom, {
                display: 'flex'
            })
        }
        this.box.appendChild(rowDom);
        this.arr.push(rowArr);
    }
    this.css(this.box, {
        width: this.width + 'px',
        height: this.height + 'px',
        margin: '0 auto',
        border: '1px solid #ccc'
    })
    
   
}
Map.prototype.css = function(dom, obj) {
    for (var key in obj) {
        dom.style[key] = obj[key]
    }
}