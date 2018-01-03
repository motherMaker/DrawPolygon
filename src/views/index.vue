<template>
    <div class="index">
        <div id="sectionFloat">
            <img src="../resource/jb_1f.jpg" alt="测试图" id="img" :style="{ transform: scaleStyle }">
            <!-- 控制台 -->
            <div id="floatConsole">
                <transition name="fade">
                    <Row class="scale colorful-stripe" v-if="showConsole">
                        <Row class="storeName">
                            <Col span="14">
                            <Input v-model="storeName">
                            <span slot="prepend">商场名：</span>
                            </Input>
                            </Col>
                            <Col span="10">
                            <Input v-model="floorNum">
                            <span slot="prepend">楼层号：</span>
                            </Input>
                            </Col>
                        </Row>
                        <Button @click="scaleAll('add')" id="addImg" type="primary">放大图片</Button>
                        <Button @click="scaleAll('reduce')" id="reduceImg" type="primary">缩小图片</Button>
                        <Slider v-model="value8" :min=4 :max=40 :step=1 :tip-format="formatTip" @on-input="consoleInput"></Slider>
                        </br>
                        <Button v-if="!continueDrawing" @click="start()" id="startDraw" :type="Drawing?'info':'success'" :disabled="Drawing">{{ Drawing? '绘制中':'开始绘制'}}</Button>
                        <Button v-if="continueDrawing" @click="Drawing=true;continueDrawing=false" id="continueDrawing">继续绘制</Button>
                        <Button @click="stop()" :disabled="!Drawing && !choosed" id="stopDraw" type="success">完成绘制</Button>
                        <Button @click="revoke()" :disabled="showRevoke" id="revokeDraw" type="warning">撤回</Button>
                        <Button @click="rename()" :disabled="showRevoke" id="renameDraw" type="warning">重命名</Button>
                        </br>
                        </br>
                        <Button @click="deletePolygon()" :disabled="!choosed" type="error">删除此多边形</Button>
                        </br>
                        </br>
                        <Button @click="start(true)" type="primary">绘制最外围</Button>
                        </br>
                        </br>
                        <Button @click="showResult()" type="primary">生成结果</Button>
                        <Button v-clipboard="ResultStr" type="primary" @success="handleSuccess">复制结果</Button>


                        <!-- <p>{{ imgUrl }}</p> -->
                        </br>
                        </br>

                        <Button @click="showTable = !showTable">{{ showTable ? '隐藏表格': '显示表格'}}</Button>
                        <Button @click="showResultStr = !showResultStr">{{ showResultStr ? '隐藏结果文档': '显示结果文档'}}</Button>
                    </Row>
                </transition>

                <Row class="transformConsole">
                    <Button type="text" icon="arrow-shrink" @click="showConsole=!showConsole" size="large"></Button>
                </Row>
            </div>

            <!-- 点的集合 -->
            <div id="pointsContent" :style="{ transform: scaleStyle ,zIndex:Drawing? zIndexTop:zIndexBottom }" :class="{ 'crosshair' : Drawing }"
                @click="getClickPos">
                <points ref="points" :AllPoints="AllPoints" :Drawing="Drawing"></points>
            </div>

            <!-- 图形 -->
            <map-content ref="mapcontent" :scale="ScaleVariable" :Polygons="AllPolygons" :index="CurrentIndex" :Drawing="Drawing" @setDarwing="editing"
                @resetStart="stop"></map-content>
        </div>

        <div id="sectionStatic" v-show="showTable || showResultStr">
            <!-- 表格显示 -->
            <transition name="fade">
                <div id="tableContent" v-show="showTable">
                    <h1>表格</h1>
                    <table-content :datas="AllDatas" @deleteStore="deletePolygon"></table-content>
                </div>
            </transition>
            <!-- 选中之后微调点的位置 -->
            <!-- <div id="movePoint">
            <move-point></move-point>
                </div> -->

            <!-- 显示结果 -->
            <transition name="fade">
                <div id="textarea" v-show="showResultStr">
                    <h1>结果</h1>
                    <Input v-model="ResultStr" type="textarea" :rows="4" placeholder="no result..."></Input>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import points from "../component/points"
    import MapContent from "../component/map"
    import tableContent from "../component/table"
    import movePoint from "../component/move"
    import Util from '../libs/util'
    export default {
        components: {
            points,
            MapContent,
            tableContent,
            movePoint
        },
        data() {
            return {
                /**
                  * 参数说明
                  * @param { ScaleVariable }           缩放值           控制图片放大缩小
                  * @param { Drawing }                 绘制状态         绘制的状态
                  * @param { zIndexTop }               高层级           高层级，用于触发点击事件
                  * @param { zIndexBottom }            低层级           低层级，用于触发点击事件
                  * @param { AllPoints }               所有点           所有点的集合（需要有初始值）
                  * @param { CurrentPoints }           当前点集合       当前的多边形点的集合 
                  * @param { CurrentIndex }            索引            当前多边形的索引
                  * @param { Polygons }                多边形点数据     当前多边形点的数据
                  * @param { AllPolygons }             所有多边形       所有多边形数据，最终需要的数据
                  * @param { DoorNumCopy }             门牌号           编辑的门牌号，如果取消重置
                  * @param { DoorNum }                 门牌号           当前绘制的多边形的门牌号
                  * @param { CurrentPointIndex }       点的索引         当前绘制的多边形点的索引
                  * @param { RenameDoorNum }           重命名的门牌号   重命名之后的门牌号码         
                  * @param { RenameNumCopy }           重命名的门牌号   编辑的重命名门牌号 ,备用        
                  * @param { continueDrawing }         继续绘制标识     是否点击了多边形进行其他操作        
                  * @param { AllDatas }                点和多边形       所有点和多边形的数组        
                  * @param { ResultStr }               结果字符串       最后生成的结果的字符串        
                  * @param { showTable }               显示表格         是否显示表格        
                  * @param { showResultStr }           显示结果文档     是否显示结果文档        
                  * @param { storeName }               商场名          当前编辑的商场名       
                  * @param { floorNum }                楼层数          当前编辑的商场楼层号 
                  */
                ScaleVariable: 1,
                Drawing: false,
                zIndexTop: 102,
                zIndexBottom: 101,
                AllPoints: {},
                CurrentPoints: [],
                CurrentIndex: 0,
                Polygons: [],
                AllPolygons: {},
                DoorNum: -1,
                DoorNumCopy: -1,
                CurrentPointIndex: 0,
                RenameDoorNum: -1,
                RenameNumCopy: -1,
                continueDrawing: false,
                AllDatas: [],
                ResultStr: "",
                showTable: false,
                showResultStr: false,
                value8: 10,
                showConsole: true,
                storeName: '',
                floorNum: ''
            }
        },
        created: function () {
        },
        computed: {
            scaleStyle: function () {
                return `scale(${this.ScaleVariable})`
            },
            // 新建多边形或者编辑多边形
            showRevoke: function () {
                return !(this.$store.state.choosed || (this.Drawing && this.DoorNum !== -1))
            },
            choosed: function () {
                return this.$store.state.choosed
            },
            imgUrl: function () {
                return this.$route.query.url ? this.$route.query.url : '1111'
            }
        },
        methods: {
            // 缩放功能
            scaleAll(type) {
                let that = this
                if (type == "add" && that.ScaleVariable > 4) {
                    this.$Message.warning("还放大,你怕是瞎了,换个人吧!")
                    return
                }

                if (type == "reduce" && that.ScaleVariable < 0.4) {
                    this.$Message.warning("还缩,你眼睛是多好,镜片是放大镜吧!")
                    return
                }

                switch (type) {
                    case "add":
                        that.ScaleVariable += 0.2
                        break
                    case "reduce":
                        that.ScaleVariable -= 0.2
                        break
                    default:
                        alert("缩放事件出错。请刷新页面重试")
                        break
                }
            },

            // 获取鼠标点击位置
            getClickPos(e) {
                // 没有点击开始绘制之前直接返回
                if (!this.Drawing) return
                const { offsetX, offsetY } = e
                // 因为层级关系会导致点击到同一个点而捕捉不到正确的位置，直接跳过并且提示
                if (offsetX == 0 && offsetY == 0) {
                    this.$Message.danger("2个点重合了，请重描")
                }
                // this.Polygons.push(offsetX, offsetY)

                this.$set(this.Polygons, this.CurrentPointIndex, offsetX)
                this.$set(this.Polygons, this.CurrentPointIndex + 1, offsetY)
                this.mouseClick({ offsetX, offsetY })
                this.CurrentPointIndex += 2
            },

            // 显示点的信息并且保存
            mouseClick(pos) {
                let points = [pos.offsetX, pos.offsetY]
                this.CurrentPoints.push(points)
                // 所有点的对象
                this.$set(this.AllPoints, this.DoorNum, this.CurrentPoints)
                // 所有多边形点的对象
                this.$set(this.AllPolygons, this.DoorNum, this.Polygons)
                // 将对象保存到store中
                this.$store.commit('set_AllPolygons', this.AllPolygons)
                this.$store.commit('set_AllPoints', this.AllPoints)
                // 触发 map 子界面的属性更新
                this.$refs.mapcontent.pushing(this.DoorNum, this.Polygons)
            },

            // 开始绘制
            start(falg = false) {
                let that = this
                if (falg) {
                    that.DoorNum = 'container'
                    that.$store.commit('set_choosedDoorId', that.DoorNum)
                    that.Drawing = true
                    that.$store.commit('set_choosed', true)
                    return
                }
                this.$Modal.confirm({
                    onCancel: () => {
                        that.$Message.warning("取消绘制！")
                        return
                    },
                    onOk: () => {
                        if (that.DoorNum === "" || that.DoorNum === -1) {
                            that.$Message.warning("不输入门牌号你是想咋样？")
                            return
                        }
                        if (Util.IdExist(that.DoorNum, that.$store.state.AllPolygons)) {
                            that.$Message.warning('已经存在此id,如果必须要一样的话，请在id前加下划线并且在最后保存的时候备注，谢谢！')
                            return
                        }
                        that.Drawing = true
                        that.$store.commit('set_choosed', true)
                    },
                    title: "请输入门牌号：",
                    render: h => {
                        return h("Input", {
                            props: {
                                value: "",
                                autofocus: true,
                                placeholder: "请输入门牌号...",
                                maxlength: 15
                            },
                            on: {
                                input: val => {
                                    that.DoorNum = val.replace(/\s+/g, "")
                                    that.$store.commit('set_choosedDoorId', that.DoorNum)
                                }
                            }
                        })
                    }
                })
            },

            // 停止绘制
            stop() {
                // 保存数组形式的数据，格式化。以后会将所有的数据统一这种格式，容易遍历和查找替换等。
                let _obj = new Object()
                if (this.DoorNum > 0) {
                    _obj.doorNum = this.DoorNum
                    _obj.points = this.CurrentPoints
                    _obj.polygons = this.Polygons
                    this.AllDatas.splice(this.CurrentIndex, 1)
                    this.AllDatas.push(_obj)
                    this.$store.commit('set_tableDatas', this.AllDatas)
                }
                this.endDrawing()
            },

            // 删除
            deletePolygon(doorNum = '') {
                let door = this.DoorNum > 0 ? this.DoorNum : doorNum

                let { AllPolygons, AllPoints, AllDatas } = this.$store.state
                for (let i in this.AllDatas) {
                    if (this.AllDatas[i].doorNum == door) {
                        this.AllDatas.splice(i, 1)
                        break
                    }
                }
                this.$delete(this.AllPolygons, door)
                this.$delete(this.AllPoints, door)

                this.$refs.mapcontent.deletePoly(door)
                this.$store.commit('set_tableDatas', this.AllDatas)
                this.$store.commit('set_AllPolygons', this.AllPolygons)
                this.$store.commit('set_AllPoints', this.AllPoints)

                this.endDrawing()
            },

            // 点击完成绘制之后的操作
            endDrawing() {
                this.CurrentIndex += 1
                this.CurrentPoints = []
                this.Polygons = []
                this.DoorNum = -1
                this.CurrentPointIndex = 0
                this.Drawing = false
                this.continueDrawing = false
                this.$store.commit('set_choosed', false)
                this.$store.commit('set_choosedDoorId', -1)
            },

            // 撤回
            revoke() {
                let { choosedDoorId, choosed } = this.$store.state
                if (this.CurrentPointIndex === 0) {
                    this.$Notice.error({
                        title: '已经撤回完了还撤回！',
                        desc: '如果要删除请通过表格功能按钮删除！'
                    })
                    return
                }
                if (choosedDoorId !== -1 && choosed) {
                    let _points = this.CurrentPoints
                    let _polygons = this.Polygons
                    _points.splice(_points.length - 1, 1)
                    _polygons.splice(_polygons.length - 2, 2)
                    this.CurrentPointIndex -= 2
                    //设置值，所有的动态绑定已经在子界面中触发
                    this.$set(this.AllPoints, this.DoorNum, this.CurrentPoints)
                    this.$set(this.AllPolygons, this.DoorNum, this.Polygons)
                    this.$refs.mapcontent.pushing(this.DoorNum, this.Polygons)
                }
            },

            // 重命名
            rename() {
                let that = this
                that.RenameNumCopy = -1
                if (that.DoorNum == 'container') {
                    this.$Notice.error({
                        title: '最外层名称不允许修改！'
                    })
                    return
                }
                this.$Modal.confirm({
                    onCancel: () => {
                        that.$Message.warning("取消重命名！")
                        that.stop()
                        return
                    },
                    onOk: () => {
                        if (that.RenameNumCopy === -1 || that.RenameNumCopy === "") {
                            that.$Message.warning("不输入门牌号你是想咋样？")
                            return
                        }
                        if (Util.IdExist(that.RenameNumCopy, that.$store.state.AllPolygons)) {
                            that.$Message.warning('已经存在此id,如果必须要一样的话，请在id前加下划线并且在最后保存的时候备注，谢谢！')
                            return
                        }
                        this.renameWork()

                    },
                    title: `当前门牌号为:${that.DoorNum},请输入需要更换的门牌号,取消则不修改：`,
                    render: h => {
                        return h("Input", {
                            props: {
                                value: "",
                                autofocus: true,
                                placeholder: "请输入门牌号...",
                                maxlength: 15
                            },
                            on: {
                                input: val => {
                                    that.RenameNumCopy = val.replace(/\s+/g, "")
                                }
                            }
                        })
                    }
                })
            },

            // 最终验证完成之后进行重命名操作
            renameWork() {
                this.RenameDoorNum = this.RenameNumCopy
                let _id = this.$store.state.choosedDoorId
                // 修改当前门牌号
                this.DoorNum = this.RenameDoorNum
                // 删除之前的数据
                delete this.AllPoints[_id]
                delete this.AllPolygons[_id]

                this.$store.commit('set_choosedDoorId', this.DoorNum)
                this.$set(this.AllPoints, this.DoorNum, this.CurrentPoints)
                this.$set(this.AllPolygons, this.DoorNum, this.Polygons)

                this.$refs.mapcontent.pushing(this.DoorNum, this.Polygons)
            },

            // 选中编辑
            editing() {
                // 从store 中获取当前点和对象的数据
                let { choosedDoorId, choosed, CurrentIndex } = this.$store.state
                let _AllPolygons = this.$store.state.AllPolygons
                let _allPoints = this.$store.state.AllPoints
                this.Polygons = _AllPolygons[choosedDoorId]
                this.CurrentPoints = _allPoints[choosedDoorId]
                this.DoorNum = choosedDoorId
                this.CurrentPointIndex = _AllPolygons[choosedDoorId].length
                this.CurrentIndex = CurrentIndex

                this.continueDrawing = true
            },

            // 生成结果 目前生成csv文件
            showResult() {

                if (this.storeName === '' || this.floorNum === '') {
                    this.$Notice.error({
                        title: '商场名和楼层号不能为空！',
                        desc: ''
                    })
                    return
                }

                let res = this.AllPolygons
                let storeFloor = `${this.storeName}_${this.floorNum}`
                let result = `${storeFloor}:{\n`

                let str = ``
                for (let key in res) {
                    str += `"${key}":[${res[key]}],\n`
                }

                str = str.substring(0, str.length - 2)

                result += str
                result += '\n}'

                this.ResultStr = result

                this.showResultStr = true
                this.showTable = true
            },

            formatTip(value) {
                return value / 10
            },
            consoleInput(value) {
                this.ScaleVariable = value / 10
            },
            handleSuccess(e) {
                if (e.text !== '') {
                    this.$Message.info('复制成功！')
                }
            }

        }
    }
</script>