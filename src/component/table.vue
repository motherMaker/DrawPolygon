<template>
  <Table border height="200" :columns="columns" :data="datas"></Table>
</template>
<script>
  export default {
    props: {
      datas: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        columns: [
          {
            title: '门牌号',
            key: 'doorNum',
          },
          {
            title: 'points',
            key: 'points'
          },
          {
            title: 'polygons',
            key: 'polygons'
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params)
                    }
                  }
                }, '高亮显示'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.choosePlace(params)
                    }
                  }
                }, '选店门')
              ]);
            }
          }
        ],
      }
    },
    methods: {
      show(params) {
        this.$store.commit('set_highLightDoorNum', params.row.doorNum)
      },
      remove(params) {
        this.$emit('deleteStore', params.row.doorNum)
      },
      choosePlace(params) {
        
      }
    }
  }
</script>