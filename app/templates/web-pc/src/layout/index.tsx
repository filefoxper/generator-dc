import React, {memo, Suspense} from 'react';
import {initial} from "@/modules";
import css from './style.less';
import zh_CN from "antd/es/locale/zh_CN";
import {ConfigProvider} from "antd";

const App = React.lazy(async () => {
    const [AppComponent] = await Promise.all([
        import(/*app*/'./app'),
        initial()
    ]);
    return AppComponent;
});

const BlankApp = memo(() => {
    return (
        <div className={css.blank}>
            <span>
                正在加载基本数据...
            </span>
        </div>
    );
});

export default () => {
    return (
        <Suspense fallback={<BlankApp/>}>
            <ConfigProvider locale={zh_CN}>
                <App/>
            </ConfigProvider>
        </Suspense>
    );
};