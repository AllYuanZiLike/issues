<template>
  <div class="mod-conference__degreeconference">
    <div class="main_box">
      <div class="left_box">
        <div class="title">学位授予</div>
        <div class="status_box">
          <!--      未开始-->
          <div class="dis_box">
            <div class="top"></div>
            <div class="disvote">
              <span class="number">{{ disvote }}</span>
              <el-icon size="large"><Histogram /></el-icon>
              <p class="word">未开始</p>
            </div>
          </div>
          <!--      进行中-->
          <div class="ing_box">
            <div class="top"></div>
            <div class="voting">
              <span class="number">{{ voting }}</span>
              <el-icon size="large"><Histogram /></el-icon>
              <p class="word">进行中</p>
            </div>
          </div>
        </div>
        <div class="button_box">
          <el-button v-if="hasPermission('conference:degreeconference:save')" type="primary" @click="addOrUpdateHandle()" class="add">
            <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
            新增会议
          </el-button>
          <el-button class="history" type="primary"  @click="checkHistory">
            <div class="img"><img src="@/assets/images/issues/history.png" alt="" /></div>
            历史会议
          </el-button>
        </div>
      </div>
      <div class="right_box">
        <div class="query">
          <el-form>
            <el-form-item>
              <el-input v-model="dataForm.name" placeholder="请输入会议名称" @keyup.enter="getDataList" :input-style="{ width: '150px'}">
                <template #append>
                  <el-button type="default" @click="getDataList()">{{ $t("query") }}</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="voteBox">
          <!--    议题盒子-->
          <div class="voteItem" v-for="(item, index) in dataList" :key="index">
            <!--   盒子主体部分-->
            <div class="top">
              <!-- 议题名称-->
              <div class="top-header">
                <div class="img">
                  <img src="@/assets/images/issues/vote.png" alt="" />
                </div>
                <div class="title">
                  <div class="tt">{{ item.name }}</div>
                </div>
              </div>
              <!--  议题地点-->
              <div class="place">
                <div class="img"><img src="@/assets/images/place.png" alt="" /></div>
                <div class="p">{{ item.room?.name }}</div>
              </div>
              <!--  议题预计时间-->
              <div class="time">
                <!--   开始时间-->
                <div class="beginTime">
                  <div class="img"><img src="@/assets/images/begin-time.png" /></div>
                  <div class="b-time">{{ item.reserveBeginTime }}</div>
                </div>
                <!--       结束时间     -->
                <div class="overTime">
                  <div class="img"><img src="@/assets/images/over-time.png" /></div>
                  <div class="o-time">{{ item.reserveEndTime }}</div>
                </div>
              </div>
            </div>
            <div class="check">
              <el-button size="small" type="default" @click="checkConcent(item.id)">点击查看详细信息</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-dialog v-model="checkVisible" title="详细信息" width="75%" draggable>
        <div id="check_box">
          <div class="check_left_box">
            <el-descriptions class="margin-top" :title="`会议名称: ${dataForm.name}`" :column="2" size="default" border>
              <template #extra v-if="dataForm.buttonShow">
                <el-tooltip class="box-item" effect="light" content="修改" placement="bottom">
                  <el-button type="primary" v-if="hasPermission('conference:degreeconference:update')" @click="addOrUpdateHandle(dataForm.id)">
                    <el-icon :size="20"><Edit /></el-icon>
                  </el-button>
                  <!--                <div class="img" v-if="hasPermission('issues:issues:update')"  @click="addOrUpdateHandle(dataForm.id)"><img src="@/assets/images/issues/update.png" alt="" /></div>-->
                </el-tooltip>
                <el-tooltip class="box-item" effect="light" content="删除" placement="bottom">
                  <el-button type="primary" v-if="hasPermission('conference:degreeconference:delete')" @click="deleteHandle(dataForm.id)">
                    <el-icon :size="20"><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><MapLocation /></el-icon>
                    会议地址
                  </div>
                </template>
                {{ dataForm.room?.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Postcard /></el-icon>
                    会议状态
                  </div>
                </template>
                {{dataForm.status==0?"未开始":(dataForm.status===1?"进行中":"已结束")}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Timer /></el-icon>
                    开始时间
                  </div>
                </template>
                {{dataForm.reserveBeginTime}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Timer /></el-icon>
                    结束时间
                  </div>
                </template>
                {{dataForm.reserveEndTime}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Tickets /></el-icon>
                    会议介绍
                  </div>
                </template>
                <div v-html="dataForm.info"></div>
              </el-descriptions-item>
            </el-descriptions>
            <div class="btn_box" v-show="!dataForm.buttonShow">
              <el-button class="box-item" type="primary" v-if="hasPermission('conference:degreeconference:participant')" @click="(dataForm.id, dataForm.status)">查看参与人</el-button>
              <el-button class="box-item" type="primary" v-if="hasPermission('conference:degreeconference:sub')" @click="checkSub(dataForm.id, dataForm.status)">查看子会议</el-button>
              <el-button class="box-item" type="primary" v-show="dataForm.status==1" v-if="hasPermission('conference:degreeconference:startOrStop')" @click="startVote(dataForm.id, dataForm.status)">结束会议</el-button>
            </div>
          </div>
          <div class="check_right_box" v-show="dataForm.buttonShow">
            <div class="left">
              <el-timeline v-show="dataForm.status===0">
                <el-timeline-item timestamp="投票人、监票人...">添加参与人</el-timeline-item>
                <el-timeline-item timestamp="名称、介绍、...">添加子议题</el-timeline-item>
                <el-timeline-item timestamp="开始评审...">开始评审</el-timeline-item>
              </el-timeline>
            </div>
            <div class="right">
              <el-tooltip effect="light" content="添加参与人" placement="bottom">
                <el-button class="box-item" type="primary" v-if="hasPermission('conference:degreeconference:participant')" @click="participantHandle(dataForm.id, dataForm.status)">
                  <el-icon><User /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="添加子会议" placement="bottom">
                <el-button class="box-item" type="primary"  v-if="hasPermission('conference:degreeconference:sub')" @click="checkSub(dataForm.id, dataForm.status)">
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="开始评审" placement="bottom">
                <el-button class="box-item" type="primary"  v-if="hasPermission('conference:degreeconference:startOrStop')" @click="startVote(dataForm.id, dataForm.status)">
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="checkVisible = false;dataForm.name='';">关闭</el-button>
          </span>
        </template>

      </el-dialog>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <historyConference v-if="drawerHis" ref="his"></historyConference>
    <degreeconferenceparticipant :conferenceId="currentId" v-if="drawerPart" ref="part"></degreeconferenceparticipant>
    <degreesubconference  :conferenceId="currentId" v-if="drawerSub" ref="sub"></degreesubconference>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./degreeconference-add-or-update.vue";
import historyConference from "@/views/conference/historyConference.vue";
import degreeconferenceparticipant from "@/views/conference/degreeconferenceparticipant.vue";
import degreesubconference from "@/views/conference/degreesubconference.vue";
import dayjs from "dayjs";
import baseService from "@/service/baseService";
// import { log } from "echarts/types/src/util/log";
export default defineComponent({
  components: {
    AddOrUpdate,
    degreeconferenceparticipant,
    degreesubconference,
historyConference
  },
  setup() {
    const addKey = ref(0);
    const addOrUpdateRef = ref();
    const addOrUpdateHandle = (id?: string) => {
      addKey.value++;
      nextTick(() => {
        addOrUpdateRef.value.init(id);
      });
    };
    const state = reactive({
      getDataListURL: "/conference/degreeconference/page",
      getDataListIsPage: true,
      exportURL: "/conference/degreeconference/export",
      deleteURL: "/conference/degreeconference",
      deleteIsBatch: true,
      datetimerange: null,
      drawerHis:false,//历史会议抽屉
      drawerPart:false,
      drawerSub:false,
      checkVisible:false,//查看详细信息
      currentId:"",
      dataForm: {
        id:"",
        name: "",
        status: "" as any,
        info:"",
        roomId: "",
        room:{} as any,
        startDateTime: null as number | null,
        endDateTime: null as number | null,
        reserveBeginTime: "",
        reserveEndTime: "",
        couterId: "",
        scrutatorId: "",
        statusText: "",
        imgSrc: "",
        border:"",
        contentText: "",
        progressSrc: "",
        buttonShow: true,
        startDateText: "",
        stopDateText: "",
      },
      disvote: 0,
      voting: 0,
      voted: 0,
      styleValue:{
        colorDisvote:"rgba(194,147,134,0.2)",
        colorVoting:"rgba(167,255,147,0.27)",
        colorVoted:"rgba(154,154,154,0.29)"
      }
    });
    return {addOrUpdateHandle, ...useView(state), ...toRefs(state) };
  },
  methods: {
    getNumber() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item,  };
      });

      // for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataForm.status === 0) {
          this.dataForm.imgSrc = "src/assets/images/start.png";
          this.dataForm.contentText = "开始活动";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_begin.png";
          this.dataForm.buttonShow = true;
          this.dataForm.statusText = "未开始";
        } else if (this.dataForm.status === 1) {
          this.dataForm.imgSrc = "src/assets/images/over.png";
          this.dataForm.contentText = "结束活动";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_ing.png";
          this.dataForm.buttonShow = false;
          this.dataForm.statusText = "进行中";
        } else if (this.dataForm.status === 2) {
          this.dataForm.imgSrc = "src/assets/images/overed.png";
          this.dataForm.contentText = "活动已结束";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_over.png";
          this.dataForm.buttonShow = false;
          this.dataForm.statusText = "已结束";
        }

        console.log(this.dataForm.statusText)
        this.dataForm.reserveBeginTime = dayjs(this.dataForm.reserveBeginTime).format("YYYY-MM-DD HH:mm");
        this.dataForm.reserveEndTime = dayjs(this.dataForm.reserveEndTime).format("YYYY-MM-DD HH:mm");
    },
    /**
     * 查看详细信息
     */
    checkConcent(id:string){
      baseService.get("/conference/degreeconference/" + id).then((res) => {
        console.log(res)
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
        this.getNumber();
        this.checkVisible = true;
      });

    },
    isParShow: function() {
      this.drawerPart = true;
    },
    isParHidden: function() {
      this.drawerPart = false;
    },
    participantHandle(id: string, status: number) {
      this.drawerPart = true;
      this.currentId = "";
      this.currentId = id;
      let that:any = this
      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        0
        that.$refs["part"].initPart();
        that.$refs["part"].$forceUpdate()
      })
    },
    isSubShow: function() {
      this.drawerSub = true;
    },
    isSubHidden: function() {
      this.drawerSub = false;
    },
    checkSub(id: string, status: number) {
      // this.$router.push({
      //   path: "/conference/degreesubconference",
      //   query: {
      //     conferenceId: id,
      //     conferenceStatus: status
      //   }
      // });
      this.drawerSub = true;
      this.currentId = "";
      this.currentId = id;
      let that:any = this
      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        that.$refs["sub"].conferenceStatus = status;
        that.$refs["sub"].initSub();
        that.$refs["sub"].$forceUpdate()
      })
    },
    /**
     *开始/结束活动
     * @param id
     * @param index
     */
    startVote(id: string, index: number) {
      console.log(index);
      console.log(id, JSON.stringify(this.dataList[index].status));
      baseService.post("/conference/degreeconference/startOrEnd", { id: id, status: JSON.stringify(this.dataList[index].status) }).then((res) => {
        console.log(res);
        if (res.code != 0) return this['$message'].error(res.msg);
        this.getDataList();
      });
    },
    /**
     * 查看历史会议
     */
    checkHistory(){
      this.drawerHis = true;
      let that:any = this
      nextTick(()=>{
        that.$refs["his"].dataForm.status = 2;
        that.$refs["his"].initHis();
        that.$refs["his"].$forceUpdate()
      })
    },
  },
  watch: {
    datetimerange(val: number[] | null) {
      if (val === null) {
        this.dataForm.startDateTime = null;
        this.dataForm.endDateTime = null;
      } else {
        this.dataForm.startDateTime = val[0];
        this.dataForm.endDateTime = val[1];
      }
    },
  },
  beforeMount() {
    /**
     * 获取议题各个状态的数量
     */
    baseService.post("/conference/degreeconference/status").then((res) => {
      console.log(res);
      if (res.code != 0) return this['$message'].error("出错了");
      this.disvote = res.data.count0;
      this.voting = res.data.count1;
      this.voted = res.data.count2;
    });
  },
  beforeUpdate() {
    for(let i=0;i<this.dataList.length;i++){
      this.dataList[i].reserveBeginTime = dayjs(this.dataList[i].reserveBeginTime).format("YYYY-MM-DD HH:mm");
      this.dataList[i].reserveEndTime = dayjs(this.dataList[i].reserveEndTime).format("YYYY-MM-DD HH:mm");
    }
  }
});
</script>

<style lang="less" scoped>
.main_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .left_box {
    display: flex;
    flex-direction: column;
    width: 60vw;
    height: 100%;
    margin-right: 2%;
    border-right: 2px dashed rgba(135, 162, 255, 0.82);

    .title {
      height: 25%;
      margin-bottom: 2.5%;
      font-size: 3em;
      padding: 5%;
      text-align: center;
      color: #716afc;
      //background-color: #eedddd;
    }
    .status_box {
      //background-color: #fff3e6;
      height: 40%;
      margin-bottom: 2.5%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      //未开始
      .dis_box{
        //width: 45%;
        height: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 3vh;
        .top {
          width: 20vw;
          height: 5vh;
          //box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
          border-top: 5vh solid transparent;
          border-left: none;
          border-right: 20vw solid rgba(233, 238, 250, 0.69);
          border-bottom: none;
        }
        .disvote {
          //flex: 1;
          width: 20vw;
          height: 20vh;
          margin-bottom: -2vh;
          background-color: rgba(233, 238, 250, 0.69);
          //margin: 0 2px;
          color: #86a1ff;
          box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
          //border-radius: 10px;
          padding: 1%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          //数字
          .number {
            font-size: 2.5em;
          }
          //文字
          .word {
            font-size: 1.6em;
          }
        }
      }
      .ing_box {
        height: 100%;
        display: flex;
        flex-direction: column;
        //margin-top: 3vh;
        .top {
          //background-color: #b4c3e5;
          width: 20vw;
          height: 5vh;
          //background-color: #8eb0f1;
          border-top: 5vh solid transparent;
          border-left: none;
          border-right: 20vw solid rgba(233, 238, 250, 0.69);
          border-bottom: none;
        }
        //进行中
        .voting {
          //flex: 1;
          width: 20vw;
          height: 25vh;
          background-color: rgba(233, 238, 250, 0.69);
          //margin: 0 2px;
          color: #86a1ff;
          box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
          //border-radius: 10px;
          padding: 1%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          .number {
            font-size: 2.5em;
          }
          //文字
          .word {
            font-size: 1.6em;
          }
        }
      }
    }
    .button_box {
      //background-color: #e5eedd;
      height: 30%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .history {
        height: 22vh;
        font-size: 1.7em;
        width: 20vw;
        color: #87a2ff;
        border:3px solid #bbcafa;
        background-color: rgba(252, 253, 255, 0.69);
        .img {
          width: 25px;
          height: 25px;
          margin-right: 20px;

          img {
            width: 100%;
          }
        }
      }
      .add {
        height: 22vh;
        font-size: 1.7em;
        color:#87a2ff;
        width: 20vw;
        border:3px solid #bbcafa;
        background-color: rgba(252, 253, 255, 0.69);
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
  .right_box {
    width: 23vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    .query {
      width: 80%;
      display: flex;
    }
    .voteBox {
      width: 20vw;
      height: 72vh;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: nowrap;
      //议题盒子
      .voteItem {
        margin-bottom: 6%;
        //margin-right: 3.5%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 15px;
        width: 90%;
        height: 21vh;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        background-image: url("@/assets/images/issues/vote_item_bg.png");
        background-size: 100% 100%;
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
              margin-right: 2.5%;

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
              margin-left: 2.5%;
              font-size: 16px;
              border-radius: 8px;
            }
          }
          //议题介绍
          .info-box {
            display: flex;
            justify-content: center;
            height: 11vh;

            .img {
              width: 7.5%;
              margin-right: 2.5%;
              img {
                width: 100%;
              }
            }
            .inform::-webkit-scrollbar {
              width:0 !important;
            }
            .inform {
              width: 92.5%;
              font-size: 14px;
              vertical-align: center;
              color: #5b5f69;
              overflow: scroll;
              border-radius: 8px;


              p {
                margin: 0;
                padding: 0;
                //margin-block-start: -1em;
                margin-block-end: -1em;
              }
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
            }
          }
        }
        .check {
          width: 100%;
          height: 18vh;
          //background-color: #ffdbdb;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

    }
  }
  #check_box {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    .check_left_box {
      display: flex;
      flex-direction: column;
      //width: 60vw;
      flex: 2;
      height: 100%;
      padding-right: 2%;
      .btn_box {
        display: flex;
        flex-direction: row;
        margin-top: 2vh;
        .box-item {
          flex:1;
        }
      }
    }
    .check_right_box {
      flex:1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      .right {
        display: flex;
        flex-direction: column;

        .box-item {
          margin-bottom: 4vh;
        }
      }

    }
  }
}
</style>
