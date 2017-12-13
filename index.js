/**
 * 主要功能:
 * 1. 上传图片和放大缩小功能
 * 2. 鼠标点击产生小圆点
 * 3. 按照顺序连接产生图形
 * 4. 撤回操作和删除图形功能
 * 5. 拖动点和拖动整个图形功能
*/

/**
 * 主要步骤：
 * 1. 点击图片区域，获取鼠标点击的点，同时添加红点表示点击的地方
 * 2. 将点放入全局数组中，每次点击都重新put并更新图形。（可能存在缓存问题，如果发现的话需要删除，不然页面太卡会影响很多，比如保存问题，这个可以cookie解决）
 * 3. 图片放大(最大2x)之后，重新计算点的位置信息
 * 4. 点击的时候产生小圆点（如果用canvas可能会出现页面太卡问题，目前考虑的是使用div，点击的时候在鼠标出产生一个div。）  
 * 
*/

/**
 * todoList:
 * 1. 暂停绘制 => 主要是用来评议多边形和移动点来重绘多边形     
 * 2. 开始、暂停、停止绘制的防多次点击判断
 * 3. 图片放大后svg和polygon的 处理
 * 4. 图片可拖动？（正在考虑是否日添加）
 * 5. 撤回操作
 * 6. 键盘操作
 * 7. 储存操作（cookie）
*/

const { log } = console
let Operate = {
  start,
  stop,
  revoke,
  rename
}
/**
 * 全局变量 
 * Img                                       图片变量  todo: 自定义上传
 * PolygonIndex                              当前图形的序号
 * selectedPolygonIndex                      当前被选中的多边形序号
 * PointIndex                                当前图形的点的序号 
 * SaleVariable                              整体缩放比例
 * Polygons                                  当前图形的点的集合
 * PolygonStyle                              图形样式
 * Created                                   是创建还是修改
 * PolygonDom                                当前的多边形节点
 * AllPolygon                                所有多边形的对象
 * DoorNum                                   即将编辑的多边形的门牌号
 * DrawEnd                                   当前多边形编辑结束
 * ContinueDraw                              是否是继续绘制
 * SelectedDoorNum                           继续绘制时选中的多边形门牌号
*/

const Img = $('#img')
let PolygonIndex = 0
let selectedPolygonIndex = PolygonIndex
let PointIndex = 0
let ScaleVariable = 1
let Polygons = []
let PolygonStyle = 'fill:#ffff00;stroke:#ff9000;fill-opacity:.6';
let Created = true
let PolygonDom = {}
let AllPolygon = {}
let pointSize = 2
let DoorNum = 0
let DrawEnd = true
let ContinueDraw = false
let SelectedDoorNum = ''

// 开始
function start() {

  if (!DrawEnd) {
    alert('请先完成绘制，再开始绘制新的多边形！')
    return
  }
  DrawEnd = false

  changeZIndex('pointsContent')

  $('#startDraw').text('绘制中')
  addDrawPolygon()
}

// 撤回
function revoke() {
  if (Polygons.length < 1) {
    alert('没点了还撤回？顺便重置了多边形绘制。')

    // 删除清空的节点
    let _currentDelPoint = $(`#map .polygon${selectedPolygonIndex}`)
    if (_currentDelPoint.attr('points') === undefined || _currentDelPoint.attr('points') === '') {
      _currentDelPoint.remove()
    }

    removeDrawPolygon()
    return
  }

  // 切断当前数组最后2位，删除当前对应的点的节点信息，重置图形
  Polygons.splice(Polygons.length - 2, 2)
  let _currentPolygon = $(`#pointsContent .point${selectedPolygonIndex}`)
  $(_currentPolygon[_currentPolygon.length - 1]).remove()
  drawPolygon()
}

// 重命名
function rename() {
  
}

// 结束
function stop() {

  if (DrawEnd) {
    alert('已经完成了，别点了。崩溃了就白描了')
  }

  // 改变图层关系，让map在pointsContent上面
  changeZIndex('map')

  removeDrawPolygon()

  log(AllPolygon)
}

// 添加绘制事件
function addDrawPolygon() {
  // 给画布添加全局点击事件并且修改鼠标样式
  ContinueDraw ? DoorNum = SelectedDoorNum : DoorNum = prompt("请你即将编辑的门牌号 :", "")

  if (DoorNum === null) {
    alert('用户取消')
    $('#startDraw').text('开始绘制')
    DrawEnd = true 
    return
  }
  $('#pointsContent')
    .on('click', function (e) {
      const { offsetX, offsetY } = e
      mouseClick({ offsetX, offsetY })
      Polygons.push(offsetX, offsetY)
      drawPolygon()
    })
    .css('cursor', 'crosshair')
}

// todo: 暂停绘制事件
function pauseDrawPolygon() {

}
//  停止绘制事件
function removeDrawPolygon() {
  $('#pointsContent')
    .unbind('click')
    .css('cursor', 'default')

  // 隐藏红点，只保留图形
  $(`.point`).hide()

  // 将数据放入全局数组中
  AllPolygon[DoorNum] = Polygons

  // 重置操作  todo:整理成一个方法
  PolygonIndex = $('#map polygon').length
  selectedPolygonIndex = PolygonIndex
  PointIndex = 0
  Polygons = []
  Created = true
  polygonDom = {}
  DrawEnd = true
  ContinueDraw = false
  $('#startDraw').text('开始绘制')
}

// 鼠标点击出现红点事件
function mouseClick(pos) {
  let _div = `<div class="point point${selectedPolygonIndex} ${selectedPolygonIndex}-${PointIndex}" style="top:${pos.offsetY - pointSize}px;left:${pos.offsetX - pointSize}px;transform:scale(${1 / ScaleVariable})"></div>`

  PointIndex++
  $('#pointsContent').append(_div)
}

// 绘制多边形功能
function drawPolygon() {
  if (!Created) {
    try {
      PolygonDom.setAttribute('points', Polygons)
    }
    catch (err) {
      PolygonDom.attr('points', Polygons)
    }
    return
  }

  let svgDom = document.getElementById('map')
  let polygonDom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  polygonDom.setAttribute('class', `polygon${PolygonIndex}`)
  polygonDom.setAttribute('data-index', `${PolygonIndex}`)
  polygonDom.setAttribute('data-doorid', `${DoorNum}`)
  polygonDom.setAttribute('style', PolygonStyle)
  polygonDom.setAttribute('points', Polygons)
  polygonDom.setAttribute('onclick', 'polygnEvent(this)')
  svgDom.appendChild(polygonDom)

  Created = false
  PolygonDom = polygonDom
}

//  图片放大缩小事件
function scaleImg(type) {

  if (type == 'add' && ScaleVariable > 2) {
    alert('还放大,你怕是瞎了,换个人吧!')
    return
  }

  if (type == 'reduce' && ScaleVariable < .4) {
    alert('还缩,你眼睛是多好,镜片是放大镜吧!')
    return
  }

  switch (type) {
    case 'add':
      ScaleVariable += 0.2
      _scale(ScaleVariable)
      break;

    case 'reduce':
      ScaleVariable -= 0.2
      _scale(ScaleVariable)
      break;

    default:
      alert("缩放事件出错。请刷新页面重试");
      break;
  }

  function _scale(scaleRat) {
    $('#img').css({
      'transform': `scale(${scaleRat})`
    })
    $('#pointsContent').css({
      'transform': `scale(${scaleRat})`
    })
    $('#pointsContent .point').css({
      'transform': `scale(${1 / scaleRat})`
    })
    $('#map').css({
      'transform': `scale(${scaleRat})`
    })
  }

}

/**
 * todo: 点击多边形选中
 * 1. 添加多边形拖动事件
 * 2. 显示点并且点添加拖动事件
 * 3. 设置pointContent的z-index低于svg以便点击选中多边形
 */

function polygnEvent(_this) {
  let _index = $(_this).attr('data-index')
  let _points = $(`#pointsContent .point${_index}`)

  Polygons = $(_this).attr('points').split(',')

  selectedPolygonIndex = _index
  PolygonDom = $(`.polygon${_index}`)
  Created = false

  $('#pointsContent .point').hide()
  _points.show()

  ContinueDraw = true
  SelectedDoorNum = $(_this).attr('data-doorid')

  log(SelectedDoorNum)

  // 将按钮文字修改成继续绘制
  $('#startDraw').text('继续绘制')
}

/**
 * 以下是工具类函数
 */

// 改变图层，可以操作到对应的元素
function changeZIndex(layer) {
  let _map = $("#map")
  let _pContent = $('#pointsContent')
  let _bigZ = 102
  let _smallZ = 101
  switch (layer) {
    case 'map':
      _map.css('zIndex', _bigZ)
      _pContent.css('zIndex', _smallZ)
      break
    case 'pointsContent':
      _map.css('zIndex', _smallZ)
      _pContent.css('zIndex', _bigZ)
      break
    default:
      alert('操作有问题,问题类型1')
      break
  }
}


