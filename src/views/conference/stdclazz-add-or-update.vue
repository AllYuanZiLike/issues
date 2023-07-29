<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="编号" prop="no">
        <el-input v-model="dataForm.no" placeholder="编号"></el-input>
      </el-form-item>
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="学院" prop="collegeId">
        <el-input v-model="dataForm.collegeId" placeholder="学院"></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="majorId">
        <el-input v-model="dataForm.majorId" placeholder="专业"></el-input>
      </el-form-item>
      <el-form-item label="一级学科" prop="disciplineId">
        <el-input v-model="dataForm.disciplineId" placeholder="一级学科"></el-input>
      </el-form-item>
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
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        no: "",
        name: "",
        sort: "",
        collegeId: "",
        majorId: "",
        disciplineId: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: "",
      }
    });
  },
  computed: {
    dataRule() {
      return {
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        let that:any=this
        that.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/conference/stdclazz/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      let that:any=this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/conference/stdclazz", this.dataForm).then((res) => {
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
