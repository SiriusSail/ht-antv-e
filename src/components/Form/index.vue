<template>
  <el-form ref="eleForm" class="myForm" :model="form" v-bind="$attrs">
    <el-row :gutter="10">
      <el-col v-for="item in list" :key="item.name" v-bind="item.col">
        <el-form-item
          :label="item.label"
          :prop="item.name"
          :rules="item.rules"
          :class="{ readonly: item.readonly || readonly }"
          :label-width="item.labelWidth"
        >
          <!-- 插槽 -->
          <slot
            v-if="item.type == 'slot'"
            :data="item"
            :name="item.name"
          ></slot>
          <!-- 单选框 -->
          <el-radio-group
            v-else-if="item.type === 'radioGroup'"
            v-model="form[item.name]"
          >
            <el-radio
              v-for="option in item.select"
              :key="option.value"
              :label="option.value"
              >{{ option.label }}</el-radio
            >
          </el-radio-group>
          <el-checkbox
            v-else-if="item.type === 'checkbox'"
            v-model="form[item.name]"
            v-bind="item"
          >
          </el-checkbox>

          <!-- 多选框 -->
          <el-checkbox-group
            v-else-if="item.type === 'checkboxGroup'"
            v-model="form[item.name]"
          >
            <el-checkbox
              v-for="option in item.select"
              :key="option.value"
              :label="option.value"
              >{{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 选择器 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.name]"
            filterable
            :placeholder="item.placeholder || '请选择'"
            v-bind="item"
          >
            <el-option
              v-for="option in item.select"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :value-key="option.value"
            >
            </el-option>
          </el-select>

          <!-- 时间选择 -->
          <el-time-select
            v-else-if="item.type === 'timeSelect'"
            v-model="form[item.name]"
            :placeholder="item.placeholder ? item.placeholder : '选择时间'"
            start="08:30"
            step="00:15"
            end="18:30"
            v-bind="item"
          >
          </el-time-select>
          <el-time-picker
            v-else-if="item.type === 'timePicker'"
            v-model="form[item.name]"
            v-bind="item"
          ></el-time-picker>
          <el-cascader
            v-model="form[item.name]"
            v-else-if="item.type === 'cascader'"
            :options="item.options"
            :props="item.props"
            clearable
            :placeholder="item.placeholder"
          />
          <!-- 日期选择 -->
          <DatePicker
            v-else-if="item.type === 'date'"
            v-model="form[item.name]"
            v-bind="item"
          ></DatePicker>

          <el-input
            v-else
            :readonly="readonly"
            v-model="form[item.name]"
            :type="item.type"
            @keypress.native.enter="item.handle ? item.handle(item) : ''"
            :placeholder="item.placeholder || '请输入内容'"
            v-bind="item"
          ></el-input>
          <slot v-if="item.rightSlot" :name="item.rightSlot"></slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch, PropType } from "vue";
import { ElForm } from "element-plus";
import { Callback } from "element-plus/lib/components/form/src/form.vue";
import DatePicker from "@/components/datePicker/index.vue";

// eslint-disable-next-line no-shadow
export interface Col {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
  xs?: number | { span: number; offset?: number };
  sm?: number | { span: number; offset?: number };
  xl?: number | { span: number; offset?: number };
  md?: number | { span: number; offset?: number };
  lg?: number | { span: number; offset?: number };
}

// input类型
export interface InputItem {
  type: "text" | "tel" | "number" | "textarea" | "slot";
  label?: string;
  labelWidth?: string | number;
  disabled?: boolean; // 是否禁用
  /** 提示文字 */
  placeholder?: string;
  maxlength?: string;
  minlength?: string;
  showWordLimit?: string;
  clearable?: string;
  showPassword?: string;
  size?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  rows?: string;
  autosize?: string;
  autocomplete?: string;
  name: string;
  readonly?: boolean;
  max?: string;
  min?: string;
  autofocus?: string;
  resize?: string;
  rules?: any;
  rightSlot?: string;
  col?: Col;
  handle?: any;
}

// 单选框组类型
export interface RadioGroupItem {
  name: string;
  label?: string;
  labelWidth?: string | number;
  type: "radioGroup";
  rules?: any;
  readonly?: boolean;
  span?: number;
  offset?: number;
  rightSlot?: string;
  select: {
    value: string | number;
    label: string;
  }[];
  col?: Col;
}
// 多选框 用于类似开关效果
export interface CheckboxItem {
  name: string;
  label?: string;
  labelWidth?: string | number;
  type: "checkbox";
  readonly?: boolean;
  rules?: any;
  rightSlot?: string;
  trueLabel?: string | number;
  falseLabel?: string | number;
  col?: Col;
}
// 多选框组类型
export interface CheckboxGroupItem {
  name: string;
  label?: string;
  labelWidth?: string | number;
  type: "checkboxGroup";
  readonly?: boolean;
  rules?: any;
  rightSlot?: string;
  select: {
    value: string | number;
    label: string;
  }[];
  col?: Col;
}
// 选择器类型
export interface SelectItem {
  type: "select";
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  labelWidth?: string | number;
  rules?: any;
  rightSlot?: string;
  multiple?: boolean; // 是否多选
  readonly?: boolean;
  clearable?: boolean;
  collapseTags?: boolean;
  multipleLimit?: number | string;
  col?: Col;
  select: {
    value: string | number;
    label: string;
  }[];
}

//任意时间选择
export interface TimePickerItem {
  type: "timePicker";
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  labelWidth?: string | number;
  rules?: any;
  rightSlot?: string;
  col?: Col;
  readonly?: boolean;
  clearable?: boolean;
  size?: "medium" | "small" | "min";
  format?: string;
  disabledSeconds?: (selectedHour: string, selectedMinute: string) => {};
}

// 时间选择
export interface TimeSelectItem {
  type: "timeSelect";
  start?: string;
  step?: string;
  end?: string;
  minTime?: string;
  maxTime?: string;
  readonly?: boolean;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  labelWidth?: string | number;
  rules?: any;
  rightSlot?: string;
  col?: Col;
}
export interface CascaderItem {
  type: "cascader";
  options?: any[];
  props?: any;
  readonly?: boolean;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  labelWidth?: string | number;
  rules?: any;
  rightSlot?: string;
  col?: Col;
}
export default defineComponent({
  components: {
    DatePicker,
  },
  props: {
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    form: {
      type: Object,
      required: false,
      default: () => {},
    },
    list: {
      type: Array as PropType<
        (
          | InputItem
          | RadioGroupItem
          | SelectItem
          | CheckboxGroupItem
          | CheckboxItem
          | TimeSelectItem
          | TimePickerItem
          | CascaderItem
        )[]
      >,
      required: false,
      default: (): Array<InputItem> => [],
    },
  },
  setup(props) {
    const { list, form } = toRefs(props);
    const eleForm = ref<InstanceType<typeof ElForm>>();
    // const form = form;

    /** 验证表单 */
    const validate = (callback?: Callback | undefined) => {
      eleForm.value?.validate(callback);
    };

    /** 清除表单 */
    const resetForm = (data?: any) => {
      eleForm.value?.resetFields();
      if (data) form.value = data;
    };

    return {
      validate,
      resetForm,
      list,
      eleForm,
      form,
    };
  },
});
</script>
<style scoped lang="scss">
.myForm {
  .readonly {
    :deep(.el-form-item__content) {
      pointer-events: none;
    }
  }

  :deep(.el-form-item__content) {
    display: flex;
    .el-select {
      width: 100%;
    }

    .el-cascader {
      width: 100%;
    }
  }

  :deep(.el-input__inner) {
    padding-right: 0 !important;
  }
}
</style>
