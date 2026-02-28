import db from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const {
    name,
    email,
    whatsapp,
    alternate,
    selectedCollege,
    selectedCity,
    selectedState,
    experience,
    dob,
    gender,
    role
  } = req.body;

  try {
    await db.query(
      `INSERT INTO students
      (name, email, mobile, alternate_mobile, college, city, state, experience, dob, gender, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        whatsapp,
        alternate,
        selectedCollege,
        selectedCity,
        selectedState,
        experience,
        dob,
        gender,
        role
      ]
    );

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User already exists or DB error"
    });
  }
}