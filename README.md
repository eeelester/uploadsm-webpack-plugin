# 简介

利用此插件在webpack打包的时候将sourcemap文件上传到配置的URL中,node端接受固定路径为/saveSourceMap

### 示例用法

```
// webpack.config.js
// npm install axios form-data webpack-log
const UploadsmWebpackPlugin = require('uploadsm-webpack-plugin')
module.exports = {
    ....
    plugin:{
        new UploadsmWebpackPlugin({
            postUrl: 'http://127.0.0.1:3000'
        })
    }
}

// node router.js
const multiparty = require('multiparty')
const fs = require('fs')
const path = require('path')

router.post('/saveSourceMap',function(req,res){
    let form = new multiparty.Form();

    form.parse(req, function(err,fields,files){
        for(let item in files){
            let inputFile = files[item][0];
            let uploadedPath = inputFile.path;
            // ./sourcemap是存放sourcemap的文件夹
            let distPath = path.join(path.resolve(__dirname,'./sourcemap'),inputFile.originalFilename)
            let readStream=fs.createReadStream(uploadedPath);
            let writeStream=fs.createWriteStream(distPath);
            readStream.pipe(writeStream);
            readStream.on('end',function(){
                fs.unlinkSync(uploadedPath);
            });
        }  
        res.send('数据已接收');
    })
})
```