import { Node, Graph, Shape } from '@antv/x6'
import { getGraphFrom } from "./module";
import GraphForm from "./module/index.d";
import { ports } from './graphInitConfig'

export class CustomText extends Shape.Rect {

  graphForm: GraphForm

  constructor(metadata: any) {
    super({
      ...metadata,
      width: 32,
      height: 50,
      ports,
      markup: [
        {
          tagName: 'rect',
          selector: 'background',
        },
        {
          tagName: 'image',
          selector: 'image',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        ...metadata.attrs,
        background: {
          strokeWidth: 1,
          rx: 5,
          width: 32,
          height: 32,
          stroke: '#CDEAFF',
          fill: '#CDEAFF',
          ...metadata.attrs.background
        },
        image: {
          textAnchor: 'middle',
          width: 32,
          height: 32,
          refX: 0,
          refY: 0,
          ...metadata.attrs.image
        },
        label: {
          refY: 50,
          textAnchor: 'middle',
          fontSize: 12,
          fill: '#AAAAAA',
          textVerticalAnchor: 'bottom',
          ...metadata.attrs.label
        }
      },
    })
    this.graphForm = getGraphFrom(this);
  }

}

export default {
}

