const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");

module.exports = class extends Generator {

    generatorConfig = {
        projectType: 'web-pc'
    };

    sources=new Set();

    targets=new Set();

    destPaths = [];

    constructor(args, opts) {
        super(args, opts);
        this.argument('path', {type: String, required: true});
        this.option('redirect');
        this.option('snake-case');
        this.option('force');
        this.option('dev', {type: String});
    }

    initializing() {
        const generatorConfig = this.config.getAll();
        if (!generatorConfig) {
            return;
        }
        this.generatorConfig.useGit = this.config.get('git');
    }

    copyTo = (source, target, templates) => {
        this.sources.add(source);
        this.targets.add(target);
        this.fs.copyTpl(source, target, templates);
        this.destPaths.push(target);
    }

    getSourcePath = (isParent) => {
        const projectType = this.generatorConfig.projectType;
        return this.templatePath(path.join(projectType, isParent ? 'parent' : 'leaf'));
    };

    transPath = (p,opt)=>{
        const snakeCase = opt['snake-case'];
        const pathArray = p.slice(1).split('/');
        return '/' + pathArray.map((d) => snakeCase ? _.snakeCase(d) : _.kebabCase(d)).join('/');
    }

    writeChildNodes = (sourcePath, destPath, pathArray, opt) => {
        const snakeCase = opt['snake-case'];
        const routeConfig = opt.routeConfig;
        const filenames = fs.readdirSync(destPath);
        const dirs = filenames.filter((f) => fs.statSync(path.join(destPath, f)).isDirectory());
        const imports = dirs.map((d) => {
            const p = '/' + [...pathArray, d].map((d) => snakeCase ? _.snakeCase(d) : _.kebabCase(d)).join('/');
            return {
                left: `${d.slice(0, 1).toLocaleUpperCase()}${d.slice(1)}Route`,
                right: d,
                path: routeConfig && routeConfig[p] ? routeConfig[p] : p
            };
        });
        this.copyTo(path.join(sourcePath, routeConfig ? 'g_childNodes.ejs' : 'childNodes.ejs'), path.join(destPath, 'childNodes.tsx'), {imports});
    };

    writeRootRoute = (opt, lastPath, isStart) => {
        const {redirect: isIndex, routeConfig} = opt;
        const projectType = this.generatorConfig.projectType;
        const sourcePath = this.templatePath(path.join(projectType, 'pages'));
        const destPath = this.destinationPath(path.join('src', 'pages'));
        if (isIndex && isStart) {
            const lastP = this.transPath(lastPath,opt);
            const actualLastPath = routeConfig && routeConfig[lastP] ? routeConfig[lastP] : lastP;
            this.copyTo(
                path.join(sourcePath, routeConfig && routeConfig[lastP] ? 'g_index.ejs' : 'index.ejs'),
                path.join(destPath, 'index.tsx'),
                {redirectTo: actualLastPath}
            );
        } else if (!this.targets.has(path.join(destPath, 'index.tsx'))&&!fs.existsSync(path.join(destPath, 'index.tsx'))) {
            this.copyTo(path.join(sourcePath, 'index.ejs'), path.join(destPath, 'index.tsx'), {redirectTo: ''});
        }
        this.writeChildNodes(sourcePath, destPath, [], opt);
    }

    copyLeafRoute = (destDirPath, opt) => {
        const {dev} = opt;
        const leafPath = this.getSourcePath(false);
        if(!fs.existsSync(path.join(destDirPath, 'index.tsx'))){
            this.copyTo(path.join(leafPath, 'index.ejs'), path.join(destDirPath, 'index.tsx'));
        }
        if (!fs.existsSync(path.join(destDirPath, 'layout.tsx'))) {
            this.copyTo(path.join(leafPath, dev ? 'develop.ejs' : 'layout.ejs'), path.join(destDirPath, 'layout.tsx'), {dev});
        }
    };

    writeRoute = (pathArray, opt, lastPath, isStart) => {
        const {redirect: isIndex, force,routeConfig} = opt;
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
        if (!fs.existsSync(path.join(destDirPath, 'layout.tsx')) || force) {
            this.copyTo(path.join(parentPath, 'layout.ejs'), path.join(destDirPath, 'layout.tsx'));
        }
        if (isIndex && isStart) {
            const lastP = this.transPath(lastPath,opt);
            const actualLastPath = routeConfig && routeConfig[lastP] ? routeConfig[lastP] : lastP;
            this.copyTo(
                path.join(parentPath, routeConfig && routeConfig[lastP] ?'g_index.ejs':'index.ejs'),
                path.join(destDirPath, 'index.tsx'),
                {redirectTo: actualLastPath}
            );
        } else if (!this.targets.has(path.join(destDirPath, 'index.tsx'))&&!fs.existsSync(path.join(destDirPath, 'index.tsx'))) {
            this.copyTo(path.join(parentPath, 'index.ejs'), path.join(destDirPath, 'index.tsx'), {redirectTo: ''});
        }
        this.writeChildNodes(parentPath, destDirPath, pathArray, opt);
        this.writeRoute(nextPathArray, opt, currentPath);
    };

    clearFolder = (destDirPath, root) => {
        if (!fs.existsSync(destDirPath)) {
            return;
        }
        if (fs.statSync(destDirPath).isFile()) {
            fs.unlinkSync(destDirPath);
            return;
        }
        const list = fs.readdirSync(destDirPath);
        list.forEach((f) => {
            this.clearFolder(path.join(destDirPath, f));
        });
        if(!root){
            fs.rmdirSync(destDirPath);
        }
    }

    clearPages = () => {
        const destDirPath = path.join(this.destinationRoot(), 'src', 'pages');
        this.clearFolder(destDirPath, true);
    }

    async prompting() {
        const path_ = this.options.path.trim();
        if (path_ === '/') {
            const {clearRoutes} = await this.prompt([{
                type: 'confirm',
                name: 'clearRoutes',
                message: '路由参数为 "/" 代表清理所有路由，是否继续？'
            }]);
            this.generatorConfig.clearRoutes = clearRoutes;
        }
    }

    writeSinglePathByArray = (pathArray, opt) => {
        const relativePath = path.join('src', 'pages', ...pathArray);
        const absolutePath = this.destinationPath(relativePath);
        fs.mkdirSync(absolutePath, {recursive: true});
        this.writeRoute(pathArray, opt);
    };

    writeSinglePath = (routePath, opt) => {
        const pathArray = routePath.split('/').map((p) => _.camelCase(p)).filter((p) => p.trim());
        this.writeSinglePathByArray(pathArray, opt);
    };

    writeConfigPath = (configPath) => {
        const pathArray = configPath.split('/').map((p) => p.trim()).filter((p) => p);
        const relativePath = path.join(...pathArray);
        const absolutePath = this.destinationPath(relativePath);
        const configString = fs.readFileSync(absolutePath).toString();
        try {
            const config = JSON.parse(configString);
            const entries = config.map((p) => {
                const pathLike = typeof p === 'string' ? p : p.path;
                const pa = pathLike.split('/').filter((d) => d.trim()).join('_');
                const pathData = typeof p === 'string' || !p.name ? _.camelCase(pa) : p.name;
                if (typeof p === 'string') {
                    return [
                        pathData,
                        {path: p}
                    ]
                }
                return [
                    pathData,
                    p
                ];
            });
            const relativeConfigCodePath = path.join('src', 'routeConfig.ts');
            const configCodePath = this.destinationPath(relativeConfigCodePath);

            const configTemplate = entries.map(([key, data]) => {
                return {key, path: data.path};
            });
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc', 'routeConfig.ejs'),
                configCodePath,
                {
                    config: configTemplate
                }
            )
            const routeConfig = Object.fromEntries(entries.map(([k, v]) => [v.path, k]));
            entries.forEach(([, v]) => {
                this.writeSinglePath(v.path, {...this.options, force: true, redirect: v.redirect, routeConfig})
            });
        } catch (e) {
            this.log('配置文件解析失败 ...');
        }
    };

    writing() {
        if (!this.config.get('useRouter')) {
            this.log('请先选择使用 react-router 路由...');
            return;
        }
        this.log('开始构建路径...');
        if (this.generatorConfig.clearRoutes) {
            this.clearPages();
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc', 'pages', 'childNodes.ejs'),
                path.join(this.destinationRoot(), 'src', 'pages', 'childNodes.tsx'),
                {
                    imports: [],
                }
            );
            this.copyTo(
                path.join(this.sourceRoot(), 'web-pc', 'pages', 'index.ejs'),
                path.join(this.destinationRoot(), 'src', 'pages', 'index.tsx'),
                {
                    redirectTo: ''
                }
            );
            this.log('构建路径完毕...');
            return;
        }
        const path_ = this.options.path.trim();
        if (path_.endsWith('.json')) {
            this.writeConfigPath(path_);
        } else {
            this.writeSinglePath(path_, this.options);
        }
        this.sources.clear();
        this.targets.clear();
        this.log('构建路径完毕...');
    }

    end() {
        if (this.destPaths.length) {
            this.destPaths.forEach((p) => {
                this.spawnCommand('prettier', ['--write', p]);
            });
        }
        this.destPaths = [];
        if (!this.generatorConfig.useGit) {
            return;
        }
        this.spawnCommand('git', ['add', '.']);
    }

}