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

    clearFolder=(destDirPath,root)=>{
        if(!fs.existsSync(destDirPath)){
            return;
        }
        if(fs.statSync(destDirPath).isFile()){
            fs.unlinkSync(destDirPath);
            return;
        }
        const list=fs.readdirSync(destDirPath);
        if(!list.length&&!root){
            fs.rmdirSync(destDirPath);
            return;
        }
        list.forEach((f)=>{
            this.clearFolder(path.join(destDirPath,f));
        });
    }

    clearPages=()=>{
        const destDirPath = path.join(this.destinationRoot(), 'src', 'pages');
        this.clearFolder(destDirPath,true);
    }

    async prompting() {
        const {reset} = await this.prompt([{
            type: 'confirm',
            name: 'reset',
            message: '重新设置可能会带来一些代码危害，是否继续？'
        }]);
        if (!reset) {
            this.extensions.exit = true;
            return;
        }
        const {git, useRouter, title} = await this.prompt([
            {
                type: 'input',
                name: 'title',
                message: '请输入网页名称'
            },
            {
                type: 'list',
                name: 'git',
                message: '是否使用git ?',
                choices: [
                    '使用git',
                    '不使用git'
                ],
                default: '使用git',
            }, {
                type: 'confirm',
                name: 'useRouter',
                message: '是否使用 react-router 路由？'
            }
        ]);

        const usingGit = git === '使用git';
        this.config.set('git', usingGit);
        this.extensions.title = title;
        this.extensions.useGit = usingGit;
        if (useRouter) {
            const {history, basename} = await this.prompt([
                promptHistory(),
                promptBasename()
            ]);
            this.extensions.useRouter=useRouter;
            this.extensions.history=history;
            this.extensions.basename=basename;
            this.config.set('useRouter',true);
        }else{
            this.config.set('useRouter',false);
        }
    }

    writeRoutes=()=>{
        const {useRouter,history,basename,title} = this.extensions;
        this.clearPages();
        if(useRouter){
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
        }else{
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
        if (this.extensions.lock||this.extensions.exit) {
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