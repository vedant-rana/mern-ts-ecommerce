import mongoose from "mongoose";
export const connectMongoDB = (uri) => {
    mongoose
        .connect(uri, {
        dbName: "mern-ts-ecommerce",
    })
        .then((data) => {
        console.log(`DB connected to ${data.connection.host}`);
    })
        .catch((error) => {
        console.log(`Error connecting to DB ${error.message}`);
    });
};
