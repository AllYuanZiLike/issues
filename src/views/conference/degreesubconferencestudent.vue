<template>
  <div class="mod-conference__degreesubconferencestudent">
   <el-drawer v-model="drawerStu" title="学生" size="70%" direction="ltr" :before-close="handleClose">
    <div class="top-box">
      <el-form :inline="true" :model="['Form']" @keyup.enter="getDataList()">
        <el-form-item v-show="resultButton">
          <el-select v-model="dataForm.status" @change="getDataList" placeholder="表决结果" clearable>
            <el-option :label="data.label" v-for="data in statusText" :key="data.value" :value="data.value">{{ data.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" style="background-color: orange;border:none;" @click="refresh()">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('conference:degreesubconferencestudent:save')" v-show="addBUtton" type="primary" @click="addStudent()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('conference:degreesubconferencestudent:delete')" v-show="deleteButton" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="student.name" label="学生姓名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="subConference.name" label="子会议" header-align="center" align="center"></el-table-column>
      <el-table-column prop="agree" label="同意" header-align="center" align="center" v-if="statusButton"></el-table-column>
      <el-table-column prop="disagree" label="不同意" header-align="center" align="center" v-if="statusButton"></el-table-column>
      <el-table-column prop="abandon" label="弃权" header-align="center" align="center" v-if="statusButton"></el-table-column>
      <el-table-column prop="resultText" label="表决结果" header-align="center" align="center" v-if="resultButton"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150" v-if="deleteButton">
        <template v-slot="scope">
          <el-button v-if="hasPermission('conference:degreesubconferencestudent:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->

    <el-dialog v-model="addUserVisible" title="新增学生" :close-on-click-modal="false" :close-on-press-escape="false" width="88%">
      <el-form :inline="true" :model="dataStuForm" @keyup.enter="getStuData()">
        <el-form-item>
          <el-select v-model="dataStuForm.sort" @change="getStuData" placeholder="学生类型" clearable prop="">
            <el-option :label="data.label" v-for="data in sortText" :key="data.value" :value="data.value">{{ data.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getStuData()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('conference:degreesubconferencestudent:stuimport')" type="info" style="background-color: #07ba00;border:none;" @click="stuImportHandle()">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info"  @click="isAll()" style="background-color: #ff6a00;border:none;">{{selectAll?"取消全选":"全选"}}</el-button>
<!--          <el-checkbox ref="checkAll" v-model="checked"  @change="checkedChange" :indeterminate="isIndeterminate"></el-checkbox>-->
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" ref="multipleTableRef" :row-key="tableData.id" :data="tableData" height="250" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%" >
        <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="no" label="学号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="学生姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="genderText" label="性别" header-align="center" align="center"></el-table-column>
        <el-table-column prop="edBackText" label="学历层次" header-align="center" align="center"></el-table-column>
        <el-table-column prop="majorName" label="专业/二级学科" header-align="center" align="center"></el-table-column>
        <el-table-column prop="grantCatorName" label="学位授予门类" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sortText" label="学生类型" header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination :current-page="stupage" :page-sizes="[10, 20, 50, 100]" :page-size="stulimit" :total="stutotal" layout="total, sizes, prev, pager, next, jumper" @size-change="stupageSizeChangeHandle" @current-change="stupageCurrentChangeHandle"> </el-pagination>
      <template v-slot:footer>
        <el-button @click="addUserVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
      </template>
    </el-dialog>
      <ExcelImport v-if="importVisible" ref="import" @refreshDataList="getDataList"></ExcelImport>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs   } from "vue";
import baseService from "@/service/baseService";
import Progre from "@/views/conference/tprogress.vue";
import ExcelImport from "@/views/conference/excel-import.vue"
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import { DatasetComponent, DataZoomComponent, GeoComponent, GridComponent, LegendComponent, PolarComponent, TitleComponent, ToolboxComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { ElMessageBox  } from "element-plus";
import { Table } from 'element-ui';
use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);

export default defineComponent({
  components: {
    // Progre,
    ExcelImport
  },
  setup() {
    const state = reactive({
      stupage: 1,
      stulimit: 10,
      stutotal: 0,
      getDataListURL: "/conference/degreesubconferencestudent/page",
      getDataListIsPage: true,
      exportURL: "/conference/degreesubconferencestudent/export",
      deleteURL: "/conference/degreesubconferencestudent",
      deleteIsBatch: true,
      addUserVisible: false,
      addBUtton: true,
      deleteButton: true,
      statusButton: false,
      resultButton: false,
      stuReVisible: true,
      importVisible: false,
      drawerStu:false,
      selectAll:false,
      checked:false,
      isIndeterminate:false,
      partSum: 0,
      sumVote: 0,
      noVote: 0,
      voted: 0,
      pro: 0,
      dataForm: {
        studentId: [],
        subConferenceId: "",
        subStatus: "",
        status: "",
        conferenceId: ""
      },
      dataStuForm: {
        id: "",
        no: "",
        name: "",
        sort: 1,
        gender: "",
        educationBackground: "",
        collegeId: "",
        clazzId: "",
        disciplineId: "",
        majorId: "",
        categoryId: "",
        grantCategoryId: ""
      },
      statusText: [
        { value: 0, label: "已通过" },
        { value: 1, label: "未通过" }
      ],
      sortText: [
        { value: 1, label: "普通" },
        { value: 2, label: "上会讨论" },
        { value: 3, label: "往届" },
        { value: 4, label: "双学位" },
        { value: 5, label: "成人学科" },
        { value: 6, label: "研究生" }
      ],
      tableData: [] as any,
      selectStuForm:[] as any
    });
    return { ...useView(state), ...toRefs(state) };
  },
  props:["conferenceId","subConferenceId"],
  methods: {
    stuImportHandle() {
      this.importVisible = true;
      console.log(this.dataForm.subConferenceId);
      this.$nextTick(() => {
        let that:any = this
        that.$refs.import.subConferenceId = this.dataForm.subConferenceId;
        that.$refs.import.init();

      });
    },
    // isAll(){
    //   console.log(this.selectAll)
    //   this.selectAll = !this.selectAll;
    //   console.log("全选状态");
    //   console.log(this.selectAll);
    //   if(this.selectAll){
    //     // this.checkSelectable=true
    //     this.tableData.forEach(row => {
    //       if(row) {
    //         this.$refs.multipleTableRef.toggleRowSelection(row,true)
    //       }
    //     })
    //   }else if(!this.selectAll){
    //     this.$refs.multipleTableRef.clearSelection()
    //   }
    //   // this.selectAll = !this.selectAll;
    // },
    //分页全选-选中框改变事件
    dataListSelectionChangeHandle (val) {
      // 数据去重
      this.selectStuForm = this.reduceSame(val);
      // 选中所有选择框时勾选全选按钮
      if (this.selectStuForm.length == this.total) {
        this.selectAll = true;
      }
      // 将row是对象数组数据转换为字符串
      this.selectStuForm = this.selectStuForm.map(function (val) {
        return val.id;
      }).toString();
      // 选中后的数据
      console.log(this.selectStuForm)
    },
    //分页全选-全选按钮change事件
    isAll () {
      console.log(this.selectAll)
      this.selectAll=!this.selectAll
      console.log(this.selectAll)
      let that = this;
      if(this.tableData!==[]) {
        if (this.selectAll) {
          // 全选选中时当前页所有数据选中
          this.tableData.forEach(row => {
            if (row) {
              this.$nextTick( ()=> {
                (that.$refs.multipleTableRef as any).toggleRowSelection(row,true)
              })
            }
          });
        } else {
          this.$nextTick(()=>{
            (that.$refs.multipleTableRef as any).clearSelection();
          })
        }
      }
    },

    //分页全选-全选时禁用选择框
    checkSelectable (row, index) {
      return !this.selectAll;
    },
    //数组对象去重
    reduceSame: function (arr) {
      let obj = {};
      return arr.reduce(function (prev, item) {
        obj[item.id] ? "" : (obj[item.id] = 1 && prev.push(item))
        return prev
          ;
      }, []);
    },
    initStu(){
      this.drawerStu = true;
      this.dataForm.conferenceId = this.conferenceId;
      this.dataForm.subConferenceId = this.subConferenceId;
      this.refresh();
    },
    refresh(){
      this.getDataList();
      this.getDataText();
      this.getDataListText();
    },
    handleClose() {
      ElMessageBox.confirm('确定要关闭吗？',{confirmButtonText:"确认",cancelButtonText:"取消"})
        .then(() => {
          this.drawerStu = false;
        })
    },
    getDataText() {
      if (this.dataForm.subStatus === '0') {
        this.addBUtton = true;
        this.deleteButton = true;
        this.resultButton = false;
        this.statusButton = false;
        // this.stuReVisible = false;
      } else if (this.dataForm.subStatus === '1') {
        // this.resultButton = true;
        this.addBUtton = false;
        this.deleteButton = false;
        this.statusButton = true;
        this.resultButton = false;
      } else if (this.dataForm.subStatus === '2') {
        this.addBUtton = false;
        this.deleteButton = false;
        this.statusButton = true;
        this.resultButton = true;
      }
    },
    getDataListText() {
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].status === 0) this.dataList[i].resultText = "通过";
        else if (this.dataList[i].status === 1) this.dataList[i].resultText = "未通过";
      }
    },
    getPartSum() {
      baseService.post("/conference/degreevoterecord/get", { conferenceId: this.dataForm.conferenceId, subConferenceId: this.dataForm.subConferenceId }).then((res) => {
        if (res.code !== 0) return false;
        this.pro = res.data.percent;
        this.sumVote = res.data.no + res.data.now;
        this.voted = res.data.now;
        this.noVote = res.data.no;
      });
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].voted = this.dataList[i].agree + this.dataList[i].disagree + this.dataList[i].abandon;
        if (this.partSum !== 0) this.dataList[i].pro = (this.dataList[i].voted / this.partSum) * 100;
        else this.dataList[i].pro = 0;
        console.log(this.dataList[i].pro);
      }
    },

    addStudent() {
      this.addUserVisible = true;
      this.getStuData();
    },
    getStuData() {
      console.log(this.dataForm.subConferenceId);
      console.log(this.getDataListIsPage ? this.stupage : null, this.getDataListIsPage ? this.stulimit : null);
      baseService
        .get("/conference/degreesubconferencestudent/getStudent", {
          order: this.order,
          orderField: this.orderField,
          page: this.getDataListIsPage ? this.stupage : null,
          limit: this.getDataListIsPage ? this.stulimit : null,
          subConferenceId: this.dataForm.subConferenceId,
          sort: JSON.stringify(this.dataStuForm.sort)
        })
        .then((res) => {
          if (res.code !== 0) return false;
          this.tableData = res.data.list;
          this.stutotal = res.data.total;
          this.getStuText();
          if(this.selectAll){
            this.$nextTick(() => {
              for (let i = 0; i < this.tableData.length; i++) {
                // if (this.tableData[i].isRerationItem.status == 1) {
                // this.$refs.multipleTableRef.toggleRowSelection(this.tableData[i])
                this.dataForm.studentId[i] = this.tableData[i].id
                // }
              }
            })
          }
        });
    },
    // 分页, 每页条数
    stupageSizeChangeHandle(val: number) {
      this.stupage = 1;
      this.stulimit = val;
      this.getStuData();
    },
    // 分页, 当前页
    stupageCurrentChangeHandle(val: number) {
      this.stupage = val;
      this.getStuData();
    },
    getStuText() {
      this.tableData = this.tableData.map((item, index) => {
        return { ...item, genderText: "", edBackText: "", resultText: "", sortText: "" };
      });
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].gender === 0) this.tableData[i].genderText = "女";
        else if (this.tableData[i].gender === 1) this.tableData[i].genderText = "男";
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].educationBackground === 0) this.tableData[i].edBackText = "本科";
        else if (this.tableData[i].educationBackground === 1) this.tableData[i].edBackText = "研究生";
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].type === 1) this.tableData[i].sortText = "普通";
        else if (this.tableData[i].type === 2) this.tableData[i].sortText = "上会讨论";
        else if (this.tableData[i].type === 3) this.tableData[i].sortText = "往届";
        else if (this.tableData[i].type === 4) this.tableData[i].sortText = "双学位";
        else if (this.tableData[i].type === 5) this.tableData[i].sortText = "成人学科";
        else if (this.tableData[i].type === 6) this.tableData[i].sortText = "研究生a";
      }
    },
    // 表单提交
    dataFormSubmitHandle() {
      for (let i = 0; i < this.dataListSelections.length; i++) {
        this.dataForm.studentId[i] = this.dataListSelections[i].id;
      }
      console.log(this.dataForm);
      baseService.post("/conference/degreesubconferencestudent", this.dataForm).then((res) => {
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        } else {
          this.dataForm.studentId = [];
          this.getDataList();
          this['$message']({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.addUserVisible = false;
            }
          });
        }
      });
    }
  },
  watch: {
    dataList:{
      immediate:true,
      handler(newValue,oldValue){
        if(newValue) this.getDataListText()
      }
    },
  },
  beforeUpdate() {
    this.getDataListText();
  }
});
</script>
<style lang="less">
.top-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
