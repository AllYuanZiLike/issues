<template>
  <div class="mod-project__prjprojectcategory">
    <!--    各种活动数量-->
    <div class="state">
      <!--      投票活动-->
      <el-badge :value="voteNum" class="num_badge">
      <el-button :class="voteFocus ? 'vote_voterFocus' : 'vote_voter'" @click="getListVote(0)">
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">投票活动</p>
      </el-button>
      </el-badge>
      <!--      监票活动-->
      <el-badge :value="jianNum" class="num_badge">
      <el-button :class="jianFocus ? 'vote_jianFocus' : 'vote_jian'" @click="getListJian(1)">
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">监票活动</p>
      </el-button>
      </el-badge>
      <!--      计票活动-->
      <el-badge :value="jiNum" class="num_badge">
      <el-button :class="jiPiaoFocus ? 'vote_jipiaoFocus' : 'vote_jipiao'" @click="getListJiPiao(2)">
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">计票活动</p>
      </el-button>
      </el-badge>
    </div>
    <!--    议题列表-->
    <div class="voteBox">
      <!--    议题盒子-->
      <div class="voteItem" v-for="(item, index) in Listform" :key="index">
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
          <div class="placeisonline">
            <!--          会议形式-->
            <div class="online">
              <div class="img"><img src="@/assets/images/online.png" alt="" /></div>
              <el-tooltip class="box-item" effect="light" content="会议形式" placement="top">
                <div class="p">{{ item.online }}</div>
              </el-tooltip>
            </div>
            <!--  议题地点-->
            <div class="place" v-show="item.online === '线下'">
              <div class="img"><img src="@/assets/images/place.png" alt="" /></div>
              <el-tooltip class="box-item" effect="light" content="会议室" placement="top">
                <div class="p">{{item.isOnline===0?"线上":item.room.name }}</div>
              </el-tooltip>
            </div>
          </div>
          <!--  议题介绍-->
          <div class="info-box">
            <div class="img">
              <img src="@/assets/images/info.png" alt="" />
            </div>
            <el-tooltip class="box-item" effect="light" content="简介" placement="top">
              <div class="inform">
                <p v-html="item.info"></p>
              </div>
            </el-tooltip>
          </div>
          <!--  收集项目时间-->
          <div class="time">
            <!--   开始时间-->
            <div class="beginTime">
              <div class="img"><img src="@/assets/images/begin-time.png" /></div>
              <el-tooltip class="box-item" effect="light" content="收集项目开始时间" placement="top">
                <div class="b-time">{{ item.startTime }}</div>
              </el-tooltip>
            </div>
            <!--       结束时间     -->
            <div class="overTime">
              <div class="img"><img src="@/assets/images/over-time.png" /></div>
              <el-tooltip class="box-item" effect="light" content="收集项目结束时间" placement="top">
                <div class="o-time">{{ item.stopTime }}</div>
              </el-tooltip>
            </div>
          </div>
          <!--  项目评审预计时间-->
          <div class="time">
            <!--   开始时间-->
            <div class="beginTime">
              <div class="img"><img src="@/assets/images/re-starttime.png" /></div>
              <el-tooltip class="box-item" effect="light" content="项目评审开始时间" placement="bottom">
                <div class="b-time">{{ item.reserveBeginTime }}</div>
              </el-tooltip>
            </div>
            <!--       结束时间     -->
            <div class="overTime">
              <div class="img"><img src="@/assets/images/re-stoptime.png" /></div>
              <el-tooltip class="box-item" effect="light" content="项目评审结束时间" placement="bottom">
                <div class="o-time">{{ item.reserveEndTime }}</div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <!--   盒子底部按钮 -->
        <div class="down">
          <!--     议题状态-->
          <el-tooltip class="box-item" effect="light" :content="item.statusText" placement="bottom">
            <div class="img"><img :src="item.progressSrc" alt="" /></div>
          </el-tooltip>
          <el-tooltip class="box-item" effect="light" content="查看项目" placement="bottom">
            <div class="img" v-show="projectButton" @click="checkProject(item.id, item.status)"><img src="@/assets/images/issues/check.png" alt="" /></div>
          </el-tooltip>
          <el-tooltip class="box-item" effect="light" content="查看项目评审明细" placement="bottom">
            <div class="img" v-show="resultButton" @click="checkResult(item.id, item.status)"><img src="@/assets/images/result.png" alt="" /></div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <VoteProject v-if="drawerProject" ref="project" :categoryId="categoryId" :categoryStatus="categoryStatus"></VoteProject>
    <Result v-if="drawerResult" ref="result"  :isAdd="isAdd" :categoryId="categoryId" :categoryStatus="categoryStatus" @changeResultVisible="changeResultVisible"></Result>
  </div>
</template>

<script lang="ts">
import {useAppStore} from "@/store/index"
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, toRefs} from "vue";
import AddOrUpdate from "./category-add-or-update.vue";
import VoteProject from "@/views/project/voteproject.vue"
import Result from "@/views/project/voteresult.vue"
import baseService from "@/service/baseService";
export default defineComponent({
  components:{
    VoteProject,
    Result
  },
  setup() {
    const store = useAppStore();
    const state = reactive({
      userLogin: {
        duty: 0,
        id: "",
        realName: "",
        username: ""
      },
      drawerProject:false,
      drawerResult:false,//评审明细抽屉
      isAdd:false,
      categoryId:"",
      categoryStatus:0,
      voteFocus: true,
      resultButton: false,
      projectButton: true,
      jianFocus: false,
      jiPiaoFocus: false,
      voteNum:0,
      jianNum:0,
      jiNum:0,
      Listform: [
        {
          beginTime: "",
          startTime:"",
          stopTime:"",
          couterId: "",
          endTime: "",
          id: "",
          info: "",
          isOnline: 0,
          name: "",
          online: "",
          reserveBeginTime: "",
          reserveEndTime: "",
          roomId: "",
          room:{} as any,
          scrutatorId: "",
          state: "",
          status: 1,
          progressSrc: "",
          placeVisible: true,
          statusText:""
        }
      ]
    });
    return { store, ...useView(state), ...toRefs(state) };
  },
  methods: {
    changeResultVisible(){
      this.drawerResult = false
    },
    getLoginUser() {
      // console.log(this.store.state.user);
      this.userLogin.id = this.store.state.user.id;
      this.userLogin.realName = this.store.state.user.realName;
      this.userLogin.username = this.store.state.user.username;
      this.getListJian(1);
      this.getListJiPiao(2);
      this.getListVote(0);
    },
    // updateDrawerPro(){
    //   this.drawerProject = false
    // },
    getDataText() {
      console.log(this.Listform);
      this.Listform = this.Listform.map((item, index) => {
        return { ...item, placeVisible: true,statusText: "", progressSrc: "" };
      });

      /**
       *处理议题盒子底部按钮状态
       */

      for (let i = 0; i < this.Listform.length; i++) {
        if (this.Listform[i].online === "线上") this.Listform[i].placeVisible = false;

        if (this.Listform[i].status === 0) {
          this.Listform[i].statusText = "未开始";
          this.Listform[i].progressSrc = "src/assets/images/issues/progress_begin.png";
        } else if (this.Listform[i].status === 1) {
          this.Listform[i].statusText = "收集项目中";
          this.Listform[i].progressSrc = "src/assets/images/projecting.png";
        } else if (this.Listform[i].status === 2) {
          this.Listform[i].statusText = "收集项目已结束";
          this.Listform[i].progressSrc = "src/assets/images/projected.png";
        } else if (this.Listform[i].status === 3) {
          this.Listform[i].statusText = "评审进行中";
          this.Listform[i].progressSrc = "src/assets/images/voting.png";
        } else if (this.Listform[i].status === 4) {
          this.Listform[i].statusText = "评审已结束";
          this.Listform[i].progressSrc = "src/assets/images/voted.png";
        }

        console.log(this.Listform[i].statusText)
      }
    },
    getListVote(duty: number) {
      this.voteFocus = true;
      this.jianFocus = false;
      this.jiPiaoFocus = false;
      this.resultButton = false;
      this.projectButton = true;
      this.userLogin.duty = duty;
      /**
       * 获取的评审列表
       */ baseService
        .get("/project/participant/have", {
          id: this.userLogin.id,
          duty: this.userLogin.duty
        })
        .then((res) => {
          console.log(res);
          if (res.code !== 0) return false;
          this.Listform = res.data;
          this.voteNum=res.data.length
          this.getDataText();
        });

    },
    getListJian(duty: number) {
      this.voteFocus = false;
      this.jianFocus = true;
      this.jiPiaoFocus = false;
      this.resultButton = true;
      this.projectButton = false;
      this.userLogin.duty = duty;
      /**
       * 获取的评审列表
       */ baseService
        .get("/project/participant/have", {
          id: this.userLogin.id,
          duty: this.userLogin.duty
        })
        .then((res) => {
          console.log(res);
          if (res.code !== 0) return false;
          this.Listform = res.data;
          this.jianNum=res.data.length
          this.getDataText();
        });

    },
    getListJiPiao(duty: number) {
      this.voteFocus = false;
      this.jianFocus = false;
      this.jiPiaoFocus = true;
      this.resultButton = true;
      this.projectButton = false;
      this.userLogin.duty = duty;
      /**
       * 获取的评审列表
       */ baseService
        .get("/project/participant/have", {
          id: this.userLogin.id,
          duty: this.userLogin.duty
        })
        .then((res) => {
          console.log(res);
          if (res.code !== 0) return false;
          this.Listform = res.data;
          this.jiNum=res.data.length
          this.getDataText();
        });

    },
    checkProject(id: string, status: number) {
      console.log(id, this.userLogin.id);
      if (status === 0) this['$message'].error("项目评审未开始");
      else {
        //是否可以查看项目
        baseService.get("/project/participant/sort", { id: id, participantId: this.userLogin.id }).then((res) => {
          console.log(res);
          if (res.code !== 0) return false;
          if (res.data === 0) {
            this.drawerProject = true;
            this.categoryId = "";
            this.categoryId = id;
            this.categoryStatus = status
            nextTick(()=>{
              // this.$refs["part"].dataForm.issuesId = id;
              // this.$refs.rule.status = status;
              let that:any = this
              that.$refs.project.initProject();
              that.$refs.project.$forceUpdate()
            })
          } else this['$message'].warning("已投票，投票后无法查看");
        });
      }
    },
    checkResult(id: string, status: number) {
      console.log(this.userLogin.duty)
      //查看结果，如果已确认则不能查看结果
      baseService.get("/project/category/confirmTime", { id: id, power: this.userLogin.duty }).then((res) => {
        console.log(res);
        if (res.code !== 0) return false;
        if (res.data === 0) {
          this.drawerResult = true;
          this.categoryId = "";
          this.categoryId = id;
          this.categoryStatus = status
          nextTick(()=>{
            // this.$refs["part"].dataForm.issuesId = id;
            // this.$refs.rule.status = status;
            let that:any = this
            that.$refs.result.initResult();
            that.$refs.result.$forceUpdate()
          })
        } else this['$message'].warning("已确认，确认后无法查看");
      });
    }
  },
  watch: {},
  beforeMount() {
    this.getLoginUser();
  },
  mounted() {
    // this.getDataText();
  }
});
</script>
<style lang="less" scoped>
//议题各个状态数量
.state {
  margin: 0 0 20px 0;
  width: 100%;
  height: 12.3vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .num_badge {
    width: 30%;
    //投票
    .vote_voter {
      cursor: pointer;
      width: 90%;
      display: inline-block;
      height: 10vh;
      background-color: #eef1fc;
      margin: 0 2px;
      color: #87a2ff;
      border-radius: 10px;
      padding: 1%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      //数字
      .number {
        font-size: 40px;
      }
      //文字
      .word {
        font-size: 25px;
      }
    }

    .vote_voterFocus {
      cursor: pointer;
      width: 90%;
      display: inline-block;
      height: 10vh;
      background-color: #eef1fc;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.15);
      margin: 0 20px;
      color: #87a2ff;
      border-radius: 10px;
      //border: 2px dotted #42a5f5;
      padding: 1%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      //数字
      .number {
        font-size: 40px;
      }
      //文字
      .word {
        font-size: 25px;
      }
    }
  }
  .num_badge {
    width: 30%;
    //监票
    .vote_jian {
      width: 90%;
      cursor: pointer;
      background-color: #eef1fc;
      display: inline-block;
      height: 10vh;
      margin: 0 20px;
      color: #87a2ff;
      border-radius: 10px;
      padding: 1%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      //数字
      .number {
        font-size: 40px;
      }
      //文字
      .word {
        font-size: 25px;
      }
    }
    .vote_jianFocus {
      width: 90%;
      cursor: pointer;
      background-color: #eef1fc;
      display: inline-block;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.15);
      height: 10vh;
      margin: 0 20px;
      color: #87a2ff;
      border-radius: 10px;
      padding: 1%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      //数字
      .number {
        font-size: 40px;
      }
      //文字
      .word {
        font-size: 25px;
      }
    }
  }
  .num_badge {
    width: 30%;
    //计票
    .vote_jipiao {
      width: 90%;
      cursor: pointer;
      background-color: #eef1fc;
      margin: 0 20px;
      display: inline-block;
      height: 10vh;
      color: #87a2ff;
      border-radius: 10px;
      padding: 1%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      //数字
      .number {
        font-size: 40px;
      }
      //文字
      .word {
        font-size: 25px;
      }
    }
    .vote_jipiaoFocus {
      width: 90%;
      cursor: pointer;
      background-color: #eef1fc;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.15);
      margin: 0 20px;
      display: inline-block;
      height: 10vh;
      color: #87a2ff;
      border-radius: 10px;
      padding: 1%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      //数字
      .number {
        font-size: 40px;
      }
      //文字
      .word {
        font-size: 25px;
      }
    }
  }
}
//新增议题盒子
.addBox {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  //新增议题按钮
  .add {
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
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 31%;
    background-color: #f8faff;
    background-image: url(@/assets/images/issues/vote_item_bg.png);
    background-size: 100% 100%;
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
          width: 8%;

          img {
            width: 100%;
          }
        }

        .title {
          //flex: 8;
          width: 85%;
          margin-left: 1%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .tt {
            font-size: 18px;
            line-height: 40px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .placeisonline {
        margin-top: 1%;
        display: flex;
        justify-content: center;
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
            width: 8%;

            img {
              width: 100%;
            }
          }

          .p {
            margin-left: 5%;
            font-size: 16px;
          }
        }
        //议题形式
        .online {
          flex: 1;
          font-size: 16px;
          color: #5b5f69;
          margin-bottom: 2px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .img {
            width: 8%;

            img {
              width: 100%;
            }
          }

          .p {
            margin-left: 5%;
            font-size: 16px;
          }
        }
      }

      //议题介绍
      .info-box {
        display: flex;
        justify-content: center;
        height: 12vh;
        .img {
          width: 7.5%;

          img {
            width: 100%;
          }
        }
        .inform {
          width: 92.5%;
          margin-left: 1%;
          font-size: 14px;
          color: #5b5f69;
          overflow: scroll;

          p {
            margin-block-start: -1em;
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
            width: 18%;

            img {
              width: 100%;
            }
          }
          .b-time {
            font-size: 1.8vh;
          }
        }
        //结束时间
        .overTime {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .img {
            width: 18%;

            img {
              width: 100%;
            }
          }
          .o-time {
            font-size: 1.8vh;
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
    }
  }
}
</style>
