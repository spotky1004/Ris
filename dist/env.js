import dotenv from "dotenv";
void dotenv.config({
    path: ".env"
});
const token = process.env.token;
export { token };
