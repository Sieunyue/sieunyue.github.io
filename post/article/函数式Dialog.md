--- 
title: 函数式Dialog
author: Sieunyue
date: 2023-03-14
description: Dialog对话框组件几乎是每个前端项目必不可少的组件，通常是在保留当前页面状态并屏蔽其他用户输入的情况下，与用户交互并承载相关操作
tags: 
- Vue3
- ElementPlus
--- 

# 函数式Dialog
Dialog对话框组件几乎是每个前端项目必不可少的组件，通常是在保留当前页面状态并屏蔽其他用户输入的情况下，与用户交互并承载相关操作。
常用UI框架提供的Dialog示例的使用方法都是把Dialog写在`<Template>`中，每次使用Dialog组件都要提供一个用于显示隐藏的变量`visible`并手动控制，当弹窗组件比较多的情况下，会写大量的`visible`变量，使用起来非常麻烦。还有一种方式是把弹窗和其内容(如：表单、表格等等)封装到同一个vue文件中，对外暴露一个`open`和`close`的函数，通过refs来调用该函数来显示隐藏。这也要书写许多refs变量，而且这种方式会把表单和弹窗耦合在一起，如果其他地方需要相同的表单但又不需要弹窗，这个方法就不具备复用条件。如果能像MessageBox一样函数式来显示弹窗，只需要传入弹窗内容，就很方便使用，通过查看MessageBox源码，发现了一种通过函数来实现弹窗的方式

## 前置知识
### h()
[h](https://cn.vuejs.org/api/render-function.html#h)函数用于创建虚拟节点(vnode)
```typescript
function h(
  type: string | Component,
  props?: object | null,
  children?: Children | Slot | Slots
): VNode
```
### render()
render函数用于将虚拟dom渲染到DOM中。
在Vue是无法使用原生的方式将组件当做普通DOM动态加入到其他的DOM中，通过render函数的第二个参数指定需要挂载DOM
```typescript
function render(
  vnode: VNode | null, 
  container: HostElement,
)
```

## 函数式弹窗实现
### 创建弹窗容器

第一步先要创建一个弹窗的容器`CommDialog`，提供一些公共属性配置和对外暴露显示和隐藏的函数

```javascript
<el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    align-center
    v-bind="$attrs"
    append-to-body
    destroy-on-close
    @closed="handleClosed">
      <slot />
      <template v-if="footer" #footer>
        <el-button @click="handleCancel"> 取消 </el-button>
        <el-button @click="handleSubmit"> 确定 </el-button>
      </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useDialog } from '@/hooks'
import { Ref, onMounted, provide } from 'vue'

interface CommDialogProps {
  title: string
  width?: string
}

const emit = defineEmits(['refresh', 'submit', 'closed', 'update:visible'])

const visible = ref<boolean>(false)

watch(visible, val => {
  emit('update:visible', val)
})


function open() {
  visible.value = true
}

function close() {
  visible.value = false
}


const props = withDefaults(defineProps<CommDialogProps>(), {
  width: undefined
})

onMounted(() => {
  open()
})

function handleCancel() {
  close()
}

async function handleSubmit() {
  emit('submit')
  close()
}

function handleClosed() {

  emit('closed')
}


defineExpose({
  open,
  close
})

provide(commDialogKey, {
  open,
  close
})
<script>
```
### 实现弹窗函数
主要思路是动态创建虚拟dom节点，将对话框组件渲染到组件上，核心关键点是要***动态创建的节点的上下文为当前app上下文***，否则会找不到全局注册的组件和指令等

```typescript
export type Options<T> = T & {
  title: string
  width?: string
}

export async function createDialog<T extends Record<string, any>>(component: Component, options: Options<T['$props']>) {
    const { title, width,  ...componentProps } = options

    const node = h(
      CommDialog,
      {
        title: title,
        width: width,
        onClosed: () => {
          render(null, container)
        }
      },
      {
        default: () => [
          h(component as Component, {
            ...componentProps,
          })
        ]
      }
    )

    node.appContext = window.__v_app.$.appContext

    const container = document.createElement('div')

    render(node, container)

    if (container.firstElementChild) {
      document.body.appendChild(container.firstElementChild)
    }
}

```

### 使用
通过调用`createDialog`并传入弹窗的内容组件即可显示该弹窗，父组件无需控制对话框组件的`visible`属性 , 这样可以简化父组件操作，不在关心对话框组件在什么时间关闭，如果对话框组件需要访问网络，也在子组件中完成。
本例只是最基础的demo，实际使用中还需要考虑许多问题。




