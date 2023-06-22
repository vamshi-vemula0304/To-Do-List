//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _=require("lodash");
const mongoose = require("mongoose");
const app = express();
// main().catch(err => console.log(err));

// async function main() {
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todoList');
const itemSchema = new mongoose.Schema({
  name: String 
  });
const Item= mongoose.model("Item",itemSchema);

const item1 = new Item({
  name:"Welcome to Your To-Do List"
})
const item2 = new Item({
  name:"Hit + button to add items to list"
})
const item3 = new Item({
  name:"<-- Hit this when you completed the task item"
})

const defaultItems = [item1,item2,item3];

const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
});

const List=mongoose.model('List',listSchema);

// const items = ["Buy Food", "Cook Food", "Eat Food"];


const day = date.getDate();
const workItems = [];

app.get("/", function(req, res) {
  
  
  blah()// calling the below fubction
  async function blah(){
    try{
      const data=await Item.find();
      if (data.length===0){
        Item.insertMany(defaultItems).then(function(){
          console.log("submitted default items into DB")
        }).catch(function(err){
          console.log(err)
        })
      }

      // res.render("list", {listTitle: day, newListItems: data});
      res.render("list", {listTitle: 'Today', newListItems: data});

    }catch(err){
      console.log(err);
    }
  };
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const itemList = req.body.list;
  const item4 = new Item({
    name:itemName
  })
  if (itemList === 'Today'){
    item4.save();
    res.redirect("/")
  }else{
    gin();
    async function gin(){
      // List.find({name: itemList}, fumction(err,foundList){
      //   foundList.i
      // })


      const kimJongUn =await List.findOne({name: req.body.list});
      // console.log(kimJongUn.items);
      // console.log(kimJongUn);
      // // console.log(kimJongUn[0]);
      // // console.log(kimJongUn[0]['items']);
      // console.log(item4);

      try{
        kimJongUn.items.push(item4);
        await kimJongUn.save();
      }catch(err){
        console.log(err);
      }
      
      res.redirect("/"+itemList);;
    }
    
    
  }


  
  // Item.Save().then(function(){
  //   console.log("Uploaded the new item into DB")
  // }).catch(function(err){
  //   console.log(err)
  // })
  
});

app.post("/delete",function(req,res){
  // console.log(req.body);
  // console.log(Item.findOne(req.body.checkbox));
  Boo()
  async function Boo(){
    try{
      // await Item.findByIdAndRemove(req.body.checkbox);
      if (req.body.listName === 'Today'){
        await Item.deleteOne({_id:req.body.checkbox});
        res.redirect("/")
      }else{
        // console.log(req.body.listName)
        let listName = req.body.listName;
        // let filterCondition = {_id : req.body.checkbox}
        // let update={$pull: { items: { $in: [ "apples", "oranges" ] }}
        let donkey= await List.findOneAndUpdate({name: listName},{$pull:{items:{_id:req.body.checkbox}}},{new:true})
        // console.log(donkey);
        res.redirect("/"+listName);

      }
    }catch(err){
      console.log(err)
    }
  }
  
  
})

app.get("/:customLinkName",function(req,res){
  // console.log(req.params.customLinkName)
  const customLinkName=_.capitalize(req.params.customLinkName);
  sen();
  async function sen(){
    try{
      const gotchu= await List.find({name:customLinkName});
      // console.log(gotchu);
      if (gotchu.length===0){
        const list=new List({
          name:customLinkName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customLinkName)
      }else{
        const gotchu=await List.find({name:customLinkName});
        // res.render("list",{listTitle: customLinkName, newListItems: ["go re"]});
        res.render("list",{listTitle: gotchu[0]['name'], newListItems: gotchu[0]['items']});
      }
    }catch(err){
      console.log("error finding customLinkName in the list database: "+err)
    }
  }
  
})



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(8000, function() {
  console.log("Server started on port 8k");
});


// }