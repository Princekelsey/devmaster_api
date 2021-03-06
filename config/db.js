const mongoose = require("mongoose");

const connectDB = async () => {
  const connec = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB connected: ${connec.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
