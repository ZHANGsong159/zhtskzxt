<template>
    <div>
        <el-pagination
            style="margin-top: 20px;"
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            hide-on-single-page
            @current-change="handleCurrentChange"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.$emit('currentChange', val)
        }
    },
    props: {
        total: {
            type: Number,
            default: 0
        },
        pageSize:{
            type: Number,
            default: 10
        }
    }
}
</script>