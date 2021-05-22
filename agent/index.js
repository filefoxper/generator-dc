const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");

module.exports = class extends Generator {

    generatorConfig = {
        projectType: 'web-pc'
    };

    destPaths=[];

    constructor(args, opts) {
        super(args, opts);
        this.argument('path', {type: String,required:false});
        this.option('name', {type: String});
        this.option('sharing');
        this.option('weak-sharing');
        const generatorConfig = this.config.getAll();
        if (!generatorConfig) {
            return;
        }
        this.generatorConfig.useGit = this.config.get('git');
    }

    copyTo=(source,target,templates)=>{
        this.fs.copyTpl(source, target, templates);
        this.destPaths.push(target);
    }

    writing() {
        this.log('开始生成 agent 模版');
        const {path: p = '', sharing, name = 'Model'} = this.options;
        const weakSharing = this.options['weak-sharing'];
        const trimPath=p.trim();
        const path_ = trimPath ? trimPath : sharing ? '/modules' : undefined;
        if (!path_&&!sharing) {
            throw 'please use option "sharing" argument "path" to fix this problem.';
        }
        if (sharing && weakSharing) {
            throw 'please choose one from `sharing`, `weak-sharing`, or nothing.';
        }
        const name_ = name.trim();
        const sourcePath = this.sourceRoot();
        const pathArray = path_.split(/\/|\.|\|/).filter((p) => p.trim());
        const relativePath = !trimPath && sharing ? path.join('src', ...pathArray, _.lowerFirst(name_)) : path.join('src', ...pathArray);
        const absolutePath = this.destinationPath(relativePath);
        fs.mkdirSync(absolutePath, {recursive: true});
        if (!fs.existsSync(path.join(absolutePath, sharing && !trimPath ? 'index.ts' : 'model.ts'))) {
            this.copyTo(path.join(sourcePath, 'agent.ejs'), path.join(absolutePath, sharing && !trimPath ? 'index.ts' : 'model.ts'), {
                name: _.upperFirst(name_),
                lowerName: _.lowerFirst(name_),
                sharing,
                weakSharing
            });
        }
        if (!fs.existsSync(path.join(absolutePath, 'type.ts'))) {
            this.copyTo(path.join(sourcePath, 'type.ejs'), path.join(absolutePath, 'type.ts'));
        }
        this.log('结束生成 agent 模版');
    }

    end() {
        if(this.destPaths.length){
            this.destPaths.forEach((p)=>{
                this.spawnCommand('prettier',['--write',p]);
            });
        }
        this.destPaths=[];
        if (!this.generatorConfig.useGit) {
            return;
        }
        this.spawnCommand('git', ['add', '.']);
    }

}