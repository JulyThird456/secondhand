package com.second.hand.trading.server.controller;

import com.second.hand.trading.server.enums.ErrorMsg;
import com.second.hand.trading.server.service.IdleItemService;
import com.second.hand.trading.server.service.OrderService;
import com.second.hand.trading.server.service.UserService;
import com.second.hand.trading.server.vo.ResultVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("statistics")
public class StatisticsController {

    @Autowired
    private IdleItemService idleItemService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    /**
     * 获取平台交易数据统计，包括总交易量、总交易额等
     */
    @GetMapping("/trading-data")
    public ResultVo getTradingData(HttpSession session) {
        if (session.getAttribute("admin") == null) {
            return ResultVo.fail(ErrorMsg.COOKIE_ERROR);
        }

        Map<String, Object> data = new HashMap<>();
        
        // 获取总交易数
        int totalOrders = orderService.getTotalOrderCount();
        data.put("totalOrders", totalOrders);
        
        // 获取总交易金额
        BigDecimal totalAmount = orderService.getTotalOrderAmount();
        data.put("totalAmount", totalAmount);
        
        // 获取当月交易数
        int currentMonthOrders = orderService.getCurrentMonthOrderCount();
        data.put("currentMonthOrders", currentMonthOrders);
        
        // 获取当月交易金额
        BigDecimal currentMonthAmount = orderService.getCurrentMonthOrderAmount();
        data.put("currentMonthAmount", currentMonthAmount);
        
        return ResultVo.success(data);
    }

    /**
     * 获取过去6个月的交易统计数据
     */
    @GetMapping("/monthly-statistics")
    public ResultVo getMonthlyStatistics(HttpSession session) {
        if (session.getAttribute("admin") == null) {
            return ResultVo.fail(ErrorMsg.COOKIE_ERROR);
        }

        List<Map<String, Object>> monthlyData = orderService.getMonthlyOrderStatistics();
        return ResultVo.success(monthlyData);
    }

    /**
     * 获取商品分类统计数据
     */
    @GetMapping("/category-statistics")
    public ResultVo getCategoryStatistics(HttpSession session) {
        if (session.getAttribute("admin") == null) {
            return ResultVo.fail(ErrorMsg.COOKIE_ERROR);
        }

        List<Map<String, Object>> categoryData = idleItemService.getCategoryStatistics();
        return ResultVo.success(categoryData);
    }

    /**
     * 获取用户注册统计数据
     */
    @GetMapping("/user-statistics")
    public ResultVo getUserStatistics(HttpSession session) {
        if (session.getAttribute("admin") == null) {
            return ResultVo.fail(ErrorMsg.COOKIE_ERROR);
        }

        Map<String, Object> userData = new HashMap<>();
        int totalUsers = userService.getTotalUserCount();
        userData.put("totalUsers", totalUsers);
        int newUsers = userService.getNewUserCount();
        userData.put("newUsers", newUsers);
        int activeUsers = userService.getActiveUserCount();
        userData.put("activeUsers", activeUsers);
        
        return ResultVo.success(userData);
    }
}