<template>
  <div class="mod-conference__stdstudent">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.no" placeholder="学号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="学生姓名" clearable></el-input>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="info" @click="exportHandle(dataForm.clazzId)">{{ $t("export") }}</el-button>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button v-if="hasPermission('conference:stdstudent:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('conference:stdstudent:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="no" label="学号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="name" label="学生姓名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="genderText" label="性别" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sortText" label="学生类别" header-align="center" align="center"></el-table-column>
      <el-table-column prop="edBackText" label="学历层次" header-align="center" align="center"></el-table-column>
      <el-table-column prop="majorName" label="毕业证专业" header-align="center" align="center"></el-table-column>
      <el-table-column prop="grantCatorName" label="学位授予门类" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('conference:stdstudent:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('conference:stdstudent:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./stdstudent-add-or-update.vue";
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
      getDataListURL: "/conference/stdstudent/page",
      getDataListIsPage: true,
      exportURL: "/conference/stdstudent/export",
      deleteURL: "/conference/stdstudent",
      deleteIsBatch: true,
      dataForm: {
        no: "",
        name: "",
        gender: "",
        educationBackground: "",
        collegeId: "",
        clazzId: "",
        disciplineId: "",
        majorId: "",
        categoryId: "",
        grantCategoryId: ""
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    getDataText() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, genderText: "", edBackText: "", sortText: "" };
      });
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].gender === 0) this.dataList[i].genderText = "女";
        else if (this.dataList[i].gender === 1) this.dataList[i].genderText = "男";
      }
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].educationBackground === 0) this.dataList[i].edBackText = "本科";
        else if (this.dataList[i].educationBackground === 1) this.dataList[i].edBackText = "研究生";
      }
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].sort === 1) this.dataList[i].sortText = "普通";
        else if (this.dataList[i].sort === 2) this.dataList[i].sortText = "上会讨论";
        else if (this.dataList[i].sort === 3) this.dataList[i].sortText = "往届";
        else if (this.dataList[i].sort === 4) this.dataList[i].sortText = "双学位";
        else if (this.dataList[i].sort === 5) this.dataList[i].sortText = "成人学科";
        else if (this.dataList[i].sort === 6) this.dataList[i].sortText = "研究生";
      }
    }
  },
  watch: {},
  beforeUpdate() {
    this.getDataText();
  }
});
</script>
