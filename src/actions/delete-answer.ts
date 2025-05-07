"use server";
import { deleteReading } from "@/services/torso-db";

export async function deleteAnswerById(data: FormData) {
  const answerId = data.get("answerId");
  if (answerId == null)
    return {
      success: false,
      message: null,
      error: "ไม่พบ answer ที่ต้องการลบ",
    };
  const result = await deleteReading(parseInt(answerId as string));

  if (!result) {
    return {
      success: false,
      message: null,
      error: "ไม่สามารถลบคำทำนายได้",
    };
  }

  return {
    success: true,
    error: null,
    message: "ลบคำทำนายสำเร็จแล้ว, กดตกลงเพื่อกลับหน้าหลัก",
  };
}
