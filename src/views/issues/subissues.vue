<template>
    <el-drawer v-model="drawerSu" title="子议题" size="90%" direction="rtl" :before-close="handleClose"  style="background-color:#eff5ff;">
      <div class="mod-issues__subissues">
      <div class="query">
        <el-form>
          <el-form-item>
            <!--      刷新按钮-->
            <el-button type="info" @click="refresh()" style="margin-top: 3.5vh; margin-right: 1vw;" class="refresh">
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-input v-model="dataForm.name" placeholder="请输入子议题名称" @keyup.enter="getDataList" :input-style="{ width: '150px'}">
              <template #append>
                <el-button type="default" @click="getDataList()">{{ $t("query") }}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    <!--    按钮盒子-->
    <div class="buttonBox">
      <!--      新增子议题盒子-->
      <div class="addBox" v-show="addBoxVisible">
        <el-button v-if="hasPermission('issues:subissues:save')" class="add" type="primary" @click="isExistPticipant()">
          <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
          新增子议题
        </el-button>
      </div>
      <!--      导出盒子-->
<!--      <div class="exportBox" v-show="!addBoxVisible">-->
<!--        <el-button type="info" v-if="hasPermission('issues:subissues:export')" class="export" @click="exportHandle()">-->
<!--          <div class="img"><img src="@/assets/images/issues/export_result.png" alt="" /></div>-->
<!--          {{ $t("export") }}-->
<!--        </el-button>-->
<!--      </div>-->
    </div>
    <!--    空状态-->
    <el-empty description="暂无子议题" image="src/assets/images/empty_data.png" v-if="(dataList.length === 0)" />


<!--          <h3 text="2xl" justify="center">{{ item }}</h3>-->

    <!--    子议题列表-->
    <div class="voteBox">
      <!--      子议题盒子-->
<!--      <div  v-for="(item, index) in dataList" :key="index">-->
      <el-carousel type="card" height="45vh" :autoplay="false">
        <el-carousel-item class="voteItem" v-for="(item, index) in dataList" :key="index">
        <!--        子议题盒子主体部分-->
          <div class="top">
            <!--          子议题标题-->
            <div class="top-header">
              <div class="img">
                <img src="@/assets/images/issues/subissues.png" alt="" />
              </div>
              <div class="title">
                <div class="tt">{{ item.name }}</div>
              </div>
            </div>
            <!--          子议题简介-->
            <div class="inform">
              <p v-html="item.info"></p>
            </div>
            <!--          子议题负责人-->
            <div class="user">
              <div class="leader">
                <el-tooltip class="box-item" effect="light" content="分管领导" placement="bottom">
                  <div class="img"><img src="@/assets/images/leader.png" alt="" /></div>
                </el-tooltip>
                <div class="p">{{ item.leader.username }}</div>
              </div>
              <div class="reporter">
                <el-tooltip class="box-item" effect="light" content="汇报人" placement="bottom">
                  <div class="img"><img src="@/assets/images/reporter.png" alt="" /></div>
                </el-tooltip>
                <div class="p">{{ item.reporter.username }}</div>
              </div>
            </div>
          </div>
          <!--        子议题盒子底部按钮-->
          <div class="down">
            <!--          子议题状态-->
            <el-tooltip class="box-item" effect="light" :content="item.stats" placement="bottom">
              <div class="img" v-show="(buttonVoteVisble && item.deleteButton)"><img :src="item.progressSrc" alt="" /></div>
            </el-tooltip>
            <!--          结束子议题-->
            <el-tooltip class="box-item" effect="light" :content="item.contentText" placement="bottom">
              <div class="img" v-if="hasPermission('issues:subissues:endVote')" v-show="(buttonVoteVisble && item.deleteButton)" @click="endVote(item.id, index)">
                <img :src="item.imgSrc" alt="" />
              </div>
            </el-tooltip>
            <!--          上传文件-->
            <el-tooltip class="box-item" effect="light" content="上传文件" placement="bottom">
              <div class="img" v-if="hasPermission('issues:subissues:uploadFile')" v-show="item.buttonShow" @click="uploadFile(item.id)">
                <img src="@/assets/images/issues/upload.png" alt="" />
              </div>
            </el-tooltip>
            <!--          查看结果-->
            <el-tooltip class="box-item" effect="light" :content="item.resultText" placement="bottom">
              <div class="img" v-if="hasPermission('issues:subissues:checkResult')" v-show="buttonVoteVisble" @click="checkResult(item.id, item.status)">
                <img src="@/assets/images/issues/check.png" alt="" />
              </div>
            </el-tooltip>
            <!--          修改-->
            <el-tooltip class="box-item" effect="light" content="修改" placement="bottom">
              <div class="img" v-if="hasPermission('issues:subissues:update')" v-show="item.buttonShow" @click="addOrUpdateHandle(item.id)">
                <img src="@/assets/images/issues/update.png" alt="" />
              </div>
            </el-tooltip>
            <!--          删除-->
            <el-tooltip class="box-item" effect="light" content="删除" placement="bottom">
              <div class="img" v-if="hasPermission('issues:subissues:delete')" v-show="item.deleteButton" @click="deleteHandle(item.id)">
                <img src="@/assets/images/issues/delete.png" alt="" />
              </div>
            </el-tooltip>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!--    分页器-->
<!--    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>-->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"  :issuesId="dataForm.issuesId"></add-or-update>
        <subissuesfile v-if="drawerFile" ref="file" :subIssuesId="currentId"></subissuesfile>
        <issuesresults ref="result" :subIssuesId="currentId"></issuesresults>
<!--      @refreshDataList="getDataList"-->
      </div>
    </el-drawer>


</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./subissues-add-or-update.vue";
import baseService from "@/service/baseService";
import subissuesfile from "@/views/issues/subissuesfile.vue";
import issuesresults from "@/views/issues/issuesresults.vue";
import { ElMessageBox,ElMessage } from "element-plus";
export default defineComponent({
  props:["issuesId","issuesStatus"],
  components: {
    AddOrUpdate,
    subissuesfile,
    issuesresults
  },
  setup() {

    const state = reactive({
      getDataListURL: "/issues/subissues/page",
      getDataListIsPage: true,
      exportURL: "/issues/subissues/export",
      deleteURL: "/issues/subissues",
      drawerSu:false,
      deleteIsBatch: true,
      fileVisible: false,
      uploadVisible: false,
      buttonVoteVisble: false,
      drawerFile:false,
      drawerResult:false,
      addBoxVisible: true,
      resultButton:false,
      currentId:"",
      dataForm: {
        name:"",
        issuesId: "",
        issuesStatus: 0,
      }
    });
    const addKey = ref(0);
    const addOrUpdateRef = ref();
    const  addOrUpdateHandle = (id?: number)=>  {

      addKey.value++;
      nextTick(() => {
        addOrUpdateRef.value.init(id);
      });
    }
    return { addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },

  methods: {

    isExistPticipant(){
      baseService.get("issues/subissues/isExistPticipant", {issuesId: this.dataForm.issuesId}).then( res => {
        console.log(222)
        console.log(res)
        if(res.code !=0) return false
        if(!res.data) ElMessage({message:"请先添加投票人-",type:"warning"})
        else this.addOrUpdateHandle()
      })
      console.log(333)
    },
    initSub(){
      this.drawerSu = true;
      this.dataForm.issuesId=this.$props.issuesId
      this.dataForm.issuesStatus=this.$props.issuesStatus
      this.refresh();
      /**
       * 新增/导出 状态
       */
      if (this.dataForm.issuesStatus != 0) this.addBoxVisible = false;

    },
    refresh(){
      this.getDataList()
      this.getData();
    },
    isFileShow() {
      this.drawerFile = true;
    },
    isFileHidden() {
      this.drawerFile = false;
    },
    handleClose(done:()=>void) {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          // this.drawerSu = false;
          done();
          // this.$parent!.isSubHidden();
        })
        .catch(() => {
          // catch error
        })
    },
    /**
     * 处理数据
     */
    getData() {
      this.dataList = this.dataList!.map((item, index) => {
        return { ...item, imgSrc: "", contentText: "", progressSrc: "", buttonShow: true, resultText: "", deleteButton: true };
      });
      /**
       *处理议题盒子底部按钮状态
       */
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 0) {
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_begin.png";
        } else if (this.dataList[i].status === 1) {
          this.dataList[i].imgSrc = "src/assets/images/over.png";
          this.dataList[i].contentText = "结束活动";
          this.buttonVoteVisble = true;
          this.dataList[i].resultText = "查看进度";
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_ing.png";
          this.dataList[i].buttonShow = false;
          this.dataList[i].deleteButton = false;
        } else if (this.dataList[i].status ===2) {
          this.dataList[i].imgSrc = "src/assets/images/overed.png";
          this.dataList[i].contentText = "活动已结束";
          this.buttonVoteVisble = true;
          this.dataList[i].resultText = "查看结果";
          this.dataList[i].progressSrc = "src/assets/images/issues/progress_over.png";
          this.dataList[i].buttonShow = false;
          this.dataList[i].deleteButton = false;
        }
      }

      if(this.issuesStatus===2) {
        this.resultButton=true;
      }

    },
    /**
     * 结束子议题
     * @param id
     * @param index
     */
    endVote(id: string, index: number) {
      baseService.get("/issues/subissues/endvote", { id: id, status: this.dataList![index].status }).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.getDataList();
      });
    },
    /**
     * 跳转上传文件页面
     * @param id
     */
    uploadFile(id: string) {
      this.drawerFile = true;
      this.currentId = id;
      nextTick(()=>{
        let that:any = this
        that.$refs["file"].dataForm.subIssuesId = id;
        that.$refs["file"].initFile();
      })
    },
    /**
     * 跳转查看结果页面
     * @param id
     */
    checkResult(id: string, status: number) {
      this.drawerResult = true;
      this.currentId = id;
      nextTick(()=>{
        let that:any = this
        // that.$refs["result"].state.dataForm.subIssuesId = id;
        that.$refs["result"].subStatus = status;
        that.$refs["result"].initResult();
      })
    }
  },
  watch: {
    dataList:{
      immediate:true,
      handler(newValue,oldValue){
        this.getData()
      }
    }
  },
  beforeMount() {
    this.dataForm.issuesId = this.issuesId;
    this.dataForm.issuesStatus = this.issuesStatus
  },
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
.refresh {
  margin-bottom: 2%;
}
//按钮盒子
.buttonBox {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  //新增按钮
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
  //导出按钮
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
//子议题列表
.voteBox {
  width: 100%;
  //display: flex;
  //flex-wrap: wrap;
  //justify-content: flex-start;
  .voteItem:nth-child(2n+1){
    background-image: url("@/assets/images/issues/vote_item_bg1.png");
    background-size:  100% 100%;
  }
  .voteItem:nth-child(2n) {
    background-color: #e4e0fd;
  }
  //子议题盒子
  .voteItem {
    margin-bottom: 30px;
    margin-right: 3.5%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    //width: 31%;
    //background-color: #ffffff;
    display: flex;
    flex-direction: column;
    //盒子主体部分
    .top {
      flex: 7;
      padding: 2.5%;
      display: flex;
      flex-direction: column;
      //子议题标题
      .top-header {
        flex: 0.1;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
          //flex: 1;
          width: 7.5%;

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
          border-radius: 8px;
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
        border-radius: 8px;
        color: #5b5f69;
        overflow: scroll;

        p {
          //margin-block-start: -1em;
          margin-block-end: -1em;
        }
      }
      //负责人
      .user {
        color: #8c8c8c;
        width: 100%;
        flex: 0.5;
        display: flex;
        justify-content: flex-start;
        //分管领导
        .leader {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .img {
            width: 15%;

            img {
              width: 100%;
            }
          }
          .p {
            margin-left: 5%;
            border-radius: 8px;
            font-size: 16px;
          }
        }
        //汇报人
        .reporter {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .img {
            width: 15%;

            img {
              width: 100%;
            }
          }
          .p {
            margin-left: 5%;
            border-radius: 8px;
            font-size: 16px;
          }
        }
      }
    }
    //盒子底部按钮部分
    .down {
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
      .img:hover {
        background-color: rgba(121, 104, 104, 0.24);
      }
    }
  }
}
</style>
