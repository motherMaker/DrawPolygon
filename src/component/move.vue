<template>
  <div class="move">
    <Row type="flex" justify="center" style="margin-bottom:3px;">
      <Col span="24" class="textCenter">
      <Button type="primary" icon="arrow-up-a" id="up"></Button>
      </Col>
    </Row>
    <Row type="flex" justify="center">
      <Col span="24" class="textCenter">
      <Button type="primary" icon="arrow-left-a" id="left"></Button>
      <Button type="primary" icon="arrow-down-a" id="down"></Button>
      <Button type="primary" icon="arrow-right-a" id="right"></Button>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {

  }
</script>


</div>
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    conputed: {

    },
    methods: {

    }
  }
</script>

<style scoped>
  .textCenter {
    text-align: center;
  }

  .move {
    width: 100%;
  }
</style>