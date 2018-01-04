let inside = require('./inside')
let util = {}
util.title = function (title) {
    title = title ? title : 'iView project'
    window.document.title = title
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
let InterVal = 10

util.getCrossPoints = function (datas) {
    let container = datas.container
    delete datas.container
    for (let key in datas) {
        allPolygons.push(sortResult(datas[key]))
    }

    outputResult(0)
    
    let ss = allPoints

    let res = "["
    for (let i in ss) {
        for (let j in ss[i]) {
            if (i == ss.length - 1 && j == ss[i].length - 1) {
                res += `[${ss[i][j][0]},${ss[i][j][1]}]`
            }
            else {
                res += `[${ss[i][j][0]},${ss[i][j][1]}],`
            }
        }
    }
    res += "]"

    return res
}


function outputResult(index) {
    let _arr = []
    for (var i = 0; i < 1920; i = i + InterVal) {
        for (var j = 0; j < 1116; j = j + InterVal) {
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

function sortResult(polygon) {
    let _result = []
    for (let i = 0; i < polygon.length; i = i + 2) {
        let _arr = []
        _arr.push(polygon[i], polygon[i + 1])
        _result.push(_arr)
    }
    return _result
}

export default util