<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="map" :style="{transform: scaleStyle}">
      <polygon class="polygon0" data-index="0" data-doorid="11" points="799,217,2,2,281,158,315,301"
        onclick="polygnEvent(this)"></polygon>
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
      }
    },
    data() {
      return {

      };
    },
    computed: {
      scaleStyle: function () {
        return `scale(${this.scale})`
      }
    }
  }
</script>
