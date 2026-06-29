package com.second.hand.trading.server.dao;

import com.second.hand.trading.server.model.UserModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

@Mapper
public interface UserDao {
    int deleteByPrimaryKey(Long id);

    int insert(UserModel record);

    int insertSelective(UserModel record);

    UserModel userLogin(@Param("accountNumber") String accountNumber, @Param("userPassword") String userPassword);

    UserModel selectByPrimaryKey(Long id);

    Long selectByUserName(String nickname);

    List<UserModel> getUserList();

    List<UserModel> findUserByList(List<Long> idList);

    List<UserModel> getNormalUser(int begin, int nums);

    List<UserModel> getBanUser(int begin, int nums);

    // 通过账户查找用户
    List<UserModel> getUserByNumber(String searchValue, int mode);

    int countNormalUser();

    int countBanUser();
    
    /**
     * 统计总用户数
     */
    int countTotalUser();
    
    /**
     * 按日期范围统计新增用户数
     */
    int countUsersByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    /**
     * 统计活跃用户数（有发布或交易行为的用户）
     */
    int countActiveUsers(@Param("startDate") Date startDate);

    int updateByPrimaryKeySelective(UserModel record);

    int updateByPrimaryKey(UserModel record);

    int updatePassword(@Param("newPassword") String newPassword,
                       @Param("oldPassword") String oldPassword,@Param("id") Long id);
}