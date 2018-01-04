<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="map" :style="{transform: scaleStyle,zIndex:Drawing? zIndexBottom: zIndexTop}"
      @click.self="removeChooseState">
      <polygon v-for="(item ,index) in cpolygon" :points="item" :data-index="index" :data-doorid="DoorNumArr[index]" :key="index"
        @click.self="ploygonEvent" :class="DoorNumArr[index]==highLightDoorNum?'loopAnimate':''"></polygon>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'map',
    props: {
      scale: {
        type: Number,
        default: 1
      },
      Polygons: {
        type: Object,
        default: {}
      },
      index: {
        default: 0
      },
      Drawing: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        CurrentDoorNum: 0,
        zIndexTop: 102,
        zIndexBottom: 101,
        DoorNumArr: [],
        PointsArr: [],
      }
    },
    computed: {
      scaleStyle: function () {
        return `scale(${this.scale})`
      },
      highLightDoorNum: function () {
        return this.$store.state.highLightDoorNum
      },
      // 通过计算属性触发值改变
      cpolygon: function () {
        return this.PointsArr.map(function (i) {
          let _arr = []
          _arr.push(i)
          return _arr
        })
      }
    },
    methods: {
      ploygonEvent(e) {
        let { index, doorid } = e.target.dataset
        this.$store.commit('set_choosed', true)
        this.$store.commit('set_choosedDoorId', doorid)
        this.$store.commit('set_CurrentIndex', index)
        // 触发父组件编辑事件
        this.$emit('setDarwing')
      },
      pushing(doorNum, points) {
        this.$set(this.DoorNumArr, this.index, doorNum)
        this.$set(this.PointsArr, this.index, points)
      },

      deletePoly(door) {
        for (let i in this.DoorNumArr) {
          if (this.DoorNumArr[i] == door) {
            this.$delete(this.DoorNumArr, i)
            this.$delete(this.PointsArr, i)
            break
          }
        }
      },
      removeChooseState() {
        this.$store.commit('set_choosed', false)
        this.$store.commit('set_choosedDoorId', -1)
        this.$emit('resetStart')
      }
    }
  }
</script>