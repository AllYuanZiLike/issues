<template>
  <div class="mod-project__prjvoterecord">
    <el-drawer
      v-model="drawerRecord"
      title="项目评审明细"
      size="90%"
      direction="rtl"
      :before-close="handleClose"
    >
    <el-empty description="暂无结果" image="src/assets/images/no_result.png" v-if="voted === 0" />
    <div class="mod-thesis__tresults" v-if="voted != 0">
      <div class="result">
        <figure v-if="voted != 0">
          <div class="title">
<!--            <b-->
<!--              ><span>议题：{{ dataForm.issuesName }}</span-->
<!--              >&emsp;&emsp; <span>子议题：{{ dataForm.subissuesName }}</span></b-->
<!--            ><br /><br />-->
            <b>投票进度：</b>
            <span
              ><b>共 {{ sumVote }}人，已投 {{ voted }} 人</b></span
            ><br />
            <progre :width="300" :progress="pro"></progre>
          </div>
<!--          :theme="theme" :autoresize="autoResize"-->
          <v-chart :option="pie"/>
        </figure>
        <div class="comments">
          <div class="box" v-for="(item, index) in dataList" :key="index">
            <b
              ><span>第{{ index + 1 }}个</span></b
            ><br /><br />
            <span><b>结果：</b>{{ item.result }}</span
            ><br />
            <span class="opinion"><b>建议：</b>{{ item.opinion }}</span
            ><br />
          </div>
        </div>
      </div>
<!--      <el-pagination :current-page="page" :page-sizes="[10]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>-->
    </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, ref, toRefs } from "vue";
// import AddOrUpdate from "./voterecord-add-or-update.vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import { DatasetComponent, DataZoomComponent, GeoComponent, GridComponent, LegendComponent, PolarComponent, TitleComponent, ToolboxComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import Progre from "@/views/project/tprogress.vue";
import baseService from "@/service/baseService";
import {ElMessageBox} from "element-plus";
use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);

export default defineComponent({
  props:["projectId","projectStatus"],
  components: {
    // AddOrUpdate,
    Progre
  },
  setup() {
    const state = reactive({
      // getDataListURL: "/project/voterecord/page",
      getDataListIsPage: true,
      // exportURL: "/project/voterecord/export",
      // deleteURL: "/project/voterecord",
      deleteIsBatch: true,
      drawerRecord:false,
      dataForm: {
        participantId: "",
        projectId: "",
        activityId: "",
        agree: "",
        disagree: "",
        abandon: ""
      },
      voted:0,
      sumVote:0,
      pro:0,
      activityStatus: ""
    });
    const pie = ref({
      title: {
        text: "投票结果",
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
            case "同意":
              return pieDataItem + "\r" + pie.value.series[0].data[0].value + "人";
            case "不同意":
              return pieDataItem + "\r" + pie.value.series[0].data[1].value + "人";
            case "弃权":
              return pieDataItem + "\r" + pie.value.series[0].data[2].value + "人";
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
            { value: 0, name: "同意" },
            { value: 0, name: "不同意" },
            { value: 0, name: "弃权" }
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
    return { pie, ...useView(state), ...toRefs(state) };
  },
  methods: {
    initRecord(){
      this.dataForm.projectId = this.projectId;
      this.drawerRecord = true;
      this.getDataList();
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerRecord = false;
          // this.$parent!.isParHidden();
        })
        .catch(() => {
          // catch error
        })
    },
    checkPro() {
    baseService.get("/project/voterecord/show", { projectId: this.dataForm.projectId }).then((res) => {
      console.log(res);
      // if (res.code != 0) {
      //   return this.$message.error(res.msg);
      // }
      // this.sumVote = res.data.allnumber;
      // this.voted = res.data.agree.total + res.data.disagree.total + res.data.giveUp.total;
      // this.pro = parseInt((this.voted / this.sumVote) * 100);
      // console.log(this.pro);
    });
    }
  },
  watch: {},
  beforeMount() {

    // this.dataForm. = this.projectStatus;
  }
});
</script>
