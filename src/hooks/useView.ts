import app from "@/constants/app";
import { EMitt, EThemeSetting } from "@/constants/enum";
import { IObject, IViewHooks, IViewHooksOptions } from "@/types/interface";
import { registerDynamicToRouterAndNext } from "@/router";
import baseService from "@/service/baseService";
import { getToken } from "@/utils/cache";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { checkPermission, getDictLabel } from "@/utils/utils";
import qs from "qs";
import {nextTick, onActivated, onMounted} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";

/**
 * 通用视图业务逻辑（列表/增删改查基本业务）
 * @param props 自定义通用业务state
 * @returns 返回响应式自定义state和通用方法
 */
const useView = (props: IViewHooksOptions | IObject): IViewHooks => {
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const store = useAppStore();
  const defaultOptions: IViewHooksOptions = {
    createdIsNeed: true,
    activatedIsNeed: false,
    getDataListURL: "",
    getDataListIsPage: false,
    deleteURL: "",
    deleteIsBatch: false,
    deleteIsBatchKey: "id",
    exportURL: "",
    dataForm: {},
    dataList: [],
    order: "",
    orderField: "",
    page: 1,
    limit: 10,
    total: 0,
    dataListLoading: false,
    dataListSelections: [],
    addOrUpdateVisible: false,
    addOrUpdate: {},
    elTable: {}
  };
  const mergeDefaultStateToPageState = (options: IObject, props: IObject): IViewHooksOptions => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key];
      }
    }
    return props;
  };
  const state = mergeDefaultStateToPageState(defaultOptions, props);
  onMounted(() => {
    if (state.createdIsNeed && !state.activatedIsNeed) {
      viewFns.query();
    }
  });
  onActivated(() => {
    if (store.state.closedTabs.includes(store.state.activeTabName)) {
      //如果当前打开的tab页面是之前已经关闭过的会存在keep-alive缓存
      //这里采用临时刷新页面解决方案
      //待vue官方开放缓存策略后再行实现 https://github.com/vuejs/vue-next/pull/4339   https://github.com/vuejs/rfcs/pull/284

      const closedTabs = store.state.closedTabs;
      store.updateState({
        closedTabs: closedTabs.filter((x: string) => x != store.state.activeTabName)
      });
      emits.emit(EMitt.OnReloadTabPage);
    }

    if (state.activatedIsNeed) {
      viewFns.query();
    }
  });

  //
  const rejectFns = {
    hasPermission(key: string) {
      console.log(key,checkPermission(store.state.permissions as string[], key))
      return checkPermission(store.state.permissions as string[], key);
    },
    getDictLabel(dictType: string, dictValue: number) {
      return getDictLabel(store.state.dicts, dictType, dictValue);
    }
  };

  //
  const viewFns = {
    // 获取数据列表
    query() {
      if (!state.getDataListURL) {
        return;
      }
      state.dataListLoading = true;
      console.log(state.dataForm)
      baseService
        .get(state.getDataListURL, {
          order: state.order,
          orderField: state.orderField,
          page: state.getDataListIsPage ? state.page : null,
          limit: state.getDataListIsPage ? state.limit : null,
          ...state.dataForm
        })
        .then((res) => {
          console.log(res)
          state.dataListLoading = false;
          state.dataList = state.getDataListIsPage ? res.data.list : res.data;
          state.total = state.getDataListIsPage ? res.data.total : 0;
        })
        .catch(() => {
          state.dataListLoading = false;
        });
    },
    // 多选
    dataListSelectionChangeHandle(val: IObject[]) {
      state.dataListSelections = val;
    },
    // 排序
    dataListSortChangeHandle(data: IObject) {
      if (!data.order || !data.prop) {
        state.order = "";
        state.orderField = "";
        return false;
      }
      state.order = data.order.replace(/ending$/, "");
      state.orderField = data.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
      viewFns.query();
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val: number) {
      state.page = 1;
      state.limit = val;
      viewFns.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val: number) {
      state.page = val;
      viewFns.query();
    },
    //搜索
    getDataList() {
      state.page = 1;
      viewFns.query();
    },
    // 新增 / 修改
    addHandle(row: IObject) {
      state.addOrUpdateVisible = true;
      nextTick(() => {
        state.addOrUpdate?.init(row);
      })
    },
    addOrUpdateHandle(id?: string) {
      state.addOrUpdateVisible = true;
      nextTick(() => {
        if (state.addOrUpdate && !state.addOrUpdate.visible) {
          // fixEleButtonFocus();
          state.addOrUpdate.dataForm.id = id || "";
          state.addOrUpdate.init();
        }
      });
    },
    // 删除
    deleteHandle(id?: string): Promise<any> {
      return new Promise((resolve, reject) => {
        if (
          state.deleteIsBatch &&
          !id &&
          state.dataListSelections &&
          state.dataListSelections.length <= 0
        ) {
          ElMessage.warning({
            message: t("prompt.deleteBatch"),
            duration: 500
          });
          return;
        }
        ElMessageBox.confirm(t("prompt.info", { handle: t("delete") }), t("prompt.title"), {
          confirmButtonText: t("confirm"),
          cancelButtonText: t("cancel"),
          type: "warning"
        })
          .then(() => {
            baseService
              .delete(
                `${state.deleteURL}${state.deleteIsBatch ? "" : "/" + id}`,
                state.deleteIsBatch
                  ? id
                    ? [id]
                    : state.dataListSelections
                    ? state.dataListSelections.map(
                        (item: IObject) => state.deleteIsBatchKey && item[state.deleteIsBatchKey]
                      )
                    : {}
                  : {}
              )
              .then((res) => {
                ElMessage.success({
                  message: t("prompt.success"),
                  duration: 500,
                  onClose: () => {
                    viewFns.query();
                    resolve(true);
                  }
                });
              });
          })
          .catch(() => {
            //
          });
      });
    },
    // 导出
    exportHandle(id?:string) {
      window.location.href = `${app.api}${state.exportURL}?${qs.stringify({
        ...state.dataForm,
        access_token: getToken()
      })}`;
      // baseService.download(state.exportURL, { ...state.dataForm, token: getToken() });
    },
    //关闭当前窗口
    closeCurrentTab() {
      if (getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage)) {
        emits.emit(EMitt.OnCloseCurrTab);
      } else {
        router.replace("/home");
      }
    },
    // 处理流程路由
    handleFlowRoute(data: IObject) {
      const routeParams = {
        path: `/flow-form/${data.processDefinitionKey}/form`,
        query: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          businessKey: data.businessKey,
          showType: "taskHandle",
          _mt: `${route.meta.title} - ${data.processDefinitionName}`
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    },
    // 查看流程详情
    flowDetailRoute(data: IObject) {
      const routeParams = {
        path: `/flow-form/${data.processDefinitionKey}/form`,
        query: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          businessKey: data.businessKey,
          showType: "detail",
          _mt: `${route.meta.title} - ${data.processDefinitionName}`
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    }
  };

  //
  return {
    ...viewFns,
    ...rejectFns
  };
};

export default useView;
