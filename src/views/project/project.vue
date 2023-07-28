<template>
  <div class="mod-project__prjproject">
    <el-drawer v-model="drawerPro" title="项目" size="90%" direction="rtl" :before-close="handleClose" class="drawer">
      <div class="query">
        <el-form>
          <el-form-item>
            <!--      刷新按钮-->
            <el-button type="info" @click="dataForm.name='';getData()" style="margin-top: 3.5vh; margin-right: 1vw;" class="refresh">
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-input v-model="dataForm.name" placeholder="请输入项目名称" @keyup.enter="getData" :input-style="{ width: '150px'}">
              <template #append>
                <el-button type="default" @click="getData()">{{ $t("query") }}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    <div class="buttonBox">
      <div class="addBox" v-show="addBoxVisible">
        <el-button v-if="hasPermission('project:project:save')" class="add" type="primary" @click="addOrUpdateHandle()">
          <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
          新增项目
        </el-button>
      </div>
<!--      <div class="exportBox">-->
<!--        <el-button type="info" v-if="hasPermission('project:project:export')" class="export" @click="exportHandle()">-->
<!--          <div class="img"><img src="@/assets/images/issues/export_result.png" alt="" /></div>-->
<!--          {{ $t("export") }}</el-button-->
<!--        >-->
<!--      </div>-->
    </div>
    <el-empty description="暂无项目" image="src/assets/images/empty_data.png" v-if="(dataList.length== 0) && (this.dataForm.categoryStatus===1 || this.dataForm.categoryStatus===2) " />
    <div class="voteBox">
<!--      <div class="voteItem" v-for="(item, index) in dataList" :key="index">-->
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
          <!--  项目申请人-->
          <div class="applicant">
            <el-tooltip class="box-item" effect="light" content="项目申请人" placement="top">
              <div class="img"><img src="@/assets/images/user.png" alt="" /></div>
            </el-tooltip>
            <div class="p">{{ item.creatorDTO.username }}</div>
          </div>
          <div class="inform">
            <p v-html="item.info"></p>
          </div>
        </div>
        <div class="down" v-show="categoryStatus===1">
          <el-tooltip class="box-item" effect="light" content="查看相关文件" placement="bottom">
            <div class="img" v-if="hasPermission('project:project:checkFile')" v-show="fileVisible" @click="addFile(item.id, item.status)">
              <img src="@/assets/images/file.png" alt="" />
            </div>
          </el-tooltip>
<!--          &lt;!&ndash;          查看评审结果明细&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="查看评审明细" placement="bottom">-->
<!--            <div class="img" v-if="hasPermission('project:projectcategory:checkResult')" v-show="recordVisble" @click="checkResult(item.id, item.status)"><img src="@/assets/images/result.png" alt="" /></div>-->
<!--          </el-tooltip>-->
          <el-tooltip class="box-item" effect="light" content="修改" placement="bottom">
            <div class="img" v-if="hasPermission('project:project:update')" v-show="updateVisible" @click="addOrUpdateHandle(item.id)">
              <img src="@/assets/images/issues/update.png" alt="" />
            </div>
          </el-tooltip>
          <el-tooltip class="box-item" effect="light" content="删除" placement="bottom">
            <div class="img" v-if="hasPermission('project:project:delete')" v-show="deleteVisible" @click="deleteHandle(item.id)">
              <img src="@/assets/images/issues/delete.png" alt="" />
            </div>
          </el-tooltip>
        </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData" :categoryId="dataForm.categoryId" :applicantId="dataForm.applicantId"></add-or-update>
      <File v-if="drawerFile" ref="file" :projectId="projectId" :projectStatus="projectStatus"></File>
      <Record v-if="drawerRecord" ref="record" :projectId="projectId" :projectStatus="projectStatus"></Record>
<!--      <Result v-if="drawerResult" ref="result" :categoryId="categoryId" :categoryStatus="categoryStatus"></Result>-->
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./project-add-or-update.vue";
import File from "@/views/project/file.vue"
import Record from "@/views/project/voterecord.vue"
import Result from "@/views/project/voteresult.vue"
import {ElMessage, ElMessageBox} from "element-plus";
import {useAppStore} from "@/store";
import baseService from "@/service/baseService";
export default defineComponent({
  props:["categoryId","categoryStatus"],
  components: {
    AddOrUpdate,
    File,
    Record,
    // Result
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
      // getDataListURL: "/project/project/page",
      getDataListIsPage: true,
      exportURL: "/project/project/export",
      deleteURL: "/project/project",
      deleteIsBatch: true,
      drawerPro:false,
      drawerFile:false,//查看文件抽屉
      drawerRecord:false,//查看评审明细抽屉
      // drawerResult:false,
      projectId:"",
      projectStatus:0,
      categoryId:"",
      categoryStatus:0,
      dataForm: {
        applicantId: "",
        categoryId: "",
        categoryStatus: 0,
        name: "",
        status: ""
      },
      projectIds:[],
      // recordVisble: false,
      addBoxVisible: false,
      deleteVisible: false,
      updateVisible: false,
      fileVisible: false
    });
    return { store,addOrUpdateHandle,...useView(state), ...toRefs(state) };
  },
  methods: {
    initPro(){
      console.log(this.dataForm.categoryId)
      this.getLoginUser()
      this.getData();
      this.drawerPro = true;
    },
    handleClose() {
      this.dataList.forEach((item,index) =>{
        this.projectIds[index]=item.id
      })
      console.log(this.projectIds)
        if(this.dataForm.categoryStatus===1) {
          baseService.post("/project/project/isExistFile",{projectIds:this.projectIds}).then(res=>{
            console.log(res)
            if(res.code!=0) return false
            if(!res.data) ElMessageBox.confirm("您还有项目未添加文件",{confirmButtonText:"稍后添加",cancelButtonText:"现在添加"}).then(()=>{
              this.drawerPro=false
            })
            else {
              ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
                .then(() => {
                  this.drawerPro = false;
                  // this.$parent!.isParHidden();
                })
                .catch(() => {
                  // catch error
                })
            }
          })
        }
        else {
          ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
            .then(() => {
              this.drawerPro = false;
              // this.$parent!.isParHidden();
            })
            .catch(() => {
              // catch error
            })

        }
    },
    getLoginUser () {
      this.dataForm.applicantId = this.store.state.user.id;
    },
    getData() {
      console.log(this.dataForm.categoryStatus)
      if (this.dataForm.categoryStatus === 1) {
        this.addBoxVisible = true;
        this.deleteVisible = true;
        this.updateVisible = true;
        this.fileVisible = true;
        // this.recordVisble = false;
      } else if (this.dataForm.categoryStatus === 2) {
        this.addBoxVisible = false;
        this.deleteVisible = false;
        this.updateVisible = false;
        this.fileVisible = false;
        // this.recordVisble = false;
      } else if (this.dataForm.categoryStatus === 3 || this.dataForm.categoryStatus === 4) {
        this.addBoxVisible = false;
        this.deleteVisible = false;
        this.updateVisible = false;
        this.fileVisible = false;
        // this.recordVisble = true;
      }
      console.log(this.addBoxVisible);
      console.log(this.dataForm)
      baseService
        .get("/project/project/page",{
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
        })
    },
    addFile(id: string, status: number) {
      this.drawerFile = true;
      this.projectId = "";
      this.projectId = id;
      this.projectStatus = status
      console.log(this.projectId)
      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        let that:any = this
        that.$refs.file.status = status;
        that.$refs.file.initFile();
        that.$refs.file.$forceUpdate()
      })
    },
    // /**
    //  * 跳转查看项目评审结果明细页面
    //  * @param id
    //  * @param status
    //  */
    // checkResult(id: string, status: number) {
    //
    //   this.drawerResult = true;
    //
    //   nextTick(()=>{
    //     // this.$refs["part"].dataForm.issuesId = id;
    //     // this.$refs.result.status = status;
    //     let that:any = this
    //     that.$refs.result.initResult();
    //     that.$refs.result.$forceUpdate()
    //   })
    // }
  },
  watch: {},
});
</script>
<style lang="less" scoped>
.drawer {
  background-color: #b3c9f3 !important;
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
      background-color: #d2d8f5;
    }

    .voteItem {
      //height: 34vh;
      //background-image: url(@/assets/images/issues/vote_item_bg1.png);
      //background-size: 100% 100%;
      margin-bottom: 30px;
      margin-right: 3.5%;
      //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 7.5%;
      //width: 31%;
      //background-color: #ffffff;
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
        .inform::-webkit-scrollbar {
          width:0 !important;
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


<!--<template>-->
<!--  <div class="mod-project__project">-->
<!--    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getData()">-->
<!--      <el-form-item>-->
<!--        <el-input v-model="state.dataForm.applicantId" placeholder="申请人" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-select v-model="state.dataForm.categoryId" placeholder="所属项目类别">-->
<!--          <el-option label="选择" value="0"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-input v-model="state.dataForm.name" placeholder="项目名称" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button @click="state.getData()">{{ $t("query") }}</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button v-if="state.hasPermission('project:project:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button v-if="state.hasPermission('project:project:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">-->
<!--      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>-->
<!--      <el-table-column prop="applicantId" label="申请人" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="categoryId" label="所属项目类别" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="name" label="项目名称" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column prop="info" label="项目简介" header-align="center" align="center"></el-table-column>-->
<!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">-->
<!--        <template v-slot="scope">-->
<!--          <el-button v-if="state.hasPermission('project:project:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>-->
<!--          <el-button v-if="state.hasPermission('project:project:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>-->
<!--    &lt;!&ndash; 弹窗, 新增 / 修改 &ndash;&gt;-->
<!--    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getData"></add-or-update>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import useView from "@/hooks/useView";-->
<!--import { nextTick, reactive, ref, toRefs, watch } from "vue";-->
<!--import AddOrUpdate from "./project-add-or-update.vue";-->

<!--const view = reactive({-->
<!--  getDataListURL: "/project/project/page",-->
<!--  getDataListIsPage: true,-->
<!--  exportURL: "/project/project/export",-->
<!--  deleteURL: "/project/project",-->
<!--  deleteIsBatch: true,-->
<!--  dataForm: {-->
<!--    applicantId: "",-->
<!--    categoryId: "",-->
<!--    name: "",-->
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

