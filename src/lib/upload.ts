import { supabaseBrowser } from "@/lib/supabaseBrowser";

export async function uploadToMediaBucket(params: {
  userId: string;
  folder: "avatar" | "cover" | "brands" | "posts";
  file: File;
}) {
  const { userId, folder, file } = params;

  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabaseBrowser.storage
    .from("media")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (upErr) throw upErr;

  const { data } = supabaseBrowser.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
