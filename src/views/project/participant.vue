<template>
  <div class="mod-project__prjactivityparticipant">
    <el-drawer
      v-model="drawerPart"
      title="参与人"
      size="90%"
      direction="rtl"
      :before-close="handleClose"
    >
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-button type="info" @click="getDataList()" class="refresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('project:participant:save')" type="primary" v-show="addButton" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('project:participant:delete')" type="danger" v-show="updateOrDelete" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="userDTO.username" label="参与人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dutyText" label="参与人身份" header-align="center" align="center"></el-table-column>
      <el-table-column prop="categoryDTO.name" label="项目评审" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150"  v-if="updateOrDelete">
        <template v-slot="scope">
          <el-button v-if="hasPermission('project:participant:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('project:participant:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" :categoryId="dataForm.categoryId"></add-or-update>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./participant-add-or-update.vue";
import {ElMessageBox} from "element-plus";
import dayjs from "dayjs";
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
      getDataListURL: "/project/participant/page",
      getDataListIsPage: true,
      exportURL: "/project/participant/export",
      deleteURL: "/project/participant",
      deleteIsBatch: true,
      addButton: true,
      updateOrDelete:true,
      drawerPart:false,
      dataForm: {
        categoryId: "",
        participantId: "",
        categoryStatus: 0,
        duty: ""
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    initPart(){
      console.log(this.dataForm.categoryId)
      console.log(this.categoryId)
      this.dataForm.categoryId = this.categoryId;
      this.dataForm.categoryStatus = this.categoryStatus;
      this.drawerPart = true;
      this.getDataList();
      if (this.dataForm.categoryStatus != 0) this.addButton = false;
      if(this.dataForm.categoryStatus === 3 || this.dataForm.categoryStatus === 4) this.updateOrDelete = false
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerPart = false;
          // this.$parent!.isParHidden();
        })
        .catch(() => {
          // catch error
        })
    },
    tableRowClassName({ row, rowIndex }) {
      var n = "";
      if (row.duty === 1) {
        n = "warning-row";
      } else if (row.duty === 2) {
        n = "success-row";
      }
      return n;
    },
    /**
     * 处理数据
     */
    getData() {
      if (this.dataForm.categoryStatus === 3 || this.dataForm.categoryStatus === 4) this.addButton = false;
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, dutyText: "" };
      });
      //处理日期显示
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].createDate = dayjs(this.dataList[i].createDate).format("YYYY-MM-DD hh:mm:ss");
      }
      //处理身份显示
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].duty === 0) this.dataList[i].dutyText = "投票人";
        else if (this.dataList[i].duty === 1) this.dataList[i].dutyText = "监票人";
        else if (this.dataList[i].duty === 2) this.dataList[i].dutyText = "计票人";
      }
    }
  },
  watch: {
    dataList:{
      handler(newData,oldData) {
        this.getData()
      } ,
      immediate:true,
      deep:true
    }
  },
  beforeMount() {
    this.dataForm.categoryId = this.categoryId;

    // this.getData();
  }
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
