<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="身份" prop="power">
        <el-select v-model="dataForm.duty" placeholder="请选择参与人身份">
          <el-option v-for="item in dataDuty" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="user.username">
        <el-input placeholder="请选择" v-model="dataForm.username" @click="addUser"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="addUserVisible" title="用户" :close-on-click-modal="false" :close-on-press-escape="false">
    <Dept :placeholder="$t('dept.title')" v-model="dataForm.deptName" @userForm="userForm" :categoryId="categoryId" :userpage="userpage" :userlimit="userlimit" :totalUser="totalUser"></Dept><br>
    <el-table v-loading="dataListLoading" :data="dataUserForm" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="username" :label="$t('user.username')" sortable="custom" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>-->
      <el-table-column prop="status" :label="$t('user.status')" sortable="custom" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t("user.status0") }}</el-tag>
          <el-tag v-else size="small" type="success">{{ $t("user.status1") }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="userpage" :page-sizes="[10, 20, 50, 100]" :page-size="userlimit" :total="totalUser" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeUserHandle" @current-change="pageCurrentChangeUserHandle"> </el-pagination>
    <template v-slot:footer>
      <el-button @click="addUserVisible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormUserSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive,toRefs } from "vue";
import Dept from "@/views/project/ren-dept-tree.vue"
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
import useView from "@/hooks/useView";
import {ElMessage} from "element-plus";
export default defineComponent({
  components: {
    Dept
  },
  props: ["categoryId"],
  setup() {
    const state = reactive({
      visible: false,
      addUserVisible:false,
      getDataListIsPage: true,
      totalUser:0,
      userpage:1,
      userlimit:10,
      dataForm: {
        id: "",
        categoryId: "",
        participantId: "",
        deptName:"",
        duty: "",
        sort: "",
        createDate: "",
        creator: "",
        updateDate: "",
        updater: "",
        userId:[],
        username:[]
      },
      dataDuty: [
        { value: 0, label: "投票人" },
        { value: 1, label: "监票人" },
        { value: 2, label: "计票人" }
      ],
      dataUserForm: []
    });
    return {...useView(state),...toRefs(state)}
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
        that.dataForm.duty=""
        that.dataForm.username=[]
        that.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    addUser() {
      if(this.dataForm.duty==="") {
        ElMessage.warning("请先选择参与人身份")
      } else {
        this.addUserVisible = true;
        this.dataForm.deptName=""
        this.dataUserForm=[]
        this.dataUserForm=[]
        this.queryUser();
      }
    },
    //获取用户
    userForm(val:IObject) {
      this.dataUserForm = val.userList;
      this.totalUser = val.total;
    },
    queryUser(){
      this.dataForm.categoryId = this.categoryId;
      console.log(this.dataForm);
      baseService.get("/project/participant/UserPage",{
        page: this.getDataListIsPage ? this.userpage : null,
        limit: this.getDataListIsPage ? this.userlimit : null,
        ...this.dataForm
      }).then( res => {
        console.log(res)
        if(res.code != 0) return false;
        this.dataUserForm = res.data.records;
        this.totalUser = res.data.total;
      })
    },
    pageSizeChangeUserHandle(val: number){
      this.userpage = 1;
      this.userlimit = val;
      this.queryUser();
    },
    pageCurrentChangeUserHandle(val: number){
      this.userpage = val;
      this.queryUser();
    },
    dataFormUserSubmitHandle(){
      baseService.post("/project/participant/beforeAdd", { power:this.dataForm.duty,dataForm:this.dataListSelections }).then(res =>{
        if(res.code != 0) return this['$message'].error(res.msg);
        this.addUserVisible = false;
        for (let i = 0; i < this.dataListSelections.length; i++) {
          this.dataForm.userId[i] = this.dataListSelections[i].id;
          this.dataForm.username[i] = this.dataListSelections[i].username;
        }

      })
    },
    // 获取信息
    getInfo() {
      baseService.get("/project/participant/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.dataForm.categoryId = this.categoryId;
      console.log(236)
      console.log(this.categoryId)
      console.log(this.dataForm.categoryId)
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/project/participant", this.dataForm).then((res) => {
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
              let that:any = this
              that.$refs.dataFormRef.resetFields();
            }
          });
        });
      });
    }
  }
});
</script>
