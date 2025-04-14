import { PackageInfo } from "@/interfaces/i-package";
import { torso } from "../torso-db";
export const getActivePack = async () => {
  try {
    const pack = await torso.execute({
      sql: "SELECT * FROM pack",
    });

    const rows =
      pack.rows.length <= 0
        ? []
        : pack.rows.map(
            (row) =>
              ({
                id: row.id,
                packageTitle: row.title,
                subtitle: row.subtitle,
                priceNumber: row.price
                  ? parseInt(row.price.toString()) * 100
                  : 0,
                price: row.price?.toString(),
                creditAmountNumber: row.credit_amount
                  ? parseInt(row.credit_amount.toString())
                  : 0,
                creditAmount: row.credit_amount?.toString(),
                currency: "฿",
                ctaText: row.cta_text,
              } as PackageInfo)
          );

    return rows;
  } catch (error) {
    console.log(error);
    return [];
  }
};
