const {History, ProjectType, TestMode} = require("./constant.js");

const promptTitle = () => {
    return {
        type: 'input',
        name: 'title',
        message: '请输入网页名称'
    };
};

const promptProjectType = (promptValues) => {
    const {projectType=ProjectType.WEB_PC}=promptValues;
    return {
        type: 'list',
        name: 'projectType',
        message: '请选择项目类型',
        choices: Object.values(ProjectType),
        default: projectType,
        store: true
    };
};

const promptTestMode = (promptValues) => {
    const {testMode=TestMode.INDEPENDENT}=promptValues;
    return {
        type: 'list',
        name: 'testMode',
        message: '请选择测试模式',
        choices: Object.values(TestMode),
        default: testMode,
        store: true
    };
}

const promptOutput=(promptValues)=>{
    return {
        type: 'input',
        name: 'output',
        message: '请输入编译目标路径（可以是相对路径）',
        default:promptValues.output,
        store:true
    };
}

const promptUseRouter=()=>{
    return {
        type: 'confirm',
        name: 'useRouter',
        message: '是否使用 react-router 路由？'
    };
}

const promptUseUnitTest=()=>{
    return {
        type: 'confirm',
        name: 'useTest',
        message: '是否添加单元测试？',
        store:true
    };
}

const promptHistory = (promptValues) => {
    const {history=History.H5}=promptValues;
    return {
        type: 'list',
        name: 'history',
        message: '请选择路由history类型',
        choices: Object.values(History),
        default: history,
        store:true
    };
};

const promptBasename=()=>{
    return {
        type: 'input',
        name: 'basename',
        message: '请输入 basename （直接敲回车，使用默认 basename，键默认为/）'
    };
}

const promptTools=(promptValues)=>{
    const {tools=[]}=promptValues;
    return {
        type: 'checkbox',
        name: 'tools',
        message: '请选择基础依赖库',
        choices: [
            "react-router",
            "redux",
            "moment",
            "axios",
            "antd"
        ],
        default:tools,
        store:true
    };
}

const items=[
    'title',
    'output',
    // 'projectType',
    'basename',
    'history',
    'testMode',
    // 'tools'
];

const defaultPrompts=[
    promptTitle,
    // promptProjectType,
    promptOutput,
    promptBasename,
    promptHistory,
    promptTestMode,
    // promptTools
];

const prompting=(promptValues,promptFactories=defaultPrompts,filter=(c)=>c)=>{
    return promptFactories.map((factory)=>{
        return factory(promptValues);
    }).filter(filter);
}

module.exports={
    prompting,
    defaultPrompts,
    items,
    promptTitle,
    promptOutput,
    promptUseRouter,
    promptBasename,
    promptHistory,
    promptUseUnitTest,
    promptTestMode
}