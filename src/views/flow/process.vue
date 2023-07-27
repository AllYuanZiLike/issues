<template>
  <div class="mod__process">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.processName" :placeholder="$t('process.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.key" :placeholder="$t('process.key')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deployHandle()">{{ $t("process.deployFile") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" :label="$t('process.id')" header-align="center" align="center" width="280"></el-table-column>
      <el-table-column prop="name" :label="$t('process.name')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="key" :label="$t('process.key')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="version" :label="$t('process.version')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag size="small">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="resourceName" :label="$t('process.resourceName')" header-align="center" align="center" :show-overflow-tooltip="true" width="100">
        <template v-slot="scope">
          <a :href="getResourceURL(scope.row.deploymentId, scope.row.resourceName)" target="_blank">{{ scope.row.resourceName }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="diagramResourceName" :label="$t('process.diagramResourceName')" header-align="center" align="center" :show-overflow-tooltip="true" width="100">
        <template v-slot="scope">
          <a :href="getResourceURL(scope.row.deploymentId, scope.row.diagramResourceName)" target="_blank">{{ scope.row.diagramResourceName }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="deploymentTime" :label="$t('process.deploymentTime')" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="scope.row.suspended" type="primary" link @click="activeHandle(scope.row.id)">{{ $t("process.active") }}</el-button>
          <el-button v-else type="primary" link @click="suspendHandle(scope.row.id)">{{ $t("process.suspend") }}</el-button>
          <el-button type="primary" link @click="state.deleteHandle(scope.row.deploymentId)">{{ $t("delete") }}</el-button>
          <el-button type="primary" link @click="convertToModelHandle(scope.row.id)">{{ $t("process.convertToModel") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 部署流程文件 -->
    <deploy ref="deployRef" @refreshDataList="state.getDataList"></deploy>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import Deploy from "./process-deploy.vue";
import qs from "qs";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import baseService from "@/service/baseService";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
const { t } = useI18n();

const deployRef = ref();

const view = reactive({
  getDataListURL: "/flow/process/page",
  getDataListIsPage: true,
  deleteURL: "/flow/process",
  deleteIsBatch: true,
  deleteIsBatchKey: "deploymentId",
  dataForm: {
    processName: "",
    key: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

// 获取流程(xml/image)url地址
const getResourceURL = (id: string, name: string) => {
  const params = qs.stringify({
    access_token: getToken(),
    deploymentId: id,
    resourceName: name
  });
  return `${app.api}/flow/process/resource?${params}`;
};

// 部署流程文件
const deployHandle = () => {
  deployRef.value.init();
};

// 激活
const activeHandle = (id: string) => {
  ElMessageBox.confirm(t("prompt.info", { handle: t("process.active") }), t("prompt.title"), {
    confirmButtonText: t("confirm"),
    cancelButtonText: t("cancel"),
    type: "warning"
  })
    .then(() => {
      baseService.put(`/flow/process/active/${id}`).then((res) => {
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

// 挂起
const suspendHandle = (id: string) => {
  ElMessageBox.confirm(t("prompt.info", { handle: t("process.suspend") }), t("prompt.title"), {
    confirmButtonText: t("confirm"),
    cancelButtonText: t("cancel"),
    type: "warning"
  })
    .then(() => {
      baseService.put(`/flow/process/suspend/${id}`).then((res) => {
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

// 转换为模型
const convertToModelHandle = (id: string) => {
  ElMessageBox.confirm(t("prompt.info", { handle: t("process.convertToModel") }), t("prompt.title"), {
    confirmButtonText: t("confirm"),
    cancelButtonText: t("cancel"),
    type: "warning"
  })
    .then(() => {
      baseService.post(`/flow/process/convertToModel/${id}`).then((res) => {
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
