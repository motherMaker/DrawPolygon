<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    }
  };
</script>
<style>
  /* 全局属性 */

  * {
    margin: 0;
    padding: 0;
  }

  .crosshair {
    cursor: crosshair;
  }

  #map,
  #pointsContent,
  #img {
    transform-origin: 0 0;
  }

  /* 基本点的样式 */

  .point {
    width: 0;
    height: 0;
    padding: 1px;
    border-radius: 50%;
    background-color: red;
  }

  /* 商场名 */

  .storeName {
    width: 300px;
    margin-bottom: 15px;
  }


  /* 被编辑的图片 */

  #img {
    width: 1920px;
    height: 1116px;
    z-index: 99;
  }

  /* 点的集合和画布 ,大小和图片保持一直，同时伸缩 */

  #pointsContent,
  #map {
    width: 1920px;
    height: 1116px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }

  #pointsContent {
    z-index: 101;
  }

  #pointsContent .point {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }

  /* 画布属性 */

  #map polygon {
    z-index: 102;
    fill: #ffff00;
    stroke: #ff9000;
    fill-opacity: .6
  }

  /* table */

  #tableContent,
    {
    width: 96%;
    margin: 0 auto;
  }

  #movePoint {
    width: 250px;
    position: fixed;
    bottom: 150px;
    right: 20px;
    z-index: 200
  }

  /* 闪烁动画 */

  .loopAnimate {
    animation: mymove 2s ease-in-out;
  }

  @keyframes mymove {
    0% {
      fill: white;
      opacity: 0
    }
    50% {
      fill: #ffff00;
      opacity: 1
    }
    100% {
      fill: white;
      opacity: 0
    }
  }

  /* table */

  #sectionStatic {
    background: #eee;
    width: 100%;
    margin: 0 auto;
    z-index: 300;
    position: fixed;
    bottom: 0;
    padding: 50px;
    left: 0;
  }

  #textarea,
  #tableContent {
    width: 100%;
  }


  /* 控制按钮 */

  #floatConsole {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 200;
  }

  #floatConsole .transformConsole {
    position: absolute;
    cursor: pointer;
    top: -4px;
    left: -7px;
    font-size: 18px;
  }

  /* 控制台效果样式 */

  .colorful-stripe {
    padding: 20px 30px;
    position: absolute;
    color: #fff;
    border-radius: .5em;
    background: linear-gradient(limegreen, transparent), linear-gradient(90deg, skyblue, transparent), linear-gradient(-90deg, coral, transparent);
    background-blend-mode: screen;
  }
</style>