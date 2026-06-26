import { financialApi } from "@/api/financial";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { FundCategory } from "@/api/financial.d";


export interface iFundCategoryTreeList {
  id: number;
  parentId: number;
  type: number;
  name: string;
  children: Array<iFundCategoryTreeList>;
}

export const useFinancialStore = defineStore('financial', () => {
  // 收入分类列表
  const incomeCategoryList = ref<Array<iFundCategoryTreeList>>([]);
  // 支出分类列表
  const expenditureCategoryList = ref<Array<iFundCategoryTreeList>>([]);

  const listToTree = (list: Array<iFundCategoryTreeList>, rootId: number) => {
    const map = new Map<number, iFundCategoryTreeList>();
    const treeList: Array<iFundCategoryTreeList> = [];

    for (const item of list) {
      map.set(item.id, item);
    }

    for (const item of list) {
      const node = map.get(item.id)!;
      if (node?.parentId === rootId) {
        treeList.push(node);
      } else {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    }

    return treeList;
  }

  const getFundCategoryList = async () => {
    const { data: { Data } } = await financialApi.getFundCategoryList();

    let list = Data;
    let incomeList: Array<iFundCategoryTreeList> = [];
    let expenditureList: Array<iFundCategoryTreeList> = [];
    list.forEach((item) => {
      if (item.type === 1) {
        incomeList.push({
          id: item.id,
          parentId: item.parentId,
          type: item.type,
          name: item.name,
          children: [],
        });
      } else {
        expenditureList.push({
          id: item.id,
          parentId: item.parentId,
          type: item.type,
          name: item.name,
          children: [],
        });
      }
    });
    incomeCategoryList.value = listToTree(incomeList, 0);
    expenditureCategoryList.value = listToTree(expenditureList, 0);
    console.log(list, incomeCategoryList.value, expenditureCategoryList.value);
  }

  return {
    incomeCategoryList,
    expenditureCategoryList,
    getFundCategoryList
  }
})