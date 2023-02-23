import { Graph } from '@antv/x6'
import { VueShape } from "@antv/x6-vue-shape";
import CustomDrag from './customTextDrag.vue'

export class TextShape extends VueShape {}
TextShape.config({
  width: 150,
  height: 80,
  component: {
    template: `<CustomDrag></CustomDrag>`,
    methods: {},
    components: {
      CustomDrag,
    },
  },
})
Graph.registerNode('text-shape', TextShape, true)

export default { }

