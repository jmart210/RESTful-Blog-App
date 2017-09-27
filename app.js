var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// App Config
mongoose.connect('mongodb://localhost/restful_blog_app', {useMongoClient: true});
mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

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

app.get('/blogs', function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!");
        } else {
            res.render('index', {blogs: blogs});
        }
    });
});

app.listen(process.env.PORT || 8000, function(){
    console.log("Listening on port %d in %s mode", this.address().port, app.settings.env);
});
