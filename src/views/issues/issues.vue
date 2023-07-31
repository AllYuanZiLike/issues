<template>
  <!--  议题-->
  <div class="mod-issues__issues">
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="checkVisible=false;getDataList();"></add-or-update>
    <historyIssues v-if="drawerHis" ref="his" @refreshDataList="getDataList"></historyIssues>
    <Issuesparticipant v-if="drawerPart" ref="part" :issuesId="currentId" :issuesStatus="currentStatus" @refreshDataList="getDataList"></Issuesparticipant>
    <subissues v-if="drawerSub" ref="sub" :issuesId="currentId" :issuesStatus="currentStatus" @refreshDataList="getDataList"></subissues>

    <div class="main_box">
      <div class="left_box">
        <div class="title">会议评审</div>
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
          <el-button v-if="hasPermission('issues:issues:save')" type="primary" @click="addOrUpdateHandle()" class="add">
            <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
            新增议题
          </el-button>
          <el-button class="history" type="primary"  @click="checkHistory">
            <div class="img"><img src="@/assets/images/issues/history.png" alt="" /></div>
            历史议题
          </el-button>
        </div>
      </div>
      <div class="right_box">
        <div class="query">
          <el-form>
            <el-form-item>
              <el-input v-model="dataForm.name" placeholder="请输入议题名称" @keyup.enter="getDataList" :input-style="{ width: '150px'}">
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
                    <div class="p">{{ item.roomDTO?.name }}</div>
                  </div>
                  <!--  议题预计时间-->
                  <div class="time">
                    <!--   开始时间-->
                    <div class="beginTime">
                      <div class="img"><img src="@/assets/images/begin-time.png" /></div>
                        <div class="b-time">{{ item.beginTime }}</div>
                    </div>
                    <!--       结束时间     -->
                    <div class="overTime">
                      <div class="img"><img src="@/assets/images/over-time.png" /></div>
                        <div class="o-time">{{ item.endTime }}</div>
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
                <el-button type="primary" v-if="hasPermission('issues:issues:update')" @click="addOrUpdateHandle(dataForm.id)">
                  <el-icon :size="20"><Edit /></el-icon>
                </el-button>
<!--                <div class="img" v-if="hasPermission('issues:issues:update')"  @click="addOrUpdateHandle(dataForm.id)"><img src="@/assets/images/issues/update.png" alt="" /></div>-->
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" content="删除" placement="bottom">
                <el-button type="primary" v-if="hasPermission('issues:issues:delete')" @click="deleteHandle(dataForm.id)">
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
              {{ dataForm.roomDTO?.name }}
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
              {{dataForm.beginTime}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :size="18"><Timer /></el-icon>
                  结束时间
                </div>
              </template>
              {{dataForm.endTime}}
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
            <el-button class="box-item" type="primary" v-if="hasPermission('issues:issues:checkParticipant')" @click="checkParticipant(dataForm.id, dataForm.status)">查看参与人</el-button>
            <el-button class="box-item" type="primary" v-if="hasPermission('issues:issues:checkSubissues')" @click="checkSubissues(dataForm.id, dataForm.status)">查看子议题</el-button>
            <el-button class="box-item" type="primary" v-show="dataForm.status==1" v-if="hasPermission('issues:issues:startVote')" @click="startVote(dataForm.id, dataForm.status)">结束议题</el-button>
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
              <el-button class="box-item" type="primary" v-if="hasPermission('issues:issues:checkParticipant')" @click="checkParticipant(dataForm.id, dataForm.status)">
                <el-icon><User /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="添加子议题" placement="bottom">
              <el-button class="box-item" type="primary"  v-if="hasPermission('issues:issues:checkSubissues')" @click="checkSubissues(dataForm.id, dataForm.status)">
                <el-icon><DocumentCopy /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="开始评审" placement="bottom">
              <el-button class="box-item" type="primary"  v-if="hasPermission('issues:issues:startVote')" @click="startVote(dataForm.id, dataForm.status)">
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
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import { Delete, Edit} from '@element-plus/icons-vue'
import historyIssues from "@/views/issues/historyIssues.vue";
import AddOrUpdate from "./issues-add-or-update.vue";
import baseService from "@/service/baseService";
import Issuesparticipant from "@/views/issues/issuesparticipant.vue";
import subissues from "@/views/issues/subissues.vue";
export default defineComponent({
  components: {
    Edit,
    historyIssues,
    Issuesparticipant,
    AddOrUpdate,
    subissues,
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
      getDataListURL: "/issues/issues/page",
      getDataListIsPage: true,
      exportURL: "/issues/issues/export",
      deleteURL: "/issues/issues",
      deleteIsBatch: true,
      checkVisible:false,
      drawerHis:false,//历史会议抽屉
      drawerPart:false,//参与人抽屉
      drawerSub:false,//子议题抽屉
      currentId:"",//当前议题id
      currentStatus:0,//当前议题状态
      disvote: 0,// 议题未开始
      voting: 0,// 议题进行中
      voted: 0,// 议题已结束
      dataForm:{
        id:"" as any,
        name:"",
        info:"",
        room_id:"",
        roomDTO:{} as any,
        status:"" as any,
        start_time:"",
        stop_time:"",
        begin_time:"",
        beginTime:"",
        end_time:"",
        endTime:"",
        counter_id:"",
        counter_time:"",
        supervisor_id:"",
        scrutator_time:"",
        sort:"",
        del_flag:"",
        creator:"",
        create_date:"",
        updater:"",
        updata_date:"",
        imgSrc: "", //图片路径
        contentText: "", //提示框文字
        progressSrc: "", //进度图片路径
        buttonShow: true, //按钮是否展示
        step:0,//创建顺序
      }
    });
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    /**
     * 拿到dataList后，处理数据
     */
    getNumber() {
      /**
       *处理议题盒子底部按钮状态
       */
        if (this.dataForm.status === 0) {
          this.dataForm.imgSrc = "src/assets/images/start.png";
          this.dataForm.contentText = "开始活动";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_begin.png";
          this.dataForm.buttonShow=true;
        } else if (this.dataForm.status === 1) {
          this.dataForm.imgSrc = "src/assets/images/over.png";
          this.dataForm.contentText = "结束活动";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_ing.png";
          this.dataForm.buttonShow = false;
        } else if (this.dataForm.status === 2) {
          this.dataForm.imgSrc = "src/assets/images/overed.png";
          this.dataForm.contentText = "活动已结束";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_over.png";
          this.dataForm.buttonShow = false;
        }
      console.log(this.dataForm.buttonShow)
    },
    /**
     * 查看详细信息
     */
    checkConcent(id:string){

      baseService.get("/issues/issues/" + id).then((res) => {
        console.log(res)
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
        this.getNumber();
        this.checkVisible = true;
      });

    },
    /**
     * 查看历史会议
     */
    checkHistory(){
      this.drawerHis = true;
      nextTick(()=>{
        let that:any = this
        that.$refs["his"].dataForm.status = 2;
        that.$refs["his"].initHis();
        that.$refs["his"].$forceUpdate()
      })
    },
    /**
     * 跳转查看参与人页面
     * @param id
     * @param status
     */
    checkParticipant(id: string, status: number) {
     this.drawerPart = true;
     this.currentId = "";
     this.currentId = id;
     this.currentStatus = status
     let that:any = this
      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        // that.$refs["part"].status = status;
        that.$refs["part"].initPart();
        that.$refs["part"].$forceUpdate()
      })
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
    /**
     *开始/结束活动
     * @param id
     * @param index
     */
    startVote(id: string, status: number) {
      baseService.get("/issues/subissues/status", { id: id, status: status }).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.getDataList();
      });
    }
  },
  beforeMount() {
    /**
     * 获取议题各个状态的数量
     */
    baseService.post("/issues/issues/number").then((res) => {
      this.disvote = res.data.zero;
      this.voting = res.data.one;
      this.voted = res.data.two;
    });
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
<!--<style lang="less" scoped>-->
<!--@keyframes transShadow1 {-->
<!--  0% {-->
<!--    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0);-->
<!--  }-->
<!--  25% {-->
<!--    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0.10);-->
<!--  }-->
<!--  50% {-->
<!--    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0.16);-->
<!--  }-->
<!--  100% {-->
<!--    box-shadow: 0 0 5px 8px rgba(131, 100, 94, 0.25);-->
<!--  }-->
<!--}-->
<!--@keyframes transShadow2 {-->
<!--  0% {-->
<!--    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0);-->
<!--  }-->
<!--  25% {-->
<!--    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.08);-->
<!--  }-->
<!--  50% {-->
<!--    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.15);-->
<!--  }-->
<!--  100% {-->
<!--    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);-->
<!--  }-->
<!--}-->
<!--//.history_box {-->
<!--//  display: flex;-->
<!--//  justify-content: flex-end;-->
<!--//  align-items: center;-->
<!--//-->
<!--//  .history {-->
<!--//    background-color: #96c24e;-->
<!--//    color:#fff;-->
<!--//  }-->
<!--//}-->
<!--//议题各个状态数量-->
<!--//.state {-->
<!--//  margin: 0 0 20px 0;-->
<!--//  width: 100%;-->
<!--//  display: flex;-->
<!--//  justify-content: center;-->
<!--//  //未开始-->
<!--//  .disvote {-->
<!--//    flex: 1;-->
<!--//    background-color: #42a5f5;-->
<!--//    margin: 0 2px;-->
<!--//    color: #fff;-->
<!--//    border-radius: 10px;-->
<!--//    padding: 1%;-->
<!--//    display: flex;-->
<!--//    justify-content: center;-->
<!--//    flex-direction: column;-->
<!--//    align-items: center;-->
<!--//    //数字-->
<!--//    .number {-->
<!--//      font-size: 40px;-->
<!--//    }-->
<!--//    //文字-->
<!--//    .word {-->
<!--//      font-size: 25px;-->
<!--//    }-->
<!--//  }-->
<!--//  .disvote:hover {-->
<!--//    box-shadow: 0 8px 12px 0 rgba(66, 165, 245, 0.63);-->
<!--//    .number {-->
<!--//      text-shadow:  2px 2px 2px rgba(0, 0, 0, 1);-->
<!--//    }-->
<!--//  }-->
<!--//  //进行中-->
<!--//  .voting {-->
<!--//    flex: 1;-->
<!--//    background-color: #ffa726;-->
<!--//    margin: 0 4px 0 2px;-->
<!--//    color: #fff;-->
<!--//    border-radius: 10px;-->
<!--//    padding: 1%;-->
<!--//    display: flex;-->
<!--//    justify-content: center;-->
<!--//    flex-direction: column;-->
<!--//    align-items: center;-->
<!--//    .number {-->
<!--//      font-size: 40px;-->
<!--//    }-->
<!--//    .word {-->
<!--//      font-size: 25px;-->
<!--//    }-->
<!--//  }-->
<!--//  .voting:hover {-->
<!--//    box-shadow: 0 8px 12px 0 rgba(255, 167, 38, 0.48);-->
<!--//-->
<!--//    .number {-->
<!--//      text-shadow:  2px 2px 2px rgba(0, 0, 0);-->
<!--//    }-->
<!--//  }-->
<!--//  //已结束-->
<!--//  .voted {-->
<!--//    flex: 1;-->
<!--//    background-color: #ba68c8;-->
<!--//    color: #fff;-->
<!--//    border-radius: 10px;-->
<!--//    padding: 1%;-->
<!--//    display: flex;-->
<!--//    justify-content: center;-->
<!--//    flex-direction: column;-->
<!--//    align-items: center;-->
<!--//    .number {-->
<!--//      font-size: 40px;-->
<!--//    }-->
<!--//    .word {-->
<!--//      font-size: 25px;-->
<!--//    }-->
<!--//  }-->
<!--//  .voted:hover {-->
<!--//    box-shadow: 0 8px 12px 0 rgba(186, 104, 200, 0.47);-->
<!--//-->
<!--//    .number {-->
<!--//      text-shadow:  2px 2px 2px rgb(0,0,0);-->
<!--//    }-->
<!--//  }-->
<!--//}-->
<!--//新增议题盒子-->
<!--//.addBox {-->
<!--//  width: 100%;-->
<!--//  height: 70px;-->
<!--//  display: flex;-->
<!--//  justify-content: center;-->
<!--//  //新增议题按钮-->
<!--//  .add {-->
<!--//    height: 50px;-->
<!--//    font-size: 20px;-->
<!--//    width: 50%;-->
<!--//-->
<!--//    .img {-->
<!--//      width: 25px;-->
<!--//      height: 25px;-->
<!--//      margin-right: 20px;-->
<!--//-->
<!--//      img {-->
<!--//        width: 100%;-->
<!--//      }-->
<!--//    }-->
<!--//  }-->
<!--//  .add:hover{-->
<!--//     animation:transShadow1 0.3s forwards;-->
<!--//   }-->
<!--//}-->

<!--//议题列表-->
<!--//.voteBox {-->
<!--//  width: 100%;-->
<!--//  display: flex;-->
<!--//  flex-wrap: wrap;-->
<!--//  justify-content: flex-start;-->
<!--//-->
<!--//  .voteItem:nth-child(3n) {-->
<!--//    margin-right: 0;-->
<!--//  }-->
<!--//  //议题盒子-->
<!--//  .voteItem {-->
<!--//    margin-bottom: 30px;-->
<!--//    margin-right: 3.5%;-->
<!--//    border: 1px solid rgba(0, 0, 0, 0.15);-->
<!--//    border-radius: 15px;-->
<!--//    width: 31%;-->
<!--//    background-color: #ffffff;-->
<!--//    display: flex;-->
<!--//    flex-direction: column;-->
<!--//    //议题主体-->
<!--//    .top {-->
<!--//      flex: 7;-->
<!--//      padding: 2.5%;-->
<!--//      display: flex;-->
<!--//      flex-direction: column;-->
<!--//      //议题标题-->
<!--//      .top-header {-->
<!--//        flex: 0.1;-->
<!--//        display: flex;-->
<!--//        justify-content: flex-start;-->
<!--//        align-items: center;-->
<!--//-->
<!--//        .img {-->
<!--//          width: 7.5%;-->
<!--//          margin-right: 2.5%;-->
<!--//-->
<!--//          img {-->
<!--//            width: 100%;-->
<!--//          }-->
<!--//        }-->
<!--//-->
<!--//        .title {-->
<!--//          //flex: 8;-->
<!--//          width: 85%;-->
<!--//          display: flex;-->
<!--//          flex-direction: column;-->
<!--//          justify-content: flex-start;-->
<!--//          border-radius: 8px;-->
<!--//          .tt {-->
<!--//            font-size: 18px;-->
<!--//            line-height: 40px;-->
<!--//            overflow: hidden;-->
<!--//            white-space: nowrap;-->
<!--//            text-overflow: ellipsis;-->
<!--//          }-->
<!--//        }-->
<!--//        .title:hover {-->
<!--//          background-color: rgba(121, 129, 241, 0.51);-->
<!--//        }-->
<!--//      }-->
<!--//      //议题地点-->
<!--//      .place {-->
<!--//        flex: 1;-->
<!--//        font-size: 16px;-->
<!--//        color: #5b5f69;-->
<!--//        margin-bottom: 2px;-->
<!--//        display: flex;-->
<!--//        justify-content: flex-start;-->
<!--//        align-items: center;-->
<!--//-->
<!--//        .img {-->
<!--//          width: 7.5%;-->
<!--//-->
<!--//          img {-->
<!--//            width: 100%;-->
<!--//          }-->
<!--//        }-->
<!--//-->
<!--//        .p {-->
<!--//          width:85%;-->
<!--//          margin-left: 2.5%;-->
<!--//          font-size: 16px;-->
<!--//          border-radius: 8px;-->
<!--//        }-->
<!--//        .p:hover {-->
<!--//          background-color: rgba(121, 223, 241, 0.51);-->
<!--//        }-->
<!--//      }-->
<!--//      //议题介绍-->
<!--//      .info-box {-->
<!--//        display: flex;-->
<!--//        justify-content: center;-->
<!--//        height: 11vh;-->
<!--//-->
<!--//        .img {-->
<!--//          width: 7.5%;-->
<!--//          margin-right: 2.5%;-->
<!--//          img {-->
<!--//            width: 100%;-->
<!--//          }-->
<!--//        }-->
<!--//        .inform::-webkit-scrollbar {-->
<!--//           width:0 !important;-->
<!--//         }-->
<!--//        .inform {-->
<!--//          width: 92.5%;-->
<!--//          font-size: 14px;-->
<!--//          vertical-align: center;-->
<!--//          color: #5b5f69;-->
<!--//          overflow: scroll;-->
<!--//          border-radius: 8px;-->
<!--//-->
<!--//-->
<!--//          p {-->
<!--//            margin: 0;-->
<!--//            padding: 0;-->
<!--//            //margin-block-start: -1em;-->
<!--//            margin-block-end: -1em;-->
<!--//          }-->
<!--//        }-->
<!--//-->
<!--//        .inform:hover {-->
<!--//          background-color: rgba(241, 193, 121, 0.51);-->
<!--//        }-->
<!--//      }-->
<!--//      //议题预计时间-->
<!--//      .time {-->
<!--//        width: 100%;-->
<!--//        flex: 0.5;-->
<!--//        display: flex;-->
<!--//        justify-content: flex-start;-->
<!--//        //开始时间-->
<!--//        .beginTime {-->
<!--//          flex: 1;-->
<!--//          display: flex;-->
<!--//          justify-content: flex-start;-->
<!--//          align-items: center;-->
<!--//-->
<!--//          .img {-->
<!--//            width: 15%;-->
<!--//            margin-right: 4%;-->
<!--//-->
<!--//            img {-->
<!--//              width: 100%;-->
<!--//            }-->
<!--//          }-->
<!--//          .b-time {-->
<!--//            font-size: 1.8vh;-->
<!--//            border-radius: 8px;-->
<!--//          }-->
<!--//          .b-time:hover {-->
<!--//            background-color: rgba(143, 241, 121, 0.51);-->
<!--//          }-->
<!--//        }-->
<!--//        //结束时间-->
<!--//        .overTime {-->
<!--//          flex: 1;-->
<!--//          display: flex;-->
<!--//          justify-content: flex-start;-->
<!--//          align-items: center;-->
<!--//-->
<!--//          .img {-->
<!--//            width: 15%;-->
<!--//            margin-right: 4%;-->
<!--//-->
<!--//            img {-->
<!--//              width: 100%;-->
<!--//-->
<!--//            }-->
<!--//          }-->
<!--//          .o-time {-->
<!--//            font-size: 1.8vh;-->
<!--//            border-radius: 8px;-->
<!--//          }-->
<!--//          .o-time:hover {-->
<!--//            background-color: rgba(143, 241, 121, 0.51);-->
<!--//          }-->
<!--//        }-->
<!--//      }-->
<!--//    }-->
<!--//    //议题盒子底部按钮-->
<!--//    .down {-->
<!--//      flex: 2.5;-->
<!--//      display: flex;-->
<!--//      justify-content: space-around;-->
<!--//      align-items: center;-->
<!--//      border-top: 1px solid #cccccc;-->
<!--//-->
<!--//      .img {-->
<!--//        width: 15%;-->
<!--//        padding: 2.5%;-->
<!--//        display: flex;-->
<!--//        justify-content: center;-->
<!--//        align-items: center;-->
<!--//-->
<!--//        img {-->
<!--//          width: 70%;-->
<!--//        }-->
<!--//      }-->
<!--//      .img:hover {-->
<!--//        background-color: rgba(121, 104, 104, 0.24);-->
<!--//      }-->
<!--//    }-->
<!--//  }-->
<!--//-->
<!--//  .voteItem:hover {-->
<!--//    background-color: rgba(227, 196, 173, 0.27);-->
<!--//    animation: transShadow2 0.3s forwards;-->
<!--//  }-->
<!--//}-->
<!--</style>-->
