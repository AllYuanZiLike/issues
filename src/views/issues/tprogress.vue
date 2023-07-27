<template>
  <!--  进度条组件-->
  <div class="m-progress" :style="`width:${width}px;`">
    <!--    外层-->
    <div class="m-progress-outer">
      <!--      内层-->
      <div class="m-progress-inner">
        <div class="u-progress-bg" :style="`width: ${progress}%;`"></div>
      </div>
    </div>
    <span class="u-progress-text">{{ progress }}%</span>
  </div>
</template>

<script lang="ts">
export default {
  name: "Progress",
  props: {
    width: {
      type: Number,
      default: 600
    },
    progress: {
      type: Number,
      default: 36
    }
  }
};
</script>
<style lang="less" scoped>
.m-progress {
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  line-height: 24px;
  margin: 10px 0;
  .m-progress-outer {
    display: inline-block;
    width: calc(100% - 60px);
    .m-progress-inner {
      width: 100%;
      background-color: #f5f5f5;
      border-radius: 100px;
      .u-progress-bg {
        background-color: #1890ff;
        border-radius: 100px;
        height: 8px;
        transition: all 0.3s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
      }
    }
  }
  .u-progress-text {
    margin-left: 10px;
    width: 50px;
    color: rgba(0, 0, 0, 0.45);
    text-align: left;
    vertical-align: middle;
  }
}
</style>
