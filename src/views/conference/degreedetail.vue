<template>
  <div class="mod-conference__degreedetail">
    <el-drawer v-model="drawerPro" title="学生" size="70%" direction="ltr" :before-close="handleClose">
      <el-form>
      <el-form-item>
        <el-button type="info" style="background-color: orange;border:none;" @click="refresh()">刷新</el-button>
      </el-form-item>
    </el-form>
    <figure>

      <!--        进度-->

      <div class="title">
        投票进度：<br /><br />
        <span>共 {{ sumVote }}人，已投 {{ voted }} 人</span>
        <!--          进度条-->
        <progre :width="300" :progress="pro"></progre>
      </div>
    </figure>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="participantName" label="投票人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="student.name" label="学生" header-align="center" align="center"></el-table-column>
      <el-table-column prop="subConferenceName" label="子会议" header-align="center" align="center"></el-table-column>
      <el-table-column prop="agree" label="同意" header-align="center" align="center"></el-table-column>
      <el-table-column prop="disagree" label="不同意" header-align="center" align="center"></el-table-column>
      <el-table-column prop="abandon" label="弃权" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
// import AddOrUpdate from "./degreedetail-add-or-update.vue";
import Progre from "@/views/conference/tprogress.vue";
import baseService from "@/service/baseService";
import { ElMessageBox } from "element-plus";
export default defineComponent({
  components: {
    Progre
  },
  setup() {
    const state = reactive({
      getDataListURL: "/conference/degreedetail/page",
      getDataListIsPage: true,
      exportURL: "/conference/degreedetail/export",
      deleteURL: "/conference/degreedetail",
      deleteIsBatch: true,
      sumVote: 0,
      noVote: 0,
      voted: 0,
      pro: 0,
      drawerPro:false,
      dataForm: {
        participantId: "",
        conferenceId: "",
        studentId: "",
        subConferenceId: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  props:["conferenceId","subConferenceId"],
  methods: {
    initPro(){
      this.drawerPro = true;
      this.dataForm.conferenceId = this.conferenceId;
      this.dataForm.subConferenceId = this.subConferenceId;
      this.refresh();
    },
    refresh(){
      this.getPro()
      this.getDataList();
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerPro = false;
        })
    },
    getPro() {
      baseService.post("/conference/degreevoterecord/get", { conferenceId: this.dataForm.conferenceId, subConferenceId: this.dataForm.subConferenceId }).then((res) => {
        console.log(res);
        if (res.code != 0) return false;
        this.pro = res.data.percent;
        this.sumVote = res.data.no + res.data.now;
        this.voted = res.data.now;
        this.noVote = res.data.no;
      });
      // for (let i = 0; i < this.dataList.length; i++) {
      //   this.dataList[i].voted = this.dataList[i].agree + this.dataList[i].disagree + this.dataList[i].abandon;
      //   if (this.partSum != 0) this.dataList[i].pro = (this.dataList[i].voted / this.partSum) * 100;
      //   else this.dataList[i].pro = 0;
      //   console.log(this.dataList[i].pro);
      // }
    }
  },
  watch: {},
  beforeMount() {
    // this.dataForm.conferenceId = this.$route.query.conferenceId;
    // this.dataForm.subConferenceId = this.$route.query.subConferenceId;
    // this.getPro();
  },
  beforeUpdate() {}
});
</script>
