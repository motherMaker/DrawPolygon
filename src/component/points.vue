<template>
  <div>
    <div v-for="(item,index) in AllPoints" :data-index="index">
      <div v-for="(citem,cindex) in item" :data-cindex="cindex" class="point" v-bind:style="{ left: citem[0]+'px', top: citem[1]+'px' }">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'points',
    props: {
      AllPoints: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
      }
    },
    computed: {
      pointStyle: function () {
        return {
          transform: `scale(${1 / this.scale})`,
        }
      }
    },
    methods: {
    }
  }
</script>