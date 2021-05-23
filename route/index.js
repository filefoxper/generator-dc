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
        this.argument('path', {type: String, required: true});
        this.option('redirect');
        this.option('snake-case');
    }

    initializing() {
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

    getSourcePath = (isParent) => {
        const projectType = this.generatorConfig.projectType;
        return this.templatePath(path.join(projectType, isParent ? 'parent' : 'leaf'));
    };

    writeChildNodes = (sourcePath, destPath, pathArray,snakeCase) => {
        const filenames = fs.readdirSync(destPath);
        const dirs = filenames.filter((f) => fs.statSync(path.join(destPath, f)).isDirectory());
        const imports = dirs.map((d) => (
            {
                left: `${d.slice(0, 1).toLocaleUpperCase()}${d.slice(1)}Route`,
                right: d,
                path: '/' + [...pathArray, d].map((d) => snakeCase?_.snakeCase(d):_.kebabCase(d)).join('/')
            }
        ));
        this.copyTo(path.join(sourcePath, 'childNodes.ejs'), path.join(destPath, 'childNodes.tsx'), {imports});
    };

    writeRootRoute = (opt, lastPath, isStart) => {
        const {redirect:isIndex} = opt;
        const projectType = this.generatorConfig.projectType;
        const sourcePath = this.templatePath(path.join(projectType, 'pages'));
        const destPath = this.destinationPath(path.join('src', 'pages'));
        if (isIndex && isStart) {
            this.copyTo(path.join(sourcePath, 'index.ejs'), path.join(destPath, 'index.tsx'), {redirectTo: lastPath});
        } else if (!fs.existsSync(path.join(destPath, 'childNodes.tsx'))) {
            this.copyTo(path.join(sourcePath, 'index.ejs'), path.join(destPath, 'index.tsx'), {redirectTo: ''});
        }
        this.writeChildNodes(sourcePath, destPath, [],opt['snake-case']);
    }

    copyLeafRoute = (destDirPath, opt) => {
        const leafPath = this.getSourcePath(false);
        this.copyTo(path.join(leafPath, 'index.ejs'), path.join(destDirPath, 'index.tsx'));
        if (!fs.existsSync(path.join(destDirPath, 'layout.tsx'))) {
            this.copyTo(path.join(leafPath, 'layout.ejs'), path.join(destDirPath, 'layout.tsx'));
        }
    };

    writeRoute = (pathArray, opt, lastPath, isStart) => {
        const {redirect:isIndex} = opt;
        if (!pathArray.length) {
            this.writeRootRoute(opt, lastPath, isStart);
            return;
        }
        const currentPath = '/' + pathArray.join('/');
        const nextPathArray = pathArray.slice(0, pathArray.length - 1);
        const relativePath = path.join('src', 'pages', ...pathArray);
        const destDirPath = this.destinationPath(relativePath);
        if (!lastPath) {
            this.copyLeafRoute(destDirPath, opt);
            this.writeRoute(nextPathArray, opt, currentPath, true);
            return;
        }
        const parentPath = this.getSourcePath(true);
        if (!fs.existsSync(path.join(destDirPath, 'layout.tsx'))) {
            this.copyTo(path.join(parentPath, 'layout.ejs'), path.join(destDirPath, 'layout.tsx'));
        }
        if (isIndex && isStart) {
            this.copyTo(path.join(parentPath, 'index.ejs'), path.join(destDirPath, 'index.tsx'), {redirectTo: lastPath});
        } else if (!fs.existsSync(path.join(destDirPath, 'index.tsx')) || !fs.existsSync(path.join(destDirPath, 'childNodes.tsx'))) {
            this.copyTo(path.join(parentPath, 'index.ejs'), path.join(destDirPath, 'index.tsx'), {redirectTo: ''});
        }
        this.writeChildNodes(parentPath, destDirPath, pathArray);
        this.writeRoute(nextPathArray, opt, currentPath);
    };

    writing() {
        this.log('开始构建路径...');
        const path_ = this.options.path.trim();
        const pathArray = path_.split('/').filter((p) => p.trim());
        const relativePath = path.join('src', 'pages', ...pathArray);
        const absolutePath = this.destinationPath(relativePath);
        fs.mkdirSync(absolutePath, {recursive: true});
        this.writeRoute(pathArray, this.options);
        this.log('构建路径完毕...');
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