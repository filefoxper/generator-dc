module.exports=(mode)=>({
    'NODE_ENV': JSON.stringify(mode==='development' ? mode : 'production'),
});