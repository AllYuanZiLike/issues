<template>
  <!--  新增 / 修改 弹窗-->
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <!--    表单-->
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">

      <el-form-item label="身份" prop="power">
        <el-select v-model="dataForm.power" placeholder="请选择参与人身份">
          <el-option v-for="item in dataPower" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="所属部门" prop="user.deptName">-->
<!--        <ren-dept-tree :placeholder="$t('dept.title')" v-model="dataForm.deptName" @userForm="userForm"></ren-dept-tree>-->
<!--      </el-form-item>-->
      <el-form-item label="用户" prop="user.username">
                <el-input placeholder="请选择" v-model="dataForm.username" @click="addUser"></el-input>
<!--        <el-select v-model="dataForm.userId" placeholder="请选择参与人">-->
<!--          <el-option v-for="item in dataUserForm" :key="item.id" :label="item.username" :value="item.id" />-->
<!--        </el-select>-->
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="addUserVisible" title="用户" :close-on-click-modal="false" :close-on-press-escape="false">
    <Dept :placeholder="$t('dept.title')" v-model="dataForm.deptName" @userForm="userForm" :issuesId="issuesId" :userpage="userpage" :userlimit="userlimit" :totalUser="totalUser"></Dept><br>
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
    <template v-slot:footer>
      <el-button @click="addUserVisible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormUserSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
    <el-pagination :current-page="userpage" :page-sizes="[10, 20, 50, 100]" :page-size="userlimit" :total="totalUser" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeUserHandle" @current-change="pageCurrentChangeUserHandle"> </el-pagination>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive ,toRefs } from "vue";
import Dept from "@/views/issues/ren-dept-tree.vue"
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import { IObject } from "@/types/interface";
import useView from "@/hooks/useView";
import {ElMessage} from "element-plus";
export default defineComponent({
  props: ["issuesId"],
  components:{
    Dept
  },
  setup() {
    const state = reactive({
      visible: false,
      addUserVisible: false,
      getDataListIsPage: true,
      totalUser:0,
      userpage:1,
      userlimit:10,
      dataForm: {
        id: "",
        userId: [],
        username:[],
        issuesId: "",
        deptName:"",
        // deptId:"",
        power: "",
        createDate: "",
        creator: "",
        updater: "",
        updateDate: ""
      },
      dataPower: [
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
    // 初始化
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
    addUser() {
      if(this.dataForm.power==="") {
        ElMessage.warning("请先选择参与人身份")
      } else {
        this.addUserVisible = true;
        this.queryUser();
      }

    },
    //获取用户
    userForm(val:IObject) {
      this.dataUserForm = val.userList;
      this.totalUser = val.total;
    },
    queryUser(){
      this.dataForm.issuesId = this.issuesId;
      baseService.get("/issues/issuesparticipant/UserPage",{
        page: this.getDataListIsPage ? this.userpage : null,
        limit: this.getDataListIsPage ? this.userlimit : null,
        ...this.dataForm
      }).then( res => {
        if(res.code !== 0) return false;
        this.dataUserForm = res.data.list;
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
      baseService.post("/issues/issuesparticipant/beforeAdd", { power:this.dataForm.power,dataForm:this.dataListSelections }).then(res =>{
        if(res.code != 0) return this['$message'].error(res.msg);
        this.addUserVisible = false;
        for (let i = 0; i < this.dataListSelections.length; i++) {
          this.dataForm.userId[i] = this.dataListSelections[i].id;
          this.dataForm.username[i] = this.dataListSelections[i].username;
        }

      })
    },
    // 修改：获取信息
    getInfo() {
      baseService.get("/issues/issuesparticipant/" + this.dataForm.id).then((res) => {
        console.log(res);
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
        console.log(this.dataForm);
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.dataForm.issuesId = this.issuesId;
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/issues/issuesparticipant", this.dataForm).then((res) => {
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
              this.dataForm.userId = []
              this.dataForm.username = [];

            }
          });
        });
      });
    }
  }
});
</script>
