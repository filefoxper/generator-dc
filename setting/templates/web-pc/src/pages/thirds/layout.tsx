import React, { memo, useCallback } from 'react';
import css from './style.less';
import { Button } from 'antd';
import { goBack } from '@/utils/history';

export default memo(() => {
  const handleBack = useCallback(() => {
    goBack();
  }, []);
  return (
    <div className={css.main}>
      <div className={css.header}>
        <Button onClick={handleBack}>返回</Button>
      </div>
      <h1>第三方库</h1>
      <div className={css.unit}>
        <div className={css.desc}>react：构建前端UI及数据流的工具项目</div>
        <div className={css.bottom}>
          <a href="https://reactjs.org/docs" target="_blank">
            官网
          </a>
          <a href="" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          react-router：构建react使用项目的路由地址
        </div>
        <div className={css.bottom}>
          <a
            href="https://reacttraining.com/react-router/web/guides/quick-start"
            target="_blank"
          >
            官网
          </a>
          <a href="" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          agent-reducer：以 reducer 的形式组织复杂数据流，其 class reducer
          扩展功能， 自成一派的 MiddleWare 系统，以及 decorator
          兼容做法，使得它在读写数据时比传统 reducer 更加自然。
          而其强大的可移植性使它更容易成为平台切换常用的利器。而其最令无数少男少女前端程序员痴狂的便是其模型数据可共享的特性，
          不同于redux的强制全量共享方式，agent-reducer
          支持的是强弱两种共享模式，而弱共享对页面级别的数据共享来说简直就是必备良药。
          如果心动了，还不赶紧点进 use-agent-reducer 官网 或 agent-reducer
          github 查看一番。
        </div>
        <div className={css.bottom}>
          <a href="https://github.com/filefoxper/agent-reducer" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          use-agent-reducer：agent-reducer 与 react hook 的结合器，得利于
          agent-reducer 的共享特性， 其数据共享模式并不需要 react context
          的支持，客官来一个呗。
        </div>
        <div className={css.bottom}>
          <a
            href="https://filefoxper.github.io/use-agent-reducer/#/"
            target="_blank"
          >
            官网
          </a>
          <a
            href="https://github.com/filefoxper/use-agent-reducer"
            target="_blank"
          >
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          type-qs：支持类型检查以及类型强转的 url search 解析工具
        </div>
        <div className={css.bottom}>
          <a href="https://github.com/filefoxper/type-qs" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          ant design：蚂蚁金服出品的 react ui 库，内置许多漂亮的ui组件，开箱即用
        </div>
        <div className={css.bottom}>
          <a href="https://ant.design/index-cn" target="_blank">
            官网
          </a>
          <a href="https://github.com/ant-design/ant-design" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          lodash：再也没有哪款数据处理工具有它这么经典强大的了，前端程序员的必备品无疑。
        </div>
        <div className={css.bottom}>
          <a href="https://lodash.com" target="_blank">
            官网
          </a>
          <a href="https://github.com/lodash/lodash" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>
          axios：目前最流行的ajax请求工具之一，也是当前项目被改造成更犀利的ajax工具的原料
        </div>
        <div className={css.bottom}>
          <a href="https://axios-http.com" target="_blank">
            官网
          </a>
          <a href="https://github.com/axios/axios" target="_blank">
            github
          </a>
        </div>
      </div>
      <div className={css.unit}>
        <div className={css.desc}>moment：一款强大的时间处理工具</div>
        <div className={css.bottom}>
          <a href="https://momentjs.com" target="_blank">
            官网
          </a>
          <a href="https://github.com/moment/moment" target="_blank">
            github
          </a>
        </div>
      </div>
    </div>
  );
});
