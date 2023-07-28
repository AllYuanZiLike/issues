<template>
  <div class="mod-project__prjprojectcategory">
<!--    &lt;!&ndash;    各个状态议题数量&ndash;&gt;-->
<!--    <div class="state">-->
<!--      &lt;!&ndash;      未开始&ndash;&gt;-->
<!--      <div class="disvote">-->
<!--        <span class="number">{{ statusNum.disvote }}</span>-->
<!--        <el-icon size="large"><Histogram /></el-icon>-->
<!--        <p class="word">未开始</p>-->
<!--      </div>-->
<!--      &lt;!&ndash;      收集项目中&ndash;&gt;-->
<!--      <div class="projecting">-->
<!--        <span class="number">{{ statusNum.projecting }}</span>-->
<!--        <el-icon size="large"><Histogram /></el-icon>-->
<!--        <p class="word">收集项目中</p>-->
<!--      </div>-->
<!--      &lt;!&ndash;      收集项目已结束&ndash;&gt;-->
<!--      <div class="projected">-->
<!--        <span class="number">{{ statusNum.projected }}</span>-->
<!--        <el-icon size="large"><Histogram /></el-icon>-->
<!--        <p class="word">收集项目已结束</p>-->
<!--      </div>-->
<!--      &lt;!&ndash;      项目评审进行中&ndash;&gt;-->
<!--      <div class="voting">-->
<!--        <span class="number">{{ statusNum.voting }}</span>-->
<!--        <el-icon size="large"><Histogram /></el-icon>-->
<!--        <p class="word">项目评审进行中</p>-->
<!--      </div>-->
<!--      &lt;!&ndash;      项目评审已结束&ndash;&gt;-->
<!--      <div class="voted">-->
<!--        <span class="number">{{ statusNum.voted }}</span>-->
<!--        <el-icon size="large"><Histogram /></el-icon>-->
<!--        <p class="word">项目评审已结束</p>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="history_box">-->
<!--      &lt;!&ndash;      <div class="history"></div>&ndash;&gt;-->
<!--      <el-button class="history" @click="checkHistory">历史会议</el-button>-->
<!--    </div>-->
<!--    &lt;!&ndash;    新增议题按钮&ndash;&gt;-->
<!--    <div class="addBox" v-show="startVoteVisible">-->
<!--      <el-button v-if="hasPermission('/project:category:save')" type="primary" @click="addOrUpdateHandle()" class="add">-->
<!--        <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>-->
<!--        新增项目评审-->
<!--      </el-button>-->
<!--    </div>-->
<!--    &lt;!&ndash;    议题列表&ndash;&gt;-->
<!--    <div class="voteBox">-->
<!--      &lt;!&ndash;    议题盒子&ndash;&gt;-->
<!--      <div class="voteItem" v-for="(item, index) in dataList" :key="index">-->
<!--        &lt;!&ndash;   盒子主体部分&ndash;&gt;-->
<!--        <div class="top">-->
<!--          &lt;!&ndash; 议题名称&ndash;&gt;-->
<!--          <div class="top-header">-->
<!--            <div class="img">-->
<!--              <img src="@/assets/images/issues/vote.png" alt="" />-->
<!--            </div>-->
<!--            <div class="title">-->
<!--              <div class="tt">{{ item.name }}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="placeisonline">-->
<!--            &lt;!&ndash;          会议形式&ndash;&gt;-->
<!--            <div class="online">-->
<!--              <div class="img"><img src="@/assets/images/online.png" alt="" /></div>-->
<!--              <el-tooltip class="box-item" effect="light" content="会议形式" placement="top">-->
<!--                <div class="p">{{ item.isOnline===0?"线上":item.room.name }}</div>-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--            &lt;!&ndash;  议题地点&ndash;&gt;-->
<!--            <div class="place" v-show="item.online === '线下'">-->
<!--              <div class="img"><img src="@/assets/images/place.png" alt="" /></div>-->
<!--              <el-tooltip class="box-item" effect="light" content="会议室" placement="top">-->
<!--&lt;!&ndash;                <div class="p">{{ item.baseRoomDTO.name }}</div>&ndash;&gt;-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--          </div>-->
<!--          &lt;!&ndash;  议题介绍&ndash;&gt;-->
<!--          <div class="info-box">-->
<!--            <div class="img">-->
<!--              <img src="@/assets/images/info.png" alt="" />-->
<!--            </div>-->
<!--            <el-tooltip class="box-item" effect="light" content="简介" placement="top">-->
<!--              <div class="inform">-->
<!--                <p v-html="item.info"></p>-->
<!--              </div>-->
<!--            </el-tooltip>-->
<!--          </div>-->
<!--          &lt;!&ndash;  收集项目时间&ndash;&gt;-->
<!--          <div class="time">-->
<!--            &lt;!&ndash;   开始时间&ndash;&gt;-->
<!--            <div class="beginTime">-->
<!--              <div class="img"><img src="@/assets/images/begin-time.png" /></div>-->
<!--              <el-tooltip class="box-item" effect="light" content="收集项目开始时间" placement="top">-->
<!--                <div class="b-time">{{ item.startTime }}</div>-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--            &lt;!&ndash;       结束时间     &ndash;&gt;-->
<!--            <div class="overTime">-->
<!--              <div class="img"><img src="@/assets/images/over-time.png" /></div>-->
<!--              <el-tooltip class="box-item" effect="light" content="收集项目结束时间" placement="top">-->
<!--                <div class="o-time">{{ item.stopTime }}</div>-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--          </div>-->
<!--          &lt;!&ndash;  项目评审预计时间&ndash;&gt;-->
<!--          <div class="time">-->
<!--            &lt;!&ndash;   开始时间&ndash;&gt;-->
<!--            <div class="beginTime">-->
<!--              <div class="img"><img src="@/assets/images/re-starttime.png" /></div>-->
<!--              <el-tooltip class="box-item" effect="light" content="项目评审开始时间" placement="bottom">-->
<!--                <div class="b-time">{{ item.reserveBeginTime }}</div>-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--            &lt;!&ndash;       结束时间     &ndash;&gt;-->
<!--            <div class="overTime">-->
<!--              <div class="img"><img src="@/assets/images/re-stoptime.png" /></div>-->
<!--              <el-tooltip class="box-item" effect="light" content="项目评审结束时间" placement="bottom">-->
<!--                <div class="o-time">{{ item.reserveEndTime }}</div>-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        &lt;!&ndash;   盒子底部按钮 &ndash;&gt;-->
<!--        <div class="down">-->
<!--          &lt;!&ndash;     议题状态&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" :content="item.statusText" placement="bottom">-->
<!--            <div class="img"><img :src="item.progressSrc" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          开始/结束活动&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" :content="item.contentText" placement="bottom">-->
<!--            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:changeVote')" @click="startVote(item.id, index)">-->
<!--              <img :src="item.imgSrc" alt="" />-->
<!--            </div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          查看评审规则&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="查看评审规则" placement="bottom">-->
<!--            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:checkRule')" @click="checkRule(item.id, item.status)"><img src="@/assets/images/rules.png" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          查看参与人员&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="查看参与人员" placement="bottom">-->
<!--            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:checkParticipant')" @click="checkParticipant(item.id, item.status)"><img src="@/assets/images/issues/add.png" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          查看项目&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="查看项目" placement="bottom">-->
<!--            <div class="img" v-if="hasPermission('project:category:checkProject')" v-show="item.projectVisible" @click="isParticipant(item.id, item.status)"><img src="@/assets/images/issues/check.png" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          查看评审结果明细&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="查看评审明细" placement="bottom">-->
<!--            <div class="img" v-if="hasPermission('project:projectcategory:checkResult')" v-show="item.resultVisible" @click="checkResult(item.id, item.status)"><img src="@/assets/images/result.png" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          议题修改&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="修改" placement="bottom" v-if="item.upOrdeVisible">-->
<!--            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:update')" @click="addOrUpdateHandle(item.id)"><img src="@/assets/images/issues/update.png" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;          议题删除&ndash;&gt;-->
<!--          <el-tooltip class="box-item" effect="light" content="删除" placement="bottom" v-if="item.upOrdeVisible">-->
<!--            <div class="img" v-show="startVoteVisible" v-if="hasPermission('/project:category:delete')" @click="deleteHandle(item.id)"><img src="@/assets/images/issues/delete.png" alt="" /></div>-->
<!--          </el-tooltip>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <el-pagination :current-page="page" :page-sizes="[6, 9, 12, 27]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>-->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData();getDataText()"></add-or-update>
    <historyProject v-if="drawerHis" ref="his"></historyProject>
    <Rule v-if="drawerRule" ref="rule" :categoryId="categoryId" :categoryStatus="categoryStatus"></Rule>
    <Part v-if="drawerPart" ref="part" :categoryId="categoryId" :categoryStatus="categoryStatus"></Part>
    <Project v-if="drawerPro" ref="pro" :categoryId="categoryId" :categoryStatus="categoryStatus"></Project>
    <Result v-if="drawerResult" ref="result" :isAdd="isAdd" :categoryId="categoryId" :categoryStatus="categoryStatus"></Result>
<!--    @changeResultVisible="changeResultVisible"-->
    <div class="main_box">
      <div class="left_box">
        <div class="title">项目评审</div>
        <div class="status_box">
          <!--      未开始-->
          <div class="dis_box">
<!--            <div class="top"></div>-->
            <div class="disvote">
              <span class="number">{{ statusNum.disvote }}</span>
<!--              <el-icon size="large"><Histogram /></el-icon>-->
              <p class="word">未开始</p>
            </div>
          </div>
          <!--收集项目中-->
          <div class="ing_box">
<!--            <div class="top"></div>-->
            <div class="projecting">
              <span class="number">{{ statusNum.projecting }}</span>
<!--              <el-icon size="large"><Histogram /></el-icon>-->
              <p class="word">收集项目中</p>
            </div>
          </div>
          <!--      收集项目已结束-->
          <div class="projected">
            <span class="number">{{ statusNum.projected }}</span>
<!--            <el-icon size="large"><Histogram /></el-icon>-->
            <p class="word">收集项目已结束</p>
          </div>
          <!--      项目评审进行中-->
          <div class="voting">
            <span class="number">{{ statusNum.voting }}</span>
<!--            <el-icon size="large"><Histogram /></el-icon>-->
            <p class="word">项目评审进行中</p>
          </div>
        </div>
        <div class="button_box">
          <el-button v-if="hasPermission('/project:category:save')" type="primary" @click="addOrUpdateHandle()" class="add">
            <div class="img"><img src="@/assets/images/issues/addVote.png" alt="" /></div>
            新增项目评审
          </el-button>
          <el-button class="history" type="primary"  @click="checkHistory">
            <div class="img"><img src="@/assets/images/issues/history.png" alt="" /></div>
            历史项目评审
          </el-button>
        </div>
      </div>
      <div class="right_box">
        <div class="query">
          <el-form>
            <el-form-item>
              <el-input v-model="dataForm.name" placeholder="请输入项目名称" @keyup.enter="getData" :input-style="{ width: '150px'}">
                <template #append>
                  <el-button type="default" @click="getDataList()">{{ $t("query") }}</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="voteBox">
          <!--    议题盒子-->
          <div class="voteItem" v-for="(item, index) in dataList" :key="index">
            <!--   盒子主体部分-->
            <div class="top">
              <!-- 议题名称-->
              <div class="top-header">
                <div class="img">
                  <img src="@/assets/images/issues/vote.png" alt="" />
                </div>
                <div class="title">
                  <div class="tt">{{ item.name }}</div>
                </div>
              </div>
              <!--  议题地点-->
              <div class="place">
                <div class="img"><img src="@/assets/images/place.png" alt="" /></div>
                <div class="p">{{ item.isOnline==0?"线上":`${item.room?.name}` }}</div>
              </div>
              <!--  议题预计时间-->
              <div class="time">
                <!--   开始时间-->
                <div class="beginTime">
                  <div class="img"><img src="@/assets/images/begin-time.png" /></div>
                  <div class="b-time">{{ item.reserveBeginTime }}</div>
                </div>
                <!--       结束时间     -->
                <div class="overTime">
                  <div class="img"><img src="@/assets/images/over-time.png" /></div>
                  <div class="o-time">{{ item.reserveEndTime }}</div>
                </div>
              </div>
            </div>
            <div class="check">
              <el-button size="small" type="default" @click="checkConcent(item.id)">点击查看详细信息</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-dialog v-model="checkVisible" title="详细信息" width="60%" draggable>
        <div id="check_box">
          <div class="check_left_box">
            <el-descriptions class="margin-top" :title="`项目评审名称: ${dataForm.name}`" :column="2" size="default" border label-align="center">
              <template #extra v-if="dataForm.status===0">
                <el-tooltip class="box-item" effect="light" content="修改" placement="bottom">
                  <el-button type="primary" v-if="hasPermission('/project:category:update')" @click="addOrUpdateHandle(dataForm.id)">
                    <el-icon :size="20"><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="box-item" effect="light" content="删除" placement="bottom">
                  <el-button type="primary" v-if="hasPermission('/project:category:delete')" @click="deleteHandle(dataForm.id)">
                    <el-icon :size="20"><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><MapLocation /></el-icon>
                    地址
                  </div>
                </template>
                {{ dataForm.isOnline==0?"线上":`${dataForm.room?.name}` }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Postcard /></el-icon>
                    状态
                  </div>
                </template>
                {{dataForm.statusText}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Timer /></el-icon>
                    开始时间
                  </div>
                </template>
                {{dataForm.reserveBeginTime}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Timer /></el-icon>
                    结束时间
                  </div>
                </template>
                {{dataForm.reserveEndTime}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :size="18"><Tickets /></el-icon>
                    介绍
                  </div>
                </template>
                <div v-html="dataForm.info"></div>
              </el-descriptions-item>
            </el-descriptions>
<!--            <div class="btn_box">-->
<!--              <el-button class="box-item" type="primary" v-if="hasPermission('/project:category:checkRule')" @click="checkRule(dataForm.id, dataForm.status)">查看规则</el-button>-->
<!--              <el-button class="box-item" type="primary" v-if="hasPermission('/project:category:checkParticipant')" @click="checkParticipant(dataForm.id, dataForm.status)">查看参与人</el-button>-->
<!--              <el-button class="box-item" type="primary" v-if="hasPermission('project:category:checkProject')" @click="checkProject(dataForm.id, dataForm.status)">查看项目</el-button>-->

<!--            </div>-->
          </div>
          <div class="check_right_box">
            <div class="left">
<!--              v-show="(dataForm.status===0||dataForm.status===1||dataForm.status===2)"-->
              <el-timeline>
                <el-timeline-item timestamp="投票人、监票人..." v-if="hasPermission('/project:category:checkParticipant')">{{dataForm.status===0?"添加参与人":"查看参与人"}}</el-timeline-item>
                <el-timeline-item timestamp="是否匿名、类型..." v-if="hasPermission('/project:category:checkRule')">{{dataForm.status===0?"添加规则":"查看规则"}}</el-timeline-item>
                <el-timeline-item timestamp="改变评审进程..." v-if="hasPermission('/project:category:changeVote')">{{ dataForm.status===0?"开启项目收集":(dataForm.status===1?"结束收集":(dataForm.status===2?"开始评审":"结束评审")) }}</el-timeline-item>
                <el-timeline-item timestamp="项目名称、介绍..." v-if="hasPermission('project:category:checkProject')" v-show="!(dataForm.status===0)">{{dataForm.status===1?"添加项目":"查看项目"}}</el-timeline-item>
                <el-timeline-item timestamp="各项目的评审进度..." v-if="hasPermission('project:projectcategory:checkResult')" v-show="dataForm.status===3">查看进度</el-timeline-item>
              </el-timeline>
            </div>
<!--            <el-button class="box-item" type="primary" v-if="hasPermission('/project:category:checkParticipant')" @click="checkParticipant(dataForm.id, dataForm.status)">-->

<!--          </el-button>-->
            <div class="right">
              <el-tooltip effect="light" :content="dataForm.status===0?'添加参与人':'查看参与人'" placement="bottom">
                <el-button class="box-item" type="primary" v-if="hasPermission('/project:category:checkParticipant')" @click="checkParticipant(dataForm.id, dataForm.status)">
                  <el-icon :size="22"><User /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="light" :content="dataForm.status===0?'添加规则':'查看规则'" placement="bottom">
                <el-button class="box-item" type="primary"  v-if="hasPermission('/project:category:checkRule')" @click="checkRule(dataForm.id, dataForm.status)">
                  <el-icon :size="22"><Reading /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip class="box-item" effect="light" :content="dataForm.contentText" placement="bottom">
                <el-button class="box-item" type="primary" v-show="startVoteVisible" v-if="hasPermission('/project:category:changeVote')" @click="startVote(dataForm.id)">
                  <el-icon :size="22" v-if="dataForm.status===0||dataForm.status===2"><VideoPlay /></el-icon>
                  <el-icon :size="22" v-if="dataForm.status===1||dataForm.status===3"><VideoPause /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="light" :content="dataForm.status===1?'添加项目':'查看项目'" placement="bottom" v-if="(dataForm.status===1||dataForm.status===2||dataForm.status===3)">
                <el-button class="box-item" type="primary"  v-if="hasPermission('project:category:checkProject')" @click="checkProject(dataForm.id, dataForm.status)">
                  <el-icon :size="22"><DocumentCopy /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip effect="light" content="查看进度" placement="bottom" v-if="dataForm.status===3">
                <el-button class="box-item" type="primary"  v-if="hasPermission('project:projectcategory:checkResult')" @click="checkResult(dataForm.id, dataForm.status)">
                  <el-icon :size="22"><DataLine /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="checkVisible = false;this.getData;dataForm.name='';">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="less" scoped>
.main_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .left_box {
    display: flex;
    flex-direction: column;
    width: 60vw;
    height: 100%;
    margin-right: 2%;
    border-right: 2px dashed rgba(135, 162, 255, 0.82);

    .title {
      height: 25%;
      margin-bottom: 3%;
      font-size: 2.5em;
      padding: 5%;
      text-align: center;
      color: #716afc;
      //background-color: #eedddd;
    }
    .status_box {
      //background-color: #fff3e6;
      height: 40%;
      margin-bottom: 2.5%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      //未开始
      .dis_box{
        //width: 45%;
        height: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 3vh;
        .top {
          width: 20vw;
          height: 5vh;
          //box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
          border-top: 5vh solid transparent;
          border-left: none;
          border-right: 20vw solid rgba(233, 238, 250, 0.69);
          border-bottom: none;
        }
        .disvote {
          //flex: 1;
          width: 20vw;
          height: 15vh;
          //margin-bottom: -2.5vh;
          background-color: rgba(233, 238, 250, 0.69);
          //margin: 0 2px;
          color: #86a1ff;
          box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
          //border-radius: 10px;
          //padding: 1%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          //数字
          .number {
            font-size: 2.5em;
          }
          //文字
          .word {
            font-size: 1.5em;
            margin-block-start: 0em;
            margin-block-end: 0em;
          }
        }
      }
      .ing_box {
        height: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 3vh;
        .top {
          //background-color: #b4c3e5;
          width: 20vw;
          height: 5vh;
          //background-color: #8eb0f1;
          border-top: 5vh solid transparent;
          border-left: none;
          border-right: 20vw solid rgba(233, 238, 250, 0.69);
          border-bottom: none;
        }
        //进行中
        .projecting {
          //flex: 1;
          width: 20vw;
          height: 15vh;
          background-color: rgba(233, 238, 250, 0.69);
          //margin: 0 2px;
          color: #86a1ff;
          box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
          //border-radius: 10px;
          //padding: 1%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          .number {
            font-size: 2.5em;
          }
          .word {
            font-size: 1.5em;
            margin-block-start: 0em;
            margin-block-end: 0em;
          }
        }
      }
      .projected {
        width: 20vw;
        height: 15vh;
        background-color: rgba(233, 238, 250, 0.69);
        //margin: 0 2px;
        color: #86a1ff;
        box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        //数字
        .number {
          font-size: 2.5em;
        }
        //文字
        .word {
          font-size: 1.5em;
          margin-block-start: 0em;
          margin-block-end: 0em;
        }
      }
      //进行中
      .voting {
        width: 20vw;
        height: 15vh;
        background-color: rgba(233, 238, 250, 0.69);
        //margin: 0 2px;
        color: #86a1ff;
        box-shadow: 7px 7px 3px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .number {
          font-size: 2.5em;
        }
        .word {
          font-size: 1.5em;
          margin-block-start: 0em;
          margin-block-end: 0em;
        }
      }
    }
    .button_box {
      //background-color: #e5eedd;
      height: 30%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .history {
        height: 13vh;
        font-size: 1.7em;
        width: 20vw;
        color: #87a2ff;
        border:3px solid #bbcafa;
        background-color: rgba(252, 253, 255, 0.69);
        .img {
          width: 25px;
          height: 25px;
          margin-right: 20px;

          img {
            width: 100%;
          }
        }
      }
      .add {
        height: 13vh;
        font-size: 1.7em;
        color:#87a2ff;
        width: 20vw;
        border:3px solid #bbcafa;
        background-color: rgba(252, 253, 255, 0.69);
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
  .right_box {
    width: 23vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    .query {
      width: 80%;
      display: flex;
    }
    .voteBox {
      width: 20vw;
      height: 72vh;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: nowrap;
      //议题盒子
      .voteItem {
        margin-bottom: 6%;
        //margin-right: 3.5%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 15px;
        width: 90%;
        height: 21vh;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        background-image: url("@/assets/images/issues/vote_item_bg.png");
        background-size: 100% 100%;
        //议题主体
        .top {
          flex: 7;
          padding: 2.5%;
          display: flex;
          flex-direction: column;
          //议题标题
          .top-header {
            flex: 0.1;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .img {
              width: 7.5%;
              margin-right: 2.5%;

              img {
                width: 100%;
              }
            }

            .title {
              //flex: 8;
              width: 85%;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              border-radius: 8px;
              .tt {
                font-size: 18px;
                line-height: 40px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          //议题地点
          .place {
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
              width:85%;
              margin-left: 2.5%;
              font-size: 16px;
              border-radius: 8px;
            }
          }
          //议题介绍
          .info-box {
            display: flex;
            justify-content: center;
            height: 11vh;

            .img {
              width: 7.5%;
              margin-right: 2.5%;
              img {
                width: 100%;
              }
            }
            .inform::-webkit-scrollbar {
              width:0 !important;
            }
            .inform {
              width: 92.5%;
              font-size: 14px;
              vertical-align: center;
              color: #5b5f69;
              overflow: scroll;
              border-radius: 8px;


              p {
                margin: 0;
                padding: 0;
                //margin-block-start: -1em;
                margin-block-end: -1em;
              }
            }
          }
          //议题预计时间
          .time {
            width: 100%;
            flex: 0.5;
            display: flex;
            justify-content: flex-start;
            //开始时间
            .beginTime {
              flex: 1;
              display: flex;
              justify-content: flex-start;
              align-items: center;

              .img {
                width: 15%;
                margin-right: 4%;

                img {
                  width: 100%;
                }
              }
              .b-time {
                font-size: 1.8vh;
                border-radius: 8px;
              }
            }
            //结束时间
            .overTime {
              flex: 1;
              display: flex;
              justify-content: flex-start;
              align-items: center;

              .img {
                width: 15%;
                margin-right: 4%;

                img {
                  width: 100%;

                }
              }
              .o-time {
                font-size: 1.8vh;
                border-radius: 8px;
              }
            }
          }
        }
        .check {
          width: 100%;
          height: 20vh;
          //background-color: #ffdbdb;
          //z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

    }
  }
  #check_box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .check_left_box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      //width: 60vw;
      flex: 2;
      height: 100%;
      padding-right: 2%;
      .btn_box {
        display: flex;
        flex-direction: row;
        margin-top: 2vh;
        .box-item {
          flex:1;
        }
      }
    }
    .check_right_box {
      flex:1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      .right {
        display: flex;
        flex-direction: column;

        .box-item {
          margin-bottom: 4vh;
        }
      }

    }
  }
}
</style>
<script lang="ts">
import useView from "@/hooks/useView";
import {defineComponent, nextTick, reactive, ref, toRefs} from "vue";
import AddOrUpdate from "./category-add-or-update.vue";
import baseService from "@/service/baseService";
import historyProject from "@/views/project/historyProject.vue";
import Rule from "@/views/project/rule.vue";
import Part from "@/views/project/participant.vue"
import Project from "@/views/project/project.vue"
import Result from "@/views/project/voteresult.vue"
import {useAppStore} from "@/store/index"
import {ElMessage} from "element-plus";
export default defineComponent({
  components: {
    historyProject,
    AddOrUpdate,
    Rule,
    Part,
    Project,
    Result
  },
  setup() {
    const addKey = ref(0);
    const addOrUpdateRef = ref();
    const addOrUpdateHandle = (id?: number) => {
      addKey.value++;
      nextTick(() => {
        addOrUpdateRef.value.dataForm.$reset();
        addOrUpdateRef.value.init(id);
      });
    };
    const store = useAppStore();
    const state = reactive({
      // getDataListURL: "/project/category/page",
      getDataListIsPage: true,
      exportURL: "/project/category/export",
      deleteURL: "/project/category",
      deleteIsBatch: true,
      datetimerange: null,
      drawerHis:false,//历史会议抽屉
      drawerRule:false,//规则抽屉
      drawerPart:false,//参与人抽屉
      drawerPro:false,//项目抽屉
      drawerResult:false,//评审明细
      projectVisible: false,//是否可查看项目
      startVoteVisible: true,//是否能启动活动
      resultVisble: false,//是否能查看明细
      checkVisible:false,//查看详细信息
      isAdd:true,
      categoryId:"",//当前项目评审id
      categoryStatus:0,//当前项目评审状态
      dataForm: {
        name: "",
        startDateTime: null as number | null,
        endDateTime: null as number | null,
        isOnline: "",
        status: 0,
        delFlag: "",
        userId:"",
        statusText: "",
        contentText:"",
        imgSrc:"",
        progressSrc:"",
        placeVisible: true,
        upOrdeVisible: true,
        projectVisible:false,
        resultVisible:false,
      },
      userLogin: {
        duty: 0,
        id: "",
        realName: "",
        username: ""
      },
      statusNum:{
        // 议题未开始
        disvote: 0,
        //收集项目中
        projecting: 0,
        //收集项目已结束
        projected: 0,
        // 议题进行中
        voting: 0,
        // 议题已结束
        voted: 0
      }
    });
    return {store,addOrUpdateHandle,...useView(state),...toRefs(state)}

  },
  methods: {
    getLoginUser () {
      console.log(this.store.state.user);
      this.userLogin.id = this.store.state.user.id;
      this.userLogin.realName = this.store.state.user.realName;
      this.userLogin.username = this.store.state.user.username;
      if (this.userLogin.realName !== "项目评审管理员") {
        this.startVoteVisible = false;
      }
      if (this.userLogin.realName === "超级管理员") {
        this.startVoteVisible = true;
      }
    },
    /**
     * 查看详细信息
     */
    checkConcent(id:string){
      baseService.get("/project/category/" + id).then((res) => {
        console.log(res)
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        this.dataForm = res.data;
        this.getDataText();
        this.checkVisible = true;
      });

    },
    getData(){
      this.dataForm.userId=this.userLogin.id
      console.log(this.dataForm)
      baseService
        .get("/project/category/page",{
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
          this.getDataText()
        })
    },
    getDataText() {
      /**
       *处理议题盒子底部按钮状态
       */
      // for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataForm.status === 0) {
          this.dataForm.statusText = "未开始";
          this.dataForm.projectVisible = false;
          this.dataForm.upOrdeVisible = true;
          this.dataForm.resultVisible = false;
          this.dataForm.contentText = "开始项目收集";
          this.dataForm.imgSrc = "src/assets/images/start_collection.png";
          this.dataForm.progressSrc = "src/assets/images/issues/progress_begin.png";
        } else if (this.dataForm.status === 1) {
          this.dataForm.statusText = "收集项目中";
          this.dataForm.contentText = "结束项目收集";
          this.dataForm.projectVisible = true;
          this.dataForm.upOrdeVisible = true;
          this.dataForm.resultVisible = false;
          this.dataForm.imgSrc = "src/assets/images/over_collection.png";
          this.dataForm.progressSrc = "src/assets/images/projecting.png";
        } else if (this.dataForm.status === 2) {
          this.dataForm.statusText = "收集项目已结束";
          this.dataForm.projectVisible = true;
          this.dataForm.upOrdeVisible = true;
          this.dataForm.resultVisible = false;
          this.dataForm.contentText = "活动已结束";
          this.dataForm.progressSrc = "src/assets/images/projected.png";
          this.dataForm.contentText = "开始项目评审";
          this.dataForm.imgSrc = "src/assets/images/start.png";
        } else if (this.dataForm.status === 3) {
          this.dataForm.statusText = "评审进行中";
          this.dataForm.projectVisible = true;
          this.dataForm.upOrdeVisible = false;
          this.dataForm.resultVisible = true;
          this.dataForm.progressSrc = "src/assets/images/voting.png";
          this.dataForm.imgSrc = "src/assets/images/over.png";
          this.dataForm.contentText = "结束项目评审";
        } else if (this.dataForm.status === 4) {
          this.dataForm.statusText = "评审已结束";
          this.dataForm.projectVisible = true;
          this.dataForm.upOrdeVisible = false;
          this.dataForm.resultVisible = true;
          this.dataForm.progressSrc = "src/assets/images/voted.png";
          this.dataForm.imgSrc = "src/assets/images/overed.png";
          this.dataForm.contentText = "评审已结束";
        }
      // }
      // console.log(this.projectVisible)
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].online === "线上") this.dataList[i].placeVisible = false;
      }
    },
    /**
     * 查看历史会议
     */
    checkHistory(){
      this.drawerHis = true;
      nextTick(()=>{
        let that:any = this
        that.$refs.his.dataForm.status = 2;
        that.$refs.his.initHis();
        that.$refs.his.$forceUpdate()
      })
    },
    /**
     * 跳转查看规则页面
     * @param id
     * @param status
     */
    checkRule(id: string, status: number) {
      this.drawerRule = true;
      this.categoryId = "";
      this.categoryId = id;
      this.categoryStatus = status
      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        // this.$refs.rule.status = status;
        let that:any = this
        that.$refs.rule.initRule();
        that.$refs.rule.$forceUpdate()
      })
    },
    /**
     * 跳转查看参与人页面
     * @param id
     * @param status
     */
    checkParticipant(id: string, status: number) {
      // this.$router.push({
      //   path: "/project/prjactivityparticipant",
      //   query: {
      //     thesisId: id,
      //     status: status
      //   }
      // });
      console.log(id)
      this.drawerPart = true;
      this.categoryId = "";
      this.categoryId = id;
      this.categoryStatus = status
      // this.$refs.part.dataForm.categoryId = id
      nextTick(()=>{
        let that:any = this
        that.$refs.part.initPart();
        that.$refs.part.$forceUpdate()
      })
    },
    /**
     * 跳转查看项目页面
     * @param id
     * @param status
     */
    isParticipant(id: string, status: number){
      console.log(id,this.userLogin.id)
      baseService.get("project/project/isParticipant", {categoryId: id,userId:this.userLogin.id}).then( res => {
        console.log(res)
        if (res.code !== 0) return false
        console.log(555 ,id);
        if (res.data) ElMessage.error("你是该项目评审参与人，不能查看项目");
        else this.checkProject(id,status)
      })
    },
    checkProject(id: string, status: number) {
          console.log(333)
          this.drawerPro = true;
          this.categoryId = "";
          this.categoryId = id;
          this.categoryStatus = status
          console.log(this.categoryId)
          nextTick(()=>{
            let that:any = this
            that.$refs.pro.dataForm.categoryId=id
            console.log(that.$refs.pro.dataForm.categoryId)
            that.$refs.pro.dataForm.categoryStatus=status
            console.log(that.$refs.pro.dataForm.categoryStatus)
            that.$refs.pro.initPro();
            that.$refs.pro.$forceUpdate()
          })

    },
    /**
     * 跳转查看项目评审结果明细页面
     * @param id
     * @param status
     */
    checkResult(id: string, status: number) {

      this.drawerResult = true;
      this.categoryId = "";
      this.categoryId = id;
      this.categoryStatus = status

      nextTick(()=>{
        // this.$refs["part"].dataForm.issuesId = id;
        // this.$refs.result.status = status;
        let that:any = this
        that.$refs.result.initResult();
        that.$refs.result.$forceUpdate()
      })
    },
    /**
     *开始/结束活动
     * @param id
     * @param index
     */
    startVote(id: string, index: number) {
      baseService.get("/project/category/change", { id: id, status: this.dataForm.status }).then((res) => {
        console.log(res);
        if (res.code !== 0) {
          return this['$message'].error(res.msg);
        }
        baseService.get("/project/category/" + id).then((res) => {
          console.log(res)
          if (res.code !== 0) {
            return this['$message'].error(res.msg);
          }
          this.dataForm = res.data;
          this.getDataText();
        });
      });
    }
  },
  watch: {
    statusNum:{
      handler(newData,oldData) {
        this.getDataText()
      },
      immediate:true,
      deep:true
    }
  },
  mounted() {
    /**
     * 获取议题各个状态的数量
     */
    baseService.get("/project/category/show").then((res) => {
      console.log(res);
      if (res.code !== 0) return false;
      this.statusNum.disvote = res.data.zero;
      this.statusNum.projecting = res.data.one;
      this.statusNum.projected = res.data.two;
      this.statusNum.voting = res.data.three;
      this.statusNum.voted = res.data.four;
    });
    this.getLoginUser();
    this.getData()
    // this.getDataText();
  }
});
</script>


