<template>
  <!--  添加参与人-->
  <div class="mod-issues__issuesparticipant">
    <el-drawer v-model="drawerPar" title="参与人员" size="90%" direction="rtl" :before-close="handleClose">
    <!--    顶部按钮-->
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-button type="info" @click="refresh()" class="refresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-form-item>
      <!--      导出-->
<!--      <el-form-item>-->
<!--        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>-->
<!--      </el-form-item>-->
      <!--      新增-->
      <el-form-item v-show="buttonShow">
        <el-button v-if="hasPermission('issues:issuesparticipant:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <!--      删除-->
      <el-form-item v-show="buttonShow">
        <el-button v-if="hasPermission('issues:issuesparticipant:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <!--    展示表格-->
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="user.username" label="用户" header-align="center" align="center"></el-table-column>
      <el-table-column prop="powerText" label="身份" header-align="center" align="center"></el-table-column>
      <el-table-column prop="issues.name" label="所属议题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150" v-if="buttonShow">
        <template v-slot="scope">
          <el-button v-if="hasPermission('issues:issuesparticipant:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('issues:issuesparticipant:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" :issuesId="dataForm.issuesId"></add-or-update>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./issuesparticipant-add-or-update.vue";
import dayjs from "dayjs";
import { ElMessageBox } from 'element-plus'
export default defineComponent({
  props:["issuesId","partFresh","issuesStatus"],
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
      getDataListURL: "/issues/issuesparticipant/page",
      getDataListIsPage: true,
      exportURL: "/issues/issuesparticipant/export",
      deleteURL: "/issues/issuesparticipant",
      deleteIsBatch: true,
      buttonShow: true,
      drawerPar:false,
      Fresh:false,
      status: 0,
      dataForm: {
        userId: "",
        issuesId: "",
        createDate: ""
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    initPart(){
      this.drawerPar = true;
      this.dataForm.issuesId=this.$props.issuesId
      this.status=this.$props.issuesStatus
      this.refresh();
      console.log(this.status)
      if (this.status === 1 || this.status === 2) this.buttonShow = false;
    },
    refresh(){
      this.getDataList();
      this.getData()
    },
     handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerPar = false;
        })
    },
    tableRowClassName({ row, rowIndex :any }) {
      var n = "";
      if (row.power === 1) {
        n = "warning-row";
      } else if (row.power === 2) {
        n = "success-row";
      }
      return n;
    },
    /**
     * 处理数据
     */
    getData() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, powerText: "" };
      });
      //处理日期显示
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].createDate = dayjs(this.dataList[i].createDate).format("YYYY-MM-DD hh:mm:ss");
      }
      //处理身份显示
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].power === 0) this.dataList[i].powerText = "投票人";
        else if (this.dataList[i].power === 1) this.dataList[i].powerText = "监票人";
        else if (this.dataList[i].power === 2) this.dataList[i].powerText = "计票人";
      }
    }
  },
  watch: {
    dataList:{
      immediate:true,
      handler(newValue,oldValue){
        this.getData()
      }
    }
  },
  beforeMount() {
    this.dataForm.issuesId = this.issuesId;
    this.Fresh = this.partFresh;
  },
  mounted() {
    if(this.Fresh){
      this.getDataList();
      this.Fresh = false;
      this.dataForm.issuesId = this.issuesId;

    }
  },
});
</script>
<style>
.refresh {
  margin-bottom: 1%;
}
.el-table .warning-row {
  background: #fff6ba;
}

.el-table .success-row {
  background: #c8ffd8;
}
</style>
