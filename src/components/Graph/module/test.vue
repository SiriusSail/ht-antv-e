<template>
  <div>
    <div style="text-align: center">
      <Testchild>
        hahahahha
        <template #name>33333</template>
      </Testchild>
    </div>
  </div>
</template>

<script lang="ts">
import { Node } from "@antv/x6";
import {
  onMounted,
  reactive,
  toRefs,
  defineComponent,
  inject,
  computed,
} from "vue";
import Testchild from "./testchild.vue";

export default defineComponent({
  name: "TextComponen",
  components: {
    Testchild,
  },
  setup(props, { slots }) {
    return {};
  },
});
</script>
