package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.dao.AddressDao;
import com.second.hand.trading.server.model.AddressModel;
import com.second.hand.trading.server.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Resource
    private AddressDao addressDao;

    /**
     * 查询一个用户的所有地址信息
     * 数据库对user_id建索引，加速查询
     * @param userId
     * @return
     */
    public List<AddressModel> getAddressByUser(Long userId){
        return addressDao.getAddressByUser(userId);
    }

    /**
     * 通过地址id查询地址的信息
     * 同时验证用户身份
     * @param id
     * @param userId
     * @return
     */
    public AddressModel getAddressById(Long id,Long userId){
        AddressModel addressModel=addressDao.selectByPrimaryKey(id);
        if(userId.equals(addressModel.getUserId())){
            return addressModel;
        }
        return null;
    }

    /**
     * 新增地址，默认地址的处理逻辑待优化
     * @param addressModel
     * @return
     */
    public boolean addAddress(AddressModel addressModel){
        if(addressModel.getDefaultFlag()){
            AddressModel a=new AddressModel();
            a.setDefaultFlag(false);
            a.setUserId(addressModel.getUserId());
            //将一个用户的所有地址改为非默认地址，需要优化，sql增加判断条件default_flag=1，减少更新记录的数目
            addressDao.updateByUserIdSelective(a);
        }else {
            List<AddressModel> list=addressDao.getDefaultAddress(addressModel.getUserId());
            if(null==list||0==list.size()){
                addressModel.setDefaultFlag(true);
            }
        }
        return addressDao.insert(addressModel)==1;
    }

    /**
     * 更新地址信息，同时要验证用户身份（未验证）
     *
     * @param addressModel
     * @return
     */
    public boolean updateAddress(AddressModel addressModel){
        if(addressModel.getDefaultFlag()){
            AddressModel a=new AddressModel();
            a.setDefaultFlag(false);
            a.setUserId(addressModel.getUserId());
            addressDao.updateByUserIdSelective(a);
        }else{
            List<AddressModel> list=addressDao.getAddressByUser(addressModel.getUserId());
            for(AddressModel a:list){
                if(a.getDefaultFlag()&& a.getId().equals(addressModel.getId())){
                    AddressModel a1=new AddressModel();
                    a1.setId(list.get(0).getId());
                    a1.setDefaultFlag(true);
                    return addressDao.updateByPrimaryKeySelective(addressModel)==1&&
                            addressDao.updateByPrimaryKeySelective(a1)==1;
                }
            }
        }
        return addressDao.updateByPrimaryKeySelective(addressModel)==1;
    }

    /**
     * 删除地址，同时要验证用户身份
     * @param addressModel
     * @return
     */
    public boolean deleteAddress(AddressModel addressModel){
        return addressDao.deleteByPrimaryKeyAndUser(addressModel.getId(),addressModel.getUserId())==1;
    }
}
