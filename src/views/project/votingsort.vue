<template>
  <div class="mod-project__prjproject">
    <el-dialog v-model="visible" title="投票" width="50%" center>
      <el-card class="box-card">
        <div v-for="(item, index) in projectForm" :key="item.id" class="item">
          <div class="item_name"><b>项目名称：</b>{{ item.name }}&emsp; <el-button class="item_file" type="primary" @click="checkFileList(index)">查看文件</el-button></div>
          请选择名次：
          <el-select style="margin-top: 5%" v-model="item.sortStatus" placeholder="请选择名次" size="small">
            <el-option v-for="item in sortArr" :key="item.value" :label="item.value" :value="item.value" />
          </el-select>
        </div>
      </el-card>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="文件预览" v-model="dialogFileVisible" width="40%" top="2%">
<!--      v-if="file.length === 0" v-show="file.length != 0"-->
<!--      <el-empty description="该项目暂无已上传文件" image="src/assets/images/empty_data.png"/>-->
      <el-card class="box-card" >
        <div v-for="(item, index) in file" :key="index">
          文件名：{{ item.name }}
          <el-button size="mini" plain type="info" @click="checkFile(index)">查看文件</el-button>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog :title="`${fileitem.name}文件预览`" v-model="FileVisible" width="80%" height="600" center>
      <div class="fileitem">
        <iframe class="child" :src="fileitem.url" :style="{ height: 500 }" />
<!--        http://view.xdocin.com/view?src=-->
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
export default defineComponent({
  props: ["maxpoll", "minpoll", "categoryId", "userId"],
  setup() {
    const state = reactive({
      sumPoll: 0,
      visible: false,
      flag: true,
      projectForm: [
        {
          sortStatus:0,
          id:"",
          name:"",
          voterId:"",
          fileDTOS:[]
        }
      ],
      sortArr: [{ value: 1 }],
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
        url:"",
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.getProject();

        // this.confirmSortArr();
      });
    },
    getProject() {
      // baseService.get("/project/project/page", { categoryId: this.categoryId }).then((res) => {
      //   console.log(res);
      //   if (res.code != 0) return false;
      //   this.projectForm = res.data.list;
      //
      // });
      /**
       * 获取项目列表
       */
      baseService
        .get("/project/category/showProject", {
          id: this.categoryId
        })
        .then((res) => {
          console.log(res)
          if (res.code != 0) return false;
          this.projectForm = res.data;
          this.projectForm = this.projectForm.map((item, index) => {
            return { ...item,voterId:"" };
          });
          for (let i=0;i<this.projectForm.length;i++){
            this.projectForm[i].voterId=this.userId;
          }
          this.confirmSortArr();
        });
    },
    checkFileList(index: number) {
      console.log(this.projectForm);
      this.file = this.projectForm[index].fileDTOS;
      this.dialogFileVisible = true;
    },
    checkFile(index: number) {
      console.log(this.file);
      this.fileitem = this.file[index];
      console.log(this.file[index]);
      this.FileVisible = true;
    },
    confirmSortArr() {
      this.sortArr.splice(0, this.sortArr.length);
      for (let i = 0; i < this.projectForm.length; i++) {
        // let sNum = 0;
        // sNum = i + 1;
        this.sortArr.push({ value: i + 1 });
      }
    },
    dataFormSubmit() {
      console.log(this.projectForm);
      const sortSta = [];
      for (let i = 0; i < this.projectForm.length; i++) {
        sortSta[i] = this.projectForm[i].sortStatus;
      }
      const result = Array.from(new Set(sortSta));
      console.log(result);
      if (sortSta.length === result.length) {
        ElMessageBox.confirm("确定投票吗？（投票成功后无法再次修改）", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log(this.projectForm);
          baseService
            .post("/project/voterecord/save", {
              categoryId: this.categoryId,
              poll: this.projectForm,
              participantId: this.userId
            })
            .then((res) => {
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
          console.log("投票成功");
        });
      } else {
        this['$message']({
          message: "所投名次不能重复，请重新投票",
          type: "error",
          duration: 1500
        });
      }
    }
  },
  watch: {}
});
</script>
<style lang="less" scoped>
.box-card {
  width: 480px;
  margin: auto;

  .item {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10%;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.04);
    .item_name {
      margin-bottom: 5%;
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
</style>
