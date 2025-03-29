import axios from "axios";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { statement } = req.body;
  if (!statement) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/statement", {
      statement,
    });
    const facts = response.data;
    res.status(200).json(facts);
  } catch (error: any) {
    console.log("error", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
