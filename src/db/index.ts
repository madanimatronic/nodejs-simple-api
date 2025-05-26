import mongoose from 'mongoose';

export const startDB = async (
  connectionString: string,
  callback: () => void,
) => {
  await mongoose.connect(connectionString);
  callback();
};
