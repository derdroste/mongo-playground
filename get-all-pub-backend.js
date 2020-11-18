const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],

    date: { type: Date, default: Date.now },
    isPublished: Boolean
});
const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    await Course
        .find({tags: 'backend', isPublished: true})
        .sort({name: 1})
        .select({ name: 1, author: 1 })
        .then(result => console.log(result));
}

getCourses();

