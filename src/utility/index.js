import { v4 as uuidv4 } from "uuid";

export const getRandom32UniqueCode = () => {
  const uniqueCode = uuidv4().toString().replace(/-/gi, "");
  return uniqueCode;
};
