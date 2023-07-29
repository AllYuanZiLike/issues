<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <!--      <el-form-item label="学号" prop="no">-->
      <!--        <el-input v-model="dataForm.no" placeholder="学号"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="学生姓名" prop="name">-->
      <!--        <el-input v-model="dataForm.name" placeholder="学生姓名"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="性别" prop="gender">-->
      <!--        <el-input v-model="dataForm.gender" placeholder="性别"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="学历层次" prop="educationBackground">-->
      <!--        <el-input v-model="dataForm.educationBackground" placeholder="学历层次"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="学院" prop="collegeId">-->
      <!--        <el-input v-model="dataForm.collegeId" placeholder="学院"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="班级" prop="clazzId">-->
      <!--        <el-input v-model="dataForm.clazzId" placeholder="班级"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="专业类/一级学科" prop="disciplineId">-->
      <!--        <el-input v-model="dataForm.disciplineId" placeholder="专业类/一级学科"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="专业/二级学科" prop="majorId">-->
      <!--        <el-input v-model="dataForm.majorId" placeholder="专业/二级学科"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="学科门类" prop="categoryId">-->
      <!--        <el-input v-model="dataForm.categoryId" placeholder="学科门类"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="学位授予门类" prop="grantCategoryId">-->
      <!--        <el-input v-model="dataForm.grantCategoryId" placeholder="学位授予门类"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="排序" prop="sort">-->
      <!--        <el-input v-model="dataForm.sort" placeholder="排序"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="所属部门" prop="deptId">
        <ren-dept-tree :placeholder="$t('dept.title')" v-model:deptName="dataForm.deptName" @userForm="userForm"></ren-dept-tree>
      </el-form-item>
      <el-form-item label="用户" prop="name">
        <el-input placeholder="请选择" v-model="dataForm.name" @click="addUserVisible"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="addUserVisible" title="用户" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table v-loading="['dataListLoading']" :data="dataUserForm" border @selection-change="['dataListSelectionChangeHandle']" @sort-change="['dataListSortChangeHandle']" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="username" :label="$t('user.username')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" :label="$t('user.status')" sortable="custom" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t("user.status0") }}</el-tag>
          <el-tag v-else size="small" type="success">{{ $t("user.status1") }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <template v-slot:footer>
      <el-button @click="addUserVisible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
    <el-pagination :current-page="['page']" :page-sizes="[10, 20, 50, 100]" :page-size="['limit']" :total="['total']" layout="total, sizes, prev, pager, next, jumper" @size-change="['pageSizeChangeHandle']" @current-change="['pageCurrentChangeHandle']"> </el-pagination>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    return reactive({
      getDataListURL: "/sys/user/page",
      addUserVisible: false,
      visible: false,
      // dataForm: {
      //   id: "",
      //   no: "",
      //   name: "",
      //   gender: "",
      //   educationBackground: "",
      //   collegeId: "",
      //   clazzId: "",
      //   disciplineId: "",
      //   majorId: "",
      //   categoryId: "",
      //   grantCategoryId: "",
      //   sort: "",
      //   creator: "",
      //   createDate: "",
      //   updater: "",
      //   updateDate: "",
      // }
      dataForm: {
        id: "",
        userId: [],
        username: "",
        issuesId: "",
        deptId: "",
        deptName: "",
        name: "学生"
      },
      dataUserForm: []
    });
  },
  computed: {
    dataRule() {
      return {};
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        let that:any = this
        that.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    userForm(val) {
      this.dataUserForm = val;
      console.log(this.dataUserForm);
    },
    // 获取信息
    getInfo() {
      baseService.get("/conference/stdstudent/" + this.dataForm.id).then((res) => {
        if (res.code != 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      let that:any = this
      that.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/conference/stdstudent", this.dataForm).then((res) => {
          if (res.code != 0) {
            return this['$message'].error(res.msg);
          }
          this['$message']({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>
