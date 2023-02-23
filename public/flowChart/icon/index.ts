const files = import.meta.globEager("./*.svg");
const icons: any = {};

Object.keys(files).forEach((key) => {
  if (Object.prototype.hasOwnProperty.call(files, key)) {
    icons[key.replace(/(\.\/)/g, "")] = files[key].default;
  }
});

export default icons;
