<template>
  <!--  子议题新增 / 修改 弹窗-->
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <!--    表单-->
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="子议题名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="子议题名称"></el-input>
      </el-form-item>
      <el-form-item label="子议题介绍" prop="info" style="height: 300px">
<!--        <editor v-model="dataForm.info" :init="{ height: 300 }"></editor>-->
        <WangEditor v-model="dataForm.info" style="height: 180px"></WangEditor>
<!--          <textarea name="" id="" v-model="dataForm.info" cols="30" rows="10"></editor>>-->
      </el-form-item>
      <el-form-item label="分管领导" prop="leader.username">
        <el-select v-model="dataForm.leaderId" placeholder="请选择">
          <el-option v-for="item in dataUserForm" :key="item['userId']" :value="item['userId']" :label="item['user']['username']"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报人" prop="reporter.username">
        <el-select v-model="dataForm.reporterId" placeholder="请选择">
          <el-option v-for="item in dataUserForm" :key="item['userId']" :value="item['userId']" :label="item['user']['username']"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
// import Tinymce from "@/components/tinymce";
import WangEditor from "@/components/wang-editor/index.vue";
export default defineComponent({
  components: { WangEditor },
  props: ["issuesId"],
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        name: "",
        userId: "",
        deptNameLeader: "",
        deptNameReporter: "",
        info: "",
        issuesId: "",
        leaderId: "",
        reporterId: "",
        status: "",
        createDate: "",
        creator: "",
        updater: "",
        updateDate: ""
      },
      dataUserForm: []
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        info: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    // 初始化
    init() {
      this.visible = true;
      this.$nextTick(() => {
        let that:any = this
        that.$refs["dataFormRef"].resetFields();
        console.log(this.dataForm)
        this.getUserInfo();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 修改：获取信息
    getInfo() {
      baseService.get("/issues/subissues/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    //获取用户
    getUserInfo() {
      this.dataForm.issuesId = this.issuesId;
      baseService.get("/issues/issuesparticipant/page", { issuesId: this.dataForm.issuesId, power: 0 }).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataUserForm = res.data.list;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.dataForm.issuesId = this.issuesId;
      console.log(this.dataForm);
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/issues/subissues", this.dataForm).then((res) => {
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
