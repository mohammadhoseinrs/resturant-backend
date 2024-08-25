import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to the MySQL database.");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the MySQL database:", err);
    process.exit(1);
  }
}

testConnection();

export default pool;
