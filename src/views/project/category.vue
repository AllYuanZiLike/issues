<template>
  <div class="mod-project__prjprojectcategory">
    <!--    各个状态议题数量-->
    <div class="state">
      <!--      未开始-->
      <div class="disvote">
        <span class="number">{{ statusNum.disvote }}</span>
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">未开始</p>
      </div>
      <!--      收集项目中-->
      <div class="projecting">
        <span class="number">{{ statusNum.projecting }}</span>
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">收集项目中</p>
      </div>
      <!--      收集项目已结束-->
      <div class="projected">
        <span class="number">{{ statusNum.projected }}</span>
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">收集项目已结束</p>
      </div>
      <!--      项目评审进行中-->
      <div class="voting">
        <span class="number">{{ statusNum.voting }}</span>
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">项目评审进行中</p>
      </div>
      <!--      项目评审已结束-->
      <div class="voted">
        <span class="number">{{ statusNum.voted }}</span>
        <el-icon size="large"><Histogram /></el-icon>
        <p class="word">项目评审已结束</p>
      </div>
    </div>
    <div class="history_box">
      <!--      <div class="history"></div>-->
      <el-button class="history" @click="checkHistory">历史会议</el-button>
    </div>
    <!--    新增议题按钮-->
    <div class="addBox" v-show="startVoteVisible">
      <el-button v-if="hasPermission('/project:category:save')" type="primary" @click="addOrUpdateHandle()" class="add">
        <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
        新增项目评审
      </el-button>
    </div>
    <!--    议题列表-->
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
          <div class="placeisonline">
            <!--          会议形式-->
            <div class="online">
              <div class="img"><img src="@/assets/images/online.png" alt="" /></div>
              <el-tooltip class="box-item" effect="light" content="会议形式" placement="top">
                <div class="p">{{ item.isOnline===0?"线上":item.room.name }}</div>
              </el-tooltip>
            </div>
            <!--  议题地点-->
            <div class="place" v-show="item.online === '线下'">
              <div class="img"><img src="@/assets/images/place.png" alt="" /></div>
              <el-tooltip class="box-item" effect="light" content="会议室" placement="top">
<!--                <div class="p">{{ item.baseRoomDTO.name }}</div>-->
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
          <!--          开始/结束活动-->
          <el-tooltip class="box-item" effect="light" :content="item.contentText" placement="bottom">
            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:changeVote')" @click="startVote(item.id, index)">
              <img :src="item.imgSrc" alt="" />
            </div>
          </el-tooltip>
          <!--          查看评审规则-->
          <el-tooltip class="box-item" effect="light" content="查看评审规则" placement="bottom">
            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:checkRule')" @click="checkRule(item.id, item.status)"><img src="@/assets/images/rules.png" alt="" /></div>
          </el-tooltip>
          <!--          查看参与人员-->
          <el-tooltip class="box-item" effect="light" content="查看参与人员" placement="bottom">
            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:checkParticipant')" @click="checkParticipant(item.id, item.status)"><img src="@/assets/images/issues/add.png" alt="" /></div>
          </el-tooltip>
          <!--          查看项目-->
          <el-tooltip class="box-item" effect="light" content="查看项目" placement="bottom">
            <div class="img" v-if="hasPermission('project:category:checkProject')" v-show="item.projectVisible" @click="isParticipant(item.id, item.status)"><img src="@/assets/images/issues/check.png" alt="" /></div>
          </el-tooltip>
          <!--          查看评审结果明细-->
          <el-tooltip class="box-item" effect="light" content="查看评审明细" placement="bottom">
            <div class="img" v-if="hasPermission('project:projectcategory:checkResult')" v-show="item.resultVisible" @click="checkResult(item.id, item.status)"><img src="@/assets/images/result.png" alt="" /></div>
          </el-tooltip>
          <!--          议题修改-->
          <el-tooltip class="box-item" effect="light" content="修改" placement="bottom" v-if="item.upOrdeVisible">
            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:update')" @click="addOrUpdateHandle(item.id)"><img src="@/assets/images/issues/update.png" alt="" /></div>
          </el-tooltip>
          <!--          议题删除-->
          <el-tooltip class="box-item" effect="light" content="删除" placement="bottom" v-if="item.upOrdeVisible">
            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:delete')" @click="deleteHandle(item.id)"><img src="@/assets/images/issues/delete.png" alt="" /></div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData();getDataText()"></add-or-update>
    <historyProject v-if="drawerHis" ref="his"></historyProject>
    <Rule v-if="drawerRule" ref="rule" :categoryId="categoryId" :categoryStatus="categoryStatus"></Rule>
    <Part v-if="drawerPart" ref="part" :categoryId="categoryId" :categoryStatus="categoryStatus"></Part>
    <Project v-if="drawerPro" ref="pro" :categoryId="categoryId" :categoryStatus="categoryStatus"></Project>
    <Result v-if="drawerResult" ref="result" :isAdd="isAdd" :categoryId="categoryId" :categoryStatus="categoryStatus"></Result>
<!--    @changeResultVisible="changeResultVisible"-->
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./category-add-or-update.vue";
import baseService from "@/service/baseService";
import historyProject from "@/views/project/historyProject.vue";
import Rule from "@/views/project/rule.vue";
import Part from "@/views/project/participant.vue"
import Project from "@/views/project/project.vue"
import Result from "@/views/project/voteresult.vue"
import {useAppStore} from "@/store/index"
import {ElMessage} from "element-plus";
export default defineComponent({
  components: {
    historyProject,
    AddOrUpdate,
    Rule,
    Part,
    Project,
    Result
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
    const store = useAppStore();
    const state = reactive({
      // getDataListURL: "/project/category/page",
      getDataListIsPage: true,
      exportURL: "/project/category/export",
      deleteURL: "/project/category",
      deleteIsBatch: true,
      datetimerange: null,
      drawerHis:false,//历史会议抽屉
      drawerRule:false,//规则抽屉
      drawerPart:false,//参与人抽屉
      drawerPro:false,//项目抽屉
      drawerResult:false,//评审明细
      projectVisible: false,//是否可查看项目
      startVoteVisible: true,//是否能启动活动
      resultVisble: false,//是否能查看明细
      isAdd:true,
      categoryId:"",//当前项目评审id
      categoryStatus:0,//当前项目评审状态
      dataForm: {
        name: "",
        startDateTime: null as number | null,
        endDateTime: null as number | null,
        isOnline: "",
        status: "",
        delFlag: "",
        userId:""
      },
      userLogin: {
        duty: 0,
        id: "",
        realName: "",
        username: ""
      },
      statusNum:{
        // 议题未开始
        disvote: 0,
        //收集项目中
        projecting: 0,
        //收集项目已结束
        projected: 0,
        // 议题进行中
        voting: 0,
        // 议题已结束
        voted: 0
      }
    });
    return {store,addOrUpdateHandle,...useView(state),...toRefs(state)}

  },
  methods: {
    getLoginUser () {
      console.log(this.store.state.user);
      this.userLogin.id = this.store.state.user.id;
      this.userLogin.realName = this.store.state.user.realName;
      this.userLogin.username = this.store.state.user.username;
      if (this.userLogin.realName !== "项目评审管理员") {
        this.startVoteVisible = false;
      }
      if (this.userLogin.realName === "超级管理员") {
        this.startVoteVisible = true;
      }
    },
    getData(){
      this.dataForm.userId=this.userLogin.id
      console.log(this.dataForm)
      baseService
        .get("/project/category/page",{
          order: this.order,
          orderField: this.orderField,
          page: this.getDataListIsPage ? this.page : null,
          limit: this.getDataListIsPage ? this.limit : null,
          ...this.dataForm
        })
        .then((res) => {
          console.log(res);
          if (res.code !== 0) return false;
          this.dataList = res.data;
          this.dataListLoading = false;
          this.dataList = this.getDataListIsPage ? res.data.list : res.data;
          this.total = this.getDataListIsPage ? res.data.total : 0;
          this.getDataText()
        })
    },
    getDataText() {
      this.dataList = this.dataList.map((item, index) => {
        return { ...item, onlineText: "", statusText: "", placeVisible: true, upOrdeVisible: true,projectVisible:false,resultVisible:false };
      });
      // for (let i = 0; i < this.dataList.length; i++) {
      //   if (this.dataList[i].isOnline === 0) this.dataList[i].onlineText = "线上";
      //   else if (this.dataList[i].isOnline === 1) this.dataList[i].onlineText = "线下";
      // }
      /**
       * 获取议题各个状态的数量
       */
      baseService.get("/project/category/show").then((res) => {
        console.log(res);
        if (res.code !== 0) return false;
        this.statusNum.disvote = res.data.zero;
        this.statusNum.projecting = res.data.one;
        this.statusNum.projected = res.data.two;
        this.statusNum.voting = res.data.three;
        this.statusNum.voted = res.data.four;
      });
      /**
       *处理议题盒子底部按钮状态
       */
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 0) {
          this.dataList[i].statusText = "未开始";
          this.dataList[i].projectVisible = false;
          this.dataList[i].upOrdeVisible = true;
          this.dataList[i].resultVisible = false;
          this.dataList[i].contentText = "开始项目收集";
          this.dataList[i].imgSrc = "src/assets/images/start_collection.png";
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_begin.png";
        } else if (this.dataList[i].status === 1) {
          this.dataList[i].statusText = "收集项目中";
          this.dataList[i].contentText = "结束项目收集";
          this.dataList[i].projectVisible = true;
          this.dataList[i].upOrdeVisible = true;
          this.dataList[i].resultVisible = false;
          this.dataList[i].imgSrc = "src/assets/images/over_collection.png";
          this.dataList[i].progressSrc = "src/assets/images/projecting.png";
          this.dataList[i].buttonShow = false;
        } else if (this.dataList[i].status === 2) {
          this.dataList[i].statusText = "收集项目已结束";
          this.dataList[i].projectVisible = true;
          this.dataList[i].upOrdeVisible = true;
          this.dataList[i].resultVisible = false;
          this.dataList[i].contentText = "活动已结束";
          this.dataList[i].progressSrc = "src/assets/images/projected.png";
          this.dataList[i].buttonShow = false;
          this.dataList[i].contentText = "开始项目评审";
          this.dataList[i].imgSrc = "src/assets/images/start.png";
        } else if (this.dataList[i].status === 3) {
          this.dataList[i].statusText = "评审进行中";
          this.dataList[i].projectVisible = true;
          this.dataList[i].upOrdeVisible = false;
          this.dataList[i].resultVisible = true;
          this.dataList[i].progressSrc = "src/assets/images/voting.png";
          this.dataList[i].imgSrc = "src/assets/images/over.png";
          this.dataList[i].contentText = "结束项目评审";
        } else if (this.dataList[i].status === 4) {
          this.dataList[i].statusText = "评审已结束";
          this.dataList[i].projectVisible = true;
          this.dataList[i].upOrdeVisible = false;
          this.dataList[i].resultVisible = true;
          this.dataList[i].progressSrc = "src/assets/images/voted.png";
          this.dataList[i].imgSrc = "src/assets/images/overed.png";
          this.dataList[i].contentText = "评审已结束";
        }
      }
      console.log(this.projectVisible)
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].online === "线上") this.dataList[i].placeVisible = false;
      }
    },
    /**
     * 查看历史会议
     */
    checkHistory(){
      this.drawerHis = true;
      nextTick(()=>{
        let that:any = this
        that.$refs.his.dataForm.status = 2;
        that.$refs.his.initHis();
        // this.$refs.his.$forceUpdate()
      })
    },
    /**
     * 跳转查看规则页面
     * @param id
     * @param status
     */
    checkRule(id: string, status: number) {
      // this.$router.push({
      //   path: "/project/prjrule",
      //   query: {
      //     thesisId: id,
      //     status: status
      //   }
      // });
      this.drawerRule = true;
      this.categoryId = "";
      this.categoryId = id;
      this.categoryStatus = status
      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        // this.$refs.rule.status = status;
        let that:any = this
        that.$refs.rule.initRule();
        that.$refs.rule.$forceUpdate()
      })
    },
    /**
     * 跳转查看参与人页面
     * @param id
     * @param status
     */
    checkParticipant(id: string, status: number) {
      // this.$router.push({
      //   path: "/project/prjactivityparticipant",
      //   query: {
      //     thesisId: id,
      //     status: status
      //   }
      // });
      console.log(id)
      this.drawerPart = true;
      this.categoryId = "";
      this.categoryId = id;
      this.categoryStatus = status
      // this.$refs.part.dataForm.categoryId = id
      nextTick(()=>{
        let that:any = this
        that.$refs.part.initPart();
        that.$refs.part.$forceUpdate()
      })
    },
    /**
     * 跳转查看项目页面
     * @param id
     * @param status
     */
    isParticipant(id: string, status: number){
      console.log(id,this.userLogin.id)
      baseService.get("project/project/isParticipant", {categoryId: id,userId:this.userLogin.id}).then( res => {
        console.log(res)
        if (res.code !== 0) return false
        console.log(555 ,id);
        if (res.data) ElMessage.error("你是该项目评审参与人，不能查看项目");
        else this.checkProject(id,status)
      })
    },
    checkProject(id: string, status: number) {
          console.log(333)
          this.drawerPro = true;
          this.categoryId = "";
          this.categoryId = id;
          this.categoryStatus = status
          console.log(this.categoryId)
          nextTick(()=>{
            let that:any = this
            that.$refs.pro.dataForm.categoryId=id
            console.log(that.$refs.pro.dataForm.categoryId)
            that.$refs.pro.dataForm.categoryStatus=status
            console.log(that.$refs.pro.dataForm.categoryStatus)
            that.$refs.pro.initPro();
            that.$refs.pro.$forceUpdate()
          })

    },
    /**
     * 跳转查看项目评审结果明细页面
     * @param id
     * @param status
     */
    checkResult(id: string, status: number) {

      this.drawerResult = true;
      this.categoryId = "";
      this.categoryId = id;
      this.categoryStatus = status

      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        // this.$refs.result.status = status;
        let that:any = this
        that.$refs.result.initResult();
        that.$refs.result.$forceUpdate()
      })
    },
    /**
     *开始/结束活动
     * @param id
     * @param index
     */
    startVote(id: string, index: number) {
      console.log(index);
      console.log(id, this.dataList[index].status);
      baseService.get("/project/category/change", { id: id, status: this.dataList[index].status }).then((res) => {
        console.log(res);
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.getData();
        this.getDataText()
      });
    }
  },
  watch: {
    statusNum:{
      handler(newData,oldData) {
        this.getDataText()
      },
      immediate:true,
      deep:true
    }
  },
  mounted() {
    this.getLoginUser();
    this.getData()
    // this.getDataText();
  }
});
</script>
<style lang="less" scoped>

//议题各个状态数量
.state {
  margin: 0 0 20px 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  //未开始
  .disvote {
    flex: 1;
    background-color: #42a5f5;
    margin: 0 2px;
    color: #fff;
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
  //项目收集中
  .projecting {
    flex: 1;
    background-color: #68f58d;
    margin: 0 2px;
    color: #fff;
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
  //未开始
  .projected {
    flex: 1;
    background-color: #ec6d6d;
    margin: 0 2px;
    color: #fff;
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
  //进行中
  .voting {
    flex: 1;
    background-color: #ffa726;
    margin: 0 4px 0 2px;
    color: #fff;
    border-radius: 10px;
    padding: 1%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .number {
      font-size: 40px;
    }
    .word {
      font-size: 25px;
    }
  }
  //已结束
  .voted {
    flex: 1;
    background-color: #ba68c8;
    color: #fff;
    border-radius: 10px;
    padding: 1%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .number {
      font-size: 40px;
    }
    .word {
      font-size: 25px;
    }
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
    background-image: url("@/assets/images/bg-vote-item.png");
    background-size: auto 100%;
    margin-bottom: 30px;
    margin-right: 3.5%;
    border-radius: 7.5%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
            margin-left: 1%;
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
        .inform::-webkit-scrollbar {
          width:0 !important;
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


<!--<template>-->
<!--  <div class="mod-/project__category">-->
<!--    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">-->
<!--      <el-form-item>-->
<!--        <el-input v-model="state.dataForm.name" placeholder="活动名称" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--            <el-radio-group v-model="state.dataForm.isOnline">-->
<!--              <el-radio :label="0">单选</el-radio>-->
<!--            </el-radio-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button v-if="state.hasPermission('/project:category:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button v-if="state.hasPermission('/project:category:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">-->
<!--      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>-->
<!--      <el-table-column prop="name" label="活动名称" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="info" label="活动简介" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="startTime" label="收集项目开始时间" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="stopTime" label="收集项目截止时间" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="isOnline" label="线上/会议" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="reserveBeginTime" label="评审预计开始时间" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="reserveEndTime" label="评审预计结束时间" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">-->
<!--        <template v-slot="scope">-->
<!--          <el-button v-if="state.hasPermission('/project:category:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>-->
<!--          <el-button v-if="state.hasPermission('/project:category:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>-->
<!--    &lt;!&ndash; 弹窗, 新增 / 修改 &ndash;&gt;-->
<!--    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import useView from "@/hooks/useView";-->
<!--import { nextTick, reactive, ref, toRefs, watch } from "vue";-->
<!--import AddOrUpdate from "./category-add-or-update.vue";-->

<!--const view = reactive({-->
<!--  getDataListURL: "//project/category/page",-->
<!--  getDataListIsPage: true,-->
<!--  exportURL: "//project/category/export",-->
<!--  deleteURL: "//project/category",-->
<!--  deleteIsBatch: true,-->
<!--  dataForm: {-->
<!--    name: "",-->
<!--    isOnline: "",-->
<!--  }-->
<!--});-->

<!--const state = reactive({ ...useView(view), ...toRefs(view) });-->


<!--const addKey = ref(0);-->
<!--const addOrUpdateRef = ref();-->
<!--const addOrUpdateHandle = (id?: number) => {-->
<!--  addKey.value++;-->
<!--  nextTick(() => {-->
<!--    addOrUpdateRef.value.init(id);-->
<!--  });-->
<!--};-->
<!--</script>-->
