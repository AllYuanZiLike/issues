<template>
  <div>
    <el-input v-model="showDeptName" :placeholder="placeholder" @click="deptDialog">
      <template v-slot:append>
        <el-button icon="search" @click="deptDialog"></el-button>
      </template>
    </el-input>
    <el-dialog v-model="visibleDept" width="30%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :inline="true">
        <el-form-item :label="$t('keyword')">
          <el-input v-model="filterText" :input-style="{ width: '150px'}"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 5%">
          <el-button type="default" >{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-tree class="filter-tree" :data="deptList" :default-expanded-keys="expandedKeys" :props="{ label: 'name', children: 'children' }" :expand-on-click-node="false" :filter-node-method="filterNode" :highlight-current="true" node-key="id" ref="tree"> </el-tree>
      <template v-slot:footer>
        <el-button type="default" @click="cancelHandle()">{{ $t("cancel") }}</el-button>
<!--        v-if="query"-->
        <el-button type="info" @click="clearHandle()">{{ $t("clear") }}</el-button>
        <el-button type="primary" @click="beforeCommit()">{{ $t("confirm") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent,reactive, toRefs } from "vue";
import { IObject } from "@/types/interface";
import baseService from "@/service/baseService";
export default defineComponent({
  name: "RenDeptTree",
  data() {
    const state = reactive({
      filterText: "",
      visibleDept: false,
      getDataListIsPage: true,
      deptList: [],
      showDeptName: "",
      expandedKeys: [] as string[],
      defaultProps: {
        children: "children",
        label: "label"
      },
      UserList:[],
      dataForm:{
        issuesId:'',
        deptName:'',
        usertotal:0
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  props: {
    modelValue: String,
    deptName: String,
    query: Boolean,
    placeholder: String,
    issuesId:String,
    userpage:Number,
    userlimit:Number,
    totalUser:Number
  },
  watch: {
    filterText(val) {
      let that:any = this
      that.$refs.tree.filter(val);
    },
    deptName(val) {
      this.showDeptName = val;
    }
  },
  methods: {
    deptDialog() {
      this.expandedKeys = [];
      this.visibleDept = true;
      this.getDeptList(this.modelValue);
    },
    filterNode(value: string, data: IObject) {
      if (!value) return true;
      return data.name.indexOf(value) != -1;
    },
    getDeptList(id?: string) {
      return baseService.get("/sys/dept/list").then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.deptList = res.data;
        this.$nextTick(() => {
          if (id) {
            let that:any = this
            that.$refs.tree.setCurrentKey(id);
            this.expandedKeys = [id];
          }
        });
      });

    },
    cancelHandle() {
      this.visibleDept = false;
      this.deptList = [];
      this.filterText = "";
    },
    clearHandle() {
      this.$emit("update:modelValue", "");
      this.$emit("update:deptName", "");
      this.showDeptName = "";
      this.visibleDept = false;
      this.deptList = [];
      this.filterText = "";
    },
    beforeCommit(){
      let that:any = this
      this.dataForm.deptName = that.$refs.tree.getCurrentNode().id;
      this.dataForm.issuesId = this.issuesId;
      this.dataForm.usertotal = this.totalUser;
      baseService.get("/issues/issuesparticipant/UserPage",{
        page: this.getDataListIsPage ? this.userpage : null,
        limit: this.getDataListIsPage ? this.userlimit : null,
        ...this.dataForm }).then(res => {
        console.log(res);
        if (res.code != 0) return false;
        this.UserList = res.data.list;
        this.dataForm.usertotal = this.getDataListIsPage ? res.data.total : 0;
      })
      // this.commitHandle();
      let number = 0;
      let timeid = setInterval(()=>{
          if(that.UserList.length >= 0){
            that.commitHandle()
            clearTimeout(timeid)
          }
          if(number>30){
            clearTimeout(timeid)
          }
          number++
        },500)
    },
    commitHandle() {
      let that:any = this
      const node = that.$refs.tree.getCurrentNode();
      if (!node) {
        this['$message'].error(this.$t("dept.chooseerror"));
        return;
      }
      this.$emit("update:modelValue", node.id);
      this.$emit("update:deptName", node.name);
      this.$emit("userForm",{userList:this.UserList,total:this.dataForm.usertotal});
      this.showDeptName = node.name;
      this.visibleDept = false;
      this.deptList = [];
      this.filterText = "";
    }
  },
});
</script>
