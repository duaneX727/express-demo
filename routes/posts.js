// Request params object. Powering a blog. get all the posts for a given month and a given year.
app.get('/api/posts/:year/:month',(req,res) =>{
  res.send(req.params);
});
// Query string parameters
// http://localhost:5004/api/posts/2099/1?sortBy=name
app.get('/api/posts/:year/:month',(req,res) =>{
  res.send(req.query);
});

// Getting a single post from the server
app.get('/api/posts/:id', (req, res) => {
  res.send(res.query)
});




