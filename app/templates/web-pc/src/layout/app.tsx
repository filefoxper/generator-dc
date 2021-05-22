import React, {memo} from "react";
import zh_CN from "antd/es/locale/zh_CN";
import {ConfigProvider} from "antd";
import PageRoutes from '@/pages';
import {instanceBy} from "@/utils/history";
import {Router} from "react-router";

const historyMode = process.env.history;

export default memo(() => {
    return (
        <ConfigProvider locale={zh_CN}>
            <Router history={instanceBy({mode: historyMode as 'h5' | 'hash'})}>
                {/*添加app header*/}
                <PageRoutes/>
                {/*添加app footer*/}
            </Router>
        </ConfigProvider>
    );
});