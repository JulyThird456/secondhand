package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.dao.IdleItemDao;
import com.second.hand.trading.server.dao.OrderDao;
import com.second.hand.trading.server.model.IdleItemModel;
import com.second.hand.trading.server.model.OrderModel;
import com.second.hand.trading.server.service.OrderService;
import com.second.hand.trading.server.utils.OrderTask;
import com.second.hand.trading.server.utils.OrderTaskHandler;
import com.second.hand.trading.server.vo.PageVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class OrderServiceImpl implements OrderService {

    @Resource
    private OrderDao orderDao;

    @Resource
    private IdleItemDao idleItemDao;
    private static HashMap<Integer,ReentrantLock> lockMap=new HashMap<>();
    static {
        for(int i=0;i<100;i++){
            lockMap.put(i,new ReentrantLock(true));
        }
    }
    public boolean addOrder(OrderModel orderModel){
        IdleItemModel idleItemModel=idleItemDao.selectByPrimaryKey(orderModel.getIdleId());
        System.out.println(idleItemModel.getIdleStatus());
        if(idleItemModel.getIdleStatus()!=1){
            return false;
        }
        IdleItemModel idleItem=new IdleItemModel();
        idleItem.setId(orderModel.getIdleId());
        idleItem.setUserId(idleItemModel.getUserId());
        idleItem.setIdleStatus((byte)2);

        int key= (int) (orderModel.getIdleId()%100);
        ReentrantLock lock=lockMap.get(key);
        boolean flag;
        try {
            lock.lock();
            flag=addOrderHelp(idleItem,orderModel);
        }finally {
            lock.unlock();
        }
        return flag;
    }
    @Transactional(rollbackFor = Exception.class)
    public boolean addOrderHelp(IdleItemModel idleItem,OrderModel orderModel){
        IdleItemModel idleItemModel=idleItemDao.selectByPrimaryKey(orderModel.getIdleId());
        if(idleItemModel.getIdleStatus()!=1){
            return false;
        }
        if(idleItemDao.updateByPrimaryKeySelective(idleItem)==1){
            if(orderDao.insert(orderModel)==1){
                orderModel.setOrderStatus((byte) 4);
                //半小时未支付则取消订单
                OrderTaskHandler.addOrder(new OrderTask(orderModel,30*60));
                return true;
            }else {
                new RuntimeException();
            }
        }
        return false;
    }

    /**
     * 获取订单信息，同时获取对应的闲置信息
     * @param id
     * @return
     */
    public OrderModel getOrder(Long id){
        OrderModel orderModel=orderDao.selectByPrimaryKey(id);
        orderModel.setIdleItem(idleItemDao.selectByPrimaryKey(orderModel.getIdleId()));
        return orderModel;
    }

    /**
     *   根据订单号，查询订单
     *
     *
     * @return*/
    @Override
    public PageVo<OrderModel> findOrderByNumber(String searchValue, int page, int nums) {
        List<OrderModel> list=orderDao.getOrderByNumber(searchValue,(page-1)*nums,nums);

        if(list.size()>0){
            List<Long> idleIdList=new ArrayList<>();
            for(OrderModel i:list){
                idleIdList.add(i.getIdleId());
            }
            List<IdleItemModel> idleItemModelList=idleItemDao.findIdleByList(idleIdList);
            Map<Long,IdleItemModel> map=new HashMap<>();
            for(IdleItemModel idle:idleItemModelList){
                map.put(idle.getId(),idle);
            }
            for(OrderModel i:list){
                i.setIdleItem(map.get(i.getIdleId()));
            }
        }

        return new PageVo<OrderModel>(list,1);
    }

    /**
     * 更新订单状态，无验证，后期修改为定制的更新sql
     * 后期改为在支付时下架闲置
     * @param orderModel
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean updateOrder(OrderModel orderModel){
        orderModel.setOrderNumber(null);
        orderModel.setUserId(null);
        orderModel.setIdleId(null);
        orderModel.setCreateTime(null);
        if(orderModel.getOrderStatus()==4){
            OrderModel o=orderDao.selectByPrimaryKey(orderModel.getId());
            if(o.getOrderStatus()!=0){
                return false;
            }
            IdleItemModel idleItemModel=idleItemDao.selectByPrimaryKey(o.getIdleId());
            if(idleItemModel.getIdleStatus()==2){
                IdleItemModel idleItem=new IdleItemModel();
                idleItem.setId(o.getIdleId());
                idleItem.setUserId(idleItemModel.getUserId());
                idleItem.setIdleStatus((byte)1);
                if(orderDao.updateByPrimaryKeySelective(orderModel)==1){
                    if(idleItemDao.updateByPrimaryKeySelective(idleItem)==1){
                        return true;
                    }else {
                        new RuntimeException();
                    }
                }
                return false;
            }else{
                if(orderDao.updateByPrimaryKeySelective(orderModel)==1){
                    return true;
                }else {
                    new RuntimeException();
                }
            }
        }
        return orderDao.updateByPrimaryKeySelective(orderModel)==1;
    }

    /**
     * 获取我的所有订单
     * 同时查询出对应的闲置信息，
     * 未做分页
     * userId建索引
     * @param userId
     * @return
     */
    public List<OrderModel> getMyOrder(Long userId){
        List<OrderModel> list=orderDao.getMyOrder(userId);
        if(list.size()>0){
            List<Long> idleIdList=new ArrayList<>();
            for(OrderModel i:list){
                idleIdList.add(i.getIdleId());
            }
            List<IdleItemModel> idleItemModelList=idleItemDao.findIdleByList(idleIdList);
            Map<Long,IdleItemModel> map=new HashMap<>();
            for(IdleItemModel idle:idleItemModelList){
                map.put(idle.getId(),idle);
            }
            for(OrderModel i:list){
                i.setIdleItem(map.get(i.getIdleId()));
            }
        }
        return list;
    }

    /**
     * 查询用户卖出的闲置
     * @param userId
     * @return
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public List<OrderModel> getMySoldIdle(Long userId){
        List<IdleItemModel> list=idleItemDao.getAllIdleItem(userId);
        List<OrderModel> orderList=null;
        if(list.size()>0){
            List<Long> idleIdList=new ArrayList<>();
            for(IdleItemModel i:list){
                idleIdList.add(i.getId());
            }
            orderList=orderDao.findOrderByIdleIdList(idleIdList);
            Map<Long,IdleItemModel> map=new HashMap<>();
            for(IdleItemModel idle:list){
                map.put(idle.getId(),idle);
            }
            for(OrderModel o:orderList){
                o.setIdleItem(map.get(o.getIdleId()));
            }
        }
        return orderList;
    }

    public PageVo<OrderModel> getAllOrder(int page, int nums){
        List<OrderModel> list=orderDao.getAllOrder((page-1)*nums,nums);
        if(list.size()>0){
            List<Long> idleIdList=new ArrayList<>();
            for(OrderModel i:list){
                idleIdList.add(i.getIdleId());
            }
            List<IdleItemModel> idleItemModelList=idleItemDao.findIdleByList(idleIdList);
            Map<Long,IdleItemModel> map=new HashMap<>();
            for(IdleItemModel idle:idleItemModelList){
                map.put(idle.getId(),idle);
            }
            for(OrderModel i:list){
                i.setIdleItem(map.get(i.getIdleId()));
            }
        }
        int count=orderDao.countAllOrder();
        return new PageVo<>(list,count);
    }

    public boolean deleteOrder(long id){
        return orderDao.deleteByPrimaryKey(id)==1;
    }

    /**
     * 获取总订单数
     */
    @Override
    public int getTotalOrderCount() {
        return orderDao.countAllOrder();
    }

    /**
     * 获取总订单金额
     */
    @Override
    public BigDecimal getTotalOrderAmount() {
        return orderDao.getTotalOrderAmount();
    }

    /**
     * 获取当月订单数
     */
    @Override
    public int getCurrentMonthOrderCount() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startDate = calendar.getTime();
        
        calendar.add(Calendar.MONTH, 1);
        Date endDate = calendar.getTime();
        
        return orderDao.getOrderCountByDateRange(startDate, endDate);
    }

    /**
     * 获取当月订单金额
     */
    @Override
    public BigDecimal getCurrentMonthOrderAmount() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startDate = calendar.getTime();
        
        calendar.add(Calendar.MONTH, 1);
        Date endDate = calendar.getTime();
        
        return orderDao.getOrderAmountByDateRange(startDate, endDate);
    }

    /**
     * 获取过去6个月的订单统计数据
     */
    @Override
    public List<Map<String, Object>> getMonthlyOrderStatistics() {
        List<Map<String, Object>> result = new ArrayList<>();
        SimpleDateFormat monthFormat = new SimpleDateFormat("yyyy-MM");
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        for (int i = 0; i < 6; i++) {
            Date endDate = calendar.getTime();
            calendar.add(Calendar.MONTH, -1);
            Date startDate = calendar.getTime();
            
            int orderCount = orderDao.getOrderCountByDateRange(startDate, endDate);
            BigDecimal orderAmount = orderDao.getOrderAmountByDateRange(startDate, endDate);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthFormat.format(endDate));
            monthData.put("orderCount", orderCount);
            monthData.put("orderAmount", orderAmount);
            
            result.add(0, monthData); // 添加到列表前端，保持时间顺序
            
            calendar.add(Calendar.MONTH, -1); // 再减去一个月，为下一次循环准备
        }
        
        return result;
    }
}
