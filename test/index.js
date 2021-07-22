const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");

const isValidTestFilePattern = (fileName) => {
    const lower = fileName.toLocaleLowerCase();
    return lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.jsx');
}

const isValidTestFile = (directory, fileName) => {
    return fs.statSync(path.join(directory, fileName)).isFile() && isValidTestFilePattern(fileName);
}

const generateTestFileName = (fileName) => {
    const fileParts = fileName.split('.');
    return fileParts.map((part, index) => {
        if (index === fileParts.length - 1) {
            return ['test', part];
        }
        return part;
    }).flat().join('.');
}

const getCleanFileName = (name) => name.slice(0, name.lastIndexOf('.test'));

module.exports = class extends Generator {

    generatorConfig = {
        projectType: 'web-pc',
        testMode: '独立测试包'
    }

    destPaths = [];

    constructor(args, opts) {
        super(args, opts);
        this.argument('path', {type: String, required: true});
        const generatorConfig = this.config.getAll();
        if (!generatorConfig) {
            return;
        }
        this.generatorConfig.testMode = this.config.get('testMode');
        this.generatorConfig.useGit = this.config.get('git');
    }

    copyTo=(source,target,templates)=>{
        this.fs.copyTpl(source, target, templates);
        this.destPaths.push(target);
    }

    getPathFibre = (mode) => {
        const path_ = this.options.path.trim();
        const pathArray = path_.split('/').map((p) => p.trim()).filter((p) => p);
        const from = this.destinationPath(path.join('src', ...pathArray));
        if (fs.statSync(from).isDirectory()) {
            const ifDirectoryDirectoryToShouldBe = mode === 'padding' ?
                path.join(from, '__test__') : this.destinationPath(path.join('test', ...pathArray));
            return {
                from,
                to: ifDirectoryDirectoryToShouldBe,
                pathArray,
                directoryFrom: from,
                directoryTo: ifDirectoryDirectoryToShouldBe
            }
        } else {
            const directories = pathArray.slice(0, pathArray.length - 1);
            const fileName = pathArray[pathArray.length - 1];
            const newFileName = generateTestFileName(fileName);
            const directoryFrom = this.destinationPath(path.join('src', ...directories));
            const ifFileDirectoryToShouldBe = mode === 'padding' ?
                this.destinationPath(path.join('src', ...directories, '__test__')) :
                this.destinationPath(path.join('test', ...directories));
            const to = this.destinationPath(path.join(ifFileDirectoryToShouldBe, newFileName));
            return {
                from,
                to,
                pathArray,
                directoryFrom,
                directoryTo: ifFileDirectoryToShouldBe
            };
        }
    }


    makeTestDir = (from, to, pathArray) => {
        if (!fs.existsSync(to) || !fs.statSync(to).isDirectory()) {
            fs.mkdirSync(to, {recursive: true});
        }
        const fromChildren = fs.readdirSync(from).filter(isValidTestFilePattern);
        const toChildren = fs.readdirSync(to).filter(isValidTestFilePattern);
        const toSet = new Set(toChildren.map(getCleanFileName));
        const files = fromChildren.filter((c) => !toSet.has(getCleanFileName(c)));
        const source = pathArray.join('/');
        files.forEach((fileName) => {
            const newFileName = generateTestFileName(fileName);
            const filePath = this.destinationPath(path.join(to, newFileName));
            this.copyTo(this.templatePath('source.test.ejs'), filePath, {source: `@/${source}/${fileName}`});
        });
    }

    makeTestFile = (to, directoryTo, pathArray) => {
        const directory = directoryTo;
        if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
            fs.mkdirSync(directory, {recursive: true});
        }
        if (!isValidTestFilePattern(to)) {
            return;
        }
        if (fs.existsSync(to) && fs.statSync(to).isFile()) {
            return;
        }
        const source = pathArray.join('/');
        this.copyTo(this.templatePath('source.test.ejs'), to, {source: `@/${source}`});
    }

    independentWriting = (mode) => {
        const {from, to, directoryTo, pathArray} = this.getPathFibre(mode);
        if (!fs.existsSync(from)) {
            return;
        }
        const stats = fs.statSync(from);
        if (stats.isDirectory()) {
            this.makeTestDir(from, to, pathArray);
        } else {
            this.makeTestFile(to, directoryTo, pathArray);
        }
    };

    writing() {
        const {testMode} = this.generatorConfig;
        this.log('开始生成测试模版');
        if (testMode === '独立测试包') {
            this.independentWriting();
        } else {
            this.independentWriting('padding');
        }
        this.log('生成测试模版结束');
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