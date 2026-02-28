import db from "../../lib/db";

export default async function handler(req, res) {
  const { search } = req.query;

  if (!search || search.length < 3) {
    return res.status(200).json([]);
  }

  try {
    const [rows] = await db.execute(
      "SELECT name FROM colleges WHERE name LIKE ? LIMIT 10",
      [`%${search}%`]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}