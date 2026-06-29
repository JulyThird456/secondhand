<template>
	<div class="main-border">
		<div class="page-header">
			<h2 class="page-title">闲置商品管理</h2>
			<div class="search-container">
				<el-input 
					placeholder="搜索闲置名称..." 
					v-model="findValue" 
					@keyup.enter.native="searchIdle"
					prefix-icon="el-icon-search"
					clearable
					class="search-input">
					<el-button slot="append" icon="el-icon-search" @click="searchIdle">搜索</el-button>
				</el-input>
			</div>
		</div>

		<el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card" class="custom-tabs">
			<el-tab-pane label="上线的闲置" name="1">
				<div class="table-container">
					<el-table
						:data="onlineGoods"
						stripe
						style="width: 100%"
						:header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
						border
						v-loading="tableLoading">
						<el-table-column prop="releaseTime" label="发布日期" width="180"></el-table-column>
						<el-table-column prop="idleName" label="闲置名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="user.nickname" label="发布用户" min-width="100" width="120"></el-table-column>
						<el-table-column prop="idlePrice" label="价格" min-width="100" width="100">
							<template slot-scope="scope">
								<span class="price-tag">¥{{ scope.row.idlePrice }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" align="center">
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="danger"
									icon="el-icon-delete"
									@click="confirmOfflineGoods(scope.$index, scope.row)"
									round>
									违规下架
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tab-pane>
			
			<el-tab-pane label="下架的闲置" name="2">
				<div class="table-container">
					<el-table
						:data="OfflineGoods"
						stripe
						style="width: 100%"
						:header-cell-style="{ background: '#f5f7fa', color: '#303133', fontWeight: 'bold' }"
						border
						v-loading="tableLoading">
						<el-table-column prop="releaseTime" label="发布日期" width="180"></el-table-column>
						<el-table-column prop="idleName" label="闲置名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="user.nickname" label="发布用户" min-width="100" width="120"></el-table-column>
						<el-table-column prop="idlePrice" label="价格" min-width="100" width="100">
							<template slot-scope="scope">
								<span class="price-tag">¥{{ scope.row.idlePrice }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" align="center">
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="danger"
									icon="el-icon-delete"
									@click="confirmDeleteGoods(scope.$index, scope.row)"
									round>
									永久删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tab-pane>
		</el-tabs>

		<div class="pagination-container">
			<el-pagination
				@current-change="handleCurrentChange"
				:current-page.sync="nowPage"
				:page-size="8"
				background
				layout="total, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
    export default {
        name: "IdleGoods",
        data() {
            return {
                activeTab: "1",
                mode: 1,
                nowPage: 1,
                total: 0,
                onlineGoods: [],
                OfflineGoods: [],
                findValue: '',
                status: 1,
                tableLoading: false
            }
        },
        created() {
            this.getOnlineGoods();
        },
        methods: {
            handleTabClick(tab) {
                this.mode = parseInt(tab.name);
                this.status = parseInt(tab.name);
                this.nowPage = 1;
                
                if (this.mode === 1) {
                    this.getOnlineGoods();
                } else {
                    this.getOfflineGoods();
                }
            },
            searchIdle(){
                this.tableLoading = true;
                this.$api.queryIdle({
                    findValue: this.findValue,
                    page: this.nowPage,
                    nums: 8,
                    status: this.status
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1 && res.data.list != null) {
                        if(res.data.list[0].idleStatus == 1){
                            this.onlineGoods = res.data.list;
                            this.total = res.data.count;
                        } else {
                            this.OfflineGoods = res.data.list;
                            this.total = res.data.count;
                        }
                    } else{
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            handleCurrentChange(val) {
                this.nowPage = val;
                if (this.mode == 1) {
                    this.getOnlineGoods();
                }
                if (this.mode == 2) {
                    this.getOfflineGoods();
                }
            },
            handleSelect(val) {
                if (this.mode !== val) {
                    this.mode = val;
                    if (val == 1) {
                        this.nowPage = 1;
                        this.getOnlineGoods();
                    }
                    if (val == 2) {
                        this.nowPage = 1;
                        this.getOfflineGoods();
                    }
                }
            },
            confirmOfflineGoods(index, row) {
                this.$confirm('确定要将该闲置商品下架吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.makeOfflineGoods(index);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下架'
                    });          
                });
            },
            confirmDeleteGoods(index, row) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteGoods(index);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            makeOfflineGoods(i) {
                this.tableLoading = true;
                this.$api.updateGoods({
                    id: this.onlineGoods[i].id,
                    status: 2
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1) {
                        this.$message.success('商品已成功下架');
                        this.getOnlineGoods();
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            deleteGoods(i) {
                this.tableLoading = true;
                this.$api.updateGoods({
                    id: this.OfflineGoods[i].id,
                    status: 0
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1) {
                        this.$message.success('商品已永久删除');
                        this.getOfflineGoods();
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            getOnlineGoods() {
                this.tableLoading = true;
                this.$api.getGoods({
                    status: 1,
                    page: this.nowPage,
                    nums: 8
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1) {
                        this.onlineGoods = res.data.list;
                        this.total = res.data.count;
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            },
            getOfflineGoods() {
                this.tableLoading = true;
                this.$api.getGoods({
                    status: 2,
                    page: this.nowPage,
                    nums: 8
                }).then(res => {
                    this.tableLoading = false;
                    if (res.status_code == 1) {
                        this.OfflineGoods = res.data.list;
                        this.total = res.data.count;
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(e => {
                    this.tableLoading = false;
                    console.log(e)
                })
            }
        }
    }
</script>

<style scoped>
	.main-border {
		background-color: #fff;
		margin: 20px;
		padding: 25px;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
		border-radius: 10px;
		height: calc(100% - 40px);
		display: flex;
		flex-direction: column;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25px;
		border-bottom: 1px solid #ebeef5;
		padding-bottom: 15px;
	}

	.page-title {
		font-size: 20px;
		font-weight: 600;
		color: #303133;
		margin: 0;
	}

	.search-container {
		width: 350px;
	}

	.search-input {
		width: 100%;
	}

	.search-input >>> .el-input__inner {
		border-radius: 20px 0 0 20px;
		border-right: none;
	}

	.search-input >>> .el-input-group__append {
		border-radius: 0 20px 20px 0;
		background-color: #409EFF;
		border-color: #409EFF;
		color: white;
	}

	.search-input >>> .el-input-group__append .el-button {
		color: white;
		border: none;
	}

	.custom-tabs >>> .el-tabs__header {
		margin-bottom: 20px;
	}

	.custom-tabs >>> .el-tabs__item {
		font-size: 15px;
		padding: 0 25px;
		height: 40px;
		line-height: 40px;
	}

	.custom-tabs >>> .el-tabs__item.is-active {
		color: #409EFF;
		font-weight: bold;
	}

	.table-container {
		margin-bottom: 20px;
		flex: 1;
	}

	.el-table {
		border-radius: 6px;
		overflow: hidden;
	}

	.price-tag {
		color: #ff6b6b;
		font-weight: bold;
	}

	.pagination-container {
		margin-top: 20px;
		display: flex;
		justify-content: center;
	}

	.el-button--danger {
		background-color: #ff6b6b;
		border-color: #ff6b6b;
	}

	.el-button--danger:hover, .el-button--danger:focus {
		background-color: #ff8c8c;
		border-color: #ff8c8c;
	}

	/* 加载状态样式 */
	.el-loading-mask {
		background-color: rgba(255, 255, 255, 0.8);
	}

	/* 响应式调整 */
	@media screen and (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.search-container {
			width: 100%;
			margin-top: 15px;
		}

		.main-border {
			padding: 15px;
			margin: 10px;
		}
	}
</style>