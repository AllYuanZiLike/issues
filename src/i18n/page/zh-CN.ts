import { IObject } from "@/types/interface";

const t: IObject = {};

t.loading = "加载中...";

t.add = "新增";
t.delete = "删除";
t.deleteBatch = "删除";
t.update = "修改";
t.query = "查询";
t.export = "导出";
t.handle = "操作";
t.confirm = "确定";
t.cancel = "取消";
t.clear = "清除";
t.close = "关闭";
t.logout = "退出";
t.manage = "办理";
t.createDate = "创建时间";
t.updateDate = "更新时间";
t.keyword = "关键字：";
t.choose = "请选择";
t.fileName = "文件名";
t.design = "在线设计";
t.preview = "预览";

t.prompt = {};
t.prompt.title = "提示";
t.prompt.info = "确定进行[{handle}]操作?";
t.prompt.success = "操作成功";
t.prompt.failed = "操作失败";
t.prompt.deleteBatch = "请选择操作项";

t.validate = {};
t.validate.required = "必填项不能为空";
t.validate.format = "{attr}格式错误";

t.upload = {};
t.upload.text = "将文件拖到此处，或<em>点击上传</em>";
t.upload.tip = "只支持{format}格式文件！";
t.upload.button = "点击上传";

t.datePicker = {};
t.datePicker.range = "至";
t.datePicker.start = "开始日期";
t.datePicker.end = "结束日期";

t.fullscreen = {};
t.fullscreen.prompt = "您的浏览器不支持此操作";

t.updatePassword = {};
t.updatePassword.title = "修改密码";
t.updatePassword.username = "账号";
t.updatePassword.password = "原密码";
t.updatePassword.newPassword = "新密码";
t.updatePassword.confirmPassword = "确认密码";
t.updatePassword.validate = {};
t.updatePassword.validate.confirmPassword = "确认密码与新密码输入不一致";

t.contentTabs = {};
t.contentTabs.closeCurrent = "关闭当前标签页";
t.contentTabs.closeOther = "关闭其它标签页";
t.contentTabs.closeAll = "关闭全部标签页";

/* 页面 */
t.notFound = {};
t.notFound.desc = "抱歉！您访问的页面<em>失联</em>啦...";
t.notFound.back = "上一页";
t.notFound.home = "首页";

t.login = {};
t.login.title = "登录";
t.login.username = "用户名";
t.login.password = "密码";
t.login.captcha = "验证码";
t.login.demo = "在线演示";
t.login.copyright = "人人开源";

t.home = {};
t.home.desc = {};
t.home.desc.title = "项目介绍";
t.home.desc.list = [
  "人人微服务平台，是基于Spring Cloud打造的微服务平台，为企业提供一站式微服务解决方案",
  "基于最新的Spring Cloud Alibaba、Spring Cloud Gateway、Spring Boot、SpringSecurity OAuth2.0、Flowable、Sentinel、Skywalking、Seata、Nacos、Mybatis、Vue3、Element-Plus、TypeScript、Vite2开发",
  "代码风格优雅简洁、通俗易懂，且符合《阿里巴巴Java开发手册》规范要求，可作为企业代码规范",
  "优秀的菜单功能权限，前端可灵活控制页面及按钮的展示，后端可对未授权的请求进行拦截",
  "优秀的数据权限管理，只需增加相应注解，无需其他任何代码，即可实现数据过滤，达到数据权限目的",
  "灵活的角色权限管理，新增角色时，角色权限只能是创建者权限的子集，可有效防止权限越权",
  "灵活的日志管理，可查看登录日志、操作日志、异常日志，方便审计及BUG定位",
  "灵活的国际化配置，目前已支持简体中文、繁体中文、English，如需增加新语言，只需增加新语言[i18n]文件即可",
  "灵活的前端动态路由，新增页面无需修改路由文件，也可在页面动态新增tab标签"
].join("\n");

/* 模块 */
t.model = {};
t.model.name = "名称";
t.model.key = "标识";
t.model.version = "版本";
t.model.createTime = "创建时间";
t.model.lastUpdateTime = "更新时间";
t.model.design = "在线设计";
t.model.deploy = "部署";
t.model.description = "描述";

t.process = {};
t.process.name = "名称";
t.process.key = "标识";
t.process.deployFile = "部署流程文件";
t.process.id = "流程ID";
t.process.deploymentId = "部署ID";
t.process.version = "版本";
t.process.resourceName = "XML";
t.process.diagramResourceName = "图片";
t.process.deploymentTime = "部署时间";
t.process.active = "激活";
t.process.suspend = "挂起";
t.process.convertToModel = "转换为模型";
t.process.bizRouteSet = "配置业务路由";
t.process.bizRoute = "业务路由";

t.running = {};
t.running.id = "实例ID";
t.running.definitionKey = "定义Key";
t.running.processDefinitionId = "定义ID";
t.running.processDefinitionName = "流程名称";
t.running.activityId = "当前环节";
t.running.suspended = "是否挂起";
t.running.suspended0 = "否";
t.running.suspended1 = "是";

t.news = {};
t.news.title = "标题";
t.news.pubDate = "发布时间";
t.news.createDate = "创建时间";
t.news.content = "内容";

t.schedule = {};
t.schedule.beanName = "bean名称";
t.schedule.beanNameTips = "spring bean名称, 如: testTask";
t.schedule.pauseBatch = "暂停";
t.schedule.resumeBatch = "恢复";
t.schedule.runBatch = "执行";
t.schedule.log = "日志列表";
t.schedule.params = "参数";
t.schedule.cronExpression = "cron表达式";
t.schedule.cronExpressionTips = "如: 0 0 12 * * ?";
t.schedule.remark = "备注";
t.schedule.status = "状态";
t.schedule.status0 = "暂停";
t.schedule.status1 = "正常";
t.schedule.statusLog0 = "失败";
t.schedule.statusLog1 = "成功";
t.schedule.pause = "暂停";
t.schedule.resume = "恢复";
t.schedule.run = "执行";
t.schedule.jobId = "任务ID";
t.schedule.times = "耗时(单位: 毫秒)";
t.schedule.createDate = "执行时间";

t.mail = {};
t.mail.name = "名称";
t.mail.config = "邮件配置";
t.mail.subject = "主题";
t.mail.createDate = "创建时间";
t.mail.send = "发送邮件";
t.mail.content = "内容";
t.mail.smtp = "SMTP";
t.mail.port = "端口号";
t.mail.username = "邮箱账号";
t.mail.password = "邮箱密码";
t.mail.mailTo = "收件人";
t.mail.mailCc = "抄送";
t.mail.params = "模板参数";
t.mail.paramsTips = '如：{"code": "123456"}';
t.mail.templateId = "模版ID";
t.mail.status = "状态";
t.mail.status0 = "发送失败";
t.mail.status1 = "发送成功";
t.mail.mailFrom = "发送者";
t.mail.createDate = "发送时间";

t.sms = {};
t.sms.mobile = "手机号";
t.sms.status = "状态";
t.sms.status0 = "发送失败";
t.sms.status1 = "发送成功";
t.sms.config = "短信配置";
t.sms.send = "发送短信";
t.sms.platform = "平台类型";
t.sms.platform1 = "阿里云";
t.sms.platform2 = "腾讯云";
t.sms.params = "参数";
t.sms.paramsTips = '如：{"code": "123456"}';
t.sms.params1 = "参数1";
t.sms.params2 = "参数2";
t.sms.params3 = "参数3";
t.sms.params4 = "参数4";
t.sms.createDate = "发送时间";
t.sms.aliyunAccessKeyId = "Key";
t.sms.aliyunAccessKeyIdTips = "阿里云AccessKeyId";
t.sms.aliyunAccessKeySecret = "Secret";
t.sms.aliyunAccessKeySecretTips = "阿里云AccessKeySecret";
t.sms.aliyunSignName = "短信签名";
t.sms.aliyunTemplateCode = "短信模板";
t.sms.aliyunTemplateCodeTips = "短信模板CODE";
t.sms.qcloudAppId = "AppId";
t.sms.qcloudAppIdTips = "腾讯云AppId";
t.sms.qcloudAppKey = "AppKey";
t.sms.qcloudAppKeyTips = "腾讯云AppKey";
t.sms.qcloudSignName = "短信签名";
t.sms.qcloudTemplateId = "短信模板";
t.sms.qcloudTemplateIdTips = "短信模板ID";

t.oss = {};
t.oss.config = "云存储配置";
t.oss.upload = "上传文件";
t.oss.url = "URL地址";
t.oss.createDate = "创建时间";
t.oss.type = "类型";
t.oss.type1 = "七牛";
t.oss.type2 = "阿里云";
t.oss.type3 = "腾讯云";
t.oss.type4 = "FastDFS";
t.oss.type5 = "本地上传";
t.oss.qiniuDomain = "域名";
t.oss.qiniuDomainTips = "七牛绑定的域名";
t.oss.qiniuPrefix = "路径前缀";
t.oss.qiniuPrefixTips = "不设置默认为空";
t.oss.qiniuAccessKey = "AccessKey";
t.oss.qiniuAccessKeyTips = "七牛AccessKey";
t.oss.qiniuSecretKey = "SecretKey";
t.oss.qiniuSecretKeyTips = "七牛SecretKey";
t.oss.qiniuBucketName = "空间名";
t.oss.qiniuBucketNameTips = "七牛存储空间名";
t.oss.aliyunDomain = "域名";
t.oss.aliyunDomainTips = "阿里云绑定的域名，如：http://cdn.renren.io";
t.oss.aliyunPrefix = "路径前缀";
t.oss.aliyunPrefixTips = "不设置默认为空";
t.oss.aliyunEndPoint = "EndPoint";
t.oss.aliyunEndPointTips = "阿里云EndPoint";
t.oss.aliyunAccessKeyId = "AccessKeyId";
t.oss.aliyunAccessKeyIdTips = "阿里云AccessKeyId";
t.oss.aliyunAccessKeySecret = "AccessKeySecret";
t.oss.aliyunAccessKeySecretTips = "阿里云AccessKeySecret";
t.oss.aliyunBucketName = "BucketName";
t.oss.aliyunBucketNameTips = "阿里云BucketName";
t.oss.qcloudDomain = "域名";
t.oss.qcloudDomainTips = "腾讯云绑定的域名";
t.oss.qcloudPrefix = "路径前缀";
t.oss.qcloudPrefixTips = "不设置默认为空";
t.oss.qcloudAppId = "AppId";
t.oss.qcloudAppIdTips = "腾讯云AppId";
t.oss.qcloudSecretId = "SecretId";
t.oss.qcloudSecretIdTips = "腾讯云SecretId";
t.oss.qcloudSecretKey = "SecretKey";
t.oss.qcloudSecretKeyTips = "腾讯云SecretKey";
t.oss.qcloudBucketName = "BucketName";
t.oss.qcloudBucketNameTips = "腾讯云BucketName";
t.oss.qcloudRegion = "所属地区";
t.oss.qcloudRegionTips = "请选择";
t.oss.qcloudRegionBeijing1 = "北京一区（华北）";
t.oss.qcloudRegionBeijing = "北京";
t.oss.qcloudRegionShanghai = "上海（华东）";
t.oss.qcloudRegionGuangzhou = "广州（华南）";
t.oss.qcloudRegionChengdu = "成都（西南）";
t.oss.qcloudRegionChongqing = "重庆";
t.oss.qcloudRegionSingapore = "新加坡";
t.oss.qcloudRegionHongkong = "香港";
t.oss.qcloudRegionToronto = "多伦多";
t.oss.qcloudRegionFrankfurt = "法兰克福";
t.oss.localDomain = "域名";
t.oss.localDomainTips = "绑定的域名，如：http://cdn.renren.io";
t.oss.fastdfsDomain = "域名";
t.oss.fastdfsDomainTips = "绑定的域名，如：http://cdn.renren.io";
t.oss.localPrefix = "路径前缀";
t.oss.localPrefixTips = "不设置默认为空";
t.oss.localPath = "存储目录";
t.oss.localPathTips = "如：D:/upload";

t.dept = {};
t.dept.name = "名称";
t.dept.parentName = "上级部门";
t.dept.sort = "排序";
t.dept.parentNameDefault = "一级部门";

t.dict = {};
t.dict.dictName = "字典名称";
t.dict.dictType = "字典类型";
t.dict.dictLabel = "字典标签";
t.dict.dictValue = "字典值";
t.dict.sort = "排序";
t.dict.remark = "备注";
t.dict.createDate = "创建时间";

t.logError = {};
t.logError.module = "模块名称";
t.logError.requestUri = "请求URI";
t.logError.requestMethod = "请求方式";
t.logError.requestParams = "请求参数";
t.logError.ip = "操作IP";
t.logError.userAgent = "用户代理";
t.logError.createDate = "创建时间";
t.logError.errorInfo = "异常信息";

t.logLogin = {};
t.logLogin.creatorName = "用户名";
t.logLogin.operation = "操作类型";
t.logLogin.operation0 = "登录";
t.logLogin.operation1 = "退出";
t.logLogin.ip = "操作IP";
t.logLogin.userAgent = "User-Agent";
t.logLogin.createDate = "创建时间";

t.online = {};
t.online.kickout = "踢出";
t.online.userId = "用户ID";
t.online.username = "用户名";
t.online.realName = "姓名";
t.online.loginDate = "登录时间";
t.online.expireDate = "超时时间";

t.order = {};
t.order.orderId = "订单ID";
t.order.userId = "购买者ID";
t.order.status = "订单状态";
t.order.productId = "产品ID";
t.order.productName = "产品名称";
t.order.payAmount = "支付金额";
t.order.payAt = "支付时间";
t.order.createDate = "下单时间";
t.order.pay = "支付";
t.order.outTradeNo = "订单号";
t.order.notifyId = "通知校验ID";
t.order.tradeStatus = "交易状态";
t.order.tradeNo = "交易号";
t.order.totalAmount = "订单金额";
t.order.buyerPayAmount = "付款金额";

t.excel = {};
t.excel.realName = "学生姓名";
t.excel.identity = "身份证";
t.excel.address = "家庭地址";
t.excel.joinDate = "入学日期";
t.excel.className = "班级名称";
t.excel.import = "导入";

t.post = {};
t.post.postCode = "岗位编码";
t.post.postName = "岗位名称";
t.post.sort = "排序";
t.post.status = "岗位状态";

t.logOperation = {};
t.logOperation.module = "模块名称";
t.logOperation.status = "状态";
t.logOperation.status0 = "失败";
t.logOperation.status1 = "成功";
t.logOperation.creatorName = "用户名";
t.logOperation.operation = "用户操作";
t.logOperation.requestUri = "请求URI";
t.logOperation.requestMethod = "请求方式";
t.logOperation.requestParams = "请求参数";
t.logOperation.requestTime = "请求时长";
t.logOperation.ip = "操作IP";
t.logOperation.userAgent = "User-Agent";
t.logOperation.createDate = "创建时间";

t.menu = {};
t.menu.name = "名称";
t.menu.icon = "图标";
t.menu.type = "类型";
t.menu.type0 = "菜单";
t.menu.type1 = "按钮";
t.menu.sort = "排序";
t.menu.url = "路由";
t.menu.permissions = "授权标识";
t.menu.permissionsTips = "多个用逗号分隔，如：sys:menu:save,sys:menu:update";
t.menu.parentName = "上级菜单";
t.menu.parentNameDefault = "一级菜单";
t.menu.resource = "授权资源";
t.menu.resourceUrl = "资源URL";
t.menu.resourceMethod = "请求方式";
t.menu.resourceAddItem = "添加一项";
t.menu.openStyle = "打开方式";
t.menu.openStyle0 = "内部打开";
t.menu.openStyle1 = "外部打开";

t.params = {};
t.params.paramCode = "编码";
t.params.paramValue = "值";
t.params.remark = "备注";

t.role = {};
t.role.name = "名称";
t.role.remark = "备注";
t.role.createDate = "创建时间";
t.role.menuList = "菜单授权";
t.role.deptList = "数据授权";

t.user = {};
t.user.username = "用户名";
t.user.deptName = "所属部门";
t.user.email = "邮箱";
t.user.mobile = "手机号";
t.user.status = "状态";
t.user.status0 = "停用";
t.user.status1 = "正常";
t.user.createDate = "创建时间";
t.user.password = "密码";
t.user.confirmPassword = "确认密码";
t.user.realName = "真实姓名";
t.user.gender = "性别";
t.user.gender0 = "男";
t.user.gender1 = "女";
t.user.gender2 = "保密";
t.user.roleIdList = "角色配置";
t.user.postIdList = "所在岗位";
t.user.validate = {};
t.user.validate.confirmPassword = "确认密码与密码输入不一致";
t.user.select = "选择用户";
t.user.selecterror = "请选择一条记录";
t.dept.chooseerror = "请选择部门";
t.dept.title = "选择部门";

t.correction = {};
t.correction.post = "申请岗位";
t.correction.entryDate = "入职日期";
t.correction.correctionDate = "转正日期";
t.correction.workContent = "工作內容";
t.correction.achievement = "工作成绩";

t.process.comment = "审核意见";
t.process.completeTask = "同意";
t.process.rejectTask = "驳回";
t.process.doBackRollback = "回退";
t.process.terminationTask = "终止";
t.process.entrustTask = "委托";
t.process.createInstance = "发起流程";
t.process.instanceId = "流程实例ID";
t.process.taskId = "任务ID";
t.process.days = "天数";
t.process.businessKey = "业务KEY";
t.process.processDefinitionName = "流程名称";
t.process.ended = "流程进度";
t.process.ended0 = "已完成";
t.process.ended1 = "未完成";
t.process.startTime = "发起时间 ~ 结束时间";
t.process.endTime = "结束时间";
t.process.activityName = "当前环节";
t.process.createTime = "创建时间";
t.process.assignee = "处理人";
t.process.viewFlowImage = "查看流程图";
t.process.detail = "详情";
t.process.flowImage = "流程图";
t.process.processDefinitionVersion = "流程版本";
t.process.startUserId = "发起人";
t.process.taskName = "当前环节";
t.process.owner = "任务所有人";
t.process.claim = "签收";
t.process.routeError = "请先配置业务表单路由信息";
t.process.entrustError = "请选择委托人";
t.process.formURLError = "请设置保存表单的URL";
t.process.keyError = "请设置流程KEY";
t.process.formNameError = "请设置表单名称";
t.process.businessKeyError = "业务KEY为空，无法启动流程";
t.process.notExistError = "没有查询到流程，请先设计流程";
t.process.circulation = "流转详情";

t.task = {};
t.task.businessKeyError = "业务KEY为空，无法处理任务";
t.task.detailError = "业务KEY为空，无法查看处理详情";
t.task.startTime = "任务开始时间";
t.task.endTime = "任务结束时间";
t.task.durationInSeconds = "任务时长（秒）";

t.region = {};
t.region.id = "区域标识";
t.region.name = "区域名称";
t.region.type = "区域类型";
t.region.sort = "排序";
t.region.updateDate = "更新时间";
t.region.province = "省份直辖市";
t.region.city = "地市";
t.region.county = "区县";

t.oss.type6 = "MinIO";
t.oss.minioEndPoint = "EndPoint";
t.oss.minioEndPointTips = "MinIO EndPoint";
t.oss.minioAccessKey = "AccessKey";
t.oss.minioAccessKeyTips = "AccessKey";
t.oss.minioSecretKey = "SecretKey";
t.oss.minioSecretKeyTips = "SecretKey";
t.oss.minioBucketName = "BucketName";
t.oss.minioBucketNameTips = "BucketName";
t.oss.minioPrefix = "路径前缀";
t.oss.minioPrefixTips = "不设置默认为空";

t.sms.platform3 = "七牛";
t.sms.qiniuAccessKey = "AccessKey";
t.sms.qiniuAccessKeyTips = "AccessKey";
t.sms.qiniuSecretKey = "SecretKey";
t.sms.qiniuSecretKeyTips = "SecretKey";
t.sms.qiniuTemplateId = "短信模板";
t.sms.qiniuTemplateIdTips = "短信模板ID";
t.sms.smsCode = "短信编码";
t.sms.remark = "备注";

t.notice = {};
t.notice.title = "标题";
t.notice.type = "类型";
t.notice.senderName = "发送者";
t.notice.senderDate = "发送时间";
t.notice.status = "状态";
t.notice.status0 = "草稿";
t.notice.status1 = "已发";
t.notice.view = "查看";
t.notice.view1 = "通知管理 - 查看";
t.notice.view2 = "我的通知 - 查看";
t.notice.readStatus = "阅读状态";
t.notice.readStatus0 = "未读";
t.notice.readStatus1 = "已读";
t.notice.content = "内容";
t.notice.receiverType = "接收者";
t.notice.receiverType0 = "全部";
t.notice.receiverType1 = "部门";
t.notice.selectDept = "选择部门";
t.notice.draft = "保存草稿";
t.notice.release = "发布通知";
t.notice.close = "关闭";
t.notice.receiverName = "接收者";
t.notice.readDate = "阅读时间";
t.notice.new = "有新通知";

export default t;
