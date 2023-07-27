<template>
  <div class="mod-conference__degreeconferenceparticipant">
    <el-drawer
      v-model="drawerPar"
      title="参与人员"
      size="90%"
      direction="rtl"
      :before-close="handleClose"
    >
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.participantId" placeholder="参与人" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.conferenceId" placeholder="会议" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.duty" placeholder="参与人职责" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-button @click="getDataList()">{{ $t("query") }}</el-button>-->
      <!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button v-if="hasPermission('conference:degreeconferenceparticipant:export')" type="info" @click="exportHandle(dataForm.conferenceId)">{{ $t("export") }}</el-button>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button v-if="hasPermission('conference:degreeconferenceparticipant:save')" type="primary" v-show="buttonShow" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('conference:degreeconferenceparticipant:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="participantName" label="参与人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="conference.name" label="会议" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dutyText" label="参与人职责" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('conference:degreeconferenceparticipant:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('conference:degreeconferenceparticipant:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>

      <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" :conferenceId="dataForm.conferenceId"></add-or-update>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./degreeconferenceparticipant-add-or-update.vue";
import { ElMessageBox } from "element-plus";
export default defineComponent({
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
      getDataListURL: "/conference/degreeconferenceparticipant/page",
      getDataListIsPage: true,
      exportURL: "/conference/degreeconferenceparticipant/export",
      deleteURL: "/conference/degreeconferenceparticipant",
      buttonShow: true,
      deleteIsBatch: true,
      drawerPar:false,
      conferenceStatus: "",
      dataForm: {
        participantId: "",
        conferenceId: "",
        duty: ""
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  props:["conferenceId"],
  methods: {
    initPart(){
      this.drawerPar = true;
      this.dataForm.conferenceId = this.conferenceId;
      if (this.conferenceStatus === "1" || this.conferenceStatus === "2") this.buttonShow = false;
      this.refresh();
    },
    refresh(){
      this.getDataList();
      this.getData();
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerPar = false;
        })
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(row);
      var n = "";
      if (row.duty === 1) {
        n = "warning-row";
      } else if (row.duty === 2) {
        n = "success-row";
      }
      console.log(n);
      return n;
    },
    getData() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, dutyText: "" };
      });
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].duty === 0) this.dataList[i].dutyText = "投票人";
        else if (this.dataList[i].duty === 1) this.dataList[i].dutyText = "监票人";
        else if (this.dataList[i].duty === 2) this.dataList[i].dutyText = "计票人";
      }
    }
  },
  watch: {
    dataList:{
      immediate:true,
      handler(newValue,oldValue){
        if(newValue) this.getData()
      }
    }
  },
  beforeMount() {
    this.dataForm.conferenceId = this.conferenceId;
  },
  // beforeUpdate() {
  //   this.getData();
  // }
});
</script>
<style>
.el-table .warning-row {
  background: #fff6ba;
}

.el-table .success-row {
  background: #c8ffd8;
}
</style>
