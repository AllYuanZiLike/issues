<template>
  <div class="mod-project__prjproject">
    <el-dialog v-model="visible" title="投票" width="50%" center>
      <el-card class="box-card">
        <div v-for="(item, index) in projectForm" :key="item.id" class="item">
          <div class="item_name"><b>项目名称：</b>{{ item.name }}&emsp; <el-button class="item_file" type="primary" @click="checkFileList(index)">查看相关文件</el-button></div>
          请选择：
          <div class="item_choose">
            <el-button v-for="(sitem, sindex) in item.btn" :key="sitem.value" :type="sitem.value === projectForm[index].chooseStatus ? 'success' : 'info'" size="mini" @click="choBtn(index, sindex)">{{ sitem.label }}</el-button>
          </div>
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
      <el-card class="box-card" v-show="file.length !== 0">
        <div v-for="(item, index) in file" :key="index">
          文件名：{{ item.name }}
          <el-button size="mini" plain type="info" @click="checkFile(index)">查看文件</el-button>
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
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./project-add-or-update.vue";
import {useAppStore} from "@/store/index"
import baseService from "@/service/baseService";
import file from "@/views/project/file.vue";
export default defineComponent({
  props: ["maxpoll", "minpoll", "categoryId", "userId"],
  setup() {
    const store = useAppStore()
    const state = reactive({
      sumPoll: 0,
      visible: false,
      projectForm: [
        {
          id:"",
          name:"",
          chooseStatus:0,
          voterId:"",
          fileDTO:[],
          btn:[
            {value:0,label:""}
          ]
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
    choBtn(index: number, sindex: number) {
      this.projectForm[index].chooseStatus = sindex;
    },
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
      //   if (res.code !== 0) return false;
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
          if (res.code !== 0) return false;
          this.projectForm = res.data;
          this.projectForm = this.projectForm.map((item, index) => {
            return {
              ...item,
              chooseStatus: 0,
              voterId:"",
              btn: [
                { value: 0, label: "同意" },
                { value: 1, label: "不同意" },
                { value: 2, label: "弃权" }
              ]
            };
          });
          for (let i=0;i<this.projectForm.length;i++){
            this.projectForm[i].voterId=this.store.state.user.id;
          }
        });
    },
    checkFileList(index: number) {
      console.log(this.projectForm);
      this.file = this.projectForm[index].fileDTO;
      this.dialogFileVisible = true;
    },
    checkFile(index: number) {
      console.log(this.file);
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
        this.submitForm();
      });

      // this.visible = false;
    },
    submitForm() {
      console.log(this.categoryId)
      console.log(this.projectForm)
      console.log(this.userId)
      baseService
        .post("/project/voterecord/save", {
          categoryId: this.categoryId,
          poll: this.projectForm,
          participantId: this.userId
        })
        .then((res) => {
          console.log(res);
          if (res.code !== 0) {
            for (let i = 0; i < this.projectForm.length; i++) {
              this.projectForm[i].chooseStatus = 0;
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
