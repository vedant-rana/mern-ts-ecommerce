import mongoose from "mongoose";

export const connectMongoDB = (uri: string) => {
  mongoose
    .connect(uri, {
      tlsAllowInvalidCertificates: true,
    })
    .then((data) => {
      console.log(`DB connected to ${data.connection.host}`);
    })
    .catch((error) => {
      console.log(`Error connecting to DB ${error.message}`);
    });
};
