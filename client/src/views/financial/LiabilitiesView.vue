<template>
  <GlassPageShell title="负债管理" subtitle="查看与管理各平台负债记录">
    <GlassListPanel>
      <template #toolbar>
        <el-form ref="filterFormRef" :model="filterForm" inline class="glass-form">
          <el-form-item label="类型" prop="type">
            <el-select v-model="filterForm.type" placeholder="请选择流水类型" style="width: 160px">
              <el-option label="全部" :value="0" />
              <el-option label="收入" :value="1" />
              <el-option label="支出" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="日期" prop="type">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              placeholder="请选择日期范围"
              style="width: 240px"
            />
          </el-form-item>

          <el-form-item>
            <button class="glass-btn glass-btn--primary" type="button" style="margin-right: 8px" @click="handleFilter">
              查询
            </button>
            <button class="glass-btn glass-btn--ghost" type="button">添加</button>
          </el-form-item>
        </el-form>
      </template>

      <el-table :data="tableData" class="glass-table" height="100%">
        <el-table-column type="index" width="50" label="#" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <span class="type-badge" :class="row.type === 1 ? 'type-badge--income' : 'type-badge--expense'">
              {{ row.type === 1 ? '收入' : '支出' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" min-width="120">
          <template #default="{ row }">
            <span class="amount-text amount-text--expense">¥ {{ formatAmount(row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="140" />
        <el-table-column prop="remark" label="备注" min-width="160">
          <template #default="{ row }">
            <span class="remark-text">{{ row.remark || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <button class="glass-action-btn glass-action-btn--edit" type="button">编辑</button>
            <button class="glass-action-btn glass-action-btn--delete" type="button">删除</button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next"
          background
          class="glass-pagination"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </template>
    </GlassListPanel>
  </GlassPageShell>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type FormInstance } from 'element-plus';
import GlassPageShell from '@/components/layout/GlassPageShell.vue';
import GlassListPanel from '@/components/layout/GlassListPanel.vue';

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

const tableData = ref<Array<iTableData>>([]);

function formatAmount(amount: number) {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const handleFilter = () => {};

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page;
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
};
</script>
