# cmd 启动 Android AVD Manager

- (首先你得配置了一个 avd 实例 (通过 Android Studio))
- 前往 Android sdk 工具目录, 如: `%HOME_DIR%/AppData/Local/Android/sdk/tools`
- 找出你得 avd 实例: `$ android.bat list avd`, 拷贝要启动的 avd 名称
- 启动 avd: `$ emulator.exe -avd <avd_name>`

# 记录

### 截图尺寸与代码尺寸的对应

- 汉字: 2:1
- 数字: 1.5:1 (即数字的实际占据尺寸是指定尺寸的3/4)

# 问题

### Hot Reloading 不生效

奇怪的原因, 仅当组件继承的父类代码变量名为 `Component` 或 `React.Component` 时才会生效, 否则 Hot Loading 就会失效.

猜测原因是 Hot Reloading 针对组件的实现依赖于代码静态分析, 参见 [React Hot Reloading 实现](https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html).
