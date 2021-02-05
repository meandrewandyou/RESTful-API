const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

// Creating DB , schema and model
// Создаем базу данных, схему и модель

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const wikiSchema = mongoose.Schema({
  title: "String",
  content: "String"
});

const Article = new mongoose.model("article", wikiSchema);


// We use chainble route

app.route("/articles")
// Send to user objects from our DB
// Отправляем пользователю объекты с нашей БД по запросу
.get(function(req,res){

  Article.find(function(err,foundArticle){
    if (err){
      res.send(err);
    }else{
      res.send(foundArticle);
    }
  });
})
// Let user create a new article
// Пользователь добавляет новый объект в БД
.post(function(req,res){

  console.log(req.body.title);
  console.log(req.body.content);

const newArticle = new Article({
  title: req.body.title,
  content: req.body.content
});

newArticle.save(function(err){
  if(!err){
    res.send("New article succesfully added!")
  }else{
    res.send(err)
  }
});
})
// Delete all items from article collection
// Удаление всех объектов с коллекции
.delete(function(req,res){

  Article.deleteMany(function(err){
    if(!err){
      res.send("All articles succesfully deleted!")
    }else{
      res.send(err)
    }
  });
});

// Chainble route for single item operations


app.route("/articles/:itemRoute")
.get(function(req,res){
  const itemRoute = req.params.itemRoute;

  // Find one

Article.findOne({title: itemRoute}, function(err, foundArticle){
console.log(foundArticle);
  if(foundArticle){
    res.send(foundArticle)
  }else{
    res.send("No match found.")
  }
});

})

// Put (replace) one

.put(function(req,res){
  const itemRoute = req.params.itemRoute;

  Article.replaceOne(
    {title: itemRoute},
    {title: req.body.title, content: req.body.content},
    function(err, foundOne){
      if(!err){
        res.send(foundOne)
      }else{
        console.log(err);
      }
    }
  )
})

// Patch (update without replacement) elements of single item

.patch(function(req,res){
  const itemRoute = req.params.itemRoute;
Article.updateOne(
  {title: itemRoute},
  {$set: req.body},
  function(err){
    if(!err){
      res.send("Article succesfully patched");
    }else{
      res.send(err)
    }
  }
)

})

// Delete single item

.delete(function(req,res){
  const itemRoute = req.params.itemRoute;
Article.deleteOne(
  {title: itemRoute},
  function(err){
    if(!err){
      res.send("Article succesfully deleted")
    }else{
      res.send(err)
    }
  }
)
});






















app.listen(3000,function(){
  console.log("Server started");
});
