<template>
  <div class="mod-conference__degreesubconference">
    <el-drawer v-model="drawerSu" title="子会议" size="90%" direction="rtl" :before-close="handleClose">
      <div class="query">
        <el-form>
          <el-form-item>
            <!--      刷新按钮-->
            <el-button type="info" @click="refresh()" style="margin-top: 3.5vh; margin-right: 1vw;" class="refresh">
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-input v-model="dataForm.name" placeholder="请输入子会议名称" @keyup.enter="getDataList" :input-style="{ width: '150px'}">
              <template #append>
                <el-button type="default" @click="getDataList()">{{ $t("query") }}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    <div class="buttonBox">
      <div class="addBox" v-show="addBoxVisible">
        <el-button v-if="hasPermission('conference:degreesubconference:save')" class="add" type="primary" @click="addOrUpdateHandle()">
          <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
          新增子会议
        </el-button>
      </div>
<!--      <div class="exportBox" v-show="!addBoxVisible">-->
<!--        <el-button type="info" v-if="hasPermission('conference:degreesubconference:export')" class="export" @click="exportHandle(dataForm.conferenceId)">-->
<!--          <div class="img"><img src="@/assets/images/issues/export_result.png" alt="" /></div>-->
<!--          {{ $t("export") }}</el-button-->
<!--        >-->
<!--      </div>-->
    </div>
    <el-empty description="暂无子会议" image="src/assets/images/empty_data.png" v-if="dataList.length == 0" />
    <div class="voteBox">
<!--      <div class="voteItem" v-for="(item, index) in dataList" :key="index" :style="[{borderColor:(item.status == 0 ? styleValue.colorDisvote :(item.status == 1 ? styleValue.colorVoting : styleValue.colorVoted)) }]">-->
        <el-carousel type="card" height="45vh" :autoplay="false">
          <el-carousel-item class="voteItem" v-for="(item, index) in dataList" :key="index">
            <div class="top">
              <div class="top-header">
                <div class="img">
                  <img src="@/assets/images/issues/subissues.png" alt="" />
                </div>
                <div class="title">
                  <div class="tt">{{ item.name }}</div>
                </div>
              </div>
              <div class="inform">
                <p v-html="item.info"></p>
              </div>
            </div>
            <div class="down">
              <el-tooltip class="box-item" effect="light" :content="item.statusText" placement="bottom">
                <div class="img"><img :src="item.progressSrc" alt="" /></div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" :content="item.contentText" placement="bottom">
                <div class="img" v-if="hasPermission('conference:degreesubconference:endvote')" v-show="buttonVoteVisble" @click="endVote(item.id, index, item.name)">
                  <img :src="item.imgSrc" alt="" />
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" content="查看学生" placement="bottom">
                <div class="img" v-if="hasPermission('conference:degreesubconference:students')" v-show="item.buttonShow" @click="addStudent(item.id, item.status)">
                  <img src="@/assets/images/issues/add.png" alt="" />
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" :content="item.resultText" placement="bottom">
                <div class="img" v-if="hasPermission('conference:degreesubconference:checkresult')" v-show="buttonVoteVisble" @click="checkResult(item.id, item.status)">
                  <img src="@/assets/images/issues/check.png" alt="" />
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" content="修改" placement="bottom">
                <div class="img" v-if="hasPermission('conference:degreesubconference:update')" v-show="item.buttonShow" @click="addOrUpdateHandle(item.id)">
                  <img src="@/assets/images/issues/update.png" alt="" />
                </div>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" content="删除" placement="bottom">
                <div class="img" v-if="hasPermission('conference:degreesubconference:delete')" v-show="item.deleteButton" @click="deleteHandle(item.id)">
                  <img src="@/assets/images/issues/delete.png" alt="" />
                </div>
              </el-tooltip>
            </div>
          </el-carousel-item>
        </el-carousel>
    </div>
<!--    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>-->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" :conferenceId="dataForm.conferenceId"></add-or-update>
      <degreesubconferencestudent :conferenceId="dataForm.conferenceId" :subConferenceId="currentId" v-if="drawerStu" ref="stu"></degreesubconferencestudent>
      <degreedetail  :conferenceId="dataForm.conferenceId" :subConferenceId="currentId" v-if="drawerProgress" ref="pro"></degreedetail>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./degreesubconference-add-or-update.vue";
import degreesubconferencestudent from "@/views/conference/degreesubconferencestudent.vue";
import degreedetail from "@/views/conference/degreedetail.vue";
import baseService from "@/service/baseService";
import { ElMessageBox } from "element-plus";
import { log } from "echarts/types/src/util/log";
export default defineComponent({
  components: {
    AddOrUpdate,
    degreesubconferencestudent,
    degreedetail
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
      getDataListURL: "/conference/degreesubconference/page",
      getDataListIsPage: true,
      exportURL: "/conference/degreesubconference/export",
      deleteURL: "/conference/degreesubconference",
      deleteIsBatch: true,
      buttonVoteVisble: false,
      addBoxVisible: false,
      drawerSu:false,
      drawerStu:false,
      drawerProgress:false,
      currentId:"",
      conferenceStatus: -1,
      dataForm: {
        conferenceId: "",
        name: "",
        status: "",
        couterId: "",
        scrutatorId: ""
      },
      styleValue:{
        colorDisvote:"rgba(194,147,134,0.2)",
        colorVoting:"rgba(89,246,54,0.27)",
        colorVoted:"#9a9a9a"
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  props:["conferenceId"],
  methods: {
    initSub(){
      this.drawerSu = true;
      this.dataForm.conferenceId = this.conferenceId;
      this.refresh();
    },
    refresh(){
      this.dataForm.name='';
      this.getDataList();
      this.getData()
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerSu = false;
        })
    },
    getData() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, statusText: "", imgSrc: "", contentText: "", progressSrc: "", buttonShow: true, startDateText: "", stopDateText: "", deleteButton: true };
      });
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 0) this.dataList[i].statusText = "未开始";
        else if (this.dataList[i].status === 1) this.dataList[i].statusText = "进行中";
        else if (this.dataList[i].status === 2) this.dataList[i].statusText = "已结束";
      }
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 0) {
          // this.dataList[i].imgSrc = "src/assets/images/start.png";
          // this.dataList[i].contentText = "开始活动";
          this.buttonVoteVisble = false;
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_begin.png";
        } else if (this.dataList[i].status === 1) {
          this.dataList[i].imgSrc = "src/assets/images/over.png";
          this.dataList[i].contentText = "结束活动";
          this.buttonVoteVisble = true;
          this.dataList[i].resultText = "查看进度";
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_ing.png";
          this.dataList[i].buttonShow = false;
          this.dataList[i].deleteButton = false;
          console.log(this.dataList[i].imgSrc);
        } else if (this.dataList[i].status === 2) {
          this.dataList[i].imgSrc = "src/assets/images/overed.png";
          this.dataList[i].contentText = "活动已结束";
          this.buttonVoteVisble = true;
          this.dataList[i].resultText = "查看结果";
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_over.png";
          this.dataList[i].buttonShow = false;
        }
      }
      if (this.conferenceStatus === 0) this.addBoxVisible = true;
    },
    addStudent(id: string, status: number) {
      this.drawerStu = true;
      this.currentId = id;
      let that:any = this
      nextTick(()=>{
        that.$refs["stu"].dataForm.subStatus = status;
        that.$refs["stu"].initStu();
      })
    },
    checkResult(id: string, status: number) {
      if (status === 1){
        this.drawerProgress = true;
        this.currentId = id;
        nextTick(()=>{
          let that:any = this
          // this.$refs["pro"].dataForm.subStatus = status;
          that.$refs["pro"].initPro();
        })
        // this.$router.push({
        //   path: "/conference/degreedetail",
        //   query: {
        //     subConferenceId: id,
        //     subStatus: status,
        //     conferenceId: this.dataForm.conferenceId
        //   }
        // });
      }
      else if (status === 2){
        this.drawerStu = true;
        this.currentId = id;
        let that:any = this
        nextTick(()=>{
          that.$refs["stu"].dataForm.subStatus = status;
          that.$refs["stu"].initStu();
        })
        // this.$router.push({
        //   path: "/conference/degreesubconferencestudent",
        //   query: {
        //     subConferenceId: id,
        //     subStatus: status,
        //     conferenceId: this.dataForm.conferenceId
        //   }
        // });
      }
    },
    endVote(id: string, index: number, name: string) {
      baseService.post("/conference/degreesubconference/over", { id: id, status: JSON.stringify(this.dataList[index].status) }).then((res) => {
        console.log(res);
        if (res.code != 0) return this['$message'].error(res.msg);
        this['$message'].warning("子会议" + name + "已结束");
        baseService.post("/conference/degreesubconferencestudent/result", { subConferenceId: id }).then((res) => {
          console.log(res);
          if (res.code != 0) return false;
          // this.$message.warning("子会议" + name + "已结束");
          this.getDataList();
        });
      });
    }
  },
  watch: {
    dataList: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) this.getData()
      },
    }
  },
  beforeUpdate() {
    // this.getData();
  }
});
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

  .addBox {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;

    .add {
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
.voteBox {
  width: 100%;

  .voteItem:nth-child(2n+1){
    background-image: url("@/assets/images/issues/vote_item_bg1.png");
    background-size:  100% 100%;
  }
  .voteItem:nth-child(2n) {
    background-color: #e4e0fd;
  }

  .voteItem {
    //height: 34vh;
    margin-bottom: 30px;
    margin-right: 3.5%;
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    //width: 31%;
    //background-color: #ffffff;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 4%;

    .top {
      flex: 7;
      padding: 2.5%;
      display: flex;
      flex-direction: column;

      .top-header {
        flex: 0.1;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
          flex: 1;
          width: 5%;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          flex: 8;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin-left: 2%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .tt {
            flex: 1;
            font-size: 18px;
            line-height: 40px;
          }
        }
      }
      //子议题介绍
      .inform::-webkit-scrollbar {
        width:0 !important;
      }
      .inform {
        height: 12vh;
        width: 100%;
        padding: 2px;
        font-size: 14px;
        color: #5b5f69;
        overflow: scroll;
      }
    }
    .down {
      //background-color: #e79393;
      flex: 2;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #cccccc;
      .img {
        width: 14%;
        padding: 2.5%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 70%;
        }
      }
    }
  }
}
</style>
