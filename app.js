var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// App Config
mongoose.connect('mongodb://localhost/restful_blog_app', {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title: "TEst Blog",
//     image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
//     body: "Hello this is a blog post!"
// });
// RESTful Routes
app.get('/', function(req,res){
    res.redirect('/blogs');
});
// Index Route
app.get('/blogs', function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!");
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

// New Routes which shows new dog form
app.get('/blogs/new', function(req,res){
    res.render('new');
});
// Create Route, creates blog, then redirects to /blogs
app.post('/blogs', function(req,res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else {
            //then, redirectto the index
            res.redirect('/blogs');
        }
    });
});

//Show Route
app.get('/blogs/:id', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

//EDit Route
app.get('/blogs/:id/edit', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

//UPDate Route
app.put('/blogs/:id', function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

//Delete Route
app.delete('/blogs/:id', function(req,res){
    //destroy blogs
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    })
    //redirect somewhere
});

app.listen(process.env.PORT || 8000, function(){
    console.log("Listening on port %d in %s mode", this.address().port, app.settings.env);
});
