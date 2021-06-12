const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const {
    prompting,
    promptTitle,
    promptOutput,
    promptUseRouter,
    promptBasename,
    promptHistory,
    promptUseUnitTest,
    promptTestMode
} = require('./prompt.js');

module.exports = class extends Generator {

    extensions = {
        autoInstall: true,
        projectType: 'web-pc',
        useGit: false,
        lock: false
    };

    constructor(args, opts) {
        super(args, opts);
        this.option('skip-install');
        this.option('git');
    }

    initializing() {
        const {lock} = this.config.getAll();
        this.extensions.lock = lock;
        if (this.extensions.lock) {
            return;
        }
        const git = this.options.git;
        const noInstall = this.options['skip-install'];
        this.extensions.autoInstall = !noInstall;
        this.extensions.useGit = git;
        this.config.set('git', git);
        this.log('欢迎使用dx-react');
    }

    async prompting() {
        if (this.extensions.lock) {
            return;
        }
        const {title, output} = await this.prompt(
            prompting(
                {output: '../dist'},
                [
                    promptTitle,
                    promptOutput
                ]
            )
        );
        this.extensions.title = title;
        this.extensions.output = output;
        const {useRouter}=await this.prompt([promptUseRouter()]);
        if(useRouter){
            const {history, basename} = await this.prompt(
                prompting(
                    {},
                    [
                        promptHistory,
                        promptBasename
                    ]
                )
            );
            this.extensions.history = history;
            this.extensions.basename = basename;
            this.config.set('useRouter',true);
        }else{
            this.extensions.projectType='web-pc-simple';
        }
        const {testMode} = await this.prompt(
            prompting(
                {},
                [
                    promptTestMode
                ]
            )
        );
        this.extensions.testMode = testMode;
    }

    writeConfig = (fileName) => {
        const appName = this.appname;
        const {projectType, title, history, basename = '', output = '../dist'} = this.extensions;
        const fullAppName = appName.split(' ').join('-');
        if (fileName === '.gt') {
            this.fs.copyTpl(path.join(this.sourceRoot(), projectType, fileName), this.destinationPath('.gitignore'))
            return;
        }
        this.fs.copyTpl(path.join(this.sourceRoot(), projectType, fileName), this.destinationPath(fileName), {
            appName: fullAppName,
            title,
            history,
            output,
            basename
        });
    };

    writeConfigs = () => {
        const {projectType} = this.extensions;
        const sourcePath = path.join(this.sourceRoot(), projectType);
        const filenames = fs.readdirSync(sourcePath);
        filenames.forEach((fileName) => {
            const sourceFile = path.join(sourcePath, fileName);
            if (fs.statSync(sourceFile).isDirectory()) {
                return;
            }
            this.writeConfig(fileName);
        });
    }

    writing() {
        if (this.extensions.lock) {
            return;
        }
        const {projectType} = this.extensions;
        this.log('开始复制基本配置信息...');
        this.copyTemplate(path.join(this.sourceRoot(), projectType, 'src'), path.join(this.destinationRoot(), 'src'));
        this.copyTemplate(path.join(this.sourceRoot(), projectType, 'test'), path.join(this.destinationRoot(), 'test'));
        this.writeConfigs();
        this.log('复制基本配置信息结束...');
    }

    install() {
        if (this.extensions.lock) {
            return;
        }
        const {autoInstall} = this.extensions;
        if (!autoInstall) {
            return;
        }
        this.log('开始安装依赖包...');
        this.npmInstall();
    }

    end() {
        if (this.extensions.lock) {
            this.log('项目设置已经被锁定...');
            return;
        }
        this.spawnCommand('prettier', ['--write', '.']);
        if (!this.extensions.useGit) {
            return;
        }
        this.spawnCommand('git', ['add', '.']);
    }

};