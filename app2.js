//引入http模块
const http = require('http');
//引入fs文件模块
const fs = require('fs');
//引入path路径模块
const path = require('path');
//引入mime模块 
const mime = require('mime');
//引入querystring模块
const querystring = require('querystring');

//网站根目录
let rootPath = path.join(__dirname,'www');
 //console.log(rootPath); //e:...}\05-课堂练习\03.apache-puls\www

//创建http服务
 let server =http.createServer((request,response)=>{
       
        //请求文件的绝对路径拼接 
        let filePath = path.join(rootPath,querystring.unescape(request.url));
        // console.log(filePath);

        //判断访问的文件是否存在
        let isExiect = fs.existsSync(filePath);
        // console.log(isExiect);

        //文件目录存在才能进入if判断
        if(isExiect){

            //获取文件列表
            fs.readdir(filePath,(err,files)=>{
                //err错误信息
                if(err){
                    //读取文件 返回文件
                    fs.readFile(filePath,(err,data)=>{
                        if (err) {
                            // console.log("我是err");
                            // console.log(err);
                        } else {
                            response.writeHead(200,{
                                'content-type': mime.getType(filePath)
                            })
                            response.end(data);
                        }
                    })
                }//目录下的文件数组列表
                else{
                             console.log(files);
                            if (files.indexOf("index.html") != -1) {
                                // console.log("有首页");
                                //有首页 返回首页
                                fs.readFile(path.join(filePath, "index.html"), (err, data) => {
                                    if(err){
                                        // console.log(err);
                                    }else{
                                        response.end(data);
                                    }
                                })
                            } else {    
                                //没有首页 返回列表
                                let backData="";
                                for (let i = 0; i < files.length; i++) {
                              
                                    // console.log("我是request.url");
                                    // console.log(request.url);???????????????????????????????????为啥是/

                                    backData+= 
                                    `
                                    <h2><a href="${request.url== '/' ? "" :request.url}/${files[i]}"> ${files[i]} </a></h2>
                                  `
                                }
                                //响应头
                                response.writeHead(200,{
                                    'content-type':'text/html;charset=utf-8'
                                })
                                response.end(backData);

                                
                            }
                    
                    
                }
                
            })
        }//文件不存在 返回404
        else{
            response.end(`
                <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
                <html><head>
                <title>404 Not Found</title>
                </head><body>
                <h1>Not Found</h1>
                <p>The requested URL /index.hththt was not found on this server.</p>
                </body></html>
            `)
        }
 })


server.listen(80,"127.0.0.1",()=>{
     console.log("监听127.0.0.1 成功");
 });