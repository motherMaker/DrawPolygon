<template>
    <div class="index">
        <img src="../resource/5f.jpg" alt="测试图" id="img" :style="{ transform: ScaleVariableStyle }">
        <!-- 控制台 -->
        <div id="floatConsole">
            <Row class="scale">
                <Button @click="scaleAll('add')" id="addImg">放大图片</Button>
                <Button @click="scaleAll('reduce')" id="reduceImg">缩小图片</Button>
                <Button @click="start()" id="startDraw" :disabled="Drawing">{{ Drawing? '绘制中':'开始绘制'}}</Button>
                <Button @click="stop()" id="stopDraw">完成绘制</Button>
                <Button @click="revoke()" id="revokeDraw">撤回</Button>
                <Button @click="rename()" id="renameDraw">重命名</Button>
            </Row>
        </div>

        <!-- 点的集合 -->
        <div id="pointsContent" :style="{ transform: scaleStyle ,zIndex:zIndexTop }" :class="{ 'crosshair' : Drawing }" @click="getClickPos">
            <points ref="points" :AllPoints="AllPoints"></points>
        </div>
        <!-- 图形 -->
        <map-content :scale="ScaleVariable" :Polygons="Polygons"></map-content>
    </div>
</template>
<script>
    import points from '../component/points'
    import MapContent from '../component/map'

    export default {
        components: {
            points,
            MapContent
        },
        data() {
            return {
                /**
                 * 参数说明
                * @param { ScaleVariable }           缩放值          控制图片放大缩小
                * @param { ScaleVariableStyle }      缩放样式        通过计算属性赋值
                * @param { Drawing }                 绘制状态        绘制的状态
                * @param { zIndexTop }               高层级          高层级，用于触发点击事件
                * @param { zIndexBottom }            低层级          低层级，用于触发点击事件
                * @param { AllPoints }               所有点          所有点的集合（需要有初始值）
                * @param { CurrentPoints }           当前点集合      当前的多边形点的集合 
                * @param { CurrentIndex }            索引            当前多边形的索引
                * @param { Polygons }                多边形点数据    当前多边形点的数据
                * @param { AllPolygons }             所有多边形      所有多边形数据，最终需要的数据
                * @param { DoorNum }                 门牌号          当前绘制的多边形的门牌号
                */
                ScaleVariable: 1,
                ScaleVariableStyle: 'scale(1)',
                Drawing: false,
                zIndexTop: 102,
                zIndexBottom: 101,
                AllPoints: {
                    0: [[]]
                },
                CurrentPoints: [],
                CurrentIndex: 0,
                Polygons: [],
                AllPolygons: [],
                DoorNum: null
            };
        },
        computed: {
            scaleStyle: function () {
                return `scale(${this.scale})`
            },
        },
        methods: {
            // 缩放功能
            scaleAll(type) {
                let that = this
                if (type == 'add' && that.ScaleVariable > 2) {
                    this.$Message.warning('还放大,你怕是瞎了,换个人吧!')
                    return
                }

                if (type == 'reduce' && that.ScaleVariable < .4) {
                    this.$Message.warning('还缩,你眼睛是多好,镜片是放大镜吧!')
                    return
                }

                switch (type) {
                    case 'add':
                        that.ScaleVariable += 0.2
                        this.ScaleVariableStyle = `scale(${that.ScaleVariable})`
                        break
                    case 'reduce':
                        that.ScaleVariable -= 0.2
                        this.ScaleVariableStyle = `scale(${that.ScaleVariable})`
                        break
                    default:
                        alert("缩放事件出错。请刷新页面重试")
                        break
                }
            },

            // 获取鼠标点击位置
            getClickPos(e) {
                // 没有点击开始绘制之前直接返回
                if (!this.Drawing)
                    return
                const { offsetX, offsetY } = e
                // 因为层级关系会导致点击到同一个点而捕捉不到正确的位置，直接跳过并且提示
                if (offsetX == 0 && offsetY == 0) {
                    this.$Message.danger('2个点重合了，请重描')
                }
                this.Polygons.push(offsetX, offsetY)
                this.mouseClick({ offsetX, offsetY })
                this.drawPolygon()
            },

            mouseClick(pos) {
                let points = [pos.offsetX, pos.offsetY]
                this.CurrentPoints.push(points)
                this.AllPoints[this.CurrentIndex] = this.CurrentPoints
            },

            drawPolygon() {
                console.log(this.AllPoints)
            },

            // 点击完成绘制之后的操作
            /**
             * 索引+1
             * 清空 CurrentPoints
            */
            endDrawing() {
                this.CurrentIndex += 1
                this.AllPolygons.push(this.Polygons)
                this.CurrentPoints = []
                this.Polygons = []
            },

            // 开始绘制
            start() {
                let that = this
                this.$Modal.confirm({
                    onCancel: () => {
                        that.$Message.warning('取消绘制！')
                        return
                    },
                    onOk: () => {
                        if (this.DoorNum === null) {
                            that.$Message.warning('不输入门牌号你是想咋样？')
                            return
                        }
                        that.Drawing = true
                    },
                    title: '请输入门牌号：',
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: that.DoorNum,
                                autofocus: true,
                                placeholder: '请输入门牌号...',
                                maxlength: 15
                            },
                            on: {
                                input: (val) => {
                                    that.DoorNum = val.replace(/\s+/g, "")
                                }
                            },
                        })
                    }
                })
            },

            // 停止绘制
            stop() {
                this.Drawing = false
                this.endDrawing()
            }
        }
    };
</script>
<style scoped>
</style>