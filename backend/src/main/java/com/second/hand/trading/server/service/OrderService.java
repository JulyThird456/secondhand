package com.second.hand.trading.server.service;

import com.second.hand.trading.server.model.OrderModel;
import com.second.hand.trading.server.vo.PageVo;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface OrderService {

    /**
     * 新增订单
     * @param orderModel
     * @return
     */
    boolean addOrder(OrderModel orderModel);

    /**
     * 获取订单信息
     * @param id
     * @return
     */
    OrderModel getOrder(Long id);
    PageVo<OrderModel> findOrderByNumber(String searchValue, int page, int nums);

    /**
     *  获取订单信息
     * @param name
     * */

    /**
     * 更新订单信息
     * @param orderModel
     * @return
     */
    boolean updateOrder(OrderModel orderModel);

    /**
     * 获取某个用户买到的闲置的订单列表
     * @param userId
     * @return
     */
    List<OrderModel> getMyOrder(Long userId);

    /**
     * 获取某个用户卖出的闲置的订单信息
     * @param userId
     * @return
     */
    List<OrderModel> getMySoldIdle(Long userId);

    PageVo<OrderModel> getAllOrder(int page, int nums);

    boolean deleteOrder(long id);

    /**
     * 获取总订单数
     * @return 总订单数
     */
    int getTotalOrderCount();

    /**
     * 获取总订单金额
     * @return 总订单金额
     */
    BigDecimal getTotalOrderAmount();

    /**
     * 获取当月订单数
     * @return 当月订单数
     */
    int getCurrentMonthOrderCount();

    /**
     * 获取当月订单金额
     * @return 当月订单金额
     */
    BigDecimal getCurrentMonthOrderAmount();

    /**
     * 获取过去6个月的订单统计数据
     * @return 包含月份和对应的订单数量及金额的列表
     */
    List<Map<String, Object>> getMonthlyOrderStatistics();
}
