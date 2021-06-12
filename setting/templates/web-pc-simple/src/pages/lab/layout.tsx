import React, { memo, useCallback } from 'react';
import { Button } from 'antd';
import { useAgentMethods } from 'use-agent-reducer';
import { pageSwitchRef } from '@/modules/pageSwitch';
import css from './style.less';

export default memo(() => {
  const { switchTo } = useAgentMethods(pageSwitchRef.current);
  const handleBack = useCallback(() => {
    switchTo('home');
  }, []);
  return (
    <div className={css.main}>
      <div className={css.header}>
        <Button onClick={handleBack}>返回</Button>
      </div>
      <h1>DC 实验室</h1>
      <div className={css.unit}>
        <div className={css.desc}>
          <div>history：与 react-router 共享的 url history 对象</div>
          <div>
            通常，人们都喜欢直接使用 react-router 的 useHistory 在组件内获取
            history 对象， 在 UI 中使用页面跳转很方便，但如果碰到需要在一段非 UI
            组件的业务代码中进行跳转，就不是那么容易了。 因此我们将 history
            对象做了简单包装，在确保 react-router 可以拿到和我们平时使用相同的
            history 对象的情况下， 我们可以直接调用 push, replace, go, goBack
            等常用方法。
          </div>
          <div>
            因为高版本的 history 不再支持 query object
            接口，而需要使用者通过使用 qs.stringify 等手法来重现之前的接口功能。
            这里我们在 push, replace
            接口中重新添加了该参数入口。同时我们还添加了诸如：changeQuery,
            assignQuery 这样的接口， 让使用者可以简单修改当前页面的 search
            参数。具体可参考 history/index.ts 内部注释。
          </div>
        </div>
        <div className={css.bottom}>
          <div>用法1 ：</div>
          <div className={css.desc}>
            <div>{"import {push} from '@/utils/history'"}</div>
            <div>{"push('/lab',{id:1})"}</div>
          </div>
          <div>效果</div>
          <div className={css.desc}>url: http://localhost:8080/lab?id=1</div>
          <div className={css.mp}>
            用法2 ：（假设当前 url 为：http://localhost:8080/lab）
          </div>
          <div className={css.desc}>
            <div>{"import {changeQuery} from '@/utils/history'"}</div>
            <div>{'changeQuery({id:1})'}</div>
          </div>
          <div>效果</div>
          <div className={css.desc}>url: http://localhost:8080/lab?id=1</div>
          <div className={css.mp}>
            用法3 ：（假设当前 url 为：http://localhost:8080/lab?id=1）
          </div>
          <div className={css.desc}>
            <div>{"import {assignQuery} from '@/utils/history'"}</div>
            <div>{"assignQuery({name:'wangyi'})"}</div>
          </div>
          <div>效果</div>
          <div className={css.desc}>
            url: http://localhost:8080/lab?id=1&name=wangyi
          </div>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          <div>
            rest：axios 是一款相当不错的 ajax 请求工具，rest
            则是为了让这款工具变得更加易懂易用。
          </div>
          <div>
            为此我们采用了链式的设计规则，让 ajax 请求不再如此神秘。 除了 Http
            请求方法 get post put delete ，以及根路由 rest
            外，其他设置可以随意调换位置。
          </div>
          <div>
            <div>
              1. rest('/main-url') 创建 ajax 主路由根节点，当最终调用了 get post
              delete put 等方法后，会自动重置其他参数
            </div>
            <div>2. path('/child-url') 指定 ajax 子路由</div>
            <div>
              3. setRequestParams(object) 以 object 的形式设置 url?search 中的
              search 部分
            </div>
            <div>
              4. setRequestBody(any) 以 object 的形式设置 url 的 payload 信息
            </div>
            <div>
              5. post 调用的 http 方法为 POST, get 调用的 http 方法为 GET,
              delete 调用的 http 方法为 DELETE, put 调用的 http 方法为 PUT
            </div>
          </div>
        </div>
        <div className={css.bottom}>
          <div>GET 用法 ：</div>
          <div className={css.desc}>
            <div>{"import {rest} from '@/utils/rest'"}</div>
            <div>
              {
                "rest('main-url').path('child-url').setRequestParams({id:1}).get()"
              }
            </div>
          </div>
          <div>效果</div>
          <div className={css.desc}>
            访问: GET http://localhost:8080/main-url/child-url?id=1
          </div>
          <div className={css.mp}>POST 用法 ：</div>
          <div className={css.desc}>
            <div>{"import {rest} from '@/utils/rest'"}</div>
            <div>
              {
                "rest('main-url').path('child-url').setRequestBody({id:1}).post()"
              }
            </div>
          </div>
          <div>效果</div>
          <div className={css.desc}>
            {
              '访问: POST http://localhost:8080/main-url/child-url [payload:{id:1}]'
            }
          </div>
        </div>
      </div>
    </div>
  );
});
