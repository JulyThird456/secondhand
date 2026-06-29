<template>
	<div class="statistics-container">
		<!-- 页面标题 -->
		<div class="page-header">
			<h2 class="page-title">数据统计分析</h2>
			<div class="header-actions">
				<el-button 
					type="primary" 
					icon="el-icon-refresh" 
					size="small" 
					@click="fetchAllStatisticsData"
					class="refresh-btn"
					:loading="isLoading">
					刷新数据
				</el-button>
			</div>
		</div>

		<!-- 平台交易数据概览 -->
		<el-card class="data-card overview-card" shadow="hover" v-loading="isLoading">
			<div slot="header" class="card-header">
				<span class="card-title"><i class="el-icon-data-line"></i> 平台交易数据概览</span>
			</div>
			<el-row :gutter="20" class="data-row">
				<el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in tradingDataList" :key="index">
					<div class="stat-card" :class="item.class">
						<div class="stat-icon">
							<i :class="item.icon"></i>
						</div>
						<div class="stat-content">
							<div class="stat-title">{{ item.title }}</div>
							<div class="stat-value">{{ item.prefix }}{{ item.value }}</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</el-card>

		<!-- 用户统计数据 -->
<!--		<el-card class="data-card user-card" shadow="hover" v-loading="isLoading">-->
<!--			<div slot="header" class="card-header">-->
<!--				<span class="card-title"><i class="el-icon-user"></i> 用户统计数据</span>-->
<!--			</div>-->
<!--			<el-row :gutter="20" class="data-row">-->
<!--				<el-col :xs="24" :sm="8" v-for="(item, index) in userDataList" :key="index">-->
<!--					<div class="stat-card" :class="item.class">-->
<!--						<div class="stat-icon">-->
<!--							<i :class="item.icon"></i>-->
<!--						</div>-->
<!--						<div class="stat-content">-->
<!--							<div class="stat-title">{{ item.title }}</div>-->
<!--							<div class="stat-value">{{ item.value }}</div>-->
<!--						</div>-->
<!--					</div>-->
<!--				</el-col>-->
<!--			</el-row>-->
<!--		</el-card>-->

		<!-- 图表区域 -->
		<el-row :gutter="20" class="chart-container">
			<!-- 月度交易统计 -->
			<el-col :xs="24" :md="12">
				<el-card class="data-card chart-card" shadow="hover" v-loading="isLoading">
					<div slot="header" class="card-header">
						<span class="card-title"><i class="el-icon-data-analysis"></i> 月度交易统计</span>
					</div>
					<div ref="monthlyChart" class="chart"></div>
				</el-card>
			</el-col>
			
			<!-- 商品分类统计 -->
			<el-col :xs="24" :md="12">
				<el-card class="data-card chart-card" shadow="hover" v-loading="isLoading">
					<div slot="header" class="card-header">
						<span class="card-title"><i class="el-icon-pie-chart"></i> 商品分类统计</span>
					</div>
					<div ref="categoryChart" class="chart"></div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 页面底部空间，防止内容被截断 -->
		<div class="page-bottom-space"></div>
	</div>
</template>

<script>
import * as echarts from 'echarts';

export default {
	name: "DataStatistics",
	data() {
		return {
			isLoading: false,
			tradingData: {
				totalOrders: 0,
				totalAmount: 0,
				currentMonthOrders: 0,
				currentMonthAmount: 0
			},
			userData: {
				totalUsers: 0,
				newUsers: 0,
				activeUsers: 0
			},
			monthlyData: [],
			categoryData: [],
			monthlyChart: null,
			categoryChart: null
		}
	},
	computed: {
		tradingDataList() {
			return [
				{
					title: '总交易订单',
					value: this.tradingData.totalOrders,
					icon: 'el-icon-tickets',
					prefix: '',
					class: 'blue-card'
				},
				{
					title: '总交易金额',
					value: this.tradingData.totalAmount,
					icon: 'el-icon-money',
					prefix: '¥',
					class: 'green-card'
				},
				{
					title: '当月交易订单',
					value: this.tradingData.currentMonthOrders,
					icon: 'el-icon-document',
					prefix: '',
					class: 'orange-card'
				},
				{
					title: '当月交易金额',
					value: this.tradingData.currentMonthAmount,
					icon: 'el-icon-wallet',
					prefix: '¥',
					class: 'purple-card'
				}
			];
		},
		userDataList() {
			return [
				{
					title: '总用户数',
					value: this.userData.totalUsers,
					icon: 'el-icon-user-solid',
					class: 'blue-card'
				},
				{
					title: '本月新增用户',
					value: this.userData.newUsers,
					icon: 'el-icon-coordinate',
					class: 'green-card'
				},
				{
					title: '活跃用户数',
					value: this.userData.activeUsers,
					icon: 'el-icon-star-on',
					class: 'orange-card'
				}
			];
		}
	},
	mounted() {
		this.fetchAllStatisticsData();
		// 添加窗口大小变化监听，以便调整图表大小
		window.addEventListener('resize', this.resizeCharts);
	},
	beforeDestroy() {
		// 组件销毁前移除监听器
		window.removeEventListener('resize', this.resizeCharts);
	},
	methods: {
		fetchAllStatisticsData() {
			this.isLoading = true;
			
			// 使用Promise.all同时请求多个接口
			Promise.all([
				// 获取平台交易数据
				this.$api.getTradingData({}),
				// 获取用户统计数据
				this.$api.getUserStatistics({}),
				// 获取月度交易统计
				this.$api.getMonthlyStatistics({}),
				// 获取商品分类统计
				this.$api.getCategoryStatistics({})
			]).then(([tradingRes, userRes, monthlyRes, categoryRes]) => {
				// 处理平台交易数据
				if (tradingRes.status_code === 1) {
					this.tradingData = tradingRes.data;
				}
				
				// 处理用户统计数据
				if (userRes.status_code === 1) {
					this.userData = userRes.data;
				}
				
				// 处理月度交易统计
				if (monthlyRes.status_code === 1) {
					this.monthlyData = monthlyRes.data;
				}
				
				// 处理商品分类统计
				if (categoryRes.status_code === 1) {
					this.categoryData = categoryRes.data;
				}
				
				// 延迟初始化图表，确保DOM已经渲染
				this.$nextTick(() => {
					this.initMonthlyChart();
					this.initCategoryChart();
				});
			}).catch(error => {
				console.error('获取统计数据失败', error);
				this.$message.error('获取统计数据失败，请稍后重试');
			}).finally(() => {
				this.isLoading = false;
			});
		},
		resizeCharts() {
			if (this.monthlyChart) {
				this.monthlyChart.resize();
			}
			if (this.categoryChart) {
				this.categoryChart.resize();
			}
		},
		initMonthlyChart() {
			if (this.monthlyChart) {
				this.monthlyChart.dispose();
			}
			
			if (!this.$refs.monthlyChart) {
				return;
			}
			
			this.monthlyChart = echarts.init(this.$refs.monthlyChart);
			
			const months = this.monthlyData.map(item => item.month);
			const orderCounts = this.monthlyData.map(item => item.orderCount);
			const orderAmounts = this.monthlyData.map(item => item.orderAmount);
			
			const option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					},
					formatter: function(params) {
						let tooltip = params[0].name + '<br/>';
						params.forEach(param => {
							let value = param.seriesName === '交易金额' ? '¥' + param.value : param.value;
							tooltip += param.marker + ' ' + param.seriesName + ': ' + value + '<br/>';
						});
						return tooltip;
					}
				},
				legend: {
					data: ['订单数量', '交易金额'],
					top: 10,
					textStyle: {
						fontSize: 12
					}
				},
				grid: {
					left: '5%',
					right: '5%',
					bottom: '15%',
					top: '15%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: months,
					axisLabel: {
						interval: 0,
						rotate: 45,
						fontSize: 12,
						margin: 8
					},
					axisLine: {
						lineStyle: {
							color: '#999'
						}
					},
					axisTick: {
						alignWithLabel: true
					}
				},
				yAxis: [
					{
						type: 'value',
						name: '订单数量',
						position: 'left',
						nameTextStyle: {
							fontSize: 12,
							padding: [0, 0, 0, 50]
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#5470C6'
							}
						},
						splitLine: {
							lineStyle: {
								type: 'dashed',
								color: '#eee'
							}
						}
					},
					{
						type: 'value',
						name: '交易金额',
						position: 'right',
						nameTextStyle: {
							fontSize: 12,
							padding: [0, 50, 0, 0]
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#91CC75'
							}
						},
						splitLine: {
							show: false
						}
					}
				],
				series: [
					{
						name: '订单数量',
						type: 'bar',
						yAxisIndex: 0,
						data: orderCounts,
						barWidth: '40%',
						itemStyle: {
							color: '#5470C6',
							borderRadius: [4, 4, 0, 0]
						},
						emphasis: {
							itemStyle: {
								color: '#3A5FD9'
							}
						}
					},
					{
						name: '交易金额',
						type: 'line',
						yAxisIndex: 1,
						data: orderAmounts,
						smooth: true,
						lineStyle: {
							color: '#91CC75',
							width: 3
						},
						symbol: 'circle',
						symbolSize: 8,
						itemStyle: {
							color: '#91CC75',
							borderWidth: 2,
							borderColor: '#fff'
						}
					}
				]
			};
			
			this.monthlyChart.setOption(option);
		},
		initCategoryChart() {
			if (this.categoryChart) {
				this.categoryChart.dispose();
			}
			
			if (!this.$refs.categoryChart) {
				return;
			}
			
			this.categoryChart = echarts.init(this.$refs.categoryChart);
			
			// 设置饼图的颜色
			const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272'];
			
			const option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					orient: 'vertical',
					left: 10,
					top: 'center',
					textStyle: {
						fontSize: 12
					},
					formatter: function(name) {
						// 确保图例文字不会太长
						return name.length > 10 ? name.slice(0, 10) + '...' : name;
					},
					data: this.categoryData.map(item => item.categoryName)
				},
				color: colors,
				series: [
					{
						name: '商品分类',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['60%', '50%'],
						avoidLabelOverlap: false,
						itemStyle: {
							borderColor: '#fff',
							borderWidth: 2
						},
						label: {
							show: true,
							position: 'outside',
							formatter: '{b}: {c} ({d}%)',
							fontSize: 12
						},
						emphasis: {
							label: {
								show: true,
								fontSize: 14,
								fontWeight: 'bold'
							},
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						labelLine: {
							show: true,
							length: 15,
							length2: 10
						},
						data: this.categoryData.map((item, index) => ({
							value: item.count,
							name: item.categoryName,
							itemStyle: {
								color: colors[index % colors.length]
							}
						}))
					}
				]
			};
			
			this.categoryChart.setOption(option);
		}
	}
}
</script>

<style scoped>
.statistics-container {
	padding: 25px;
	min-height: calc(100vh - 190px);
	background-color: #f6f8f9;
	position: relative; /* 确保定位正确 */
}

/* 页面标题样式 */
.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25px;
	background-color: #fff;
	padding: 15px 20px;
	border-radius: 12px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
	font-size: 22px;
	font-weight: 600;
	color: #303133;
	margin: 0;
}

.refresh-btn {
	border-radius: 20px;
	padding: 10px 20px;
}

/* 数据卡片样式 */
.data-card {
	border-radius: 12px;
	margin-bottom: 25px;
	border: none;
	transition: all 0.3s ease;
	overflow: visible; /* 确保内容不被截断 */
}

.data-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
	padding: 15px 20px;
	border-bottom: 1px solid #f0f2f5;
	background-color: #fafafa;
}

.card-title {
	font-size: 18px;
	font-weight: 600;
	color: #303133;
}

.card-title i {
	margin-right: 8px;
	font-size: 20px;
	vertical-align: middle;
	color: #409EFF;
}

/* 统计卡片样式 */
.data-row {
	padding: 15px 10px;
}

.stat-card {
	background: #fff;
	border-radius: 12px;
	padding: 20px;
	display: flex;
	align-items: center;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
	margin-bottom: 20px;
	position: relative;
	overflow: hidden;
	height: 100%;
	min-height: 120px;
	border: 1px solid rgba(0, 0, 0, 0.03);
}

.stat-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 5px;
}

.blue-card::before {
	background: linear-gradient(to right, #4facfe, #00f2fe);
}

.green-card::before {
	background: linear-gradient(to right, #43e97b, #38f9d7);
}

.orange-card::before {
	background: linear-gradient(to right, #fa709a, #fee140);
}

.purple-card::before {
	background: linear-gradient(to right, #a18cd1, #fbc2eb);
}

.stat-icon {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20px;
	flex-shrink: 0;
}

.blue-card .stat-icon {
	background: rgba(79, 172, 254, 0.15);
	color: #4facfe;
}

.green-card .stat-icon {
	background: rgba(67, 233, 123, 0.15);
	color: #43e97b;
}

.orange-card .stat-icon {
	background: rgba(250, 112, 154, 0.15);
	color: #fa709a;
}

.purple-card .stat-icon {
	background: rgba(161, 140, 209, 0.15);
	color: #a18cd1;
}

.stat-icon i {
	font-size: 28px;
}

.stat-content {
	flex: 1;
}

.stat-title {
	font-size: 16px;
	color: #606266;
	margin-bottom: 12px;
}

.stat-value {
	font-size: 28px;
	font-weight: 700;
	letter-spacing: 1px;
}

.blue-card .stat-value {
	color: #4facfe;
}

.green-card .stat-value {
	color: #43e97b;
}

.orange-card .stat-value {
	color: #fa709a;
}

.purple-card .stat-value {
	color: #a18cd1;
}

/* 图表样式 */
.chart-container {
	margin-top: 20px;
	margin-bottom: 40px;
}

.chart-card {
	height: 480px;
	overflow: visible;
}

.chart {
	height: 400px;
	width: 100%;
	margin-top: 5px;
	margin-bottom: 20px;
}

/* 添加页面底部空间 */
.page-bottom-space {
	height: 60px;
	width: 100%;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
	.statistics-container {
		padding: 15px;
	}
	
	.page-header {
		flex-direction: column;
		align-items: flex-start;
		padding: 12px 15px;
	}
	
	.header-actions {
		margin-top: 15px;
		width: 100%;
	}
	
	.refresh-btn {
		width: 100%;
	}
	
	.stat-card {
		min-height: 100px;
		padding: 15px;
	}
	
	.stat-icon {
		width: 50px;
		height: 50px;
		margin-right: 15px;
	}
	
	.stat-icon i {
		font-size: 22px;
	}
	
	.stat-value {
		font-size: 22px;
	}
	
	.chart-card {
		height: 400px;
		margin-bottom: 30px;
	}
	
	.chart {
		height: 330px;
	}
}
</style> 