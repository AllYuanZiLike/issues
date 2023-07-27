<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="会议名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="会议名称"></el-input>
      </el-form-item>
      <el-form-item label="会议简介" prop="info" style="height: 300px">
        <WangEditor v-model="dataForm.info" style=" height: 180px "></WangEditor>
      </el-form-item>
      <el-form-item label="会议室" prop="room.name">
        <!--        <el-input v-model="dataForm.roomId" placeholder="会议室"></el-input>-->
        <el-select v-model="dataForm.roomId" placeholder="请选择会议室">
          <el-option v-for="item in baseroomForm" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预计开始时间" prop="beginT">
        <el-date-picker type="datetime" placeholder="预计开始时间" v-model="dataForm.reserveBeginTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="预计结束时间" prop="endTime">
        <el-date-picker type="datetime" placeholder="预计结束时间" v-model="dataForm.reserveEndTime"></el-date-picker>
      </el-form-item>
      <!--      <el-form-item label="计票人" prop="couterId">-->
      <!--        <el-input v-model="dataForm.couterId" placeholder="计票人"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="监票人" prop="scrutatorId">-->
      <!--        <el-input v-model="dataForm.scrutatorId" placeholder="监票人"></el-input>-->
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
import dayjs from "dayjs";
export default defineComponent({
  components: {
    // editor: Tinymce
    WangEditor
  },
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        name: "",
        info: "",
        status: "",
        roomId: "",
        room:{id:""},
        delFlag: "",
        reserveBeginTime:null as number | null,
        reserveEndTime: null as number | null,
        beginT:"",
        endT:"",
        couterId: "",
        couterTime: "",
        scrutatorId: "",
        scrutatorTime: "",
        beginTime: "",
        endTime: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      },
      baseroomForm: []
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

        this.getBaseroomInfo();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/conference/degreeconference/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;

        this.dataForm.beginT = dayjs(this.dataForm.reserveBeginTime).format("YYYY-MM-DD HH:mm");
        this.dataForm.endTime = dayjs(this.dataForm.reserveEndTime).format("YYYY-MM-DD HH:mm");
        console.log(this.dataForm);
      });
    },
    //获取会议室
    getBaseroomInfo() {
      baseService.get("/conference/baseroom/page", { status: 1 }).then((res) => {
        console.log(res);
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.baseroomForm = res.data.list;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {

      this.dataForm.reserveBeginTime = (new Date(this.dataForm.reserveBeginTime)).getTime();
      this.dataForm.reserveEndTime = (new Date(this.dataForm.reserveEndTime)).getTime();
      // console.log(this.dataForm.reserveBeginTime);
      // this.dataForm.reserveBeginTime = dayjs(this.dataForm.reserveBeginTime).format("YYYY-MM-DD HH:mm:ss");
      // this.dataForm.reserveEndTime = dayjs(this.dataForm.reserveEndTime).format("YYYY-MM-DD HH:mm:ss");
      console.log(this.dataForm);
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/conference/degreeconference", this.dataForm).then((res) => {
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
