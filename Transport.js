const response=("http://transfer.ttc.com.ge:8080/otp/routers/ttc/index/stops")
let XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest
let xhr= new XMLHttpRequest();
const mysql=require("mysql")
var cors = require('cors');
const express = require("express");
const app=express()
app.use(cors())
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
    optionSuccessStatus: 200
}
const db=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database:'tbilisitransports'
})


db.connect((err,res)=>{
    if(err){
        throw err
    }
    console.log("connect database")
})
app.post("/create/database",(req,res)=>{
    let sql="CREATE DATABASE tbilisitransports";
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send("database created")
    })
})
app.post("/create/table",(req,res)=>{
    let sql="CREATE TABLE transport(id INT AUTO_INCREMENT,name varchar(50),lat varchar(50),lon varchar(50),PRIMARY KEY(id))";
    db.query(sql,(err,result)=>{
        if(err) throw err
        res.send("datatable created")
    })
})
xhr.responseType='';
xhr.onreadystatechange=()=>{

    if(xhr.status==200 && xhr.readyState==4){
        const data=JSON.parse(xhr.responseText);
        for(let i=0;i<data.length;i++) {
           const name=data[i].name;
           const lat=data[i].lat;
           const lon=data[i].lon
           console.log(lon)
             let post={name:name, lat:lat,lon:lon}
    let sql="INSERT INTO transport SET ?"
    db.query(sql,post,(err,result)=>{
        if (err) throw err;
    })
        }

    }

};


xhr.open('GET',response);
xhr.send();

app.get("/posts",(req,res)=>{
    let sql=`SELECT * FROM transport `;
    db.query(sql,(err,result)=>{
        if(err) throw err;

        var normalResults = result.map((mysqlObj) => {
            return Object.assign({}, mysqlObj);
        });
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({"result":normalResults}))
    })
})
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.listen(8080)