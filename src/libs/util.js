let inside = require('./inside')
let util = {}
util.title = function (title) {
    title = title ? title : 'iView project'
    window.document.title = title
}

util.isEmptyObj = function isNullObj(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

util.IdExist = function (id, object) {
    for (let key in object) {
        if (id.toString() == key.toString()) {
            return true
        }
    }
    return false
}
let allPolygons = []
let index = 0
let allPoints = []
let allContainer = []
let InterVal = 10

util.getCrossPoints = function (datas) {
    let container = datas.container
    delete datas.container
    for (let key in datas) {
        allPolygons.push(sortResult(datas[key]))
    }

    outputResult(0)
    outputContainer(sortResult(container))

    let _res = getRes(allPoints, allContainer)

    let ss = _res
    console.log(_res)

    let res = "["
    for (let i in ss) {
        if (i == ss.length - 1) {
            res += `[${ss[i][0]},${ss[i][1]}]`
        }
        else {
            res += `[${ss[i][0]},${ss[i][1]}],`
        }
    }
    res += "]"

    return res
}

function getRes(points, container) {
    let _ContainerArr = sortArr(container)
    let _ObstacleArr = sortArr(points)

    let resultArr = []
    for (let i = _ContainerArr.length - 1; i >= 0; i--) {
        let a = _ContainerArr[i];
        for (let j = _ObstacleArr.length - 1; j >= 0; j--) {
            let b = _ObstacleArr[j];
            if (arrEqual(a, b)) {
                _ContainerArr.splice(i, 1);
                _ObstacleArr.splice(j, 1);
                break;
            }
        }
    }

    return _ContainerArr
}


function outputResult(index) {
    let _arr = []
    for (let i = 0; i < 1920; i = i + InterVal) {
        for (let j = 0; j < 1116; j = j + InterVal) {
            if (inside([i, j], allPolygons[index])) {
                _arr.push([i, j])
            }
        }
    }
    allPoints.push(_arr)
    index++
    if (index > allPolygons.length - 1) {
        return
    }
    else {
        outputResult(index)
    }
}

function outputContainer(container) {
    let _arr = []
    for (let i = 0; i < 1920; i = i + InterVal) {
        for (let j = 0; j < 1116; j = j + InterVal) {
            if (inside([i, j], container)) {
                _arr.push([i, j])
            }
        }
    }
    allContainer.push(_arr)
}


function sortResult(polygon) {
    let _result = []
    for (let i = 0; i < polygon.length; i = i + 2) {
        let _arr = []
        _arr.push(polygon[i], polygon[i + 1])
        _result.push(_arr)
    }
    return _result
}

function sortArr(arr) {
    let _arr = []
    for (let i in arr) {
        for (let j in arr[i]) {
            _arr.push(arr[i][j])
        }
    }
    return _arr
}

function arrEqual(a, b) {
    if (a[0] == b[0] && a[1] == b[1])
        return true
    return false
}

export default util