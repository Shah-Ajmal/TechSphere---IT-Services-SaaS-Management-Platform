import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Mongoose connection event listeners
// mongoose.connection.on("disconnected", () => {
//   console.log("⚠️  MongoDB disconnected");
// });

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

export default connectDB;
