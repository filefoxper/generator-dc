function isObject(value: any) {
  return Object.prototype.toString.apply(value) === '[object Object]';
}

function ifUndefined(value: any, then: any) {
  return value === undefined ? then : value;
}

interface IRecord {
  path: string | number | undefined,
  value: any,
  prevRecord: IRecord | undefined
}

class Record implements IRecord {

  path: string | number | undefined;

  prevRecord: IRecord | undefined;

  value: any;

  constructor(path: string | number | undefined, value: any, prevRecord: IRecord | undefined) {
    this.path = path;
    this.value = value;
    this.prevRecord = prevRecord;
  }

}

function matchPath(path: string | number | Function, value: any): string | number | undefined {
  if (typeof path !== 'function') {
    return path;
  }
  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      if (path(value[key], key)) {
        return key;
      }
    }
  }
  return;
}

function copy(value) {
  return Object.create(Object.getPrototypeOf(value || {}));
}

class PathRecord {

  records: Array<IRecord> = [];

  abnormal: boolean = false;

  record(state: any, pathArray: Array<string | number | Function>): PathRecord {
    let next = ifUndefined(state, {});
    this.abnormal = false;
    this.recordStep(undefined, state);
    for (let i = 0; i < pathArray.length; i++) {
      let path = matchPath(pathArray[i], next);
      if (path === undefined) {
        return this.setAbnormal();
      }
      let value = next[path];
      this.recordStep(path, value);
      next = ifUndefined(value, {});
    }
    return this;
  }

  setAbnormal() {
    this.abnormal = true;
    return this;
  }

  getLastRecord() {
    return this.records[this.records.length - 1];
  }

  recordStep(path: string | number | undefined, value: any) {
    let recordsLength = this.records.length;
    let prevRecord = recordsLength ? this.records[recordsLength - 1] : undefined;
    let record = new Record(path, value, prevRecord);
    this.records.push(record);
  }

  reverseProduce(value: any) {
    if (this.abnormal) {
      return value;
    }
    let records = this.records;
    let data: any = undefined;
    for (let i = records.length - 1; i > -1; i--) {
      let sourcePath = records[i].path;
      let prevRecord = records[i].prevRecord;
      let shouldPathValue: any = data || value;
      let temp = sourcePath === undefined ? shouldPathValue : {[sourcePath]: shouldPathValue};
      if (!prevRecord) {
        return temp;
      } else if (Array.isArray(prevRecord.value)) {
        let index = Number(sourcePath);
        let array = prevRecord.value;
        let newArray: Array<any> = [];
        let length = index < array.length ? array.length : index + 1;
        for (let n = 0; n < length; n++) {
          newArray.push(n === index ? shouldPathValue : array[n]);
        }
        data = newArray;
      } else {
        data = Object.assign(copy(prevRecord.value), prevRecord.value || {}, temp);
      }
    }
    return data;
  }

}

function parsePath(sourcePath: number | string | Function | Array<string | number | Function>) {
  if (typeof sourcePath === 'string') {
    return sourcePath.split('.');
  }
  if (typeof sourcePath === 'number' || typeof sourcePath === 'function') {
    return [sourcePath];
  }
  return sourcePath;
}

function recordByPath(state: any, path: number | string | Function | Array<string | number | Function>) {
  let pathArray = parsePath(path);
  let pathRecord = new PathRecord();
  return pathRecord.record(state, pathArray);
}

function produceBySetProperty(pathRecord: PathRecord, value: any) {
  return pathRecord.reverseProduce(value);
}

function produceByMergeProperty(pathRecord: PathRecord, value: any) {
  let lastRecord = pathRecord.getLastRecord();
  let lastRecordValue = ifUndefined(lastRecord.value, {});
  if (isObject(lastRecordValue) && isObject(value)) {
    return pathRecord.reverseProduce(Object.assign(copy(lastRecordValue), lastRecordValue, value));
  } else {
    return pathRecord.reverseProduce(value);
  }
}

type ValueGeneratorType = ((currentValue: any, nowState?: any) => any) | any;

function anyMap(data, keys, func: Function) {
  let keyMap = {};
  keys.forEach((k) => {
    keyMap[k] = k;
  });
  if (Array.isArray(data)) {
    return data.map((v, k) => {
      return keyMap[k] !== undefined ? func(v, k) : v;
    });
  } else {
    let temp = {};
    for (let key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        let value = data[key];
        temp[key] = keyMap[key] !== undefined ? func(value, key) : value;
      }
    }
    return temp;
  }
}

function keysOf(data: any) {
  let keys: Array<string | number> = [];
  for (let k in data) {
    if (Object.prototype.hasOwnProperty.call(data, k)) {
      keys.push(k);
    }
  }
  return keys;
}

function getKeys(data, key) {
  if (key === '*') {
    return keysOf(data);
  } else if (typeof key === 'function') {
    let keys = keysOf(data);
    return keys.filter((k) => key(data[k], k));
  } else {
    return [key];
  }
}

function matchAssign(temp: any, pathArray: Array<string | number | Function>, call: Function, current?: string) {
  if (pathArray.length) {
    let key = pathArray[0];
    let keys = getKeys(temp, key);
    return anyMap(temp, keys, (v, k) => {
      return matchAssign(temp[k], pathArray.slice(1), call, k);
    });
  } else {
    return call(temp, current);
  }
}

class Producer<T extends object> {

  state: T | T[];

  nowState?: T | T[];

  /**
   *
   * @param state 需要加工的数据
   */
  constructor(state: T) {
    this.state = state;
    this.nowState = undefined;
  }

  /**
   * 根据给定的路径和数据/数据生成方法，设置并产生一个新数据（没有assign功能，看起来更像替换）
   * @param path 需要设置数据的路径
   * @param valueGenerator 需要设置的数据，或产生数据的方法
   */
  set(path: number | string | Function | Array<string | number | Function>, valueGenerator: ValueGeneratorType):Producer<T> {
    let last = this.nowState || this.state;
    let pathRecord = recordByPath(last, path);
    let lastRecord = pathRecord.getLastRecord();
    let value = typeof valueGenerator === 'function' ?
      valueGenerator(lastRecord.value, last) : valueGenerator;
    this.nowState = produceBySetProperty(pathRecord, value);
    return this;
  }

  /**
   * 根据给定的路径和方法，设置并产生一个新数据（没有assign功能，看起来更像替换）
   * @param path 需要设置数据的路径
   * @param func 需要设置的方法
   */
  setFunction(path: number | string | Function | Array<string | number | Function>, func: Function):Producer<T> {
    let last = this.nowState || this.state;
    let pathRecord = recordByPath(last, path);
    this.nowState = produceBySetProperty(pathRecord, func);
    return this;
  }

  /**
   * 根据指定目录的集合，通过统一数据处理方法，生成新数据
   *
   * @param paths 需要设置数据路径的集合
   * @param func 统一数据处理方法
   *
   * @deprecated
   */
  multiSet(paths: Array<string | number | Array<string | number>>, func: Function) {
    if (Array.isArray(paths)) {
      paths.forEach((path) => {
        this.set(path, func);
      });
    }
    return this;
  }

  /**
   * 根据指定目录的集合，通过统一数据处理方法，生成新数据
   *
   * @param func 需要设置数据路径的集合
   */
  map<K extends keyof T>(func: <V>(v: V, k: K) => V) {
    let last = this.nowState || this.state;
    if (Array.isArray(last) && Array.isArray(this.nowState)) {
      this.nowState = last.map((v: any, i: number) => {
        return func(v, i as K);
      });
    } else {
      let temp: T = copy(last);
      for (let key in last) {
        if (Object.prototype.hasOwnProperty.call(last, key)) {
          let value = last[key];
          let k: K = key as K;
          temp[key] = func(value, k);
        }
      }
      this.nowState = temp;
    }
    return this;
  }

  match(path: string | number | Array<string | number | Function> | Function, func: Function): Producer<T> {
    let last = this.nowState || this.state;
    this.nowState = matchAssign(last, parsePath(path), func);
    return this;
  }

  /**
   * 根据给定的路径和数据/数据生成方法，合并原数据产生一个新数据
   * @param path 需要合并数据的路径（注意：当前参数不是string或array，而是object时，相当于path就是value的一个普通的assign）
   * @param valueGenerator 需要合并的数据，或产生数据的方法。
   * 注意：当原数据和新数据都为object时，相当于该路径下的新老数据进行了assign处理，否则将做set处理
   */
  assign(path: number | string | Function | Array<string | number | Function> | object, valueGenerator?: ValueGeneratorType): Producer<T> {
    let last = this.nowState || this.state;
    if (typeof path === 'string' || typeof path === 'number' || Array.isArray(path)) {
      let pathRecord = recordByPath(last, path);
      let lastRecord = pathRecord.getLastRecord();
      let value = typeof valueGenerator === 'function' ?
        valueGenerator(lastRecord.value, last) : valueGenerator;
      this.nowState = produceByMergeProperty(pathRecord, value);
    } else {
      this.nowState = Object.assign(copy(last), last, path);
    }
    return this;
  }

  /**
   * 当无入参时，效果为获取当前数据
   * @param path 当前参数存在则获取当前数据对应path下的数据
   * @param defaultValue 当path存在时，作为当前数据对应path下的默认值
   */
  get(): T
  get(path: number | string | Function | Array<string | number | Function>, defaultValue?: any): any
  get(path?: number | string | Function | Array<string | number | Function>, defaultValue?: any) {
    let result = this.nowState || this.state;
    if (!arguments.length) {
      return result as T;
    }
    let pathArray = parsePath(ifUndefined(path, 'undefined'));
    let next = result || {};
    for (let i = 0; i < pathArray.length; i++) {
      let path = matchPath(pathArray[i], result);
      if (path === undefined) {
        return;
      }
      let value = next[path];
      next = ifUndefined(value, (i === pathArray.length - 1 ? defaultValue : {}));
    }
    return next;
  }

  value(): T {
    let value = this.nowState || this.state;
    return value as T;
  }

}

/**
 * 作用：在不改变原始数据的情况下，以函数式编程的方式加工并生成一个新数据
 * 场景：在对reducer和react component中的state进行加工的过程中我们通常的处理方案是"Object.assign({},state,newStatePart)",
 * 如果需要改变的是深路径的数据，那么需要这么做
 * "
 * let {deepState,otherDeepState}=state;
 * let processedDeepState=Object.assign({},deepState,{name:'name'});
 * let processedOtherDeepState=Object.assign({},otherDeepState,{id:1});
 * let newState=Object.assign({},state,{deepState:processedDeepState,otherDeepState:processedOtherDeepState});
 * "
 * 这是我们为了保证原数据不变付出的代价
 * 目前市面上解决该问题的第三方库有immutableJs、immerJs
 *
 * immutableJs因为过于强调数据的不可变性，拥有一套自己的繁琐api数据结构，故而随着项目的发展常被开发者埋怨。
 * immerJs很好的解决了immutableJs的痛点，因为采用Proxy{set,get}机制，使用起来也相当的灵活，就跟使用最普通的set一样，比如
 * let newSate=produce(state,(draftState)=>{
 *     draftState.deepState.name='name';
 *     draftState.otherDeepState.id=1;
 * });
 * 但使用的时候要注意该方法被建议修改的东西只有入参draftState，也因为采用直接修改传参数的形式，容易对人产生误导，故使用的时候望多加小心
 *
 * 虽然有immerJs，但这里依然还是推荐一下produce工具，同样解决上述问题，采用类似immutableJs的逆向生成，但又不涉及繁琐的api数据结构
 * 使用如下：
 * let newState=produce(state).set('deepState.name','name').set('otherDeepState.id',1).get();
 * let newState=produce(state).set(['deepState','name'],'name').assign('otherDeepState',{id:1}).get();
 * let newState=produce(state).set(['deepState','name'],(currentDeepStateName)=>{
 *     return currentDeepStateName?'name':'defaultName';
 * }).assign('otherDeepState',({id:currentOtherDeepStateId})=>currentOtherDeepStateId?1:0}).get();
 * let currentDeepStateName=produce(state).get('deepState.name','defaultName');
 *
 * @param state 需要加工的数据
 */
export function produce<T extends object>(state: T) {
  return new Producer<T>(state);
}
