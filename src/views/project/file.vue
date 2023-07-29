<template>
  <div class="mod-project__prjprojectfile">
    <el-drawer
      v-model="drawerFile"
      title="文件"
      size="85%"
      direction="ttb"
      center
      :before-close="handleClose"
    >
    <el-form :inline="true" :model="dataForm" @keyup.enter="getData()">
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.projectId" placeholder="项目Id" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.fileId" placeholder="文件id" clearable></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="info" @click="getData()" class="refresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="文件名" clearable></el-input>
      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.creator" placeholder="创建者id" clearable></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="getData()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
<!--        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('project:file:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('project:file:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="projectDTO.name" label="项目" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="文件名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="creatorDTO.username" label="上传者" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('project:file:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('project:file:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData" :projectId="dataForm.projectId"></add-or-update>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./file-add-or-update.vue";
import {ElMessageBox} from "element-plus";
import baseService from "@/service/baseService";
export default defineComponent({
  props:["projectId"],
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
      // getDataListURL: "/project/file/page",
      getDataListIsPage: true,
      exportURL: "/project/file/export",
      deleteURL: "/project/file",
      deleteIsBatch: true,
      drawerFile:false,
      dataForm: {
        projectId: "",
        fileId: "",
        name: "",
        creator: ""
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods:{
    initFile(){
      this.dataForm.projectId = this.projectId;
      console.log(this.projectId)
      // this.getData();
      this.getData();
      setTimeout(()=>{
        this.drawerFile = true;
      },50);

    },
    getData(){
      baseService
        .get("/project/file/page",{
          order: this.order,
          orderField: this.orderField,
          page: this.getDataListIsPage ? this.page : null,
          limit: this.getDataListIsPage ? this.limit : null,
          ...this.dataForm
        })
        .then((res) => {
          console.log(res);
          if (res.code != 0) return false;
          this.dataList = res.data;
          this.dataListLoading = false;
          this.dataList = this.getDataListIsPage ? res.data.list : res.data;
          this.total = this.getDataListIsPage ? res.data.total : 0;
        })
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerFile = false;
        })
    },
  },
  watch: {},
});
</script>
