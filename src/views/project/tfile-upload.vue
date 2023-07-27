<template>
  <!--  上传弹窗-->
  <el-dialog v-model="visible" :title="$t('oss.upload')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload :action="url" :file-list="fileList" drag multiple :before-upload="beforeUploadHandle" :on-success="successHandle" class="text-center">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <template v-slot:tip>
        <div class="el-upload__tip">
          {{ $t("upload.tip", { format: "pdf" }) }}
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { getToken } from "@/utils/cache";
import { IObject } from "@/types/interface";
import app from "@/constants/app";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      num: 0,
      fileList: [] as IObject[],
      url: "",
      name: ""
    });
  },
  methods: {
    init() {
      this.visible = true;
      this.fileList = [];
      this.url = `${app.api}/oss/file/upload?access_token=${getToken()}`;
      this.num = 0;
    },
    // 上传之前
    beforeUploadHandle(file: IObject) {
      console.log(file.type);
      if (file.type !== "application/pdf") {
        this['$message'].error(this.$t("upload.tip", { format: "pdf" }));
        return false;
      }
      this.num++;
    },
    // 上传成功
    successHandle(res: IObject, file: IObject, fileList: IObject[]) {
      if (res.code !== 0) {
        return this['$message'].error(res.msg);
      }
      this.url = res.data.url;
      this.$emit("file", file);
      this.fileList = fileList;
      this.$emit("fileList", this.fileList);
      this.num--;
      if (this.num === 0) {
        this['$message']({
          message: this.$t("prompt.success"),
          type: "success",
          duration: 500,
          onClose: () => {
            this.visible = false;
            this.$emit("refreshDataList");
          }
        });
      }
    }
  }
});
</script>
