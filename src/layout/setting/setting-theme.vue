<script lang="ts">
import { EMitt, EThemeColor, EThemeSetting } from "@/constants/enum";
import { IObject } from "@/types/interface";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey, setThemeColor, updateTheme } from "@/utils/theme";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";

/**
 * 主题设置
 */
export default defineComponent({
  name: "SettingTheme",
  props: { value: Object, onChange: Function },
  setup(props) {
    const { t } = useI18n();
    const sidebar = [
      { label: "ui.setting.sidebarThemeDark", value: "dark" },
      { label: "ui.setting.sidebarThemeLight", value: "light" }
    ];
    const header = [
      { label: "ui.setting.topHeaderThemeLight", value: "light" },
      { label: "ui.setting.topHeaderThemeDark", value: "dark" },
      { label: "ui.setting.topHeaderThemePrimary", value: "primary" }
    ];
    const colors = [
      { label: "ui.setting.colorTheme1", value: "#716afc" },
      { label: "ui.setting.colorTheme2", value: "#716afc" },
      { label: "ui.setting.colorTheme3", value: "#716afc" },
      { label: "ui.setting.colorTheme4", value: "#716afc" },
      { label: "ui.setting.colorTheme5", value: "#716afc" },
      { label: "ui.setting.colorTheme6", value: "#716afc" },
      { label: "ui.setting.colorTheme7", value: "#716afc" },
      { label: "ui.setting.colorTheme8", value: "#716afc" },
      { label: "ui.setting.colorTheme9", value: "#716afc" },
      { label: "ui.setting.colorTheme10", value: "#716afc" },
      { label: "ui.setting.colorTheme11", value: "#716afc" },
      { label: "ui.setting.colorTheme12", value: "#716afc" },
      { label: "ui.setting.colorTheme13", value: "#716afc" },
      {
        label: "ui.setting.colorTheme14",
        value: "#716afc"
      }
    ];
    const state = reactive({
      themeClass: {} as IObject<string>,
      active: {
        sidebar: getThemeConfigCacheByKey(EThemeSetting.Sidebar, props.value),
        header: getThemeConfigCacheByKey(EThemeSetting.TopHeader, props.value),
        color: getThemeConfigCacheByKey(EThemeSetting.ThemeColor, props.value)
      } as IObject<string>
    });
    const onSetTheme = (key: EThemeSetting, type: string, value: string) => {
      if (key === EThemeSetting.ThemeColor) {
        setThemeColor(EThemeColor.ThemeColor, value);
        updateTheme(value);
      }
      state.active[type] = value;
      state.themeClass[key] = value;
      props.onChange && props.onChange(key, value);
      emits.emit(EMitt.OnSetTheme, [key, `${key}-${value}`]);
    };
    return { sidebar, state, header, colors, t, EThemeSetting, onSetTheme };
  }
});
</script>
<template>
  <el-space direction="vertical" alignment="flex-start" class="rr-theme">
    <el-space>
      <el-tooltip v-for="x in sidebar" :key="x.value" effect="light" :content="t(x.label)" placement="top">
        <span :class="`card side ${x.value} ${state.active.sidebar === x.value ? 'active' : ''}`" @click="onSetTheme(EThemeSetting.Sidebar, 'sidebar', 'light')"></span>
      </el-tooltip>
    </el-space>
    <el-space>
      <el-tooltip v-for="x in header" :key="x.value" effect="light" :content="t(x.label)" placement="top">
        <span :class="`card header ${x.value} ${state.active.header === x.value ? 'active' : ''}`" @click="onSetTheme(EThemeSetting.TopHeader, 'header', x.value)"></span>
      </el-tooltip>
    </el-space>
    <el-space :size="2" wrap>
      <el-tooltip v-for="x in colors" :key="x.value" effect="dark" :content="t(x.label)" placement="top">
        <span :class="`color ${state.active.color === x.value ? 'active' : ''}`" :style="`background-color: ${x.value}`" @click="onSetTheme(EThemeSetting.ThemeColor, 'color', x.value)"></span>
      </el-tooltip>
    </el-space>
  </el-space>
</template>
