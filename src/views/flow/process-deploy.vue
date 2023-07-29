<template>
  <el-dialog v-model="visible" :title="$t('process.deployFile')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload name="processFile" :action="url" :file-list="fileList" drag :before-upload="beforeUploadHandle" :on-success="successHandle" class="text-center">
      <el-icon><upload /></el-icon>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <template v-slot:tip>
        <div class="el-upload__tip">
          {{ $t("upload.tip", { format: "zip、bpmn20.xml、bpmn" }) }}
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import app from "@/constants/app";
import { getToken } from "@/utils/cache";
import { IObject } from "@/types/interface";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const url = ref("");
const fileList = ref([]);

const init = () => {
  visible.value = true;
  url.value = `${app.api}/flow/process/deploy?access_token=${getToken()}`;
  fileList.value = [];
};

// 上传之前
const beforeUploadHandle = (file: IObject) => {
  if (!/.+\.zip$/.test(file.name) && !/.+\.xml$/.test(file.name) && !/.+\.bar$/.test(file.name) && !/.+\.bpmn$/.test(file.name)) {
    ElMessage.error(t("upload.tip", { format: "zip、xml、bar、bpmn" }));
    return false;
  }
};

// 上传成功
const successHandle = (res: IObject) => {
  if (res.code != 0) {
    return ElMessage.error(res.msg);
  }
  ElMessage.success({
    message: t("prompt.success"),
    duration: 500,
    onClose: () => {
      visible.value = false;
      emit("refreshDataList");
    }
  });
};

defineExpose({
  init
});
</script>
