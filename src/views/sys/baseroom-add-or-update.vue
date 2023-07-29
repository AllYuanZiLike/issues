<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="会议室名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="会议室名称"></el-input>
      </el-form-item>
      <el-form-item label="会议室地点" prop="site">
        <el-input v-model="dataForm.site" placeholder="会议室地点"></el-input>
      </el-form-item>
      <!--      <el-form-item label="开始时间" prop="beginTime">-->
      <!--        <el-input v-model="dataForm.beginTime" placeholder="开始时间"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="结束时间" prop="endTime">-->
      <!--        <el-input v-model="dataForm.endTime" placeholder="结束时间"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="会议室状态" prop="statusText">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option v-for="item in statusText" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
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
        name: "",
        site: "",
        beginTime: "",
        endTime: "",
        status: "",
        sort: "",
        createDate: "",
        creator: "",
        updateDate: "",
        updater: ""
      },
      statusText: [
        { value: 0, label: "未启用" },
        { value: 1, label: "可用" },
        { value: 2, label: "停用" }
      ]
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
      baseService.get("/sys/baseroom/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/sys/baseroom", this.dataForm).then((res) => {
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
