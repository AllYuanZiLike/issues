<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <!--      <el-form-item label="活动id" prop="activityId">-->
      <!--        <el-input v-model="dataForm.activityId" placeholder="活动id"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="是否匿名" prop="isAnon">
        <!--        <el-input v-model="dataForm.cryptonym" placeholder="是否匿名:0：匿名，1：不匿名"></el-input>-->
        <el-select v-model="dataForm.isAnon" placeholder="请选择是否匿名">
          <el-option v-for="item in isAnonText" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="投票类型" prop="type">
        <!--投票类型：1：投票制，2：打分制，3：表决制，4. 排名制"-->
        <el-select v-model="dataForm.type" placeholder="请选择投票类型" @change="chooseType(dataForm.type)">
          <el-option v-for="item in typeText" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="最大分数" prop="maxNum" v-show="typeVisible.maxNum">
        <!--        <el-input v-model="dataForm.maxNum" placeholder="最大分数"></el-input>-->
        <el-input-number v-model="dataForm.maxNum" class="mx-4" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="最低分数" prop="minNum" v-show="typeVisible.minNum">
        <!--        <el-input v-model="dataForm.minNum" placeholder="最低分数"></el-input>-->
        <el-input-number v-model="dataForm.minNum" class="mx-4" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="最大票数" prop="maxPoll" v-show="typeVisible.maxPoll">
        <!--        <el-input v-model="dataForm.maxPoll" placeholder="最大票数"></el-input>-->
        <el-input-number v-model="dataForm.maxPoll" class="mx-4" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="最低票数" prop="minPoll" v-show="typeVisible.minPoll">
        <!--        <el-input v-model="dataForm.minPoll" placeholder="最低票数"></el-input>-->
        <el-input-number v-model="dataForm.minPoll" class="mx-4" :min="0" controls-position="right" />
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
import {ElMessage} from "element-plus";
export default defineComponent({
  props: ["categoryId"],
  setup() {
    return reactive({
      visible: false,
      typeVisible: {
        maxNum: false,
        minNum: false,
        maxPoll: false,
        minPoll: false
      },
      dataForm: {
        id: "",
        categoryId: "",
        categoryDTO:{},
        isAnon: "",
        type: null as any,
        maxNum: "",
        minNum: "",
        maxPoll: "",
        minPoll: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      },
      isAnonText: [
        { value: 0, label: "是" },
        { value: 1, label: "否" }
      ],
      typeText: [
        { value: 1, label: "投票制" },
        { value: 2, label: "打分制" },
        { value: 3, label: "表决制" },
        { value: 4, label: "排名制" }
      ]
    });
  },
  computed: {
    dataRule() {
      return {
        activityId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        cryptonym: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        type: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
        let that:any = this
        that.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/project/rule/" + this.dataForm.id).then((res) => {
        console.log("修改")
        console.log(res)
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    chooseType(type: number) {
      if (type === 1) {
        this.typeVisible.maxPoll = true;
        this.typeVisible.minPoll = true;
        this.typeVisible.maxNum = false;
        this.typeVisible.minNum = false;
      } else if (type === 2) {
        this.typeVisible.maxNum = true;
        this.typeVisible.minNum = true;
        this.typeVisible.maxPoll = false;
        this.typeVisible.minPoll = false;
      } else if (type === 3) {
        this.typeVisible.maxPoll = false;
        this.typeVisible.minPoll = false;
        this.typeVisible.maxNum = false;
        this.typeVisible.minNum = false;
      } else if (type === 4) {
        this.typeVisible.maxPoll = false;
        this.typeVisible.minPoll = false;
        this.typeVisible.maxNum = false;
        this.typeVisible.minNum = false;
      }
    },
    // 表单提交
    dataFormSubmitHandle() {
      if(this.dataForm.minPoll===this.dataForm.maxPoll) {
        ElMessage.error("最大票数与最小票数不可以相同")
      }else  if(this.dataForm.minNum===this.dataForm.maxNum) {
        ElMessage.error("最大票数与最小分数不可以相同")
      }else {
        console.log(this.dataForm)
        console.log(this.dataForm.isAnon)
        this.dataForm.categoryId = this.categoryId;
        let that:any = this
        that.$refs['dataFormRef'].validate((valid: boolean) => {
          if (!valid) {
            return false;
          }
          (!this.dataForm.id ? baseService.post : baseService.put)("/project/rule", this.dataForm).then((res) => {
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
      }}
  }
});
</script>
