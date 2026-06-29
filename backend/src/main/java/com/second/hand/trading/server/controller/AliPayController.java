package com.second.hand.trading.server.controller;

import com.alipay.easysdk.factory.Factory;
import com.alipay.easysdk.payment.page.models.AlipayTradePagePayResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;

@RestController
@RequestMapping(value = "/alipay")
public class AliPayController {

	@GetMapping("/pay") // subject=asdf&traceNo=1231&totalAmount=121
	public String pay(@RequestParam(value = "name",required = false) String name,
					  @RequestParam(value = "no",required = false) String no,
					  @RequestParam(value = "price",required = false) String price) {
		AlipayTradePagePayResponse response;
		try {
			//  发起API调用（以创建当面付收款二维码为例）
			response = Factory.Payment.Page()
					.pay("校园二手集市", no, price, "");
		} catch (Exception e) {
			System.err.println("调用遭遇异常，原因：" + e.getMessage());
			throw new RuntimeException(e.getMessage(), e);
		}

		System.out.println("***********************************************");
		System.out.println(response.getBody());

		System.out.println("***********************************************");
		return response.getBody();
	}


}
