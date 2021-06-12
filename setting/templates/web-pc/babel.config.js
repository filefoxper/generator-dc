module.exports = (api) => {
  const defaultPlugins = [
    ["@babel/plugin-transform-runtime"],
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    [
      '@babel/plugin-proposal-class-properties',
      {loose: true},
    ]
  ];
  return api.env('test') ? {
    plugins: [
      ['babel-plugin-rewire-ts'],
      ...defaultPlugins,
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            node: 'current'
          },
          useBuiltIns: "usage",
          corejs: {version: 3, proposals: true},
          loose:true
        }
      ],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ]
  } : {
    plugins: [
      ...defaultPlugins,
      [
        "import",
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
          "style": "css" // `style: true` 会加载 less 文件
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            "browsers": ["last 2 versions", "ie >=9"]
          },
          useBuiltIns: "usage",
          corejs: {version: 3, proposals: true},
          loose:true
        }
      ],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ]
  };
};
