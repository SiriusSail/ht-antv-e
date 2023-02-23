<template>
  <el-date-picker v-model="modelValue"
                  :type="type"
                  :value-format="valFormat"
                  v-bind="$attrs"></el-date-picker>
</template>
 
<script>
  import { defineComponent, watch, toRefs } from 'vue';
  import dayjs from 'dayjs';
  export default defineComponent({
    props: {
      type: {
        type: String,
        default: 'date'
      },
      modelValue: {
        type: [String, Object, Array],
        default: ''
      },
      valFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      }
    },
    setup (props, { emit }) {
      const { valFormat, modelValue, type } = toRefs(props);
      watch(() => modelValue.value, (val) => {
        let formatVal = null
        if (Array.isArray(val)) {
          formatVal = [dayjs(val[0]).format(valFormat.value), dayjs(val[1]).format(valFormat.value)];
        } else {
          formatVal = dayjs(val).format(valFormat.value);
        }
        emit('update:modelValue', formatVal);
      });
      return {
        modelValue,
        valFormat,
        type
      };
    }
  });
</script>