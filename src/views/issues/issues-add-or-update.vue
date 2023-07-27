<template>
  <!--  议题新增 / 修改弹窗-->
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <!--    表单-->
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="议题名称" prop="name">
        <el-input v-model="dataForm.name" roomIdholder="议题名称"></el-input>
      </el-form-item>
      <el-form-item label="议题简介" prop="info" style="height: 300px">
        <WangEditor v-model="dataForm.info" style="height: 180px"></WangEditor>
      </el-form-item>
      <el-form-item label="讨论地点" prop="roomId">
        <el-select v-model="dataForm.roomId" placeholder="请选择会议室">
          <el-option v-for="item in baseroomForm" :key="item['id']" :label="item['name']" :value="item['id']"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker v-model="dataForm.beginTime" type="datetime" placeholder="请选择日期"  />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="请选择日期"  />
      </el-form-item>
    </el-form>
    <!--    底部按钮-->
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import dayjs from "dayjs";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import Tinymce from "@/components/tinymce";
import WangEditor from "@/components/wang-editor/index.vue";
import { IObject } from "@/types/interface";
// import { ensureArray } from "element-plus/es/utils";
export default defineComponent({
  components: {
    // editor: Tinymce,
    WangEditor
  },
  setup() {
    return reactive({
      visible: false,
      addUserVisible: false,
      dataForm: {
        id: "",
        name: "",
        info: "",
        roomId: "",
        status: "",
        createDate: "",
        creator: "",
        updater: "",
        updateDate: "",
        chronicler: "",
        supervisor: "",
        beginTime: "",
        endTime: "",
        deptNameCh: "",
        deptNameSu: ""
      },
      // 用户
      dataUserForm: [],
      //会议室
      baseroomForm: []
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        info: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        roomId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        chronicler: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        supervisor: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
        this.getBaseroomInfo();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 修改：获取信息
    getInfo() {
      baseService.get("/issues/issues/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 获取用户
    userForm(val :any) {
      this.dataUserForm = val;
      console.log(this.dataUserForm);
    },

    //获取会议室
    getBaseroomInfo() {
      baseService.get("/sys/baseroom/page", { status: 1 }).then((res) => {
        console.log(res);
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.baseroomForm = res.data.list;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.dataForm.beginTime = dayjs(this.dataForm.beginTime).format("YYYY-MM-DD HH:mm:ss");
      this.dataForm.endTime = dayjs(this.dataForm.endTime).format("YYYY-MM-DD HH:mm:ss");
      console.log(this.dataForm);
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/issues/issues", this.dataForm).then((res) => {
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
