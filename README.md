项目未使用React框架开发。  
![](https://user-gold-cdn.xitu.io/2018/10/21/16695b5e1c0d2d87?w=625&h=1031&f=png&s=69828)
1. devSrc:js开发原文件ES6开发
2. buildSrc/js:js通过babel编译的文件，供最后打包crx使用
3. buildSrc/image 插件中的图片文件
4. buildSrc/mdl 谷歌的material desigin lite UI框架，实现material设计。
5. buildSrc/style scss源文件已经编译出的css文件。
6. buildSrc/icon.png插件的图标
7. buildSrc/mainifest.json 谷歌插件的主配置。
8. buildSrc/popup.html浏览器右上角点击弹出的插件弹窗
9. buildSrc/popup_login.html未登录时点击出来的弹窗
10. buildSrc/guide.html 插件安装用户引导页面
11. buildSrc/console.html 点击密码管理进入的控制台页面
12. crx 最终打包出来的插件
### 打包方法
通过grunt来打包crx文件  
配置文件Gruntfile.js,配置文件中三个任务流
```
grunt.registerTask('default', ['watch']);
grunt.registerTask('esTask', ['browserify']);
grunt.registerTask('crxTask', ['crx']);
```
第一个默认任务编译ES6并监听文件变化自动编译
第二个编译ES6
第三个打包生成crx。  
#### 运行命令
default: ```grunt```   
esTask: ```grunt esTask```   
crxTask: ```grunt crxTask```
### 对接I1登陆
在未登录时先配置登陆的I1域名，然后点击登陆通过打开iframe设置iframe的地址为i1的登陆地址，在iframe中登陆成功后，通过插件注入到iframe中的content.js来通知插件登陆成功然后保存登录状态。

### 密码插件的实现
通过对页面注入content.js来实现添加密码提示框。 

![](https://user-gold-cdn.xitu.io/2018/10/21/16695c3f2293cd4e?w=1012&h=1001&f=png&s=61478)   
1. 先通过```findInput()```方法来找到页面中的input[type='password']和input[type='text']的输入框，两者同时存在才开启密码插件。如果有一个password多个text则取第一个text。 
2. 获取输入框后执行```addFillIcon()```来添加输入框右侧的图标。
3. 点击图标后通过域名去获取当前网站是否存在保存的用户名密码显示在列表中。
4. 点击列表中的用户名将用户名密码填充到输入框中。
#### 注意事项
1. 填充输入框后使用```fireOnchange()```函数来生成一个输入框的change方法，来模拟真实的用户操作，避免输入框处于错误状态时填入用户名密码 表单验证不通过。
2. 对应单页应用这种页面需要时事检测页面的变化来获取是否存在input框。通过```MutationObserver```来实现，MutationObserver对象可以检测到页面中的dom的任何变化。这个事件触发比较频繁，需要设置节流函数来保证性能。