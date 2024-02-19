import { connectToDB } from "@mongodb/database";
import { writeFile } from "fs/promises";
import Work from "@models/Work";
import { createClient } from "@supabase/supabase-js";
import uniqid from "uniqid";

export async function POST(req) {
  try {
    /* Connect to MongoDB */
    await connectToDB();

    const data = await req.formData();

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    /* Extract info from the data */
    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");
    const phone = data.get("phone");

    /* Get an array of uploaded photos */
    const photos = data.getAll("workPhotoPaths");
    const bucket = "fastfastfood";
    const workPhotoPaths = [];

    /* Process and store each photo */
    for (const photo of photos) {
      const ext = photo.name.split(".").pop();
      const newphotosName = uniqid() + "." + ext;

      // Convert it to a Buffer
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Define the destination path for the uploaded file
      const uploadPath = `${newphotosName}`;

      // Upload file with proper content type
      const { data: uploadResult, error } = await supabase.storage
        .from(bucket)
        .upload(uploadPath, buffer, {
          contentType: photo.type, // Specify the content type based on the original file type
        });

      if (error) {
        console.error(error);
        return new Response(JSON.stringify({ error }), { status: 500 });
      }

      const link =
        "https://frsmcjzgunhzcsxffmyj.supabase.co/storage/v1/object/public/" +
        bucket +
        "/" +
        newphotosName;
      workPhotoPaths.push(link);
    }

    /* Create a new Work */
    const newWork = new Work({
      creator,
      category,
      title,
      description,
      price,
      phone,
      workPhotoPaths,
    });

    await newWork.save();

    return new Response(JSON.stringify(newWork), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new Work", { status: 500 });
  }
}
