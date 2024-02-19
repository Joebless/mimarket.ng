import Work from "@models/Work";
import User from "@models/User";

import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const user = await User.findById(params.id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const workList = await Work.find({ creator: params.id }).populate(
      "creator"
    );

    user.works = workList;
    await user.save();

    return new Response(JSON.stringify({ user, workList }), { status: 200 });
  } catch (err) {
    console.error("Error fetching work list by user:", err);
    return new Response("Failed to fetch work list by user", { status: 500 });
  }
};
