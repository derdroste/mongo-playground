const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (v, callback) {
                setTimeout(() => {
                    const result =  v && v.length > 0;
                    callback(result);
                }, 1000);
            },
            message: 'A course should have at least one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() {return this.isPublished},
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Node.js Course',
        category: 'Web',
        author: 'Lukas',
        tags: ['node', 'backend'],
        isPublished: true
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (let field in ex.errors)
            console.log(ex.errors[field].message);
    }
}

async function getCourses() {
    // eq => equal
    // ne => not equal
    // gt => greater than
    // gte => greater/equal
    // lt => less than
    // lte => less than/equal
    // in
    //nin => not in

    // or
    // and

    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10

    await Course
         .find({ author: 'Lukas', isPublished: true})
      // .find({ price: { $gte: 10, $lte: 20 } })
      // .find({ price: { $in: [10, 15, 20 ]}})
      // .find()
      // .or([ {author: 'Lukas'}, { isPublished: true } ])
      // Starts wit Lukas
      // .find({ author: /^Lukas/})
      // Ends with Droste
      // .find({ author: /Droste$/i })
      // Contains Lukas
      // .find({ author: /.*Lukas.*/i })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1 })
      // .select({ name: 1, tags: 1})
        .count()
        .then(result => console.log(result));
}

async function updateCourse(id) {
    // Approach: Query first
    const course = await Course.findById(id);
    if (!course) return;

    course.set({
        isPublished: true,
        author: 'Another Author'
    });

    await course.save()
        .then(result => console.log(result))
        .catch(err => console.log(err));

    // Approach: Update first
    await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Lukas',
            isPublished: false
        }
    }, {new: true}).then(result => console.log(result));
}

async function removeCourse(id) {
    await Course.findByIdAndRemove(id)
        .then(result => console.log(result));
}

// removeCourse('5fb44638945b5a0824d04e0b');
// updateCourse('5fb44638945b5a0824d04e0b');

// getCourses();

// createCourse();