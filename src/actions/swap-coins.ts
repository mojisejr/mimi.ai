"use server";

import { swapCoins } from "@/services/torso/exchange";
import { IExchangeSetting } from "@/interfaces/i-exchage";

interface ISwapCoinsResult {
  success: boolean;
  data?: {
    inputCoins: number;
    outputPoint: number;
    exchangeType: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const swapCoinsAction = async (
  lineId: string,
  exchangeSetting: IExchangeSetting,
  inputCoins: number,
  outputPoint: number
): Promise<ISwapCoinsResult> => {
  try {
    // Validate input
    if (inputCoins <= 0 || outputPoint <= 0) {
      return {
        success: false,
        error: {
          code: "INVALID_AMOUNT",
          message: "จำนวนเหรียญหรือแต้มต้องมากกว่า 0",
        },
      };
    }

    if (!exchangeSetting.isActive) {
      return {
        success: false,
        error: {
          code: "INACTIVE_EXCHANGE",
          message: "ไม่สามารถแลกเหรียญได้ในขณะนี้",
        },
      };
    }

    const result = await swapCoins(
      lineId,
      exchangeSetting,
      inputCoins,
      outputPoint
    );

    return {
      success: true,
      data: {
        inputCoins: result.exchange.inputCoins,
        outputPoint: result.exchange.outputPoint,
        exchangeType: result.exchange.exchangeType,
      },
    };
  } catch (error) {
    console.error("Swap coins error:", error);

    if (error instanceof Error) {
      if (error.message === "User not found") {
        return {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "ไม่พบข้อมูลผู้ใช้",
          },
        };
      }

      if (error.message === "Insufficient coins") {
        return {
          success: false,
          error: {
            code: "INSUFFICIENT_COINS",
            message: "เหรียญไม่เพียงพอ",
          },
        };
      }
    }

    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
    };
  }
};
