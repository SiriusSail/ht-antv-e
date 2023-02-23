import { Cell } from "@antv/x6";
import TabelFrom from "./index.d";

const files = import.meta.globEager("./*.ts");
const tsxFiles = import.meta.globEager("./*.tsx");
const functions: any = {};
const middwarlFunctions: any = {};

Object.keys(files).forEach((key) => {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
    functions[key.replace(/(\.\/|\.ts)/g, "")] = files[key]?.default;
    middwarlFunctions[key.replace(/(\.\/|\.ts)/g, "")] =
      files[key]?.FormOptionsMiddwarl;
  }
});

Object.keys(tsxFiles).forEach((key) => {
  if (Object.prototype.hasOwnProperty.call(tsxFiles, key)) {
    functions[key.replace(/(\.\/|\.tsx)/g, "")] = tsxFiles[key]?.default;
    middwarlFunctions[key.replace(/(\.\/|\.tsx)/g, "")] =
      tsxFiles[key]?.FormOptionsMiddwarl;
  }
});

export default async (node: Cell<Cell.Properties>) => {
  console.log(node.attrs.moduleData.type);
  await functions[node.attrs.moduleData.type as string]?.(node);
  return node;
};

export const getGraphFrom = (node: Cell<Cell.Properties>) => {
  const GraphForm = functions[node.attrs.moduleData?.type as string] as any;
  if (!GraphForm) {
    return null;
  }
  const graphForm: TabelFrom = new GraphForm(node);
  return graphForm;
};
