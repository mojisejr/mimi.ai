export interface IExchangeSetting {
  id: number;
  exchangeType: string;
  receivedItem: string;
  coinPerUnit: number;
  isActive: boolean;
  metadata: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICoinExchanges {
  id: number;
  lineId: string;
  exchangeType: string;
  coinAmount: number;
  receivedItem: string;
  receivedAmount: number;
  metadata: string;
  status: "completed" | "refuneded" | "failed";
  createdAt: Date;
}
