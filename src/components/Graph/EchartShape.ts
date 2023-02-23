import { Graph } from '@antv/x6'
import { VueShape } from "@antv/x6-vue-shape";
import EchatView from './echatView'

export class EchartShape extends VueShape {
  private url = '1';

  init() {
    super.init()
    this.updateSize()
  }

  setup() {
    // this.resister.
    super.setup()
    this.on('node:added', this.updateSize, this)
  }

  updateSize() {
    const position = this.position();
    if (position.x !== 0 || position.y !== 0) {
      this.prop({
        size: {
          width: (this.attrs?.size?.width || 400) as number,
          height: (this.attrs?.size?.height || 300) as number
        }
      })
      this.attr('body/show', true)
      this.attr('image/width', 400)
      this.attr('image/height', 300)
    }
  }
}
EchartShape.config({
  width: 65,
  height: 42,
  component: {
    template: `<EchatView></EchatView>`,
    methods: {},
    components: {
      EchatView,
    },
  },
})
Graph.registerNode('echart-shape', EchartShape, true)

export default {
}

