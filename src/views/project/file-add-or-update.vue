<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <!--      <el-form-item label="文件id" prop="fileId">-->
      <!--        <el-input v-model="dataForm.fileId" placeholder="文件id"></el-input>-->
      <!--      </el-form-item>-->
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
<!--  @refreshDataList="getDataList"-->
  <upload v-if="uploadVisible" ref="upload"  @fileList="getUrl"></upload>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import Upload from "@/views/project/tfile-upload.vue";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  components: {
    Upload
  },
  props: ["projectId"],
  setup() {
    return reactive({
      visible: false,
      uploadVisible: false,
      dataForm: {
        id: "",
        projectId: "",
        file: [],
        name: "",
        sort: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      },
      fileName: ""
    });
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
        this.fileName=""
        if (this.dataForm.id) {
          this.getInfo();
        }
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
      this.fileName = this.fileName + " | " + this.dataForm.file[0].name;
    },
    // 上传文件
    uploadHandle() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        let that:any = this
        that.$refs.upload.init();
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/project/file/" + this.dataForm.id).then((res) => {
        console.log(res)
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      console.log(this.projectId)
      this.dataForm.projectId = this.projectId;
      console.log(this.dataForm);
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/project/file", this.dataForm).then((res) => {
          console.log(res);
          if (res.code != 0) {
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
