<template>
  <div class="mod__model">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.name" :placeholder="$t('model.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.modelKey" :placeholder="$t('model.key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addModel()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="ID" header-align="center" align="center" width="280"></el-table-column>
      <el-table-column prop="name" :label="$t('model.name')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="modelKey" :label="$t('model.key')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="version" :label="$t('model.version')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag size="small">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created" :label="$t('model.createTime')" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column prop="lastUpdated" :label="$t('model.lastUpdateTime')" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="180">
        <template v-slot="scope">
          <a :href="getModelerURL(scope.row.id)" target="_blank" class="el-button el-button--text">{{ $t("model.design") }}</a>
          <el-button type="primary" link @click="deployHandle(scope.row.id)">{{ $t("model.deploy") }}</el-button>
          <a :href="getExportURL(scope.row.id)" target="_blank" class="el-button el-button--text">{{ $t("export") }}</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, toRefs } from "vue";
import app from "@/constants/app";
import baseService from "@/service/baseService";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
const { t } = useI18n();

const view = reactive({
  getDataListURL: "/flow/model/page",
  getDataListIsPage: true,
  dataForm: {
    name: "",
    modelKey: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const addModel = () => {
  window.open(`${app.api}/flow/modeler/index.html`);
};

// 获取在线设计url地址
const getModelerURL = (id: string) => {
  return `${app.api}/flow/modeler/index.html#/editor/${id}`;
};

// 获取导出url地址
const getExportURL = (id: string) => {
  return `${app.api}/flow/app/rest/models/${id}//bpmn20`;
};

// 部署
const deployHandle = (id: string) => {
  ElMessageBox.confirm(t("prompt.info", { handle: t("model.deploy") }), t("prompt.title"), {
    confirmButtonText: t("confirm"),
    cancelButtonText: t("cancel"),
    type: "warning"
  })
    .then(() => {
      baseService.post(`/flow/model/deploy/${id}`).then((res) => {
        ElMessage.success({
          message: t("prompt.success"),
          duration: 500,
          onClose: () => {
            state.getDataList();
          }
        });
      });
    })
    .catch(() => {
      //
    });
};
</script>
