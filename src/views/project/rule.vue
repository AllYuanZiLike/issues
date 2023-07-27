<template>
  <div class="mod-project__prjrule">
    <el-drawer
      v-model="drawerRule"
      title="规则"
      size="90%"
      direction="rtl"
      :before-close="handleClose"
    >
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.activityId" placeholder="活动id" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.cryptonym" placeholder="是否匿名:0：匿名，1：不匿名" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.type" placeholder="投票类型：1：投票制，2：打分制，3：表决制，4. 排名制" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-button @click="getDataList()">{{ $t("query") }}</el-button>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="info" @click="getData()" class="refresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button v-if="hasPermission('project:rule:save')" type="primary" v-show="addButton" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('project:rule:delete')" v-show="deleteButton" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="categoryDTO.name" label="活动" header-align="center" align="center"></el-table-column>
      <el-table-column prop="isAnonText" label="是否匿名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="typeText" label="投票类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="maxNum" label="最大分数" v-if="typeVisible.maxNum" header-align="center" align="center"></el-table-column>
      <el-table-column prop="minNum" label="最低分数" v-if="typeVisible.minNum" header-align="center" align="center"></el-table-column>
      <el-table-column prop="maxPoll" label="最大票数" v-if="typeVisible.maxPoll" header-align="center" align="center"></el-table-column>
      <el-table-column prop="minPoll" label="最低票数" v-if="typeVisible.minPoll" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150" v-if="handleButton">
        <template v-slot="scope">
          <el-button v-if="hasPermission('project:rule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('project:rule:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData" :categoryId="dataForm.categoryId" ></add-or-update>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./rule-add-or-update.vue";
import {ElMessageBox} from "element-plus";
import baseService from "@/service/baseService";
export default defineComponent({
  props:["categoryId","categoryStatus"],
  components: {
    AddOrUpdate
  },
  setup() {
    const addKey = ref(0);
    const addOrUpdateRef = ref();
    const addOrUpdateHandle = (id?: number) => {
      addKey.value++;
      nextTick(() => {
        addOrUpdateRef.value.init(id);
      });
    };
    const state = reactive({
      // getDataListURL: "/project/rule/page",
      getDataListIsPage: true,
      exportURL: "/project/rule/export",
      deleteURL: "/project/rule",
      deleteIsBatch: true,
      drawerRule:false,
      status:"",
      typeVisible: {
        maxNum: false,
        minNum: false,
        maxPoll: false,
        minPoll: false
      },
      addButton: true,
      handleButton: true,
      deleteButton: true,
      dataForm: {
        categoryId: "",
        categoryStatus: 0,
        categoryDTO:{},
        isAnon: "",
        type: ""
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    initRule(){
      this.dataForm.categoryId = this.categoryId;
      this.dataForm.categoryStatus = this.categoryStatus;
      console.log(this.dataForm.categoryId)
      this.drawerRule = true;
      this.getData();
    },
    getData(){
      baseService
        .get("/project/rule/page",{
          order: this.order,
          orderField: this.orderField,
          page: this.getDataListIsPage ? this.page : null,
          limit: this.getDataListIsPage ? this.limit : null,
          ...this.dataForm
        })
        .then((res) => {
          console.log(res);
          if (res.code !== 0) return false;
          this.dataList = res.data;
          this.dataListLoading = false;
          this.dataList = this.getDataListIsPage ? res.data.list : res.data;
          this.total = this.getDataListIsPage ? res.data.total : 0;
          this.getDataText()
          console.log(typeof this.dataForm.categoryStatus)
          if (this.dataList.length !== 0 || (this.dataForm.categoryStatus !== 0 && this.dataForm.categoryStatus !== 1 && this.dataForm.categoryStatus !== 2)) this.addButton = false;
          else this.addButton=true
          console.log(this.addButton)
        })
    },
    getDataText() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, isAnonText: "", typeText: "" };
      });
      if (this.dataForm.categoryStatus === 3 || this.dataForm.categoryStatus === 4) {
        this.handleButton = false;
        this.deleteButton = false;
      }
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].isAnon === 0) this.dataList[i].isAnonText = "匿名";
        else if (this.dataList[i].isAnon === 1) this.dataList[i].isAnonText = "不匿名";
      }

      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].type === 1) this.dataList[i].typeText = "投票制";
        else if (this.dataList[i].type === 2) this.dataList[i].typeText = "打分制";
        else if (this.dataList[i].type === 3) this.dataList[i].typeText = "表决制";
        else if (this.dataList[i].type === 4) this.dataList[i].typeText = "排名制";
      }

      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].type === 1) {
          this.typeVisible.maxPoll = true;
          this.typeVisible.minPoll = true;
          this.typeVisible.maxNum = false;
          this.typeVisible.minNum = false;
        } else if (this.dataList[i].type === 2) {
          this.typeVisible.maxNum = true;
          this.typeVisible.minNum = true;
          this.typeVisible.maxPoll = false;
          this.typeVisible.minPoll = false;
        } else if (this.dataList[i].type === 3) {
          this.typeVisible.maxPoll = false;
          this.typeVisible.minPoll = false;
          this.typeVisible.maxNum = false;
          this.typeVisible.minNum = false;
        } else if (this.dataList[i].type === 4) {
          this.typeVisible.maxPoll = false;
          this.typeVisible.minPoll = false;
          this.typeVisible.maxNum = false;
          this.typeVisible.minNum = false;
        }
      }
      if (this.dataList.length === 1) this.addButton = false;
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerRule = false;
          // this.$parent!.isParHidden();
        })
        .catch(() => {
          // catch error
        })
    },
  },
  watch: {
    // dataList:{
    //   handler(newData,oldData) {
    //     this.getDataText()
    //   } ,
    //   immediate:true,
    //   deep:true
    // }
  },
});
</script>
<style lang="scss">
.refresh {
  margin-bottom: 1%;
}
</style>
