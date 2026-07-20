import mongoose from "mongoose";

try {
  await mongoose.connect(
    "mongodb+srv://shambu:Abhi123456@abhijeet.6u1mzzi.mongodb.net/test"
  );

  console.log("✅ Connected");
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}