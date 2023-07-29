<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="子会议名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="子会议名称"></el-input>
      </el-form-item>
      <el-form-item label="子会议简介" prop="info" style="height: 300px">
        <WangEditor v-model="dataForm.info" style="height: 180px"></WangEditor>
      </el-form-item>
      <!--      <el-form-item label="子会议状态" prop="status">-->
      <!--        <el-input v-model="dataForm.status" placeholder="子会议状态"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="会议id" prop="conferenceId">-->
      <!--        <el-input v-model="dataForm.conferenceId" placeholder="会议id"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="计票人" prop="couterId">-->
      <!--        <el-input v-model="dataForm.couterId" placeholder="计票人"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="监票人" prop="scrutatorId">-->
      <!--        <el-input v-model="dataForm.scrutatorId" placeholder="监票人"></el-input>-->
      <!--      </el-form-item>-->
<!--      <el-form-item label="排序" prop="sort">-->
<!--        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('menu.sort')"></el-input-number>-->
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
// import Tinymce from "@/components/tinymce";
import WangEditor from "@/components/wang-editor/index.vue";
export default defineComponent({
  props: ["conferenceId"],
  components: {
    // editor: Tinymce
    WangEditor,
  },
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        name: "",
        info: "",
        status: "",
        conferenceId: "",
        beginTime: "",
        endTime: "",
        couterId: "",
        couterTime: "",
        scrutatorId: "",
        scrutatorTime: "",
        sort: "",
        creator: "",
        updateDate: "",
        updater: "",
        createDate: ""
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
        let that:any=this
        that.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/conference/degreesubconference/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // //html反转义
    // HTMLDecode(text) {
    //   var reg = /<[^>]+>/g;
    //   if (reg.test(text)) {
    //     return text;
    //   }
    //   var temp = document.createElement("div");
    //   temp.innerHTML = text;
    //   var output = temp.innerText || temp.textContent;
    //   temp = null;
    //   console.log(output);
    //   return output;
    // },
    // 表单提交
    dataFormSubmitHandle() {
      // this.dataForm.info = this.HTMLDecode(this.dataForm.info);
      this.dataForm.conferenceId = this.conferenceId;
      console.log(this.dataForm);
      let that:any= this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/conference/degreesubconference", this.dataForm).then((res) => {
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
