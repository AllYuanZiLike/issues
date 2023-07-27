<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item :label="$t('correction.post')" prop="applyPost">
        <el-input v-model="dataForm.applyPost" :disabled="state.fieldDisabled" :placeholder="$t('correction.post')"></el-input>
      </el-form-item>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item :label="$t('correction.entryDate')" prop="entryDate">
            <el-date-picker v-model="dataForm.entryDate" :disabled="state.fieldDisabled" value-format="YYYY-MM-DD" :placeholder="$t('correction.entryDate')" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('correction.correctionDate')" prop="correctionDate">
            <el-date-picker v-model="dataForm.correctionDate" :disabled="state.fieldDisabled" value-format="YYYY-MM-DD" :placeholder="$t('correction.correctionDate')" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('correction.workContent')" prop="workContent">
        <el-input type="textarea" v-model="dataForm.workContent" :disabled="state.fieldDisabled" :placeholder="$t('correction.workContent')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('correction.achievement')" prop="achievement">
        <el-input type="textarea" v-model="dataForm.achievement" :disabled="state.fieldDisabled" :placeholder="$t('correction.achievement')"></el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="640" v-if="!state.fieldDisabled">
      <el-col :span="4" :offset="1">
        <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("process.createInstance") }}</el-button>
      </el-col>
    </el-row>
    <ren-process-running v-if="state.runningHandleVisible" ref="renProcessRunning"></ren-process-running>
    <ren-process-detail v-if="state.processDetailVisible" ref="renProcessDetail"></ren-process-detail>
  </el-card>
</template>

<script lang="ts" setup>
import baseService from "@/service/baseService";
import { nextTick, onMounted, reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import useView from "@/hooks/useView";
const { t } = useI18n();

const dataFormRef = ref();
const dataForm = reactive({
  id: "",
  applyPost: "",
  entryDate: "",
  correctionDate: "",
  workContent: "",
  achievement: "",
  //必传
  processDefinitionId: ""
});

const view = reactive({
  createdIsNeed: false,
  // 表单属性是否可编辑
  fieldDisabled: false,
  // 是否任务处理
  runningHandleVisible: false,
  // 是否显示流程处理详情
  processDetailVisible: false
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const rules = ref({
  applyPost: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  entryDate: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  correctionDate: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  workContent: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  achievement: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  createTime: [{ required: true, message: t("validate.required"), trigger: "blur" }]
});

onMounted(() => {
  init();
});

const init = () => {
  const route = useRoute();
  const showType = route.query.showType;
  dataForm.id = route.query.businessKey as string;
  dataForm.processDefinitionId = route.query.processDefinitionId as string;

  nextTick(() => {
    // 重置表单数据
    if (dataFormRef.value) {
      dataFormRef.value.resetFields();
    }

    //表单已存在，不允许编辑
    if (dataForm.id) {
      state.fieldDisabled = true;
      getInfo();
    }

    //查看流程
    if (showType === "detail") {
      state.processDetailVisible = true;
    } else if (showType === "taskHandle") {
      //处理流程
      state.runningHandleVisible = true;
    } else {
      state.processDetailVisible = false;
      state.runningHandleVisible = false;
      state.fieldDisabled = false;
    }
  });
};

// 获取表单信息
const getInfo = () => {
  baseService.get(`/flow/demo/correction/${dataForm.id}`).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 启动流程
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/flow/demo/correction/start", dataForm).then((res) => {
      ElMessage.success({
        message: t("prompt.success"),
        duration: 500,
        onClose: () => {
          state.closeCurrentTab();
        }
      });
    });
  });
};
</script>
