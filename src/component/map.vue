<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="map" :style="{transform: scaleStyle,zIndex:Drawing? zIndexBottom: zIndexTop}">
      <polygon v-for="(item ,index) in cpolygon" :points="item" :data-index="index" :data-doorid="DoorNumArr[index]" :key="index"
        @click.self="ploygonEvent"></polygon>
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
        type: Number,
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
        let { index, doorId } = e.target.dataset
        this.$store.commit('setValue', 'choosedDoorId')

        this.$store.commit('toggleChoosed', true)

      },
      pushing(doorNum, points) {
        this.$set(this.DoorNumArr, this.index, doorNum)
        this.$set(this.PointsArr, this.index, points)
      }
    }
  }
</script>