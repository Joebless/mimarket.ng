import { connectToDB } from "@mongodb/database";
import { createClient } from "@supabase/supabase-js";
import uniqid from "uniqid";
import Work from "@models/Work";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const handleFileUpload = async (photo) => {
  if (photo instanceof Object) {
    const ext = photo.name.split(".").pop();
    const newPhotoName = uniqid() + "." + ext;

    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const bucket = "fastfastfood";
    const { data: uploadResult, error } = await supabase.storage
      .from(bucket)
      .upload(newPhotoName, buffer, {
        contentType: photo.type,
        upsert: true,
      });

    if (error) {
      console.error(error);
      throw new Error("Error uploading the photo");
    }

    return uploadResult.Key;
  } else {
    return photo; // If it's an old photo
  }
};

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const work = await Work.findById(params.id).populate("creator");

    if (!work) {
      return new Response("The Work Not Found", { status: 404 });
    }

    return new Response(JSON.stringify(work), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();
    const data = await req.formData();

    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    const photos = data.getAll("workPhotoPaths");
    const workPhotoPaths = await Promise.all(photos.map(handleFileUpload));

    const existingWork = await Work.findById(params.id);

    if (!existingWork) {
      return new Response("The Work Not Found", { status: 404 });
    }

    existingWork.category = category;
    existingWork.title = title;
    existingWork.description = description;
    existingWork.price = price;
    existingWork.workPhotoPaths = workPhotoPaths;

    await existingWork.save();

    return new Response("Successfully updated the Work", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error updating the Work", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Work.findByIdAndDelete(params.id);

    return new Response("Successfully deleted the Work", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error deleting the Work", { status: 500 });
  }
};
