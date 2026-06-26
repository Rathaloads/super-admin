export interface FundCategory {
  id: number;
  parentId: number;
  type: number;
  name: string;
  icon: string;
  isDeleted: number;
}

export interface Fund {
  id: number;
  type: number;
  categoryIds: number[];
  categoryName: string[];
  amount: number;
  remark: string;
  createdAt: string;
  extend: string;
}