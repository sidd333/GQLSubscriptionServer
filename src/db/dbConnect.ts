import mongoose from "mongoose";

// Connecting to MongoDB
const connectToDb = async () => {
   await mongoose.connect(process.env.MONGO_URI!, {
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
