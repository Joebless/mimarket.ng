import Work from "@models/Work";

// database.js
import { connectToDB } from "@mongodb/database";

export const connectToDatabase = async () => {
  try {
    await connectToDB();
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
};


/**
 * Fetches the list of works based on the specified category.
 * @param {Object} req - Request object
 * @param {Object} params - Parameters object containing the category
 * @returns {Response} - HTTP response containing the work list
 */
export const GET = async (req, { params }) => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract category from params
    const { category } = params;

    let workList;

    // Fetch work list based on the category
    if (category !== "All") {
      workList = await Work.find({ category }).populate("creator");
    } else {
      workList = await Work.find().populate("creator");
    }

    // Return the work list in the response
    return new Response(JSON.stringify(workList), { status: 200 });
  } catch (err) {
    // Handle errors and return a meaningful response
    return new Response(`Failed to fetch Work List: ${err.message}`, {
      status: 500,
    });
  }
};
