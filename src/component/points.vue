<template>
  <div>
    <div v-for="(item,index) in AllPoints" :data-index="index" v-show="Drawing">
      <div v-for="(citem,index) in item" :data-cindex="index" class="point" v-bind:style="{ left: citem[0]-2+'px', top: citem[1]-2+'px' }">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "points",
    props: {
      AllPoints: {
        type: Object,
        default: {}
      },
      Drawing: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    computed: {
      pointStyle: function () {
        return {
          transform: `scale(${1 / this.scale})`
        }
      },

      polygonChoosed() {
        return this.$store.state.choosed
      }
    },
    methods: {}
  }
</script>