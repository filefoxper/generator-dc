import {useEffect} from 'react';
import {parse, Template} from "type-qs";
import {useLocation} from "react-router";

type DriverReturn = void | (() => void);

/**
 * url query改变通知
 *
 * @param callback  通知监听 listener ，入参为queryConfig配置解析的query object
 * @param queryConfig query解析器
 * @param comparatorOrDefaults 更新对比器
 * @param defaults  默认query object
 */
export function useQueryDriver<Q extends {}>(callback: (query: Q) => DriverReturn, queryConfig: Template, comparatorOrDefaults?: Q|Array<any>, defaults?: Q)
export function useQueryDriver<Q extends {}>(callback: (query: Q) => DriverReturn, queryConfig: Template, defaults?: Q) {

    const comparators = Array.isArray(arguments[2]) ? arguments[2] : undefined;

    const defaultQuery = !Array.isArray(arguments[2]) ? arguments[2] : arguments[3];

    const location = useLocation();

    const comparatorArray: Array<any> = comparators || [];

    useEffect(() => {
        const query = parse<Q>(location.search, {template: queryConfig, defaults: defaultQuery});
        callback(query as Q);
    }, [...comparatorArray, location]);

}
