axios 是一款相当不错的 ajax 请求工具，rest 则是为了让这款工具变得更加易懂易用。

为此我们做了一些改变，让配置变得更加简单，例如：

get 请求：

1. rest('/main-url') 创建ajax主路由根节点，当最终调用了 get post delete put 等方法后，会自动重置其他参数
2. path('/child-url') 指定ajax子路由
3. setRequestParams 以object的形式设置 url?search 中的 search 部分
4. get 调用的 http 方法为 GET

```typescript
const root = rest('/main-url');
const result= await root.path('/child-url').setRequestParams({id:1}).get();
```

post 请求：

1. rest('/main-url') 创建ajax主路由根节点，当最终调用了 get post delete put 等方法后，会自动重置其他参数
2. path('/child-url') 指定ajax子路由
3. setRequestParams 以object的形式设置 url?search 中的 search 部分
4. setRequestBody 以object的形式设置 url 的 payload 信息
5. post 调用的 http 方法为 POST

```typescript
const root = rest('/main-url');
const result= await root.path('/child-url').setRequestParams({id:1}).
setRequestBody({name:'name'}).post();
```

除了 Http 请求方法 get post put delete ，以及根路由 rest 外，其他设置可以随意调换位置。