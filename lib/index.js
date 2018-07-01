let express = require('express'),
    bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

app.get('/', function (req, res) {
    res.end('home');
});
let data = {
    id: 1,
    type: '类型',
    name: '名称',
    code: '0',
    nickname: '联系人',
    tel: '1388888888',
    email: 'text@vteamsystem.com',
    date: '2018-06-'
},
    suppliersList = [];

for (let i = 0; i < 29; i++) {
    let temp = Object.assign({}, data);
    temp.id +=i;
    temp.name =`名称${Math.floor(Math.random() * 100)}`;
    let index = 0;
    if(i<9){
        index = '0' + (i + 1);
    }else{
        index = i + 1;
    }
    temp.date += (index);;
    temp.code = Math.floor(Math.random() * 100000000) + '';
    suppliersList.push(temp);
}
app.post('/getSuppliersList', function (req, res) {
    let body = req.body,
        list = [],
        tempList = [],
        maxLen = parseInt(body.index * body.size) + parseInt(body.size);
            for(let i = 0, len = suppliersList.length; i < len; i++){
                let item = suppliersList[i];
                if((body.name?item.name.indexOf(body.name) !=-1 : true)&&(body.code?item.code.indexOf(body.code) !=-1 : true)&&(body.startDate?(new Date(item.date)>=new Date(body.startDate) && new Date(item.date)<=new Date(body.endDate)): true)){
                    tempList.push(item);
                }
            }
    for(let i = body.index * body.size, len = maxLen; i < len && i < tempList.length; i++){
        list.push(tempList[i]);
    }
    let result = {
        code:'0',
        data:list,
        total:tempList.length
    }
    res.end(JSON.stringify(result));
});

app.post('/delSuppliers', function (req, res) {
    console.log('req',req.body)
    let body = req.body;
    for(let i = 0; i < suppliersList.length; i++){
       if(suppliersList[i].id == body.id){
        suppliersList.splice(i,1);
       }
    }
    let result = {
        code:'0',
        data:{}
    }
    res.end(JSON.stringify(result));
});

app.post('/delPayableList', function (req, res) {
    let list = JSON.parse(req.body.list);
   A: for(let j = 0; j < list.length; j++){ 
    for(let i = 0; i < suppliersList.length; i++){
       if(suppliersList[i].id == list[j].id){
        suppliersList.splice(i,1);
        continue A;
       }
    }
    }
    let result = {
        code:'0',
        data:{}
    }
    res.end(JSON.stringify(result));
});

app.all('*', function (req, res) {
    res.end('not found')
})
app.listen(9000);