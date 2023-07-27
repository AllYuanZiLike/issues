<template>
  <div class="mod-project__prjproject">
    <el-drawer
      v-model="drawerProject"
      title="项目"
      size="90%"
      direction="rtl"
      :before-close="handleClose"
      class="drawer"
    >
    <el-empty description="暂无项目" image="src/assets/images/empty_data.png" v-if="ListForm.length === 0" />
    <!--    投票按钮-->
    <div class="addBox" v-if="voteBtn">
      <el-button type="primary" class="add" @click="downVote()">
        <div class="img"><img src="@/assets/images/voting.png" alt="" /></div>
        点击进行投票
      </el-button>
    </div>
    <div class="voteBox">
      <div class="voteItem" v-for="(item, index) in ListForm" :key="index">
        <div class="top">
          <div class="top-header">
            <div class="img">
              <img src="@/assets/images/issues/subissues.png" alt="" />
            </div>
            <div class="title">
              <div class="tt">{{ item.name }}</div>
            </div>
          </div>
          <!--  项目申请人-->
          <div class="applicant">
            <el-tooltip class="box-item" effect="light" content="项目申请人" placement="top">
              <div class="img"><img src="@/assets/images/user.png" alt="" /></div>
            </el-tooltip>
<!--            <div class="p">{{ item.creatorDTO.username }}</div>-->
          </div>
          <div class="inform">
            <p v-html="item.info"></p>
          </div>
        </div>
      </div>
    </div>
    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <sort ref="sort" :userId="userLogin.id" :categoryId="dataForm.categoryId" v-show="sortVisible" @changeProjectVisible="changeProjectVisible"></sort>
    <score ref="score" :userId="userLogin.id" :categoryId="dataForm.categoryId" :maxscore="maxNum" :minscore="minNum" v-show="scoreVisible" @changeProjectVisible="changeProjectVisible"></score>
    <poll ref="poll" :userId="userLogin.id" :categoryId="dataForm.categoryId" :maxpoll="maxPoll" :minpoll="minPoll" v-show="pollVisible" @changeProjectVisible="changeProjectVisible"></poll>
    <decide ref="decide" :userId="userLogin.id" :categoryId="dataForm.categoryId" v-show="decideVisible" @changeProjectVisible="changeProjectVisible"></decide>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, nextTick, reactive, toRefs } from "vue";
import Sort from "@/views/project/votingsort.vue";
import Poll from "@/views/project/votingpoll.vue";
import Score from "@/views/project/votingscore.vue";
import Decide from "@/views/project/votingdecide.vue";
import baseService from "@/service/baseService";
import {useAppStore} from "@/store/index"
import {ElMessageBox} from "element-plus";
export default defineComponent({
  props:["categoryId","categoryStatus"],
  components: {
    Sort,
    Poll,
    Score,
    Decide
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
      pollAbout: false,
      pollVisible: false,
      sortAbout: false,
      sortVisible: false,
      scoreAbout: false,
      scoreVisible: false,
      decideAbout: false,
      decideVisible: false,
      voteBtn: false,
      maxNum: 0,
      maxPoll: 0,
      minNum: 0,
      minPoll: 0,
      dataForm: {
        applicantId: "",
        categoryId: "",
        name: "",
        status: ""
      },
      rule: {
        type:0,
        minPoll:0,
        maxPoll:0,
        minNum:0,
        maxNum:0
      },
      project: {},
      ListForm: [{ voteSrc: "",name:"" ,info:""}],
      fileVisible: false
    });
    return { store, ...useView(state), ...toRefs(state) };
  },
  methods: {
    changeProjectVisible(){
      this.drawerProject = false;
      this.$emit("updateDrawerPro");
    },
    initProject(){
      this.dataForm.categoryId = this.categoryId;
      this.getLoginUser()
      this.drawerProject = true;
      this.getDataList();
      console.log(this.categoryStatus)
      if(this.categoryStatus === 3) this.voteBtn = true;
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerProject = false;
          // this.$parent!.isParHidden();
        })
        .catch(() => {
          // catch error
        })
    },
    getLoginUser() {
      // console.log(this.store)
      this.userLogin.id = this.store.state.user.id;
      /**
       * 获取项目列表
       */
      baseService
        .get("/project/category/showProject", {
          id: this.dataForm.categoryId
        })
        .then((res) => {
          console.log(res)
          if (res.code !== 0) return false;
          this.ListForm = res.data;
        });
      /**
       * 获取规则
       */
      baseService
        .get("/project/category/showRule", {
          id: this.dataForm.categoryId
        })
        .then((res) => {
          console.log(res)
          if (res.code !== 0) return false;
          this.rule = res.data;
          console.log(this.rule.type)
          if (this.rule.type === 1) {
            this.pollAbout = true;
            this.maxPoll = this.rule.maxPoll;
            this.minPoll = this.rule.minPoll;
          } else if (this.rule.type === 2) {
            this.scoreAbout = true;
            this.maxNum = this.rule.maxNum;
            this.minNum = this.rule.minNum;
          } else if (this.rule.type === 3) this.decideAbout = true;
          else if (this.rule.type === 4) this.sortAbout = true;
        });
    },
    downVote() {
      if (this.pollAbout) {
        this.pollVisible = true;
        this.scoreVisible = false;
        this.sortVisible = false;
        this.decideVisible = false;
      } else if (this.scoreAbout) {
        this.pollVisible = false;
        this.scoreVisible = true;
        this.sortVisible = false;
        this.decideVisible = false;
      } else if (this.decideAbout) {
        this.pollVisible = false;
        this.scoreVisible = false;
        this.sortVisible = false;
        this.decideVisible = true;
      } else if (this.sortAbout) {
        this.pollVisible = false;
        this.scoreVisible = false;
        this.sortVisible = true;
        this.decideVisible = false;
      }
      if (this.pollVisible) {
        nextTick(() => {
          let that:any = this
          that.$refs["poll"].init();
        });
      } else if (this.scoreVisible) {
        nextTick(() => {
          let that:any = this
          that.$refs["score"].init();
        });
      } else if (this.decideVisible) {
        nextTick(() => {
          let that:any = this
          that.$refs["decide"].init();
        });
      } else if (this.sortVisible) {
        nextTick(() => {
          let that:any = this
          that.$refs["sort"].init();
        });
      }
      // this.voteBUtton = false;
      // this.$message.warning("此项目已投票，请勿重复投票");
    }
  },
  watch: {
    // ListForm:{
    //   handler(newData,oldData) {
    //     this.getLoginUser()
    //   },
    //   immediate:true,
    //   deep: true
    // }
  },
  beforeMount() {

  }
});
</script>
<style lang="less">
.drawer {
  background-image: url(@/assets/images/item-bg.jpg) !important;
  background-size: 100% auto !important;
  //投票盒子
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

  .voteBox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .voteItem:nth-child(3n) {
      margin-right: 0;
    }

    .voteItem {
      //height: 34vh;
      margin-bottom: 30px;
      margin-right: 3.5%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      width: 31%;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;

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

        //议题地点
        .applicant {
          padding-top: 1%;
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
            margin-left: 5%;
            font-size: 16px;
          }
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
}
</style>
