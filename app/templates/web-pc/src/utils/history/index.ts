import {createBrowserHistory, createHashHistory, parsePath} from 'history';
import {stringify, parse} from "./locationQs";

let history;

let basename = '';

function getPathnameFromUrl() {
  return history.location.pathname;
}

function getQueryFromUrl() {
  let search = history.location.search || '?';
  return parse(search.slice(1));
}

/**
 * h5页面跳转方法
 *
 * @param pathname 除去basename的路径
 * @param query （可选）url参数 ?后的参数的object表示，如：?name=wangyi&id=2表示为{name:'wangyi',id:2}
 *
 * 例子：
 * 当前url:http://localhost:8080/entry/list?name=wangyi&id=2
 *
 * push('/entry/edit')或push('/entry/edit',{});
 *
 * 改变url:http://localhost:8080/entry/edit
 *
 * push('/entry/edit',{id:2,name:'wangyi'});
 *
 * 改变url:http://localhost:8080/entry/edit?id=2&name=wangyi
 *
 * 继续
 * push('/entry/edit',{id:2});
 *
 * 改变url:http://localhost:8080/entry/edit?id=2
 */
export function push(pathname: string, query?: any) {
  return history.push(pathname + stringify(query));
}

/**
 * 以assign的形式改变h5页面当前url的参数
 *
 * @param query （可选）url参数 ?后的参数的object表示，如：?name=wangyi&id=2表示为{name:'wangyi',id:2}
 *
 * 例子：
 * 当前url:http://localhost:8080/entry/list?name=wangyi&id=2
 *
 * assignQuery({name:'gaga'});
 *
 * 改变url:http://localhost:8080/entry/list?name=gaga&id=2
 *
 * assignQuery({name:'zidan',role:'master'});
 *
 * 改变url:http://localhost:8080/entry/list?name=zidan&id=2&role=master
 */
export function assignQuery(query?: any) {
  let urlQuery = getQueryFromUrl();
  return push(getPathnameFromUrl(), Object.assign({}, urlQuery, query || {}));
}

/**
 * 以整体替换的形式改变h5页面当前url的参数
 *
 * @param query （可选）url参数 ?后的参数的object表示，如：?name=wangyi&id=2表示为{name:'wangyi',id:2}
 *
 * 例子：
 * 当前url:http://localhost:8080/entry/list?name=wangyi&id=2
 *
 * changeQuery({name:'wangyi'});
 *
 * 改变url:http://localhost:8080/entry/list?name=wangyi
 *
 * assignQuery({name:'zidan',id:2,role:'master'});
 *
 * 改变url:http://localhost:8080/entry/list?name=zidan&id=2&role=master
 */
export function changeQuery(query?: any) {
  return push(getPathnameFromUrl(), query);
}

/**
 * 替换当前url在url history栈中的位置，被替换的链接指针不能被go/goBack/浏览器回退/goForward等历史访问方法访问
 *
 * @param pathname  同@push
 * @param query 同@push
 *
 * 例子：
 * 之前url:http://localhost:8080/entry/list
 *
 * changeQuery({name:'wangyi'});
 *
 * 改变url:http://localhost:8080/entry/list?name=wangyi
 *
 * replace('/entry/edit',{id:1,name:'ss'});
 *
 * 改变url:http://localhost:8080/entry/edit?id=1
 *
 * goBack();
 *
 * 改变url:http://localhost:8080/entry/list
 *
 * 注意replace后第二个链接http://localhost:8080/entry/list?name=wangyi在history中变成了http://localhost:8080/entry/edit?id=1
 */
export function replace(pathname: string, query?: any) {
  return history.replace(pathname + stringify(query));
}

/**
 * assignQuery和replace功能的结合体
 *
 * @param query 同@assignQuery
 */
export function assignQueryByReplace(query?: any) {
  let urlQuery = getQueryFromUrl();
  return replace(getPathnameFromUrl(), Object.assign({}, urlQuery, query || {}));
}

/**
 * changeQuery和replace的结合体
 *
 * @param query 同@changeQuery
 */
export function changeQueryByReplace(query?: any) {
  return replace(getPathnameFromUrl(), query);
}

/**
 * 跳转count个history栈
 *
 * @param count
 */
export function go(count: number) {
  return history.go(count);
}

/**
 * 回退
 */
export function goBack() {
  return history.goBack();
}

interface Opt {
  basename?: string,
  mode?: 'h5' | 'hash'
}

export function instanceBy(opt: Opt = {mode: 'h5'}) {
  if (!history) {
    basename = opt.basename || '';
    history = opt.mode === 'h5' ? createBrowserHistory({basename}) : createHashHistory({basename});
  }
  return history;
}
