<template>
  <Table border :columns="columns" :data="datas"></Table>
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
            title: 'DoorNumber',
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
            title: 'Action',
            key: 'action',
            width: 150,
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
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除')
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
      }
    }
  }
</script>