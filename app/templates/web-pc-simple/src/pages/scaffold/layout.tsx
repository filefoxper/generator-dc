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
      <h1>脚手架简易说明</h1>
      <h2> 生成脚手架代码</h2>
      <div>输入命令</div>

      <div>/path/my$ yo dc --git</div>

      <div>按提示进行功能选择：</div>

      <div>1. 请输入网页名称</div>
      <div>2. 请输入编译目标路径（可以是相对路径，默认为 `../dist`）</div>
      <div>3. 请选择路由history类型（目前只支持`h5`和`hash`两种单页模式）</div>
      <div>
        4. 请选择测试模式:（该选择将直接影响后续使用的测试架构生成器的使用）
      </div>
      <div>
        * 独立测试包 -
        独立测试包会在当前项目的根目录下新建一个`test`目录，`test`目录下的测试文件路径和`src`目录下的真实路径相对相同。
      </div>
      <div>
        * 附属测试包 -
        这个选择会直接在被测文件当前目录下简历同名的`*.test.ts(x)`文件。
      </div>

      <div>命令： `yo dc`</div>

      <div>参数：</div>
      <div>1. --git: `generator-dc`的修改统一加入git</div>
      <div>
        2. --skip-install:
        `generator-dc`在搭建完脚手架后不自动安装`package.json`中的内容
      </div>

      <h2>生成 react-router 路由</h2>

      <div>命令：`dc:route [path]` path起点根目录为 `./src/pages`</div>

      <div>参数：</div>
      <div>1. --redirect: 指定当前路由为直接访问父路由时的默认转入子路由。</div>
      <div>2. --snake-case: 选择蛇形路由模式</div>
      <div>3. --force: 强制重写（对layout影响会比较大）</div>

      <h2> 生成 agent-reducer 模型</h2>

      <div>命令：`dc:agent [?path]` path 起点根目录为 `./src`</div>

      <div>参数：</div>
      <div>
        1. --name: 指定 agent-reducer 模型名，在使用 `--sharing`
        参数且未指定生成路径时，会影响模型包的目录名，否则只会影响模型的类名，默认为
        `Module` 。
      </div>
      <div>2. --sharing: 指定模型为共享模型，模型文件会导出 sharing 对象。</div>
      <div>
        3. --weak-sharing: 指定模型为弱共享模型，模型文件会导出 weakSharing
        对象。
      </div>

      <div>
        关于{' '}
        <a href="https://github.com/filefoxper/agent-reducer" target="_blank">
          agent-reducer
        </a>{' '}
        和
        <a
          href="https://filefoxper.github.io/use-agent-reducer/#/zh/"
          target="_blank"
        >
          use-agent-reducer
        </a>{' '}
        使用方式请参考相关包文档。
      </div>

      <h2> 生成单元测试</h2>

      <div>命令：`dc:test [?path]` path 起点根目录为 `./src`</div>
      <div>参数：（无）</div>

      <h2>设置</h2>

      <div>在配置结束后，允许重新配置部分选项，可通过该命令进行再配置</div>

      <div>命令：`dc:setting`</div>
      <div>参数：</div>
      <div>1. --lock: 锁定项目配置</div>
      <div>2. --unlock: 解锁项目配置</div>
    </div>
  );
});
