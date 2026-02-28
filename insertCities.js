import mysql from "mysql2/promise";
import fs from "fs";

const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "cshr_db",
};

async function insertCities() {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);

    const rawData = fs.readFileSync("./cleaned_cities.json");
    const cities = JSON.parse(rawData);

    console.log(`Inserting ${cities.length} cities...`);

    for (const item of cities) {
      await connection.execute(
        "INSERT INTO cities (city, state) VALUES (?, ?)",
        [item.city, item.state]
      );
    }

    console.log("✅ Cities inserted correctly!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error inserting cities:", error);
  }
}

insertCities();