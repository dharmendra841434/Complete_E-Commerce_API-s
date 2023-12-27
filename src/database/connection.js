import mongoose from "mongoose";

const DataBaseConnector = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default DataBaseConnector;
