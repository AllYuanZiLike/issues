<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="160px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目简介" prop="info" style="height: 300px">
<!--        <editor v-model="dataForm.info" :init="{ height: 300 }"></editor>-->
        <WangEditor v-model="dataForm.info" style="height: 180px"></WangEditor>
      </el-form-item>
      <el-form-item label="收集项目开始时间" prop="startTime">
        <el-date-picker type="datetime" placeholder="收集项目开始时间" v-model="dataForm.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="收集项目截止时间" prop="stopTime">
        <el-date-picker type="datetime" placeholder="收集项目截止时间" v-model="dataForm.stopTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="会议形式" prop="isOnline">
        <!--        <el-input v-model="dataForm.isOnline" placeholder="线上/线下"></el-input>-->
        <el-select v-model="dataForm.isOnline" placeholder="请选择">
          <el-option v-for="item in onlineText" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="项目状态" prop="status">-->
      <!--        &lt;!&ndash;        <el-input v-model="dataForm.status" placeholder="会议状态"></el-input>&ndash;&gt;-->
      <!--        <el-select v-model="dataForm.status" placeholder="请选择">-->
      <!--          <el-option v-for="item in statusText" :key="item.value" :label="item.label" :value="item.value"> </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="评审预计开始时间" prop="reserveBeginTime">
        <el-date-picker type="datetime" placeholder="评审预计开始时间" v-model="dataForm.reserveBeginTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="评审预计结束时间" prop="reserveEndTime">
        <el-date-picker type="datetime" placeholder="评审预计结束时间" v-model="dataForm.reserveEndTime"></el-date-picker>
      </el-form-item>
      <!--      <el-form-item label="计票人(user)" prop="couterId">-->
      <!--        <el-input v-model="dataForm.couterId" placeholder="计票人(user)"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="监票人(user)" prop="scrutatorId">-->
      <!--        <el-input v-model="dataForm.scrutatorId" placeholder="监票人(user)"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="会议室" prop="roomId" v-show="dataForm.isOnline===1">
        <!--        <el-input v-model="dataForm.roomId" placeholder="会议室(base_room)"></el-input>-->
        <el-select v-model="dataForm.roomId" placeholder="请选择会议室">
          <el-option v-for="item in baseroomForm" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
import Tinymce from "@/components/tinymce";
import WangEditor from "@/components/wang-editor/index.vue";
import dayjs from "dayjs";
export default defineComponent({
  components: { editor: Tinymce,WangEditor },
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        id: "",
        name: "",
        info: "",
        startTime: "",
        stopTime: "",
        isOnline: 0 as any,
        status: "",
        reserveBeginTime: "",
        reserveEndTime: "",
        beginTime: "",
        endTime: "",
        couterId: "",
        couterTime: "",
        scrutatorId: "",
        scrutatorTime: "",
        roomId: "",
        delFlag: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      },
      //会议室
      baseroomForm: [],
      onlineText: [
        { value: 0, label: "线上" },
        { value: 1, label: "线下" }
      ],
      statusText: [
        { value: 0, label: "未开始" },
        { value: 1, label: "收集项目中" },
        { value: 2, label: "收集项目已结束" },
        { value: 3, label: "评审进行中" },
        { value: 4, label: "评审已结束" }
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
        that.$refs.dataFormRef.resetFields();
        this.getBaseroomInfo();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    //获取会议室
    getBaseroomInfo() {
      baseService.get("/sys/baseroom/page", { status: 1 }).then((res) => {
        console.log(res);
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.baseroomForm = res.data.list;
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/project/category/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.dataForm.reserveBeginTime = dayjs(this.dataForm.reserveBeginTime).format("YYYY-MM-DD HH:mm:ss");
      this.dataForm.reserveEndTime = dayjs(this.dataForm.reserveEndTime).format("YYYY-MM-DD HH:mm:ss");
      this.dataForm.startTime = dayjs(this.dataForm.startTime).format("YYYY-MM-DD HH:mm:ss");
      this.dataForm.stopTime = dayjs(this.dataForm.stopTime).format("YYYY-MM-DD HH:mm:ss");
      console.log(this.dataForm);
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/project/category", this.dataForm).then((res) => {
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


<!--<template>-->
<!--  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">-->
<!--    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">-->
<!--      <el-form-item label="活动名称" prop="name">-->
<!--        <el-input v-model="dataForm.name" placeholder="活动名称"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="活动简介" prop="info" style="height: 400px">-->
<!--        <WangEditor v-model="dataForm.content"></WangEditor>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="收集项目开始时间" prop="startTime">-->
<!--        <el-input v-model="dataForm.startTime" placeholder="收集项目开始时间"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="收集项目截止时间" prop="stopTime">-->
<!--        <el-input v-model="dataForm.stopTime" placeholder="收集项目截止时间"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="线上/会议" prop="isOnline">-->
<!--        <el-radio-group v-model="dataForm.isOnline">-->
<!--          <el-radio :label="0">启用</el-radio>-->
<!--          <el-radio :label="1">禁用</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="评审预计开始时间" prop="reserveBeginTime">-->
<!--        <el-input v-model="dataForm.reserveBeginTime" placeholder="评审预计开始时间"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="评审预计结束时间" prop="reserveEndTime">-->
<!--        <el-input v-model="dataForm.reserveEndTime" placeholder="评审预计结束时间"></el-input>-->
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
<!--  name: "",-->
<!--  info: "",-->
<!--  startTime: "",-->
<!--  stopTime: "",-->
<!--  isOnline: "",-->
<!--  status: "",-->
<!--  reserveBeginTime: "",-->
<!--  reserveEndTime: "",-->
<!--  beginTime: "",-->
<!--  endTime: "",-->
<!--  couterId: "",-->
<!--  couterTime: "",-->
<!--  scrutatorId: "",-->
<!--  scrutatorTime: "",-->
<!--  roomId: "",-->
<!--  delFlag: "",-->
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
<!--  baseService.get("//project/category/" + id).then((res) => {-->
<!--    Object.assign(dataForm, res.data);-->
<!--  });-->
<!--};-->

<!--// 表单提交-->
<!--const dataFormSubmitHandle = () => {-->
<!--  dataFormRef.value.validate((valid: boolean) => {-->
<!--    if (!valid) {-->
<!--      return false;-->
<!--    }-->
<!--    (!dataForm.id ? baseService.post : baseService.put)("//project/category", dataForm).then((res) => {-->
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
