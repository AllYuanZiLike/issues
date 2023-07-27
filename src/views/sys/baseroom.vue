<template>
  <div class="mod-sys__baseroom">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.name" placeholder="会议室名称" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.site" placeholder="会议室地点" clearable></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item>-->
      <!--        <el-input v-model="dataForm.beginTime" placeholder="开始时间" clearable></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <!--        <el-input v-model="dataForm.status" placeholder="会议室状态（0：未启用;1：可用;2：停用）" clearable></el-input>-->
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option v-for="item in statusText" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('sys:baseroom:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('sys:baseroom:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="会议室名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="site" label="会议室地点" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column prop="beginTime" label="开始时间" header-align="center" align="center"></el-table-column>-->
      <!--      <el-table-column prop="endTime" label="结束时间" header-align="center" align="center"></el-table-column>-->
      <el-table-column prop="statusText" label="会议室状态" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('sys:baseroom:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('sys:baseroom:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./baseroom-add-or-update.vue";
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
      getDataListURL: "/sys/baseroom/page",
      getDataListIsPage: true,
      exportURL: "/sys/baseroom/export",
      deleteURL: "/sys/baseroom",
      deleteIsBatch: true,
      dataForm: {
        id:"",
        name: "",
        site: "",
        beginTime: "",
        status: ""
      },
      statusText: [
        { value: 0, label: "未启用" },
        { value: 1, label: "可用" },
        { value: 2, label: "停用" }
      ]
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    getText() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, statusText: "" };
      });
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 0) this.dataList[i].statusText = "未启用";
        else if (this.dataList[i].status === 1) this.dataList[i].statusText = "可用";
        else if (this.dataList[i].status === 0) this.dataList[i].statusText = "停用";
      }
    }
  },
  watch: {},
  beforeUpdate() {
    this.getText();
  }
});
</script>
