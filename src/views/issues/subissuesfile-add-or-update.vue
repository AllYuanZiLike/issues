<template>
  <!--  新增 / 修改 文件-->
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="文件" prop="fileId" @click="uploadHandle">
        <el-input v-model="fileName" @change="getUrl">
          <template #prefix>
            <el-icon class="el-input__icon"><Cloudy /></el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
  <!-- 弹窗, 上传文件 -->
  <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList()" @fileList="getUrl"></upload>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
import Upload from "@/views/issues/tfile-upload.vue";
import { useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
export default defineComponent({
  props: ["subissuesId"],
  components: {
    Upload
  },
  setup() {
    const state = reactive({
      // getDataListURL: "/issues/subissuesfile/page",
      visible: false,
      uploadVisible: false,
      dataForm: {
        id: "",
        subIssuesId: "",
        file: [],
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      },
      fileName: ""
    });
    return { ...useView(state), ...toRefs(state) };
  },
  computed: {
    dataRule() {
      return {};
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        let that:any = this
        that.$refs.dataFormRef.resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 修改 ：获取信息
    getInfo() {
      baseService.get("/issues/subissuesfile/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    /**
     *
     获取文件地址
     * @param e
     */
    getUrl(e:any) {
      console.log(e);
      this.dataForm.file = e;
      this.fileName = this.fileName + " | " + this.dataForm.file[0]['name'];
    },
    // 上传文件
    uploadHandle() {
      this.uploadVisible = true;
      let that:any = this
      that.$nextTick(() => {
        let that:any = this
        that.$refs.upload.init();
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.dataForm.subIssuesId = this.subissuesId;
      console.log(this.dataForm);
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/issues/subissuesfile", this.dataForm).then((res) => {
          console.log(res);
          if (res.code !== 0) {
            return this['$message'].error(res.msg);
          }
          this['$message']({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>
