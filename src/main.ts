import "@/assets/icons/iconfont/iconfont.js";
import RenDeptTree from "@/components/ren-dept-tree";
import RenProcessDetail from "@/components/ren-process-detail";
import RenProcessRunning from "@/components/ren-process-running";
import RenRadioGroup from "@/components/ren-radio-group";
import RenRegionTree from "@/components/ren-region-tree";
import RenSelect from "@/components/ren-select";
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/display.css";
import "element-plus/theme-chalk/index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
import App from "./App.vue";
import { initI18n } from "./i18n";
import router from "./router";
import * as ElementPlusIcons from "@element-plus/icons-vue";
import VFormRender from "vform3-builds/dist/render.umd.js";
import "vform3-builds/dist/render.style.css";
import axios from "axios";
import "virtual:svg-icons-register";

VXETable.setup({
  zIndex: 3000,
  select: {
    transfer: true
  }
});

const app = createApp(App);
Object.keys(ElementPlusIcons).forEach((iconName) => {
  app.component(iconName, ElementPlusIcons[iconName as keyof typeof ElementPlusIcons]);
});

app
  .use(createPinia())
  .use(router)
  .use(RenRadioGroup)
  .use(RenSelect)
  .use(RenDeptTree)
  .use(RenRegionTree)
  .use(RenProcessRunning)
  .use(RenProcessDetail)
  .use(ElementPlus, { size: "default" })
  .use(VFormRender)
  .use(VXETable)
  .use(initI18n)
  .mount("#app");

window.axios = axios;
