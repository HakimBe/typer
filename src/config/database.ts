import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI || "mongodb://localhost:27017/typer"
    );
  } catch (err) {
    console.log("Something went wrong with the database connection");
    process.exit(1);
  }
};
