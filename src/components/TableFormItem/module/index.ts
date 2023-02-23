
const files = import.meta.globEager("./*.tsx")
const components: any = {};

Object.keys(files).forEach((key) => {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
    components[key.replace(/(\.\/|\.tsx)/g, '')] = files[key]?.default
  }
});

export default components;