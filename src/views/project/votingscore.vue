<template>
  <div class="mod-project__voteresult">
    <el-dialog v-model="visible" title="投票" width="60%" height="550">
      <el-card class="box-card">
        <div class="num">最小分数：{{ minscore }}，最大分数：{{ maxscore }}</div>
        <div v-for="(item, index) in projectForm" :key="item.id" class="item">
          <div class="item_name">
            <b>项目名称：</b>{{ item.name }}&emsp;
            <el-button class="item_file" type="primary" @click="checkFileList(index)">查看相关文件</el-button>
          </div>

          请选择分数：
          <div class="item_grade">{{ item.grade }}分</div>
          <el-slider class="item_slider" v-model="item.grade" :min="minscore" :max="maxscore" show-stops />
        </div>
      </el-card>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="文件预览" v-model="dialogFileVisible" width="60%" top="2%">
      <el-empty description="该项目暂无已上传文件" image="src/assets/images/empty_data.png" v-if="file.length === 0" />
      <el-card class="box-card" v-show="file.length != 0">
        <div v-for="(item, index) in file" :key="index">
          文件名：{{ item.name }}
          <el-button size="mini" plain type="info" @click="checkFile(index)" style="margin-left: 2%;">查看文件</el-button>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog :title="`${fileitem.name}文件预览`" v-model="FileVisible" width="80%" height="600" center>
      <div class="fileitem">
        <iframe class="child" :src="fileitem.url" :style="{ height: 500 }" />
<!--http://view.officeapps.live.com/op/view.aspx?src=        http://view.xdocin.com/view?src=-->
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./project-add-or-update.vue";
import baseService from "@/service/baseService";
import { ElMessageBox } from "element-plus";
import {useAppStore} from "@/store";
export default defineComponent({
  props: ["maxscore", "minscore", "categoryId", "userId"],
  setup() {
    const store = useAppStore();
    const state = reactive({
      visible: false,
      dataForm: {
        applicantId: "",
        categoryId: "",
        categoryStatus: "",
        name: "",
        status: ""
      },
      projectForm: [
        {
          id:"",
          name:"",
          grade:0,
          voterId:"",
          fileDTO:[]
        }
      ],
      dialogFileVisible: false,
      FileVisible: false,
      file: [
        {
          name:"",
          url:""
        }
      ],
      fileitem: {
        name:"",
        url:""
      }
    });
    return { store,...useView(state), ...toRefs(state) };
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.getProject();
        console.log(this.projectForm);
      });
    },
    getProject() {
      // console.log(this.store.state.user);
      // this.dataForm.applicantId = this.store.state.user.id;
      this.dataForm.categoryId=this.categoryId
      console.log(this.dataForm)
      // baseService.get("/project/project/page", {
      //   order: this.order,
      //   orderField: this.orderField,
      //   page: this.getDataListIsPage ? this.page : null,
      //   limit: this.getDataListIsPage ? this.limit : null,
      //   ...this.dataForm
      // }).then((res) => {
      //   console.log(res);
      //   if (res.code != 0) return false;
      //   this.projectForm = res.data.list;

      // });
      /**
       * 获取项目列表
       */
      baseService
        .get("/project/category/showProject", {
          id: this.dataForm.categoryId
        })
        .then((res) => {
          console.log(res)
          if (res.code != 0) return false;
          this.projectForm = res.data;
          this.projectForm = this.projectForm.map((item, index) => {
            return { ...item, grade: this.minscore,voterId:""};
          });
          for (let i=0;i<this.projectForm.length;i++){
            this.projectForm[i].voterId=this.userId;
          }
        });
    },
    checkFileList(index: number) {
      this.file = this.projectForm[index].fileDTO ;
      this.dialogFileVisible = true;
    },
    checkFile(index: number) {
      this.fileitem = this.file[index];
      this.FileVisible = true;
    },
    dataFormSubmit() {
      ElMessageBox.confirm("确定投票吗？（投票成功后无法再次修改）", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(this.projectForm, this.userId);
        baseService.post("/project/voterecord/save", { categoryId: this.categoryId, poll: this.projectForm, participantId: this.userId }).then((res) => {
          console.log(res);
          if (res.code != 0) return false;
          this['$message']({
            message: this.$t("投票成功"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              // this.$router.push({
              //   path: "/project/vote"
              // });
              this.$emit("changeProjectVisible")
            }
          });
        });
      });
    }
  },
  watch: {}
});
</script>
<style lang="less" scoped>
.mod-project__voteresult {
  display: flex;
  align-items: center;
  .box-card {
    margin: auto;
    width: 680px;
    display: flex;
    justify-content: center;
    padding: 0;
    /deep/.el-card__body {
      width: 80%;

      .num {
        font-size: 4vh;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .item {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10%;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.04);
        .item_name {
          margin-bottom: 5%;
        }
        .item_grade {
          font-size: 5vh;
          font-weight: 550;
        }
      }
    }
  }
  .fileitem {
    width: 90%;
    margin: auto;
    .child {
      width: 100%;
      height: 600px;
      border: 0;
    }
  }
}
</style>
