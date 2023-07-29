<template>
  <!--  议题-->
  <div class="mod-issues__issues">
    <el-drawer
      v-model="drawerHis"
      title="历史会议"
      size="50%"
      direction="rtl"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="dataForm" @keyup.enter="getData()">
        <el-form-item>
          <el-button type="info" @click="refresh()" class="refresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-form-item>
        <!--      删除-->
        <el-form-item>
          <el-button v-if="hasPermission('issues:subissuesfile:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
        </el-form-item>
      </el-form>

    <!--    议题列表-->
      <el-table v-loading="dataListLoading" :data="dataList" style="width: 100%" border @selection-change="dataListSelectionChangeHandle">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="议题" width="180" align="center"></el-table-column>
        <el-table-column prop="stopTime" label="结束时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="info" v-if="hasPermission('issues:issues:checkSubissues')" @click="checkSubissues(scope.row.id, scope.row.status)">查看子议题</el-button>
            <el-button size="small" type="danger" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <!--    分页器 -->
    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </el-drawer>
    <subissues v-if="drawerSub" ref="sub" :issuesId="currentId" :issuesStatus="currentStatus" @refreshDataList="getDataList"></subissues>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, nextTick, reactive, toRefs } from "vue";
import { ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import baseService from "@/service/baseService";
import subissues from "@/views/issues/subissues.vue";
export default defineComponent({
  components: {
    subissues
  },
  setup() {
    const state = reactive({
      // getDataListURL: "/issues/issues/page",
      getDataListIsPage: true,
      exportURL: "/issues/subissues/export",
      deleteURL: "/issues/issues",
      deleteIsBatch: true,
      drawerHis:false,//抽屉
      drawerSub:false,//子议题抽屉
      currentId:"",//当前议题id
      currentStatus:0,//当前议题状态
      dataForm:{
        id:"",
        name:"",
        info:"",
        room_id:"",
        status:2                                            ,
        start_time:"",
        stop_time:"",
        begin_time:"",
        end_time:"",
        counter_id:"",
        counter_time:"",
        supervisor_id:"",
        scrutator_time:"",
        sort:"",
        del_flag:"",
        creator:"",
        create_date:"",
        updater:"",
        updata_date:""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    getData(){
      baseService
        .get("/issues/issues/page",{
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
          this.getNumber()
        })
    },
    /**
     * 拿到dataList后，处理数据
     */
    getNumber() {
      /**
       *处理议题盒子底部按钮状态
       */

        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i].stopTime = dayjs(this.dataList[i].stopTime).format("YYYY-MM-DD HH:mm:ss")
        }
      console.log("日期处理")
    },

    initHis(){
      this.drawerHis = true;
      this.refresh();
      // if (this.status === 1 || this.status === 2) this.buttonShow = false;
    },
    /**
     * 跳转查看子议题页面
     * @param id
     * @param status
     */
    checkSubissues(id: string, status: number) {
      this.drawerSub = true;
      this.currentId = "";
      this.currentId = id;
      this.currentStatus = status;
      let that:any = this
      nextTick(()=>{
        that.$refs["sub"].initSub();
        that.$refs["sub"].$forceUpdate()
      })
    },
    refresh(){
      this.getData();
      this.getNumber()
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerHis = false;
          // this.$parent!.isParHidden();
        })
        .catch(() => {
          // catch error
        })
    },
  },
  watch: {
  },
  beforeMount() {
    this.getData()
    // this.getNumber();
  }
});
</script>
<style lang="less" scoped>
@keyframes transShadow1 {
  0% {
    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0);
  }
  25% {
    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0.10);
  }
  50% {
    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0.16);
  }
  100% {
    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0.25);
  }
}
@keyframes transShadow2 {
  0% {
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0);
  }
  25% {
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.08);
  }
  50% {
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.15);
  }
  100% {
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);
  }
}
.history_box {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .history {
    background-color: #96c24e;
    color:#fff;
  }
}

//议题列表
.voteBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .voteItem:nth-child(3n) {
    margin-right: 0;
  }
  //议题盒子
  .voteItem {
    margin-bottom: 30px;
    margin-right: 3.5%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 15px;
    width: 31%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    //议题主体
    .top {
      flex: 7;
      padding: 2.5%;
      display: flex;
      flex-direction: column;
      //议题标题
      .top-header {
        flex: 0.1;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .img {
          width: 7.5%;
          margin-right: 5%;

          img {
            width: 100%;
          }
        }

        .title {
          //flex: 8;
          width: 85%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          border-radius: 8px;
          .tt {
            font-size: 18px;
            line-height: 40px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .title:hover {
          background-color: rgba(121, 129, 241, 0.51);
        }
      }
      //议题地点
      .place {
        flex: 1;
        font-size: 16px;
        color: #5b5f69;
        margin-bottom: 2px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .img {
          width: 7.5%;

          img {
            width: 100%;
          }
        }

        .p {
          width:85%;
          margin-left: 5%;
          font-size: 16px;
          border-radius: 8px;
        }
        .p:hover {
          background-color: rgba(121, 223, 241, 0.51);
        }
      }
      //议题介绍
      .info-box {
        display: flex;
        justify-content: center;
        height: 12vh;

        .img {
          width: 7.5%;
          margin-right: 5%;
          img {
            width: 100%;
          }
        }
        .inform {
          width: 92.5%;
          font-size: 14px;
          color: #5b5f69;
          overflow: scroll;
          border-radius: 8px;
        }
        .inform:hover {
          background-color: rgba(241, 193, 121, 0.51);
        }
      }
      //议题预计时间
      .time {
        width: 100%;
        flex: 0.5;
        display: flex;
        justify-content: flex-start;
        //开始时间
        .beginTime {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .img {
            width: 15%;
            margin-right: 4%;

            img {
              width: 100%;
            }
          }
          .b-time {
            font-size: 1.8vh;
            border-radius: 8px;
          }
          .b-time:hover {
            background-color: rgba(143, 241, 121, 0.51);
          }
        }
        //结束时间
        .overTime {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .img {
            width: 15%;
            margin-right: 4%;

            img {
              width: 100%;

            }
          }
          .o-time {
            font-size: 1.8vh;
            border-radius: 8px;
          }
          .o-time:hover {
            background-color: rgba(143, 241, 121, 0.51);
          }
        }
      }
    }
    //议题盒子底部按钮
    .down {
      flex: 2.5;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #cccccc;

      .img {
        width: 15%;
        padding: 2.5%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 70%;
        }
      }
      .img:hover {
        background-color: rgba(121, 104, 104, 0.24);
      }
    }
  }

  .voteItem:hover {
    background-color: rgba(227, 196, 173, 0.27);
    animation: transShadow2 0.3s forwards;
  }
}
</style>
