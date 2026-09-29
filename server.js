const express=require('express'),fs=require('fs'),path=require('path'),jwt=require('jsonwebtoken'),QRCode=require('qrcode');
const app=express(),PORT=process.env.PORT||3000,DATA=path.join(__dirname,'data/store.json'),PASS=process.env.ADMIN_PASSWORD||'change-this-password',SECRET=process.env.JWT_SECRET||'change-this-secret';
app.use(express.json({limit:'5mb'}));app.use(express.static(path.join(__dirname,'public')));app.get('/package/:id',(q,s)=>s.sendFile(path.join(__dirname,'public/package.html')));
const read=()=>JSON.parse(fs.readFileSync(DATA));const write=x=>fs.writeFileSync(DATA,JSON.stringify(x,null,2));
function auth(q,s,n){try{q.admin=jwt.verify((q.headers.authorization||'').replace('Bearer ',''),SECRET);n()}catch(e){s.status(401).json({error:'Unauthorized'})}}
app.get('/api/products',(q,s)=>s.json(read().products.filter(x=>x.active)));
app.post('/api/orders',(q,s)=>{let d=read(),b=q.body;if(!b.customer||!b.items?.length)return s.status(400).json({error:'Invalid order'});let id='ORD-'+Date.now();d.orders.push({...b,id,status:'New',createdAt:new Date().toISOString()});write(d);s.json({ok:true,orderId:id})});
app.post('/api/admin/login',(q,s)=>q.body.password===PASS?s.json({token:jwt.sign({admin:true},SECRET,{expiresIn:'7d'})}):s.status(401).json({error:'Wrong password'}));
app.get('/api/admin/products',auth,(q,s)=>s.json(read().products));
app.post('/api/admin/products',auth,(q,s)=>{let d=read(),p={...q.body,id:q.body.id||'RL-'+Date.now(),active:q.body.active!==false};d.products.push(p);write(d);s.json(p)});
app.put('/api/admin/products/:id',auth,(q,s)=>{let d=read(),i=d.products.findIndex(x=>x.id===q.params.id);if(i<0)return s.status(404).json({error:'Not found'});d.products[i]={...d.products[i],...q.body,id:q.params.id};write(d);s.json(d.products[i])});
app.get('/api/admin/orders',auth,(q,s)=>s.json(read().orders));
app.put('/api/admin/orders/:id',auth,(q,s)=>{let d=read(),o=d.orders.find(x=>x.id===q.params.id);if(!o)return s.status(404).json({error:'Not found'});Object.assign(o,q.body);write(d);s.json(o)});
app.get('/api/admin/packages',auth,(q,s)=>s.json(read().packages));
app.post('/api/admin/packages',auth,(q,s)=>{let d=read(),p={...q.body,id:q.body.id||'PKG-'+Date.now()};d.packages.push(p);write(d);s.json(p)});
app.put('/api/admin/packages/:id',auth,(q,s)=>{let d=read(),p=d.packages.find(x=>x.id===q.params.id);if(!p)return s.status(404).json({error:'Not found'});Object.assign(p,q.body);write(d);s.json(p)});
app.get('/api/package/:id',(q,s)=>{let p=read().packages.find(x=>x.id===q.params.id);p?s.json(p):s.status(404).json({error:'Package not found'})});
app.get('/api/package/:id/qr',async(q,s)=>{let u=`${process.env.PUBLIC_BASE_URL||q.protocol+'://'+q.get('host')}/package/${encodeURIComponent(q.params.id)}`;s.type('png');s.send(await QRCode.toBuffer(u,{width:900,margin:2}))});
app.listen(PORT,()=>console.log('ROGUELAB on '+PORT));
