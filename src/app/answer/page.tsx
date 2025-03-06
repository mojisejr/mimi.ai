import Link from "next/link";
import { cookies } from "next/headers";
import { IAnswer } from "@/interfaces/i-answer";

const mockParsedAnswer = {
  header:
    'สวัสดีค่ะคนสวย แม่หมอมีมี่เองนะคะ จากคำถามที่ว่า "ถ้าได้เจอจะได้เจอกันบ่อยขึ้นหรือเปล่า" แม่หมอขอเปิดไพ่ให้ 3 ใบนะคะ มาดูกันเลยว่าไพ่อะไรจะขึ้นมาบอกข่าวสารกันบ้าง ตั้งใจให้เป็นสมาธิ หรือทำใจสบายๆ ก่อนจับไพ่ให้นะคะ',
  cards: ["Two of Cups", "The Lovers", "Six of Wands"],
  reading:
    "จากหน้าไพ่ที่เปิดมานี้ บ่งบอกถึงความสัมพันธ์ที่มีแนวโน้มไปในทิศทางที่ดีขึ้นเรื่อยๆ เลยนะคะ ความรู้สึกดีๆ ที่มีให้กันจะนำพาให้คุณทั้งคู่ใกล้ชิดกันมากขึ้น การพบเจอกันบ่อยขึ้นจึงเป็นสิ่งที่คาดหวังได้เลยค่ะ แต่ทั้งนี้ทั้งนั้นก็ขึ้นอยู่กับการตัดสินใจและการกระทำของทั้งสองฝ่ายด้วยนะคะ ถ้าหากต่างฝ่ายต่างให้ความสำคัญและพยายามหาเวลาให้กัน การได้เจอกันบ่อยๆ ก็ไม่ใช่เรื่องยากเลยค่ะ นอกจากนี้ การที่ความสัมพันธ์พัฒนาไปในทางที่ดีขึ้นเรื่อยๆ นี้ จะนำมาซึ่งความสุขและความสำเร็จร่วมกัน ซึ่งจะยิ่งเป็นแรงผลักดันให้คุณทั้งคู่อยากที่จะใช้เวลาร่วมกันมากขึ้นไปอีกค่ะ",
  suggest:
    "แม่หมอแนะนำว่าให้คุณเปิดใจและสื่อสารความรู้สึกของคุณให้เขาได้รับรู้ถึงความต้องการที่จะใช้เวลาร่วมกันให้มากขึ้นนะคะ และในขณะเดียวกันก็รับฟังความต้องการของเขาด้วย การพูดคุยกันอย่างเปิดอกและจริงใจจะช่วยให้คุณทั้งคู่เข้าใจกันมากขึ้นและสามารถวางแผนการพบเจอกันได้อย่างลงตัวค่ะ",
  final:
    "แม่หมอมองว่ามีโอกาสสูงเลยทีเดียวที่คุณจะได้เจอกับเขาบ่อยขึ้น ความสัมพันธ์ของคุณมีแนวโน้มที่จะพัฒนาไปในทิศทางที่ดีขึ้นอย่างต่อเนื่อง ขอให้คุณมีความสุขกับความรักนะคะ",
  end: "ขอบคุณที่ให้แม่หมอมีมี่ได้ทำนายดวงให้คุณนะคะ ขอให้วันนี้เป็นวันที่ดีสำหรับคุณค่ะ",
  notice:
    "คำทำนายเป็นเพียงแนวทาง โปรดใช้วิจารณญาณในการตัดสินใจและดำเนินชีวิตนะคะ",
};

export default async function AnswerPage() {
  const hasAnswer = (await cookies()).has("answer");

  console.log("has answer: ", hasAnswer);

  if (!hasAnswer) {
    return (
      <div className="relative h-screen w-full max-w-xl overflow-hidden">
        <section className="h-6/6 overflow-scroll flex items-center">
          <Link href="/questions" className="btn">
            ไม่พบคำตอบ
          </Link>
        </section>
      </div>
    );
  }

  const answer = (await cookies()).get("answer")?.value;

  console.log("answer body: ", answer);

  if (!answer) {
    return (
      <div className="relative h-screen w-full max-w-xl overflow-hidden">
        <section className="h-6/6 overflow-scroll flex items-center">
          <Link href="/questions" className="btn">
            ไม่พบคำตอบ
          </Link>
        </section>
      </div>
    );
  }

  const parsedAnswer: IAnswer | null = answer ? JSON.parse(answer) : null;

  return (
    <>
      <section className="h-4/6 pt-[h-1/6]flex items-center p-4 overflow-y-auto">
        {parsedAnswer == null ? (
          <div>Loading ... </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <h1 className="border-l-2 border-accent p-2">
              {parsedAnswer.header}
            </h1>
            <div>
              <div className="text-xl font-bold">🎴 ไพ่ที่หยิบได้</div>
              {parsedAnswer.cards.map((card, index) => (
                <div key={index}>
                  {index + 1}. {card}
                </div>
              ))}
            </div>

            <h1 className="text-xl font-bold">🪄 คำทำนาย</h1>
            <p>{parsedAnswer?.reading}</p>
            <h1 className="text-xl font-bold">🤟 แนะนำ</h1>
            <p>{parsedAnswer?.suggest}</p>
            <h1 className="text-xl font-bold">💚 สรุป</h1>
            <p>{parsedAnswer?.final}</p>

            <div>{parsedAnswer.end} 🙏🙏</div>
            <div className="font-semibold text-accent">
              {parsedAnswer.notice}
            </div>
          </div>
        )}
      </section>
      <section className="h-1/6 flex w-full justify-center items-center">
        <Link href="/questions" className="btn">
          กลับหน้าคำถาม
        </Link>
      </section>
    </>
  );
}
