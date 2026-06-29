package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.OrderModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Mapper
public interface OrderDao {
    int deleteByPrimaryKey(Long id);

    int insert(OrderModel record);

    int insertSelective(OrderModel record);

    OrderModel selectByPrimaryKey(Long id);

    List<OrderModel> getMyOrder(Long userId);

    List<OrderModel> getAllOrder(int begin, int nums);

    List<OrderModel> getOrderByNumber(String searchValue, int begin, int nums);

    int countAllOrder();

    List<OrderModel> findOrderByIdleIdList(List<Long> idleIdList);

    int updateByPrimaryKeySelective(OrderModel record);

    int updateByPrimaryKey(OrderModel record);
    
    /**
     * 获取总订单金额
     * @return 总订单金额
     */
    BigDecimal getTotalOrderAmount();
    
    /**
     * 获取指定日期范围内的订单数量
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单数量
     */
    int getOrderCountByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    /**
     * 获取指定日期范围内的订单金额
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单金额
     */
    BigDecimal getOrderAmountByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}