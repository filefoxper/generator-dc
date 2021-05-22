const Generator = require('yeoman-generator');

module.exports = class extends Generator {

    extensions = {
        autoInstall: true,
        projectType: 'web-pc',
        useGit: false
    };

    constructor(args, opts) {
        super(args, opts);
        this.option('lock');
        this.option('unlock');
    }

    initializing() {
        const lock=this.options.lock;
        const unlock=this.options.unlock;
        if(lock){
            this.config.set('lock',lock);
        }
        if(unlock){
            this.config.set('lock',false);
        }
        this.log('重新设置dx-react');
    }

    async prompting() {
         const {git}=await this.prompt([{
             type: 'list',
             name: 'git',
             message: '是否使用git ?',
             choices: [
                 '使用git',
                 '不使用git'
             ],
             default: '使用git',
         }]);
         const usingGit=git==='使用git';
        this.config.set('git',usingGit);
        this.extensions.useGit= usingGit;
    }

    end() {
        if (!this.extensions.useGit) {
            return;
        }
        this.spawnCommand('git', ['add', '.']);
    }

};