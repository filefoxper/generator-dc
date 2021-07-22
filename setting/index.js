const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');

const promptHistory = () => {
    return {
        type: 'list',
        name: 'history',
        message: '请选择路由history类型',
        choices: ['hash', 'h5'],
        default: 'h5',
        store: true
    };
};

const promptBasename = () => {
    return {
        type: 'input',
        name: 'basename',
        message: '请输入 basename （直接敲回车，使用默认 basename，键默认为/）'
    };
}

const settingDescription={
    'git':'git',
    '路由':'useRouter',
    '测试':'testMode'
}

const TestMode={
    DEPENDENT:'独立测试包',
    INDEPENDENT:'附属测试包'
}

const promptTestMode = () => {
    return {
        type: 'list',
        name: 'testMode',
        message: '请选择测试模式',
        choices: Object.values(TestMode),
        default: TestMode.INDEPENDENT,
        store: true
    };
}

module.exports = class extends Generator {

    extensions = {
        autoInstall: true,
        projectType: 'web-pc',
        useGit: false
    };

    destPaths = [];

    constructor(args, opts) {
        super(args, opts);
        this.option('lock');
        this.option('unlock');
        this.option('silent')
    }

    initializing() {
        const lock = this.options.lock;
        const unlock = this.options.unlock;
        if (lock) {
            this.config.set('lock', lock);
        }
        if (unlock) {
            this.config.set('lock', false);
        }
    }

    copyTo = (source, target, templates) => {
        this.fs.copyTpl(source, target, templates);
        this.destPaths.push(target);
    }

    copyTemp = (source, target) => {
        this.copyTemplate(source, target);
        this.destPaths.push(target);
    }

    clearFolder = (destDirPath, root) => {
        if (!fs.existsSync(destDirPath)) {
            return;
        }
        if (fs.statSync(destDirPath).isFile()) {
            fs.unlinkSync(destDirPath);
            return;
        }
        const list = fs.readdirSync(destDirPath);
        if (!list.length && !root) {
            fs.rmdirSync(destDirPath);
            return;
        }
        list.forEach((f) => {
            this.clearFolder(path.join(destDirPath, f));
        });
    }

    clearPages = () => {
        const destDirPath = path.join(this.destinationRoot(), 'src', 'pages');
        this.clearFolder(destDirPath, true);
    }

    async prompting() {
        const {silent} = this.options;
        if (!silent) {
            const {reset} = await this.prompt([{
                type: 'confirm',
                name: 'reset',
                message: '重新设置可能会带来一些代码危害，是否继续？'
            }]);
            if (!reset) {
                this.extensions.exit = true;
                return;
            }
        }
        const {setting}=await this.prompt([
            {
                type: 'checkbox',
                name: 'setting',
                message: '请选择需要重新设置的选项',
                choices: [
                    "git",
                    "路由",
                    "测试",
                ]
            }
        ]);
        const set = new Set(setting.map((desc)=>settingDescription[desc]));
        const {git, useRouter} = await this.prompt([
            {
                type: 'confirm',
                name: 'git',
                message: '是否使用git ?'
            }, {
                type: 'confirm',
                name: 'useRouter',
                message: '是否使用 react-router 路由？'
            }
        ].filter(({name})=>set.has(name)));

        const usingGit = git;
        if(usingGit!==undefined){
            this.config.set('git', usingGit);
            this.extensions.useGit = usingGit;
        }
        if (useRouter) {
            const {title,history, basename} = await this.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: '请输入网页名称'
                },
                promptHistory(),
                promptBasename()
            ]);
            this.extensions.title=title;
            this.extensions.useRouter = useRouter;
            this.extensions.history = history;
            this.extensions.basename = basename;
            this.config.set('useRouter', true);
        } else if(useRouter===false){
            this.config.set('useRouter', false);
        }
        if(set.has('testMode')){
            const {testMode} = await this.prompt([
                promptTestMode()
            ]);
            this.config.set('testMode',testMode);
        }
    }

    writeRoutes = () => {
        const {silent} = this.options;
        if (silent) {
            return;
        }
        const {useRouter, history, basename, title} = this.extensions;
        this.clearPages();
        if (useRouter) {
            this.copyTemp(
                path.join(this.sourceRoot(), 'web-pc', 'src', 'pages'),
                path.join(this.destinationRoot(), 'src', 'pages')
            );
            this.copyTemp(
                path.join(this.sourceRoot(), 'web-pc', 'src', 'components', 'layouts', 'route'),
                path.join(this.destinationRoot(), 'src', 'components', 'layouts', 'route')
            );
            this.copyTemp(
                path.join(this.sourceRoot(), 'web-pc', 'src', 'layout', 'app.tsx'),
                path.join(this.destinationRoot(), 'src', 'layout', 'app.tsx')
            );
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc', 'process.env.js'),
                path.join(this.destinationRoot(), 'process.env.js'),
                {
                    history,
                    basename
                }
            );
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc', 'template.index.html'),
                path.join(this.destinationRoot(), 'template.index.html'),
                {
                    history,
                    basename,
                    title
                }
            );
        } else if(useRouter===false){
            this.copyTemp(
                path.join(this.sourceRoot(), 'web-pc-simple', 'src', 'pages'),
                path.join(this.destinationRoot(), 'src', 'pages')
            );
            this.copyTemp(
                path.join(this.sourceRoot(), 'web-pc-simple', 'src', 'layout', 'app.tsx'),
                path.join(this.destinationRoot(), 'src', 'layout', 'app.tsx')
            );
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc-simple', 'process.env.js'),
                path.join(this.destinationRoot(), 'process.env.js'),
                {}
            );
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc-simple', 'template.index.html'),
                path.join(this.destinationRoot(), 'template.index.html'),
                {
                    title
                }
            );
        }
    }

    writing() {
        if (this.extensions.lock || this.extensions.exit) {
            return;
        }
        this.log('开始复制基本配置信息...');
        this.writeRoutes();
        this.log('复制基本配置信息结束...');
    }

    end() {
        if (this.extensions.exit) {
            this.log('退出设置...');
            return;
        }
        this.log('设置结束...');
        if (this.destPaths.length) {
            this.destPaths.forEach((p) => {
                this.spawnCommand('prettier', ['--write', p]);
            });
        }
        if (!this.extensions.useGit) {
            return;
        }
        this.spawnCommand('git', ['add', '.']);
    }

};