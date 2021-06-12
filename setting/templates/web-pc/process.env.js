module.exports=(mode)=>({
    'NODE_ENV': JSON.stringify(mode==='development' ? mode : 'production'),
    'history':JSON.stringify('<%= history %>'),
    'basename':JSON.stringify('<%= basename %>')
});