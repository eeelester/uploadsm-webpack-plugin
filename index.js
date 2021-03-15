const axios = require("axios");
const FormData = require("form-data")
const getLogger = require('webpack-log');
const log = getLogger({ name: 'Uploadsm-webpack-plugin' });
class UploadsmWebpackPlugin{
    constructor(options){
        this.postUrl = options.postUrl || ''
    }
    apply(compiler){
        compiler.hooks.afterEmit.tapPromise('UploadsmWebpackPlugin',(compilation)=>{
            let smList = []
            for(let i in compilation.assets){
                if(/.+\.js\.map$/g.test(i)){
                    smList.push({
                        file: compilation.assets[i].source(),
                        filename: i
                    })
                }
            }
            if(smList.length===0) return log.warn('UploadsmWebpackPlugin: please set devtool to source-map')

            let formData = new FormData()
            smList.forEach(sm=>{
                formData.append(sm.filename,sm.file,{
                    filename: sm.filename
                })
            })

            return axios({
                method: 'POST',
                url: this.postUrl + '/saveSourceMap',
                data: formData,
                headers: formData.getHeaders()
            }).then(()=>{
                log.info(`UploadsmWebpackPlugin: upload success!`)
            }).catch(err=>{
                log.error(`UploadsmWebpackPlugin: has a problem :${err}`)
            })
        })
    }   
}

module.exports = UploadsmWebpackPlugin