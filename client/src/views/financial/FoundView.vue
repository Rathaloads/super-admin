<template>
  <div class="list-view rounded-[12px] bg-white">
    <div class="list-view">
      <div class="list-view-header">
        <el-form ref="filterFormRef" :model="filterForm" inline>
          <el-form-item label="类型" prop="type">
            <el-select v-model="filterForm.type" placeholder="请选择流水类型" class="w-[160px]">
              <el-option label="全部" :value="0" />
              <el-option label="收入" :value="1" />
              <el-option label="支出" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="日期" prop="type">
            <el-date-picker type="daterange" v-model="filterForm.dateRange" placeholder="请选择日期范围" class="w-[240px]" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button type="primary">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="list-view-content">
        <el-table :data="tableData" style="width: 100%" height="100%">
          <el-table-column type="index" width="50" label="#" />
          <el-table-column prop="type" label="类型">
            <template #default="scope">
              <el-tag :type="scope.row.type === 1 ? 'success' : 'danger'">{{ scope.row.type === 1 ? '收入' : '支出'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" />
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column prop="remark" label="备注">
            <template #default="scope">
              <span>{{ scope.row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary">编辑</el-button>
              <el-button type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="list-view-footer">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
          :total="pagination.total" layout="prev, pager, next" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { type FormInstance } from 'element-plus';
import { useFinancialStore } from '@/stores/financial';
import { financialApi } from '@/api/financial';

interface iFilterForm {
  type: number;
  dateRange: Array<string>;
}

interface iTableData {
  id: number;
  type: number;
  amount: number;
  remark: string;
  createdAt: string;
}

const financialStore = useFinancialStore();
// const { incomeCategoryList, expenditureCategoryList } = storeToRefs(financialStore);
const { getFundCategoryList } = financialStore;

const filterFormRef = ref<FormInstance>();
const filterForm = reactive<iFilterForm>({
  type: 0,
  dateRange: [],
});
const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
  total: 0,
});

const tableData = ref<Array<iTableData>>([
  {
    id: 1,
    type: 1,
    amount: 100,
    remark: '',
    createdAt: '2026-01-01',
  },
]);


const handleFilter = () => { };

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page;
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
};

const init = async () => {
  const { data: { Data } } = await financialApi.getFundList(pagination.currentPage, pagination.pageSize);
  console.log(Data);
}

onMounted(() => {
  if (financialStore.incomeCategoryList.length === 0 && financialStore.expenditureCategoryList.length === 0) {
    console.log('获取分类列表: ', financialStore.incomeCategoryList, financialStore.expenditureCategoryList);
    getFundCategoryList();
  }
  init();
});
</script>
