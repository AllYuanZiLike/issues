<template>
  <!--  上传文件-->
  <div class="mod-issues__subissuesfile">
    <el-drawer
      v-model="drawerFi"
      title="子议题"
      size="70%"
      direction="ttb"
      :before-close="handleClose"
    >
      <!--      <el-button type="info" :icon="RefreshRight" circle />-->
      <el-button type="info" class="refresh" @click="refresh()">
        <el-icon><Refresh /></el-icon>
      </el-button>
    <!--    顶部按钮-->
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <!--      导出-->
      <el-form-item>
        <el-button type="info" v-if="hasPermission('issues:subissuesfile:export')" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <!--      新增-->
      <el-form-item>
        <el-button v-if="hasPermission('issues:subissuesfile:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <!--      删除-->
      <el-form-item>
        <el-button v-if="hasPermission('issues:subissuesfile:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <!--    表格展示-->
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="subIssues.name" label="所属子议题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="文件名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('issues:subissuesfile:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('issues:subissuesfile:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页器-->
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" :subissuesId="dataForm.subIssuesId"></add-or-update>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./subissuesfile-add-or-update.vue";
import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
export default defineComponent({
  props:["subIssuesId"],
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
      getDataListURL: "/issues/subissuesfile/page",
      getDataListIsPage: true,
      exportURL: "/issues/subissuesfile/export",
      deleteURL: "/issues/subissuesfile",
      deleteIsBatch: true,
      drawerFi:false,
      dataForm:{
        subIssuesId:"",
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    initFile(){
      this.drawerFi = true;
      this.refresh();
    },
    refresh(){
      this.changeDate();
    },
    handleClose(done:()=>void) {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          // this.drawerSu = false;
          done();
        })
        .catch(() => {
          // catch error
        })
    },
    /**
     * 处理日期显示
     */
    changeDate() {
      for (let i = 0; i < this.dataList!.length; i++) {
        this.dataList![i].createDate = dayjs(this.dataList![i].createDate).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  },
  watch: {
    dataList:{
      immediate:true,
      handler(newValue,oldValue){
        this.initFile()
      }
    },
  },
  beforeMount() {
    this.dataForm.subIssuesId = this.subIssuesId;
    console.log(this.dataForm.subIssuesId);
  }
});
</script>
<style lang="less" scoped>
.refresh {
  margin-bottom: 1%;
}
</style>
