<template>
  <div class="mod-project__voteresult">
    <el-drawer
      v-model="drawerResult"
      title="评审明细"
      size="90%"
      direction="rtl"
      :before-close="handleClose"
      class="drawer"
    >
      <el-button type="info" @click="getData()" class="refresh">
        <el-icon><Refresh /></el-icon>
      </el-button>
    <el-button type="primary" class="confirmButton" @click="confirmResult()" v-show="emptyVisible">确认评审结果</el-button>
    <el-table v-loading="dataListLoading" :data="Listform" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="项目" header-align="center" align="center"></el-table-column>
      <el-table-column prop="creatorDTO.username" label="项目申请人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="categoryDTO.name" label="项目评审" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dto.agree" label="同意" header-align="center" align="center" v-if="decideVisible"></el-table-column>
      <el-table-column prop="dto.disagree" label="不同意" header-align="center" align="center" v-if="decideVisible"></el-table-column>
      <el-table-column prop="dto.abandon" label="弃权" header-align="center" align="center" v-if="decideVisible"></el-table-column>
      <el-table-column prop="dto.poll" label="票数" header-align="center" align="center" v-if="pollVisivle"></el-table-column>
      <el-table-column prop="dto.grade" label="评分" header-align="center" align="center" v-if="scoreVisible"></el-table-column>
      <el-table-column prop="dto.rank" label="排名" header-align="center" align="center" v-if="sortVisible"></el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <div class="mod-thesis__tresults" v-if="processVisible">
      <div>
        <figure v-if="sumVote != 0">
          <div class="item_box">
<!--            :theme="theme" :autoresize="autoResize"-->
            <v-chart :option="pie" />
            <el-empty description="项目评审进行中" image="src/assets/images/empty_voting.png" v-if="emptyVisible" />
          </div>
        </figure>
      </div>
    </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import useView from "@/hooks/useView";
import baseService from "@/service/baseService";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { defineComponent, reactive, ref, toRefs } from "vue";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import Progre from "@/views/project/tprogress.vue";
import {useAppStore} from "@/store";
import { DatasetComponent, DataZoomComponent, GeoComponent, GridComponent, LegendComponent, PolarComponent, TitleComponent, ToolboxComponent, TooltipComponent, VisualMapComponent } from "echarts/components";

use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);

export default defineComponent({
  props:["categoryStatus","categoryId","isAdd"],
  components: {
    VChart,
    // eslint-disable-next-line vue/no-unused-components
    Progre
  },
  provide: {
    [THEME_KEY]: "westeros"
  },
  setup() {
    const store = useAppStore();
    const state = reactive({
      // getDataListURL: "/project/votereesult/page",
      getDataListIsPage: true,
      // exportURL: "/project/votereesult/export",
      // deleteURL: "/project/votereesult",
      deleteIsBatch: true,

      Listform: [],
      drawerResult:false,
      dataForm: {
        participantId: "",
        activityId: "",
        categoryId:"",
        categoryStatus: "",
        agree: "",
        disagree: "",
        abandon: ""
      },
      userLogin: {
        duty: 0,
        id: "",
        realName: "",
        username: ""
      },
      type: 0,
      tableVisible: false,
      pollVisivle: false,
      scoreVisible: false,
      decideVisible: false,
      sortVisible: false,
      emptyVisible: false,
      processVisible:false,
      sumVote: 0,
      voted: 0,
      disvote: 0,
      pro: 0
    });
    const pie = ref({
      title: {
        text: "投票进度",
        left: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        // data: ["同意", "不同意", "弃权"],
        formatter: function (pieDataItem: string) {
          // 返回值
          let reData = "";
          switch (pieDataItem) {
            case "已投":
              return pieDataItem + "\r" + pie.value.series[0].data[0].value + "人";
            case "未投":
              return pieDataItem + "\r" + pie.value.series[0].data[1].value + "人";
          }
          return reData;
        }
      },
      series: [
        {
          name: "投票结果",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: 0, name: "已投" },
            { value: 1, name: "未投" }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 5,
              shadowColor: "rgba(0,0,0,0.5)"
            }
          }
        }
      ]
    });
    return { store, pie, ...useView(state), ...toRefs(state) };
  },
  methods: {
    initResult(){
      this.dataForm.categoryId = this.categoryId
      this.dataForm.categoryStatus = this.categoryStatus
      this.getLoginUser()
      this.getData()
      this.drawerResult = true;
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerResult = false;
          // this.$parent!.isParHidden();
        })
        .catch(() => {
          // catch error
        })
    },
    getLoginUser() {
      this.userLogin.id = this.store.state.user.id;
      this.userLogin.realName = this.store.state.user.realName;
      this.userLogin.username = this.store.state.user.username;
    },
    getData() {
      console.log("项目评审状态" + " " + this.categoryStatus)
      if (this.categoryStatus===3) {
        this.processVisible=true;
        this.emptyVisible = true;
        if(this.isAdd) this.emptyVisible=false
        this.tableVisible = false;
        this.dataForm.participantId=this.store.state.user.id
        this.dataForm.categoryId =this.categoryId
        this.dataForm.categoryStatus=this.categoryStatus
        console.log(this.dataForm)

        baseService.post("/project/voterecord/show", { categoryId: this.dataForm.categoryId }).then((res) => {
          console.log("show")
          console.log(res);
          if (res.code != 0) return false;
          if(res.data.length!=0) this.type = res.data[0].categoryDTO.ruleDTO.type;
          this.Listform = res.data;
          if (this.type === 1) {
            this.pollVisivle = true;
            this.scoreVisible = false;
            this.decideVisible = false;
            this.sortVisible = false;
          } else if (this.type === 2) {
            this.pollVisivle = false;
            this.scoreVisible = true;
            this.decideVisible = false;
            this.sortVisible = false;
          } else if (this.type === 3) {
            this.pollVisivle = false;
            this.scoreVisible = false;
            this.decideVisible = true;
            this.sortVisible = false;
          } else if (this.type === 4) {
            this.pollVisivle = false;
            this.scoreVisible = false;
            this.decideVisible = false;
            this.sortVisible = true;
          }
        });

        baseService.post("/project/voterecord/exhibition", { categoryId: this.dataForm.categoryId }).then((res) => {
          console.log("exhibition")
          console.log(res);
          if (res.code != 0) {
            return this['$message'].error(res.msg);
          }
          this.sumVote = res.data.all;
          this.voted = res.data.submitted;
          if (this.sumVote === 0) this.pro = 0;
          else this.pro = (this.voted / this.sumVote) * 100;

          this.disvote = this.sumVote - this.voted;
          this.pie.series[0].data[0].value = this.voted;
          this.pie.series[0].data[1].value = this.disvote;
        });
      } else if (this.categoryStatus===4) {
        this.processVisible=false;
        this.emptyVisible = false;
        this.tableVisible = true;
        this.dataForm.categoryId = this.categoryId
        console.log(this.dataForm.categoryId)
        baseService.post("/project/voterecord/show", { categoryId: this.dataForm.categoryId }).then((res) => {
          console.log("show")
          console.log(res);
          if (res.code != 0) return false;
          this.type = res.data[0].categoryDTO.ruleDTO.type;
          this.Listform = res.data;
          console.log(this.type);
          if (this.type === 1) {
            this.pollVisivle = true;
            this.scoreVisible = false;
            this.decideVisible = false;
            this.sortVisible = false;
          } else if (this.type === 2) {
            this.pollVisivle = false;
            this.scoreVisible = true;
            this.decideVisible = false;
            this.sortVisible = false;
          } else if (this.type === 3) {
            this.pollVisivle = false;
            this.scoreVisible = false;
            this.decideVisible = true;
            this.sortVisible = false;
          } else if (this.type === 4) {
            this.pollVisivle = false;
            this.scoreVisible = false;
            this.decideVisible = false;
            this.sortVisible = true;
          }
          console.log(this.pollVisivle, this.scoreVisible, this.decideVisible, this.sortVisible);
        });
      }
    },
    confirmResult() {
      console.log(this.dataForm.categoryId,this.userLogin.id)
      if (this.sumVote === this.voted) {
        ElMessageBox.confirm("确认后无法再次修改", "Warning", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          baseService.get("/project/category/confirm", { categoryId: this.dataForm.categoryId, participantId: this.userLogin.id }).then((res) => {
            console.log(res);
            if (res.code != 0) return false;
            // this.$router.push({
            //   path: "/project/vote"
            // });
            this['$message']({
              message: "确认成功",
              duration: 2000,
              onClose: ()=>{
                this.drawerResult = false
                this.$emit("changeResultVisible");
              }
            });
          });
        });
      } else {
        this['$message']({
          message: "投票人未投完,暂不能确认结果",
          duration: 2000
        });
      }
    }
  },
  watch: {},
  mounted() {
    this.getData();
  }
});
</script>
<style lang="less">
.drawer {
  background-image: url(@/assets/images/item-bg.jpg) !important;
  background-size: 100% auto !important;
  .refresh {
    margin-right: 2%;
  }
.confirmButton {
  margin: 2vh auto;
}
figure {
  display: inline-block;
  position: relative;
  flex: 4;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  justify-content: center;
  .item_box {
    display: flex;
    justify-content: center;
    .echarts {
      width: 30vw;
      min-width: 400px;
      height: 300px;
    }
  }
 }
}
</style>
