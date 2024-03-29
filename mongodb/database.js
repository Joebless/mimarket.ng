import mongoose from "mongoose";

const createConnection = () => {
  let isConnected = false;

  const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    try {
      if (isConnected) {
        console.log("MongoDB is already connected!");
        return;
      }

      await mongoose.connect(process.env.MONGO);

      isConnected = true;

      console.log("MongoDB connected");
    } catch (err) {
      isConnected = false;
      console.error("MongoDB connection error:", err.message);
      throw new Error("MongoDB connection error");
    }
  };

  return connectToDB;
};

export const connectToDB = createConnection();
