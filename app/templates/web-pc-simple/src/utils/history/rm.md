与 react-router 共享的 url history 对象

通常，人们都喜欢直接使用 react-router 的 useHistory 在组件内获取 history 对象，
在 UI 中使用页面跳转很方便，但如果碰到需要在一段非 UI 组件的业务代码中进行跳转，就不是那么容易了。
因此我们将 history 对象做了简单包装，在确保 react-router 可以拿到和我们平时使用相同的 history 对象的情况下，
我们可以直接调用 push, replace, go, goBack 等常用方法。

因为高版本的 history 不再支持 query object 接口，而需要使用者通过使用 qs.stringify 等手法来重现之前的接口功能。
这里我们在 push, replace 接口中重新添加了该参数入口。同时我们还添加了诸如：changeQuery, assignQuery 这样的接口，
让使用者可以简单修改当前页面的 search 参数。具体可参考 history/index.ts 内部注释。