<template>
  <!--  查看结果-->
  <el-drawer
  v-model="state.drawerRe"
  title="子议题"
  size="80%"
  direction="ltr"
  :before-close="handleClose"
>
  <el-empty description="暂无结果" image="src/assets/images/no_result.png" v-if="state.voted === 0" />
  <div class="mod-issues__issuesresults" v-if="state.voted != 0">

      <!--      <el-button type="info" :icon="RefreshRight" circle />-->
      <el-button type="info" class="refresh" @click="refresh()">
        <el-icon><Refresh /></el-icon>
      </el-button>
    <!--    导出-->
<!--    <div class="buttonBox" v-show="state.exportVisible">-->
<!--      <div class="exportBox">-->
<!--        <el-button type="info" v-if="state.hasPermission('issues:issuesresults:export')" class="export" @click="state.exportHandle()">-->
<!--          <div class="img"><img src="@/assets/images/issues/export_result.png" alt="" /></div>-->
<!--          {{ $t("export") }}-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </div>-->
    <!--    结果展示-->
    <div class="result">
      <figure>
        <!--        进度-->
        <div class="title">
          投票进度：<br /><br />
          <span>共 {{ state.sumVote }}人，已投 {{ state.voted }} 人</span>
          <!--          进度条-->
          <progre :width="300" :progress="state.pro"></progre>
        </div>
        <!--        饼状图显示结果-->
<!--        :theme="theme" :autoresize="autoResize"-->
        <v-chart :option="pie"/>
      </figure>
      <!--      意见展示-->
      <div class="comments">
        <div class="box" v-for="(item, index) in state.dataList" :key="index">
<!--          <span>第{{ index + 1 }}个</span><br />-->
          <div class="result_box">
            <div class="img">
              <img src="@/assets/images/result_list.png" alt="" />
            </div>
            <el-tooltip class="box-item" effect="light" content="结果" placement="top">
              <div class="result">
                <p>{{ item.result }}</p>
              </div>
            </el-tooltip>
          </div>
          <div class="opinion_box">
            <div class="img">
              <img src="@/assets/images/recom.png" alt="" />
            </div>
            <el-tooltip class="box-item" effect="light" content="建议" placement="top">
              <div class="opinion">
                <p>{{ item.opinion }}</p>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
  </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import {defineProps,defineComponent, onBeforeMount, onBeforeUpdate, onMounted, reactive, ref, toRefs} from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import Progre from "@/views/issues/tprogress.vue";
import baseService from "@/service/baseService";
import { DatasetComponent, DataZoomComponent, GeoComponent, GridComponent, LegendComponent, PolarComponent, TitleComponent, ToolboxComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { ElMessageBox } from "element-plus";
import {Message} from "@element-plus/icons-vue";

use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);

// export default defineComponent({
const props=defineProps(["subIssuesId"])
const components=defineComponent( {Progre, VChart})
const view = reactive({
      // getDataListURL: "/issues/issuesresults/page",
      getDataListIsPage: true,
      exportURL: "/issues/issuesresults/export",
      deleteURL: "/issues/issuesresults",
      deleteIsBatch: true,
      order:"",
      orderField:"",
      page:1,
      limit:10,
      exportVisible: false,
      drawerRe:false,
      dataForm: {
        userId: "",
        status: "",
        subIssuesId: ""
      },
      subStatus: "",
      voted: 0,
      sumVote: 0,
      pro: 0,
      result: [
        {value:0,name:"同意"},
        {value:0,name:"不同意"},
        {value:0,name:"弃权"}
      ]
    });
const state = reactive({ ...useView(view), ...toRefs(view) })
const getPieData = ()=>{
  const data = state.result
  return data
}
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
      data: getPieData(),
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
const initResult = ()=>{
  state.drawerRe = true;
  state.dataForm.subIssuesId=props.subIssuesId
  baseService.get("/issues/issuesresults/page",{order: state.order,
    orderField: state.orderField,
    page: state.getDataListIsPage ? state.page : null,
    limit: state.getDataListIsPage ? state.limit : null,
    ...state.dataForm}).then(res => {
    if(res.code != 0) return false;
    state.dataList = res.data.list;
    state.total = state.getDataListIsPage ? res.data.total : 0;
  })
  refresh();
}
const refresh=()=>{
  checkPro();
  getData();
}
const handleClose = (done:()=>void)=> {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          // this.drawerSu = false;
          done();
        })
        .catch(() => {
          // catch error
        })
    }
/**
 * 处理饼状图展示数据
 */
const checkPro=()=> {
      baseService.get("/issues/issuesresults/show", { subIssuesId: state.dataForm.subIssuesId }).then((res) => {
        console.log(res)
        if (res.code != 0) {
          return Message.error(res.msg);
        }
        state.result[0].value = res.data.agree.total;
        state.result[1].value = res.data.disagree.total;
        state.result[2].value = res.data.giveUp.total;
        state.sumVote = res.data.allnumber;
        state.voted = res.data.all.total;
        state.pro = Math.round(state.voted / state.sumVote * 100);
      });
    }
    /**
     * 处理数据
     */
    const getData = ()=> {
      if (state.subStatus === "2") state.exportVisible = true;
      return state.result
    }
  onMounted(()=>{
    let number = 0;
    let timeid = setInterval(()=>{
      if(state.dataList!.length >0){
        initResult()
        clearTimeout(timeid)
      }
      if(number>30){
        clearTimeout(timeid)
      }
      number++
    },99)
  })
  onBeforeUpdate(()=>{
    getData();
  })
defineExpose({initResult})
</script>
<style lang="less" scoped>
.refresh {
  margin-bottom: 2%;
}
.buttonBox {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;

  .exportBox {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;

    .export {
      margin: 0 auto;
      height: 50px;
      font-size: 20px;
      width: 50%;

      .img {
        width: 25px;
        height: 25px;
        margin-right: 20px;

        img {
          width: 100%;
        }
      }
    }
  }
}

.result {
  display: flex;
  .comments {
    flex: 6;
    .box {
      margin-top: 15px;
      width: 100%;
      padding: 1.5%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

      span {
        color: #5b5f69;
      }
      //议题介绍
      .result_box {
        display: flex;
        justify-content: center;

        .img {
          width: 5%;
          display: flex;
          align-items: center;
          margin-right: 2.5%;
          img {
            width: 100%;
          }
        }
        .result {
          width: 100%;
          font-size: 14px;
          color: #5b5f69;
          border-radius: 8px;
        }
        .result:hover {
          background-color: rgba(241, 193, 121, 0.51);
        }
      }
      .opinion_box {
        display: flex;
        justify-content: center;

        .img {
          width: 5%;
          display: flex;
          align-items: center;
          margin-right: 2.5%;
          img {
            width: 100%;
          }
        }
        .opinion {
          border-radius: 8px;
          display: block;
          height: 50px;
          width: 100%;
          padding: 2px;
          font-size: 14px;
          overflow: scroll;
        }
        .opinion:hover {
          background-color: rgba(241, 193, 121, 0.51);
        }
      }
    }
  }
  figure {
    display: inline-block;
    position: relative;
    flex: 4;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: 0 0 45px rgba(0, 0, 0, 0.2);
    padding: 30px;

    .title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2%;
      font-weight: 500;
    }
    .echarts {
      width: 30vw;
      min-width: 400px;
      height: 300px;
    }
  }
}
</style>
