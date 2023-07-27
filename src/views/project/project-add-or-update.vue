<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <!--      <el-form-item label="申请人" prop="applicantId">-->
      <!--        <el-input v-model="dataForm.applicantId" placeholder="申请人"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="所属项目类别" prop="categoryId">-->
      <!--        <el-input v-model="dataForm.categoryId" placeholder="所属项目类别"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目简介" prop="info" style="height: 300px">
<!--        <editor v-model="dataForm.info" :init="{ height: 300 }"></editor>-->
        <WangEditor v-model="dataForm.info" style="height: 180px"></WangEditor>
      </el-form-item>
      <!--      <el-form-item label="项目状态" prop="status">-->
      <!--        <el-input v-model="dataForm.status" placeholder="项目状态"></el-input>-->
      <!--      </el-form-item>-->
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import Tinymce from "@/components/tinymce";
import WangEditor from "@/components/wang-editor/index.vue";
export default defineComponent({
  props: ["categoryId","applicantId"],
  components: { editor: Tinymce,WangEditor },
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        applicantId: "",
        categoryId: "",
        name: "",
        info: "",
        status: "",
        sort: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      }
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
        that.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/project/project/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      console.log(this.applicantId)
      this.dataForm.categoryId = this.categoryId;
      this.dataForm.applicantId = this.applicantId
      console.log(this.dataForm)

      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/project/project", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this['$message'].error(res.msg);
          }
          this['$message']({
            message: "操作成功，请不要忘记添加文件！！！！",
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


<!--<template>-->
<!--  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">-->
<!--    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">-->
<!--      <el-form-item label="申请人" prop="applicantId">-->
<!--        <el-input v-model="dataForm.applicantId" placeholder="申请人"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="所属项目类别" prop="categoryId">-->
<!--        <el-select v-model="dataForm.categoryId" placeholder="请选择">-->
<!--          <el-option label="人人" value="0"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="项目名称" prop="name">-->
<!--        <el-input v-model="dataForm.name" placeholder="项目名称"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="项目简介" prop="info" style="height: 400px">-->
<!--        <WangEditor v-model="dataForm.content"></WangEditor>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <template v-slot:footer>-->
<!--      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>-->
<!--      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>-->
<!--    </template>-->
<!--  </el-dialog>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { reactive, ref } from "vue";-->
<!--import baseService from "@/service/baseService";-->
<!--import WangEditor from "@/components/wang-editor/index.vue";-->
<!--import { useI18n } from "vue-i18n";-->
<!--import { ElMessage } from "element-plus";-->
<!--const { t } = useI18n();-->
<!--const emit = defineEmits(["refreshDataList"]);-->

<!--const visible = ref(false);-->
<!--const dataFormRef = ref();-->

<!--const dataForm = reactive({-->
<!--  id: "",-->
<!--  applicantId: "",-->
<!--  categoryId: "",-->
<!--  name: "",-->
<!--  info: "",-->
<!--  status: "",-->
<!--  sort: "",-->
<!--  creator: "",-->
<!--  createDate: "",-->
<!--  updater: "",-->
<!--  updateDate: "",-->
<!--});-->

<!--const rules = ref({-->
<!--});-->

<!--const init = (id?: number) => {-->
<!--  visible.value = true;-->
<!--  dataForm.id = "";-->

<!--  // 重置表单数据-->
<!--  if (dataFormRef.value) {-->
<!--    dataFormRef.value.resetFields();-->
<!--  }-->

<!--  if (id) {-->
<!--    getInfo(id);-->
<!--  }-->
<!--};-->

<!--// 获取信息-->
<!--const getInfo = (id: number) => {-->
<!--  baseService.get("/project/project/" + id).then((res) => {-->
<!--    Object.assign(dataForm, res.data);-->
<!--  });-->
<!--};-->

<!--// 表单提交-->
<!--const dataFormSubmitHandle = () => {-->
<!--  dataFormRef.value.validate((valid: boolean) => {-->
<!--    if (!valid) {-->
<!--      return false;-->
<!--    }-->
<!--    (!dataForm.id ? baseService.post : baseService.put)("/project/project", dataForm).then((res) => {-->
<!--      ElMessage.success({-->
<!--        message: t("prompt.success"),-->
<!--        duration: 500,-->
<!--        onClose: () => {-->
<!--          visible.value = false;-->
<!--          emit("refreshDataList");-->
<!--        }-->
<!--      });-->
<!--    });-->
<!--  });-->
<!--};-->

<!--defineExpose({-->
<!--  init-->
<!--});-->
<!--</script>-->
