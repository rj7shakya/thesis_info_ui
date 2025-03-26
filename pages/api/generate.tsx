import {
  extractFacts,
  getHighestLabel,
  transformData,
} from "@/pages/api/utils";
import axios from "axios";

async function queryType(text: string) {
  try {
    const response = await axios.post(
      `${process.env.HF_API_URL}/albert_type2`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching Hugging Face API results:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Hugging Face API results.");
  }
}

async function queryImage(query: string) {
  try {
    const response = await axios.get(`${process.env.ICONFINDER_API_URL}`, {
      params: { query, count: 3 },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ICONFINDER_API_KEY}`,
      },
    });

    const { icons } = response.data;

    if (icons && icons.length > 0) {
      const images = icons.slice(0, 5).map((icon: any) => {
        const bestSizeIndex = icon.raster_sizes.length - 1; // Get largest available size
        return icon.raster_sizes[bestSizeIndex].formats[0].preview_url;
      });

      return { images: images.slice(0, 3) };
    } else {
      return { message: "No icons found" };
    }
  } catch (error: any) {
    console.error(
      "Error fetching Image results:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Hugging Face API results.");
  }
}

async function queryNER(text: string) {
  try {
    const response = await axios.post(
      `${process.env.HF_API_URL}/albert_tag_v2`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await extractFacts(response.data, text);
  } catch (error: any) {
    console.error(
      "Failed to fetch NER results:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch NER results.");
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { statement } = req.body;
  if (!statement) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    let facts: any = await queryNER(statement);
    facts = await Promise.all(
      facts.map(async (i: any) => {
        const type = await queryType(i?.statement);
        const images = await queryImage(i?.subject);
        return transformData({ ...i, type: getHighestLabel(type), ...images });
      })
    );

    res.status(200).json(facts);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
