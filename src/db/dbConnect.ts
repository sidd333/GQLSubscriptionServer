import mongoose from "mongoose";

// Connecting to MongoDB
const connectToDb = async () => {
   await mongoose.connect('mongodb+srv://siddhantchettri:69l1GUsovdNkwpA8@cluster0.nqromin.mongodb.net/mygraphql', {
        // 'useNewUrlParser' is no longer needed in Mongoose v6 and later
        // useUnifiedTopology: true, // Retain this option to use the new unified topology layer
    })
    .then(() => {
        console.log('Connected to MongoDB database');
    })
    .catch((error: any) => {
        console.error("Error connecting to MongoDB:", error);
    });
};

export default connectToDb;
