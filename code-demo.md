## 1. 创建项目

vue create  toutiao-mobile

选择手动配置：

1. babel				# 负责把 ES6 语法转化为 ES5 (babel-loader 负责让webpack认识babel，然后babel负责转换 ES6)
2. vue-router
3. vuex
4. css预编译器
5. lint检查

- 路由选择 hash 模式，不要选择历史模式，历史模式兼容性不好 (问题一：hash 模式与历史模式)		？

## 2. 移动端 rem 适配

- postcss-pxtorem 是一款 postcss 插件，用于将单位转换为 rem
- lib-flexible 用于设置 rem 基准值

1. 使用 lib-flexible 动态设置 rem 基准值 (html 标签的字体大小)

   安装依赖：

   ```shell
   # yarn add amfe-flexible -S
   npm i amfe-flexible -S
   ```

   然后在 main.js 中加载执行该模块：

   ```shell
   import 'amfe-flexible'
   ```

   最后测试：在浏览器中切换不同的手机设备尺寸，观察 html 标签 font-size 的变化

2. 使用 postcss-pxtorem 将 px 转为 rem

   安装依赖：

   ```shell
   # yarn add -D postcss-pxtorem
   npm install postcss-pxtorem -D
   ```

   然后在项目根目录中创建 postcss.config.js 文件

   ```javascript
   module.exports = {
       plugins: {
           'autoprefixer': {
               browsers: ['Android >= 4.0', 'iOS >= 8']
           },
           'postcss-pxtorem': {
               rootValue: 37.5,
               propList: ['*']
           }
       }
   }
   ```

   配置完毕，重新启动服务

   最后测试：刷新页面，审查元素样式查看是否已将 px 转换为 rem

## 3. 配置路由页面

| 路径                | 页面                       | 备注             |
| ------------------- | -------------------------- | ---------------- |
| /login              | views/login/index.vue      | 登录页面         |
| /                   | views/layout/index.vue     | 布局组件         |
| /                   | views/home/index.vue       | 首页，默认子路由 |
| /qa                 | views/qa/index.vue         | 问答页面         |
| /video              | views/video/index.vue      | 视频页面         |
| /my                 | views/my/index.vue         | 我的页面         |
| /search             | views/search/index.vue     | 文章搜索         |
| /article/:articleId | views/article/index.vue    | 文章详情         |
| /my/profile         | views/my-profile/index.vue | 我的资料         |
| /user/chat          | views/user-chat/index.vue  | 小智同学         |
| /user/:userId       | views/user/index.vue       | 用户页面         |

问题二：路由懒加载																									？

问题三：@																													？

```javascript
{
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  }
```

## 4. 封装请求模块

使用 axios 作为此次项目的请求库，为了方便，我们把它封装为一个请求模块，在需要的时候直接加载即可

安装 axios：

```shell
npm i axios -S
```

创建 src/utils/request.js：

```javascript
// 封装 axios 请求模块
import axios from "axios"

const request = axios.create({
    baseUrl: "http://ttapi.research.itcast.cn"
})

export default request
```

哪里使用，哪里加载：

```javascript
import request from '@/utils/request'

request({
    method: 'xxx',
    url: 'xxx'
    ...
})
```

## 5. 登录注册

### 5.1 页面布局

**结构**

这里主要使用到三个 Vant 组件：

- NavBar 导航栏
- Form 表单
  - Field 输入框
  - Button 按钮

一个经验：使用组件库中现有的组件快速布局，再慢慢调整细节，效率更高

**样式**

写样式的原则：将公共样式写到全局 (src/styles/index.less) ，将局部样式写到组件内部

**验证码处理**

点击发送验证码：

1. 先验证手机号
2. 然后发送短信
3. 请求期间禁止按钮点击
4. 处理倒计时

**处理 Token**

第一次登陆成功会拿到 Token，为了能在其他模块中获取到 Token 数据，我们需要把它存储到一个公共的位置，方便随时取用

- 本地存储（不推荐）
  - 获取麻烦
  - 数据不是响应式的
- Vuex 容器（推荐）
  - 获取方便
  - 响应式的

但 Vuex 中的数据一刷新就没了，持久化需要用到 localStorage