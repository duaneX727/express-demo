const express = require('express');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const router = express.Router();
const Joi = require('joi');
const mongoose = require('../middleware/connect2DB');

// Schema 
const courseSchema = new mongoose.Schema({
  //_id: String,
  name: {
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 30,
    //match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true
  },
  author: String,
  date: {
    type: Date, default: Date.now(),
    min: Date.parse('1/1/1901'),
    max: Date.parse('1/1/2050')
  },
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: (v, callback) => {
        // Do Async work
        setTimeout(()=>{
          const result =  v && v.length > 0;
          callback(result);
        },0);
      },
      message: 'A course should have at least one tag.'
    },
  },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function(){return this.isPublished
    },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v)   
  }
});
// Model
courseSchema.plugin(mongooseLeanVirtuals);
const Course = mongoose.model('Course', courseSchema);
// Object based on this.Class

// Save to DB
async function createCourse(){
  const course = new Course({
    name:'Eat Pussy Course',
    category: 'Web',
    author:'Duane Mitchell',
    tags:['frontend'],
    isPublished: true,
    price: 100.89
  });
    try {
      const result = await course.save();
      console.log(result);
    } 
    catch (ex) {
      for (field in ex.errors)
        //console.log(ex.errors[field]); // error OBJ
        console.log(ex.errors[field].message); // error message for EACH property
    }
}
//createCourse()
//Updating a Document- Update First
async function updateCourse(id){
 const course = await Course.findByIdAndUpdate(id,{
  $set: {
    author: 'Freddy ' + '\"Hana Barbara" ' + 'Flintstone',
    isPublished: true
  }
 },{new: true});
 console.log(course);
}
//updateCourse("5a68fe2142ae6a6482c4c9cb");
//Remove a Document
async function removeCourse(id){
  //const result = await Course.deleteOne({_id:id});
  //const result = await Course.deleteMany({_id:id});
  const course = await Course.findByIdAndRemove({_id:id});
  console.log(course);
 }
 //removeCourse("62a60ff818e33d8f801397ef");

async function getCourses(){
  return await Course
    //.find({isPublished: true, tags:{$in:['frontend','backend']}})
    .find({_id:'62a64c2cd6b98e4e945648ba'})
    .sort('name')
    .select('name tags price')
    //.select('name author price')
    
}
async function run() {
  const courses = await getCourses();
  console.log(courses[0].price);
}
//run();
//GET
router.get('/',async (req, res) => {
  const courses = await Course.find
  res.send(courses);
});
// POST
router.post('/', (req, res) => {
  const {error} = validateCourse(req.body);
  if(error){
    return res.status(400).send(error.details[0].message);
 }
 const name = courses.find(c => c.name === req.body.name);
 //course = courses.find(c => c.id === parseInt(req.params.id));
 if(name) {
   return res.status(404).send(`Duplicate record found. Choose another Name`);
  } else {
    const course = {
      id: courses.length + 1,
      name: req.body.name
    };
    courses.push(course);
    //courses.splice(courses.length,0,course)
    res.send(course);
 }
 });
   // request a single course
  router.get('/:id',async (req,res) => {
    const courses = await Course.find();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    //const course = Course.findById({$oid:(req.params.i)d});
    if(!course) res.status(404).send(`The course with the given ID was not found`);
    res.send(course);
  });
  // Single PUT request
router.put('/:id',(req, res)=>{
  const course = courses.find(c => c.id === parseInt(req.params.id));
  const name = courses.find(c => c.name === req.body.name);
  const {error} = validateCourse(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  if(name || !course) {
    return res.status(404).send(`Invalid request`);
   } else {
     const course = {
       id: parseInt(req.params.id),
       name: req.body.name
     };
     courses.splice(parseInt(req.params.id)-1,1, course);
     res.send(course);
  }
});
// Delete  
router.delete('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send(`The course with the given ID was not found`);
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}

module.exports = router;