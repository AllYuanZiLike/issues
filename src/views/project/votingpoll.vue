<template>
  <div class="mod-project__prjproject">
    <el-dialog v-model="visible" title="投票" width="50%" center>
      <el-card class="box-card">
        <div class="num">最小票数：{{ minpoll }}，最大票数：{{ maxpoll }}</div>
        <div v-for="(item, index) in projectForm" :key="item.id" class="item">
          <div class="item_name"><b>项目名称：</b>{{ item.name }}&emsp;<el-button class="item_file" type="primary" @click="checkFileList(index)">查看相关文件</el-button></div>
          请选择票数：
          <div class="item_poll">{{ item.poll }}票</div>
          <el-slider v-model="item.poll" :min="minpoll" :max="maxpoll" :step="1" show-stops />
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
      <el-empty description="该项目暂无已上传文件" image="src/assets/images/empty_data.png" v-if="file.length === 0" />
      <el-card class="box-card" v-show="file.length != 0">
        <div v-for="(item, index) in file" :key="index">
          文件名：{{ item.name }}
          <el-button size="mini" plain type="info" @click="checkFile(index)">查看文件</el-button>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog :title="`${fileitem.name}文件预览`" v-model="FileVisible" width="80%" height="600" center>
      <div class="fileitem">
        <iframe class="child" :src="fileitem.url" :style="{ height: 500 }" />
<!--        <pdf v-for="item in numPages" :key="item" :src="fileitem.url" :page="item" ref="pdf"></pdf>-->
<!--http://view.officeapps.live.com/op/view.aspx?src=        `http://view.xdocin.com/view?src=` + -->
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./project-add-or-update.vue";
import baseService from "@/service/baseService";
export default defineComponent({
  props: ["maxpoll", "minpoll", "categoryId", "userId"],
  setup() {
    const state = reactive({
      sumPoll: 0,
      visible: false,
      numPages:0,
      projectForm: [
        {
          id:"",
          name:"",
          poll:0,
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
    return { ...useView(state), ...toRefs(state) };
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
      // baseService.get("/project/project/page", { categoryId: this.categoryId }).then((res) => {
      //   console.log(res);
      //   if (res.code != 0) return false;
      //   this.projectForm = res.data.list;
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
          this.projectForm.forEach(item=>{
            item.poll=0
          })
          this.projectForm = this.projectForm.map((item, index) => {
            return { ...item, poll: this.minpoll, voterId:""};
          });
          for (let i=0;i<this.projectForm.length;i++){
            this.projectForm[i].voterId=this.userId;
          }
        });
    },
    checkFileList(index: number) {
      console.log(this.projectForm);
      this.file = this.projectForm[index].fileDTO;
      this.dialogFileVisible = true;
    },
    checkFile(index: number) {
      this.fileitem = this.file[index];
      console.log(this.file[index]);
      this.FileVisible = true;
    },
    dataFormSubmit() {

      ElMessageBox.confirm("确定投票吗？（投票成功后无法再次修改）", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        for (let i = 0; i < this.projectForm.length; i++) {
          this.sumPoll += this.projectForm[i].poll;
        }
        console.log(this.sumPoll);
        if (this.sumPoll < this.minpoll || this.sumPoll > this.maxpoll) {
          this['$message']({
            message: this.$t("所投票数不符合可投票数范围，请重新投票"),
            type: "error",
            duration: 1500
          });
          for (let i = 0; i < this.projectForm.length; i++) {
            this.projectForm[i].poll = this.minpoll;
          }
          this.sumPoll = 0;
        } else {
          console.log(this.projectForm, this.userId, this.categoryId);
          baseService
            .post("/project/voterecord/save", {
              categoryId: this.categoryId,
              poll: this.projectForm,
              participantId: this.userId
            })
            .then((res) => {
              console.log(res);
              if (res.code != 0) {
                for (let i = 0; i < this.projectForm.length; i++) {
                  this.projectForm[i].poll = this.minpoll;
                }
                this.sumPoll = 0;
                return false;
              }
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
          // this.visible = false;
        }
      });
    }
  },
  watch: {}
});
</script>
<style lang="less" scoped>
.box-card {
  width: 480px;
  margin: auto;
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
    .item_poll {
      font-size: 5vh;
      font-weight: 550;
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
