## 1. 创建项目

vue create  toutiao-mobile

选择手动配置：

1. babel				# 负责把 ES6 语法转化为 ES5 (babel-loader 负责让webpack认识babel，然后babel负责转换 ES6)
2. vue-router
3. vuex
4. css预编译器
5. lint检查

- 路由选择 hash 模式，不要选择历史模式，历史模式兼容性不好 (问题一：hash 模式与历史模式)		？