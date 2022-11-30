<template>
  <div class="project-layout">
    <header class="project-header"></header>
    <nav class="project-nav">
      <el-button type="primary" size="small">导入JSON</el-button>
      <el-button type="primary" size="small">导入Options</el-button>
      <el-button type="success" size="small">生成JSON</el-button>
      <el-button type="success" size="small">生成Options</el-button>
      <el-button type="danger" size="small">生成组件</el-button>
      <el-button type="primary" size="small">保存</el-button>
    </nav>
    <main class="project-main">
      <aside class="left-aside">
        <div class="form-component">
          <h4>表单组件</h4>
          <div class="component-list">
            <div
              draggable
              @dragstart="dragStart"
              @dragend="dragEnd"
              v-for="item in typeList"
              :key="item.type"
              class="component-type"
              :data-type="item.type"
            >
              <i :class="item.icon"></i>
              <p class="type-name">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </aside>
      <section class="project-subject">
        <div class="subject-operate">
          <el-button size="mini" type="primary" round @click="perviewView"
            >预览</el-button
          >
          <el-button size="mini" type="danger" round @click="deleteView"
            >删除</el-button
          >
        </div>

        <div
          class="view-content"
          @drop="drog"
          @dragover="dragOver"
          @dragenter="dragenter"
          @dragleave="dragleave"
        >
          <Draggable
            class="draggable-viewlist"
            v-model="viewList"
            forceFallback="true"
            animation="500"
            dragClass="drag-item"
          >
            <div
              v-for="(item, index) in viewList"
              :data-index="index"
              :key="item.id"
              class="item-single"
            >
              <div v-if="hoverId === item.id" class="over-item"></div>
              <div
                class="type-input item-type"
                :class="{ 'select-item': selectId === item.id }"
                v-if="item.type === 'input'"
              >
                <!-- {{ item.id }} -->
                <div
                  @click="selectType(item.id, item)"
                  :id="item.id"
                  class="item-mask"
                ></div>
                <div
                  v-if="selectId === item.id"
                  class="move-icon"
                  title="拖拽移动"
                >
                  <i class="el-icon-sort"></i>
                </div>
                <div class="item-content">
                  <div class="content-title">
                    <span :style="{ float: formConfigure.position }">{{
                      item.title
                    }}</span>
                  </div>
                  <div class="content-component">
                    <el-input
                      v-model="item.vlaue"
                      :placeholder="item.placeholder"
                      :size="formConfigure.size"
                      :style="{ width: `${selectedType.width}px` }"
                      :show-word-limit="formConfigure.wordCount"
                      :maxlength="formConfigure.maxlength"
                      :minlength="formConfigure.minlength"
                    ></el-input>
                  </div>
                </div>
                <div v-if="selectId === item.id" class="content-operate">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    circle
                    @click="copyItem"
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                    @click="deleteItem"
                  ></el-button>
                </div>
              </div>
              <div
                class="type-select item-type"
                :class="{ 'select-item': selectId === item.id }"
                v-if="item.type === 'select'"
              >
                <!-- {{ item.id }} -->
                <div
                  @click="selectType(item.id, item)"
                  :id="item.id"
                  class="item-mask"
                ></div>
                <div
                  v-if="selectId === item.id"
                  class="move-icon"
                  title="拖拽移动"
                >
                  <i class="el-icon-sort"></i>
                </div>
                <div class="item-content">
                  <div class="content-title">
                    <span :style="{ float: formConfigure.position }"
                      >下拉框</span
                    >
                  </div>
                  <div class="content-component">
                    <el-select
                      v-model="item.value"
                      :placeholder="item.placeholder"
                    >
                    </el-select>
                  </div>
                </div>
                <div v-if="selectId === item.id" class="content-operate">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </div>
              </div>
              <div
                class="type-switch item-type"
                :class="{ 'select-item': selectId === item.id }"
                v-if="item.type === 'switch'"
              >
                <!-- {{ item.id }} -->
                <div
                  @click="selectType(item.id, item)"
                  :id="item.id"
                  class="item-mask"
                ></div>
                <div
                  v-if="selectId === item.id"
                  class="move-icon"
                  title="拖拽移动"
                >
                  <i class="el-icon-sort"></i>
                </div>
                <div class="item-content">
                  <div class="content-title">
                    <span :style="{ float: formConfigure.position }">开关</span>
                  </div>
                  <div class="content-component">
                    <el-switch
                      v-model="item.value"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                  </div>
                </div>
                <div v-if="selectId === item.id" class="content-operate">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </div>
              </div>
              <div
                class="type-radio item-type"
                :class="{ 'select-item': selectId === item.id }"
                v-if="item.type === 'radio'"
              >
                <div
                  @click="selectType(item.id, item)"
                  :id="item.id"
                  class="item-mask"
                ></div>
                <div
                  v-if="selectId === item.id"
                  class="move-icon"
                  title="拖拽移动"
                >
                  <i class="el-icon-sort"></i>
                </div>
                <div class="item-content">
                  <div class="content-title">
                    <span :style="{ float: formConfigure.position }"
                      >单选框</span
                    >
                  </div>
                  <div class="content-component">
                    <el-radio v-model="item.value" label="1">选项一</el-radio>
                    <el-radio v-model="item.value" label="2">选项二</el-radio>
                  </div>
                </div>
                <div v-if="selectId === item.id" class="content-operate">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </div>
              </div>
              <div
                class="type-date item-type"
                :class="{ 'select-item': selectId === item.id }"
                v-if="item.type === 'date'"
              >
                <!-- {{ item.id }} -->
                <div
                  @click="selectType(item.id, item)"
                  :id="item.id"
                  class="item-mask"
                ></div>
                <div
                  v-if="selectId === item.id"
                  class="move-icon"
                  title="拖拽移动"
                >
                  <i class="el-icon-sort"></i>
                </div>
                <div class="item-content">
                  <div class="content-title">
                    <span :style="{ float: formConfigure.position }"
                      >日期选择器</span
                    >
                  </div>
                  <div class="content-component">
                    <el-date-picker
                      v-model="item.value"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </div>
                </div>
                <div v-if="selectId === item.id" class="content-operate">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </div>
              </div>
              <div
                class="type-color item-type"
                :class="{ 'select-item': selectId === item.id }"
                v-if="item.type === 'color'"
              >
                <div
                  @click="selectType(item.id, item)"
                  :id="item.id"
                  class="item-mask"
                ></div>
                <div
                  v-if="selectId === item.id"
                  class="move-icon"
                  title="拖拽移动"
                >
                  <i class="el-icon-sort"></i>
                </div>
                <div class="item-content">
                  <div class="content-title">
                    <span :style="{ float: formConfigure.position }"
                      >颜色选择器</span
                    >
                  </div>
                  <div class="content-component">
                    <el-color-picker
                      v-model="item.value"
                      show-alpha
                    ></el-color-picker>
                  </div>
                </div>
                <div v-if="selectId === item.id" class="content-operate">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </div>
              </div>
            </div>
            <div
              v-if="viewList.length && !hoverId && enterFlag"
              class="over-item"
            ></div>
          </Draggable>
        </div>
      </section>
      <aside class="right-aside">
        <section class="config-title">
          <div
            v-if="selectId"
            class="component-title"
            :class="{ 'active-config': activeName === 'component' }"
            @click="handleClick('component')"
          >
            组件配置
          </div>
          <div
            class="form-title"
            :class="{ 'active-config': activeName === 'form' }"
            @click="handleClick('form')"
          >
            表单配置
          </div>
        </section>
        <section v-if="activeName === 'component'" class="component-config">
          <div v-if="selectedType.type === 'input'">
            <div class="basic-config">
              <el-divider>基础配置</el-divider>
              <p>字段ID</p>
              <p><el-input v-model="selectedType.id"></el-input></p>
              <p>字段名称</p>
              <p><el-input v-model="selectedType.title"></el-input></p>
              <p>提示信息</p>
              <p><el-input v-model="selectedType.info"></el-input></p>
              <p>输入框宽度</p>
              <p><el-input v-model="selectedType.width"></el-input></p>
            </div>
            <div class="attribute-config">
              <el-divider>属性配置</el-divider>
              <p>是否必填</p>
              <p>
                <el-switch
                  v-model="selectedType.switch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </p>
              <p>类型</p>
              <p>
                <el-select v-model="selectedType.mode" placeholder="请选择">
                  <el-option
                    v-for="sub in selectedType.options"
                    :key="sub.value"
                    :label="sub.label"
                    :value="sub.value"
                  >
                  </el-option>
                </el-select>
              </p>
              <p>最大输入长度</p>
              <p>
                <el-input
                  size="mini"
                  v-model="selectedType.maxlength"
                  class="input-with-select"
                  ><el-button
                    slot="prepend"
                    icon="el-icon-minus"
                    @click="minusMaxlength"
                  ></el-button>
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="plusMaxlength"
                  ></el-button>
                </el-input>
              </p>
              <p>最小输入长度</p>
              <p>
                <el-input
                  disabled
                  size="mini"
                  v-model="selectedType.minlength"
                  class="input-with-select"
                  ><el-button slot="prepend" icon="el-icon-minus"></el-button>
                  <el-button slot="append" icon="el-icon-plus"></el-button>
                </el-input>
              </p>
              <p>是否显示输入字数统计</p>
              <p>
                <el-switch
                  v-model="selectedType.wordCount"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </p>
            </div>
            <div class="validation-rules">
              <el-divider>验证规则</el-divider>
            </div>
          </div>
        </section>
        <section v-if="activeName === 'form'" class="form-config">
          <div class="form-id">
            <p class="formconfig-title">表单ID</p>
            <p>{{ formConfigure.formId }}</p>
          </div>
          <div class="form-tag">
            <p class="formconfig-title">标签位置</p>
            <p>
              <el-radio-group v-model="formConfigure.position">
                <el-radio label="left">左侧</el-radio>
                <el-radio label="right">右侧</el-radio>
              </el-radio-group>
            </p>
          </div>
          <div class="form-size">
            <p class="formconfig-title">表单尺寸</p>
            <p>
              <el-radio-group v-model="formConfigure.size">
                <el-radio label="medium">medium</el-radio>
                <el-radio label="small">small</el-radio>
                <el-radio label="mini">mini</el-radio>
              </el-radio-group>
            </p>
          </div>
          <div class="form-width">
            <p class="formconfig-title">表单宽度</p>
            <p>
              <el-input
                v-model="formConfigure.width"
                size="mini"
                type="number"
              ></el-input>
            </p>
          </div>
        </section>
      </aside>
    </main>
    <el-dialog title="表单预览" :visible.sync="dialogVisible" width="50%">
      <div class="form-main">
        <div class="form-item" v-for="item in viewList" :key="item.id">
          <div v-if="item.type === 'input'">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.info"
              placement="bottom"
            >
              <i v-if="item.info" class="el-icon-info"></i>
            </el-tooltip>

            <span>{{ item.title }}</span
            ><el-input style="width: 300px" v-model="item.vlaue"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
export default {
  name: "",
  components: { Draggable },
  data() {
    return {
      type: "",
      typeList: [
        {
          name: "输入框",
          type: "input",
          icon: "el-icon-edit",
        },
        {
          name: "下拉框",
          type: "select",
          icon: "el-icon-document-checked",
        },
        {
          name: "开关",
          type: "switch",
          icon: "el-icon-open",
        },
        {
          name: "单选框",
          type: "radio",
          icon: "el-icon-aim",
        },
        {
          name: "日期选择器",
          type: "date",
          icon: "el-icon-date",
        },
        {
          name: "颜色选择器",
          type: "color",
          icon: "el-icon-help",
        },
      ],
      viewList: [],
      componentConfigure: "",
      formConfigure: {
        formId: "",
        position: "left",
        size: "small",
        width: "",
      },
      selectId: "",
      hoverId: "",
      enterFlag: false,
      activeName: "form",
      selectedType: "",
      dialogVisible: false,
    };
  },
  created() {
    this.formConfigure.formId = Date.now();
  },
  methods: {
    // 拖拽类型
    dragStart(e) {
      this.type = e.target.dataset.type;
      console.log(this.type);
    },
    // 结束拖拽
    dragEnd() {
      console.log("结束拖拽");
      this.type = "";
      this.hoverId = "";
      this.enterFlag = false;
    },
    // 已放置到指定位置
    drog(e) {
      console.log("drop：当元素放下到drop元素触发，作用于目标元素");
      if (!this.type) {
        // 内容拖拽
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      let targetObj = "";

      switch (this.type) {
        case "input":
          targetObj = {
            id: Date.now(),
            type: "input",
            value: "",
            placeholder: "请输入内容",
            title: "输入框",
            info: "",
            width: 200,
            switch: false,
            mode: "",
            options: [
              { value: "text", label: "text" },
              { value: "textarea", label: "textarea" },
              { value: "number", label: "number" },
              { value: "password", label: "password" },
            ],
            wordCount: false,
            maxlength: "",
            minlength: "",
          };
          break;
        case "select":
          targetObj = {
            id: Date.now(),
            type: "select",
            value: "",
            placeholder: "",
          };
          break;
        case "switch":
          targetObj = { id: Date.now(), type: "switch", value: true };
          break;
        case "radio":
          targetObj = { id: Date.now(), type: "radio", value: "1" };
          break;
        case "date":
          targetObj = { id: Date.now(), type: "date", value: "" };
          break;
        case "color":
          targetObj = { id: Date.now(), type: "color", value: "" };
          break;
        default:
          break;
      }
      if (this.viewList.length) {
        let targetIndex = 0;
        this.viewList.map((el, index) => {
          if (this.hoverId === parseInt(el.id)) {
            targetIndex = index;
          }
        });
        this.viewList.splice(targetIndex, 0, targetObj);
      } else {
        this.viewList.push(targetObj);
      }
      // this.dragEnd();
    },
    // 移动中
    dragOver(e) {
      // console.log(this.viewList.length, e.target.className);
      if (!this.type) {
        // 内容拖拽
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (this.viewList.length && e.target.className === "item-mask") {
        this.hoverId = parseInt(e.target.id);
        // console.log(e, e.target.id, this.hoverId);
      } else {
        this.hoverId = "";
      }
    },
    selectType(id, item) {
      console.log(item);
      this.selectId = id;
      this.activeName = "component";
      this.selectedType = item;
    },
    dragenter() {
      this.enterFlag = true;
    },
    dragleave() {
      this.enterFlag = false;
    },
    handleClick(tab) {
      console.log(tab);
      this.activeName = tab;
    },
    perviewView() {
      this.dialogVisible = true;
    },
    deleteView() {
      this.viewList = [];
      this.selectId = "";
      this.hoverId = "";
      this.enterFlag = false;
    },
    copyItem() {
      let targetItem = "";
      let targetIndex = "";
      this.viewList.forEach((item, index) => {
        if (item.id === this.selectId) {
          switch (item.type) {
            case "input":
              targetItem = {
                id: Date.now(),
                type: "input",
                value: "",
                placeholder: "请输入内容",
                title: "输入框",
                info: "",
                width: 200,
                switch: false,
                mode: "123",
                options: ["String,Array,Number,Integer"],
                wordCount: false,
                maxlength: "",
                minlength: "",
              };
              break;
            default:
              break;
          }
          targetIndex = index;
        }
      });
      this.viewList.splice(targetIndex + 1, 0, targetItem);
    },
    deleteItem() {
      let targetIndex = "";
      this.viewList.forEach((item, index) => {
        if (item.id === this.selectId) targetIndex = index;
      });
      this.viewList.splice(targetIndex, 1);
    },
    plusMaxlength() {
      console.log(123,this.selectType.maxlength);
      if (this.selectType.maxlength) {
        this.selectType.maxlength += 1;
      } else {
        this.selectType.maxlength = 1;
      }
      console.log(this.selectType.maxlength);
    },
    minusMaxlength() {
      console.log(456);
      if (this.selectType.maxlength) {
        this.selectType.maxlength -= 1;
      }
    },
  },
};
</script>

<style scoped lang="less">
.project-layout {
  .project-header {
    background-color: #282828;
    height: 35px;
    padding: 0 20px;
    position: relative;
    cursor: default;
  }
  .project-nav {
    height: 60px;
    margin: 0 20px;
    position: relative;
    display: flex;
    align-items: center;
    cursor: default;
    justify-content: flex-end;
  }
  .project-main {
    width: 100vw;
    height: calc(100vh - 96px);
    display: flex;
    border-top: 1px solid #eeeeee;
    .left-aside {
      width: 15%;
      overflow-y: auto;

      .form-component {
        .component-list {
          display: flex;
          flex-wrap: wrap;
          .component-type {
            width: 70px;
            height: 70px;
            border: 1px dashed skyblue;
            margin: 5px;
            cursor: move;
            padding-top: 20px;
            text-align: center;
            // user-select: none;
            p {
              font-size: 12px;
            }
            &:hover {
              color: white;
              background: #409eff;
            }
            .type-name {
              user-select: none;
            }
          }
        }
      }
    }
    .project-subject {
      width: 65%;
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
      background: #f5f6f8;
      .subject-operate {
        width: 96%;
        padding: 5px 22px;
        display: flex;
        justify-content: flex-end;
        background: #ffffff;
      }
      .view-content {
        width: 95%;
        height: calc(100vh - 170px);
        background: #ffffff;
        margin: 10px auto;
        position: relative;
        padding-top: 10px;
        overflow-y: auto;
        user-select: none;
        .over-item {
          width: 100%;
          height: 5px;
          background: #409eff;
          margin-bottom: 5px;
        }
        .draggable-viewlist {
          .item-single {
            .over-item {
              width: 100%;
              height: 5px;
              background: #409eff;
              margin-bottom: 5px;
            }
            .select-item {
              border: 1px solid #409eff !important;
            }
            .item-type {
              word-wrap: break-word;
              box-sizing: border-box;
              overflow: hidden;
              padding: 5px;
              position: relative;
              word-break: break-all;
              margin-bottom: 10px;
              min-height: 40px;
              border: 1px dashed #2e73ff;
              .item-mask {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background: transparent;
                z-index: 10;
              }
              .move-icon {
                position: absolute;
                top: 1px;
                left: 1px;
                background: #2e73ff;
                color: #ffffff;
                font-size: 20px;
                cursor: move;
                z-index: 11;
              }
              .item-content {
                display: flex;
                .content-title {
                  width: 80px;
                  line-height: 40px;
                  margin-left: 30px;
                  margin-right: 30px;
                }
                .content-component {
                  line-height: 40px;
                }
              }
            }
            .content-operate {
              position: absolute;
              bottom: 1px;
              right: 1px;
              z-index: 111;
            }
          }
        }
        .choose-item {
          border: 1px solid #409eff !important;
        }
        .drag-item {
          border: 1px solid #67c23a !important;
        }
      }
    }
    .right-aside {
      width: 20%;
      overflow-y: auto;
      .config-title {
        width: 100%;
        height: 50px;
        display: flex;
        .component-title {
          flex: 1;
          line-height: 50px;
          text-align: center;
          font-weight: bold;
          cursor: pointer;
        }
        .form-title {
          flex: 1;
          line-height: 50px;
          text-align: center;
          font-weight: bold;
          cursor: pointer;
        }
        .active-config {
          color: #2e73ff;
          border-bottom: 2px solid #2e73ff;
        }
      }
      .component-config {
        padding: 5px 10px;
      }
      .form-config {
        padding: 5px 10px;
        .formconfig-title {
          font-weight: bold;
        }
      }
    }
  }
}
</style>