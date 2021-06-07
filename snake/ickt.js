// 根据id获取元素
function $id(id) {
    return document.getElementById(id);
}
function getStyle(dom, key) {
    // 将变量声明再最前面
    var style;
    // 能力检测 if (getComputedStyle) {}
    // 通过window访问，避免报错
    if (window.getComputedStyle) {
        // 此时确信有getComputedStyle方法，因此可以直接使用
        style = getComputedStyle(dom);
    // 支持currentStyle属性，是IE
    } else if (dom.currentStyle) {
        style = dom.currentStyle;
    } else {
        // 都不支持
        // 提示错误，或者从行内式样式中寻找
        style = dom.style;
    }
    // 返回结果
    return style[key];
}

/***
 * 封装获取节点的方法(过滤换行符与空白符)
 * @dom         容器元素
 * return       返回一个数组，包含每一个节点成员
 **/
function getNodes(dom) {
    // 定义正则
    var reg = /^\s*$/;
    // 定义结果
    var result = [];
    // 遍历节点
    for (var i = 0; i < dom.childNodes.length; i++) {
        // 缓存节点
        var child = dom.childNodes[i];
        // 过滤掉包含多个空白符的文本节点
        if (child.nodeType === 3 && reg.test(child.nodeValue)) {
            // 遍历下一个
            continue;
        }
        // 存储该节点
        result.push(child);
    }
    return result;
}

// dom在parent的current子节点后面插入
function insertAfter(parent, dom, current) {
    // 获取后面的元素
    var next = current.nextSibling;
    // console.log(next);
    // 插入
    parent.insertBefore(dom, next);
}

// 在current的前面插入dom
function before(dom, current) {
    // 找到父元素
    var parent = current.parentNode;
    // 通过父元素向current前面插入
    parent.insertBefore(dom, current)
}

// 在current的后面插入dom
function after(dom, current) {
    // 获取父元素
    var parent = current.parentNode;
    // 获取current的下一个兄弟元素
    var next = current.nextSibling;
    // 插入
    parent.insertBefore(dom, next);
}

// 执行动画的
function animate(dom, obj, time, callback) {
    // 终止之前的动画
    clearInterval(dom.timebar);
    // 计算总次数
    var num = time / 30;
    // console.log(obj);
    // 解析遍历obj
    for (var key in obj) {
        // key代表属性名称， obj[key]代表属性值
        // 获取起始位置
        var start = parseInt(getStyle(dom, key));
        // 获取结束位置
        var end = parseInt(obj[key])
        // 记录每一次运行的距离
        var step = (end - start) / num;
        // 多个数据放在数组中
        // 第四个成员是单位
        obj[key] = [start, end, step, obj[key].slice((end + '').length) || 'px'];
    }
    // 是否结束
    var animateOver = false;
    // 启动循环定时器
    dom.timebar = setInterval(function() {
        // 改变位置
        for (var key in obj) {
            // 缓存
            var css = obj[key];
            // 起始位置加上改变的步长
            css[0] += css[2]
            // 判断是否结束
            if (Math.abs(css[0] - css[1]) < Math.abs(css[2])) {
                // 如果结束，强制到最终位置
                css[0] = css[1];
                // 结束了
                animateOver = true;
                // // 如果结束，关闭定时器，结束循环
                // clearInterval(timebar);
            }
            // 定时器的最后面更新样式
            if (key === 'opacity') {
                // 设置透明度不带单位
                dom.style[key] = css[0];
            } else {
                dom.style[key] = css[0] + css[3];
            }
        }
        // 如果结束了
        if (animateOver) {
            // 如果结束，关闭定时器，结束循环
            clearInterval(dom.timebar);
            // 执行回调函数
            callback && callback();
        }
    }, 30)
}


/***
 * 移除事件
 * @dom     绑定事件的元素
 * @type    事件类型
 * @fn      事件回调函数
 * ***/
 function removeEvent(dom, type, fn) {
    // 能力检测
    if (dom.removeEventListener) {
        // 特殊处理ff
        if (type === 'mousewheel') {
            // 移除事件
            dom.removeEventListener('DOMMouseScroll', dom.__eventName, false)
        }
        // DOM2
        dom.removeEventListener(type, fn, false);
    // ie
    } else if (dom.detachEvent) {
        // 移除事件
        dom.detachEvent('on' + type, fn.__eventName)
    } else {
        // dom0
        dom['on' + type] = null;
    }
}


/***
 * 绑定事件
 * @dom     绑定事件的元素
 * @type    事件类型
 * @fn      事件回调函数
 * ***/
 function bindEvent(dom, type, fn) {
    // 高级浏览器
    if (dom.addEventListener) {
        // 兼容
        if (type === 'mousewheel') {
            // 将匿名函数存储在dom上
            dom.__eventName = function(e) {
                // 拓展事件对象数据
                e.wheelDelta = e.detail * -40;
                // 执行回调函数
                fn.call(dom, e)
            }
            // 兼容ff
            dom.addEventListener('DOMMouseScroll', dom.__eventName, false)
        }
        // 直接绑定
        dom.addEventListener(type, fn, false)
    // 能力检测：ie浏览器
    } else if (dom.attachEvent) {
        // 存储在fn上
        fn.__eventName = function (e) {
            // 拓展属性
            e.target = e.srcElement;
            e.currentTarget = dom;
            // 拓展方法
            e.stopPropagation = function() {
                // 使用ie的方式
                e.cancelBubble = true;
            }
            // 默认行为
            e.preventDefault = function() {
                // 使用ie的方式
                e.returnValue = false;
            }
            // 执行外部的函数，才能执行内部的fn。
            fn.call(dom, e);
        };
        // 直接绑定
        dom.attachEvent('on' + type, fn.__eventName)
    } else {
        // 绑定多次
        // 缓存原来的回调函数
        var oldFn = dom['on' + type];
        // 执行的时候优先执行缓存的回调函数
        dom['on' + type] = function(e) {
            // 兼容
            e = e || window.event;
            // 拓展属性
            if (!e.target) {
                // ie浏览器
                e.target = e.srcElement;
                e.currentTarget = dom;
                // 冒泡方法
                e.stopPropagation = function() {
                    // ie的方式
                    e.cancelBubble = true;
                }
                // 默认行为
                e.preventDefault = function() {
                    // ie的方式
                    e.returnValue = false;
                }
            }
            // 没有冒泡方法，再拓展冒泡方法
            // if (!e.stopPropagation) {
            //     e.stopPropagation = function() {
            //         // ie的方式
            //         e.cancelBubble = true;
            //     }
            // }
            // // 判断方法
            // if (!e.preventDefault) {
            //     e.preventDefault = function() {
            //         // ie的方式
            //         e.returnValue = false;
            //     }
            // }
            // 执行之前的
            oldFn && oldFn.call(this, e);
            // 再执行新的
            fn.call(this, e);
        }
    }
}

// 实现防抖器
function antiShake(fn) {
    // 清除定时器
    clearTimeout(fn.__timebar);
    // 延迟执行函数
    fn.__timebar = setTimeout(function() {
        // 执行回调函数
        fn();
    }, 200)
}

// 封装节流器
function throttle(fn) {
    // 判断开关
    if (fn.__lock) {
        // 如果打开了，中断执行
        return;
    }
    // 开发开关
    fn.__lock = true;
    // 执行函数
    fn();
    // 经过一段时间，关闭开关
    setTimeout(function() {
        // 关闭开关
        fn.__lock = false;
    }, 1000)

}

/***
 * 设置样式 
 *  eg: css(box, { color: 'red' })      css(box, 'color', 'red')
 * @dom     设置的元素
 * @key     样式名称或者是样式对象
 * @value   样式属性值
 * ****/
function css(dom, key, value) {
    // 判断是否是字符串
    if (typeof key === 'string') {
        // 设置一条样式
        dom.style[key] = value;
    } else {
        // 是对象
        for (var k in key) {
            // k是样式名称 key[k] 是样式值
            // dom.style[k] = key[k];
            // 递归调用（复用逻辑）
            css(dom, k, key[k]);
        }
    }
}