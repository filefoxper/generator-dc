[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/generator-dc.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/generator-dc

# 介绍

`generator-dc`是一个react快速搭建脚手架项目，该项目依赖于 [yeoman](https://yeoman.io/learning/index.html) 。
使用者可参考 API 生成一套可供快速开发的 react web 项目，甚至在此基础上按规则生成`react-router`路由。
该脚手架内部集成了一些相对有用的开发工具，可供选择，使用者可根据自身喜好直接修改这些工具。

# 声明

该项目确定使用`typescript`作为类型系统，在选择该工具之前请先做了解。

该项目具有一定的普遍性，但并非万能，所有脚手架生成的代码可直接修改。
另外根据项目作者喜好，脚手架为使用者提供类似 [use-agent-reducer](https://www.npmjs.com/package/use-agent-reducer) 
、[antd](https://www.npmjs.com/package/antd) 、[type-qs](https://www.npmjs.com/package/type-qs) 等便捷库，
使用者可自行参考这些库的文档，并使用它们。关于部分生成工具的使用说明，可参考生成项目不同目录下的 README.md 文件。

# 安装

一、安装 `yeoman`

```
npm install -g yo
```

二、安装 `generator-dc`

```
npm install -g generator-dc
```

# 使用

## 生成脚手架代码

输入命令

```
/path/my$ yo dc --git
```

按提示进行功能选择：

1. 请输入网页名称
2. 请输入编译目标路径（可以是相对路径，默认为 `../dist`）
3. 请选择路由history类型（目前只支持`h5`和`hash`两种单页模式）
4. 请选择测试模式:（该选择将直接影响后续使用的测试架构生成器的使用）
* 独立测试包 - 独立测试包会在当前项目的根目录下新建一个`test`目录，`test`目录下的测试文件路径和`src`目录下的真实路径相对相同。 
* 附属测试包 - 这个选择会直接在被测文件当前目录下简历同名的`*.test.ts(x)`文件。

命令： `yo dc`

参数：
1. --git: `generator-dc`的修改统一加入git
2. --skip-install: `generator-dc`在搭建完脚手架后不自动安装`package.json`中的内容

## 生成 react-router 路由

输入命令

```
// 生成 react-router 路由及相关目录
/path/my$ yo dc:route /myPage
// 生成 react-router 路由及相关目录，并指定当前路由为 index redirect 路由
/path/my$ yo dc:route /otherPage/subPage --redirect
```

生成目录：

```
+ src -
    ...
    + pages -
        + myPage -
            index.tsx       // 路由
            layout.tsx      // 页面渲染
            style.less      // less文件
        + otherPage -
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
```

生成路由访问:

myPage页面路由

```
http://[host]:[?port]/[?basename/]my-page
```
otherPage页面路由
```
http://[host]:[?port]/[?basename/]other-page

因为该路由的子路由 subPage 使用了 --redirect 参数，所以自动跳转至

http://[host]:[?port]/[?basename/]other-page/sub-page
```

命令：`dc:route [path]` path起点根目录为 `./src/pages`

参数：
1. --redirect: 指定当前路由为直接访问父路由时的默认转入子路由。
2. --snake-case: 选择蛇形路由模式

```
/path/my$ yo dc:route /myPage --snake-case
```

效果

```
http://[host]:[?port]/[?basename/]my_page
```

## 生成 agent-reducer 模型

输入命令

```
/path/my$ yo dc:agent /path/xxx
```

可用于生成 agent 模型，如：

```
/path/my$ yo dc:agent /pages/myPage
```

生成结构如下

```
+ src -
    ...
    + pages -
        + myPage -
            index.tsx       
            layout.tsx      
            model.ts        // agent-reducer 模型文件
            style.less      
            type.ts         // agent-reducer 模型类型文件
        + otherPage -
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
```

使用 --sharing 默认路径为 src/modules

```
/path/my$ yo dc:agent --sharing --name user
```

生成结构如下

```
+ src -
    ...
    + modules -
        + user -            // 共享 agent-reducer 模型名
            index.ts        // 共享 agent-reducer 模型文件
            type.ts         // 共享 agent-reducer 模型类型文件
    + pages -
        + myPage -
            index.tsx       
            layout.tsx      
            model.ts        
            style.less      
            type.ts         
        + otherPage -
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
```

命令：`dc:agent [?path]` path 起点根目录为 `./src`

参数：
1. --name: 指定 agent-reducer 模型名，在使用 `--sharing` 参数且未指定生成路径时，会影响模型包的目录名，否则只会影响模型的类名，默认为 `Module` 。
2. --sharing: 指定模型为共享模型，模型文件会导出 sharing 对象。
3. --weak-sharing: 指定模型为弱共享模型，模型文件会导出 weakSharing 对象。

关于 [agent-reducer](https://github.com/filefoxper/agent-reducer) 和 [use-agent-reducer](https://filefoxper.github.io/use-agent-reducer/#/zh/) 使用方式请参考相关包文档。

## 生成单元测试

输入命令

```
/path/my$ yo dc:test /path/xxx[?.ts|.tsx]
```

可用于生成指定路径目录或源码文件的测试脚本。

如：

```
/path/my$ yo dc:test /modules/user/index.ts
```

独立包配置结果：

```
+ src -
    ...
    + modules -
        + user -            
            index.ts        
            type.ts         
    + pages -
        + myPage -
            index.tsx       
            layout.tsx      
            model.ts        
            style.less      
            type.ts         
        + otherPage -
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
+ test -
    ...
    + modules -
        + user -
            index.test.ts       // 测试脚本
```

附属包配置结果：

```
+ src -
    ...
    + modules -
        + user -
            + __test__ -
                index.test.ts    // 测试脚本   
            index.ts        
            type.ts         
    + pages -
        + myPage -
            index.tsx       
            layout.tsx      
            model.ts        
            style.less      
            type.ts         
        + otherPage -
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
```

可输入包名，生成当前包文件测试脚本。

```
/path/my$ yo dc:test /pages/otherPage
```

独立包配置结果：

```
+ src -
    ...
    + modules -
        + user -            
            index.ts        
            type.ts         
    + pages -
        + myPage -
            index.tsx       
            layout.tsx      
            model.ts        
            style.less      
            type.ts         
        + otherPage -
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
+ test -
    ...
    + modules -
        + user -
            index.test.ts       
    + pages -
        + otherPage -
            index.test.tsx      // 测试脚本
            layout.test.tsx     // 测试脚本
```

附属包配置结果：

```
+ src -
    ...
    + modules -
        + user -
            + __test__ -
                index.test.ts       
            index.ts        
            type.ts         
    + pages -
        + myPage -
            index.tsx       
            layout.tsx      
            model.ts        
            style.less      
            type.ts         
        + otherPage -
            + __test__ -
                index.test.tsx      // 测试脚本
                layout.test.tsx     // 测试脚本
            index.tsx
            layout.tsx
            style.less
            + subPage -
                index.tsx
                layout.tsx
                style.less
```

命令：`dc:test [?path]` path 起点根目录为 `./src`

参数：（无）

## 设置

在配置结束后，允许重新配置部分选项，可通过该命令进行再配置

```
/path/my$ yo dc:setting
```

命令：`dc:setting`

参数：
1. --lock: 锁定项目配置
2. --unlock: 解锁项目配置
