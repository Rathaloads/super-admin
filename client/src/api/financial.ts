import { request } from "@/network/request";
import type { FundCategory, Fund } from "./financial.d";

export const financialApi = {
  getFundCategoryList: () => request.get<Array<FundCategory>>('/fund/category'),

  getFundList: (page: number, pageSize: number) => request.get<Array<Fund>>('/fund/fund-list', { params: { page, pageSize } }),
}