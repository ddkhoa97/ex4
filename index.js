const express = require('express')
const app = express()
const port = 4000
var fs = require("fs")
const cors = require('cors');
const { query } = require('express');
const data = require('./data.json');
const data_users=require('./users.json');
const data_invoices=require("./invoices_a_user.json");
const { v4: uuidv4 } = require('uuid');
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

var new_item=
  {
    "id": 1,
    "name": "Roku Express 4K+ 2021 | Streaming Media Player HD/4K/HDR with Smooth Wireless Streaming and Roku Voice Remote with TV Controls, Includes Premium HDMI Cable",
    "seller": "Seagate",
    "type": "Roku",
    "original_price": 62.99,
    "promotion_price":0,
    "shipping":33.58,
    "rating": 4.5,
    "image": "book1.png",
    "promos": [
      "Winner of the Pulitzer Prize in Fiction",
      "Shortlisted for the Man Booker Prize",
      "New York Times Bestseller",
      "A New York Times Notable Book and a Washington Post, Time, Oprah Magazine, Newsweek, Chicago Tribune, and Kirkus Reviews Best Book of 2018",
      "The best novel ever written about trees, and really just one of the best novels, period.' ―Ann"
    ]
  }

var update_item=
  {
    "id": 10,
    "name": "The Overstory: A Novel",
    "author": "Richard Powers",
    "type": "Paperback",
    "price": 1137000000,
    "rating": 10000,
    "image": "book1.png",
    "promos": [
      "Winner of the Pulitzer Prize in Fiction hihihihihihihihihihihihihi",
      "Shortlisted for the Man Booker Prize",
      "New York Times Bestseller",
      "A New York Times Notable Book and a Washington Post, Time, Oprah Magazine, Newsweek, Chicago Tribune, and Kirkus Reviews Best Book of 2018",
      "The best novel ever written about trees, and really just one of the best novels, period.' ―Ann"
    ]
  }

var new_user={
    id:data_users.users.length+1,
  'name':'Dang Khoa12312312',
  'address':'Kalervontie',
  'phone':'123456789'
}

var new_invoice=[  {   
  "product_id":1,
  "qty":1,
  "price":2000,
  "total":2000
    },
    {   
    "product_id":2,
    "qty":2,
    "price":2000,
    "total":4000
    }
  ]


app.get('/', (req, res) => {
  res.send('Hello World!')
})




//GET ALL PRODUCTS && GET SINGLE PRODUCT
app.get('/products', async (req, res) => {
  if(req.query.id == undefined)
  {
  
    res.json(data.items);
  }
  else{
    res.json( await data.items.filter(item => item.id == req.query.id));
  }
  
});

//GET PRODUCTS BY CONDITIONS

app.get('/products/search', (req, res) => {
  
 const filters = req.query
   
   for(var key in filters)
   {
        console.log(key)
   
   }
  filtered_data= data.items.filter(item =>{
    for(var key in filters)
    {
      if(item[key] === undefined || item[key] != filters[key])
      {
        
        return false;
      }
      return true;
    
    }
  
  })
  console.log(filtered_data)


 
});



//CREATE NEW PRODUCT
app.post('/products/add-new', (req, res) => {
  
    data.items[data.items.length]= req.body;
    fs.writeFile('data.json', JSON.stringify(data),  function(err) {
      if (err) {
          return console.error(err);
      }});
     res.send("Successful!")


});


//MODIFY PRODUCT
app.patch('/products/modify/:id', (req, res) => {
  data.items[req.params.id-1]= update_item;
  fs.writeFile('data.json', JSON.stringify(data),  function(err) {
    if (err) {
        return console.error(err);
    }});

  console.log("Successful !!!");
  console.log(data)
 // return("Successful !!!");
});


//DELETE PRODUCTS
app.delete('/products/delete/:id', (req, res) => {
 
 
 data.items=data.items.filter(item => item.id != req.params.id)
    
    fs.writeFile('data.json', JSON.stringify(data),  function(err) {
      if (err) {
          return console.error(err);
      }});
    res.json(data);
     return("Successful !!!")
});



//CREATE NEW USER
app.post('/users/add-new', (req, res) => {
  data_users.users[data_users.users.length]= req.body;
  fs.writeFile('users.json', JSON.stringify(data_users),  function(err) {
    if (err) {
        return console.error(err);
    }});
res.send("Successful!")
});

// CREATE INVOICES

app.post('/check-out', (req, res) => {

    console.log(req.body)
      var purchases={
        "product_id":req.body.product_id,
        "qty":req.body.qty,
        "price":req.body.price,
        "total":req.body.total
         
      }
//  data_invoices.invoices[data_invoices.invoices.length]={
//     "user_id":1, //Get it from client side
//     "invoice_id":uuidv4(), // current = previous + 1
//     "purchases":new_invoice
//   }
//   fs.writeFile('invoices_a_user.json', JSON.stringify(data_invoices),  function(err) {
//     if (err) {
//         return console.error(err);
//     }});
    res.send("Successful !!!");
});

//GET A OR MANY INVOICES OF A USER
app.get('/users/invoices', (req, res) => {

  if(req.query.invoiceId != undefined)
  {
    filtered_data=data_invoices.invoices.filter(item => item.user_id == req.query.id && item.invoice_id == req.query.invoiceId)
  }
  else{
    filtered_data=data_invoices.invoices }
    console.log(filtered_data)
    res.json(filtered_data)
});


//DELETE INVOICE OF A USER

app.delete('/invoices/delete/:id', (req, res) => {
  
  const id_invoice= req.params.id

   data_invoices.invoices=data_invoices.invoices.filter(item =>item.invoice_id != id_invoice)
  fs.writeFile('invoices_a_user.json', JSON.stringify(data_invoices),  function(err) {
    if (err) {
        return console.error(err);
    }});
  
     res.json( data_invoices)
    res.send("successful !")
 });

 //DELETE ALL INVOICES OF A USER
 app.delete('/invoices/delete', (req, res) => {
  data_invoices.invoices= [];
    res.json( data_invoices)
 });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})