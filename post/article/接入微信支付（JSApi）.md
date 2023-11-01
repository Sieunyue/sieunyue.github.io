--- 
title: 接入微信支付（JSApi）
author: Sieunyue
date: 2023-08-15
description: JSAPI 支付是指商户通过调用微信支付提供的 JSAPI 接口，在支付场景中调起微信支付模块完成收款，JSAPI支付适用于线下场所、公众号场景和PC网站场景
tags: 
- 小程序
- Tarojs
--- 

# 接入微信支付（直连商户JSApi）
JSAPI 支付是指商户通过调用微信支付提供的 JSAPI 接口，在支付场景中调起微信支付模块完成收款，JSAPI支付适用于线下场所、公众号场景和PC网站场景。常用的场景有：

* 用户在微信公众号内打开某个主页面，完成支付。
* 用户的好友在朋友圈、聊天窗口等分享商家页面链接，用户点击链接打开商家页面，完成支付。
* 将商家页面转换成二维码，用户扫描二维码后在微信浏览器中打开页面后完成支付。

> 调用JSAPI支付的场景，必须是在`微信浏览器`内下单支付。如果需要在`外部浏览器进行下单支付`，应使用`H5支付`

## 接入前准备
### 申请APPID
> 由于微信支付的产品体系全部搭载于微信的社交体系之上，所以直连商户或服务商接入微信支付之前，都需要有一个微信社交载体，该载体对应的ID即为APPID。

社交载体可以是公众号、小程序和APP。

如社交载体为`公众号`，应选择`服务号`，订阅号只有`政府和媒体`类型才能接入微信支付，服务号不受限制。

如社交载体是自己开发的`APP`，需要自行前往[微信开放平台](https://open.weixin.qq.com/)申请接入微信支付

### 申请mchid（商户号）
申请mchid和APPID的操作互不影响，可以并行操作，申请地址如下： [商户号申请平台](https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2Fpublic%2Fwxpay%2Fapply_guidee)。
申请完成后扫描微信二维码登录微信商户平台，进入`账户中心 >  账户设置 >  商户信息`即可看到`微信支付商户`

> 注意：一个mchid只能对应一个结算币种，若需要使用多个币种收款，需要申请对应数量的mchid。

### 绑定APPID及mchid
APPID和mchid全部申请完毕后，需要建立两者之间的绑定关系。微信商户平台进入`产品中心 >  AppID账号管理 >  关联AppID`进行关联

![示意图](https://food-1256333492.cos.ap-guangzhou.myqcloud.com/assets/d41d53285402db7ccba8b20c8060c407_1692236641853.png)

> APPID与mchid之间的关系为多对多，即一个APPID下可以绑定多个mchid，而一个mchid也可以绑定多个APPID。

### 下载并配置商户证书
商户API证书是指由商户申请的，包含商户的商户号、公司名称、公钥信息的证书。
微信商户平台进入 `账户中心 >  API安全` 目录，申请证书，按提示进行操作后生成证书。

### 配置API key
API v3密钥主要用于平台证书解密、回调信息解密。登录微信商户平台，进入 `账户中心 > API安全` 目录，设置API密钥

### 配置应用
#### 设置支付授权目录
商户最后请求拉起微信支付收银台的页面地址我们称之为“支付授权目录”，例如：`https://www.weixin.com/pay.php` 的支付授权目录为：`https://www.weixin.com/`。商户实际的**支付授权目录必须和在微信支付商户平台设置的一致**，否则会报错“当前页面的URL未注册：”

登录微信支付商户平台，进入`产品中心 > 开发配置`，设置后一般5分钟内生效。

> 如果支付授权目录设置为顶级域名（例如：https://www.weixin.com/ ），那么只校验顶级域名，不校验后缀；

> 如果支付授权目录设置为多级目录，就会进行全匹配，例如设置支付授权目录为https://www.weixin.com/abc/123/，则实际请求页面目录不能为https://www.weixin.com/abc/，也不能为https://www.weixin.com/abc/123/pay/，必须为https://www.weixin.com/abc/123/


#### 设置授权域名
开发JSAPI支付时，在JSAPI下单接口中要求必传用户openid，而获取openid则需要您在微信公众平台设置获取openid的域名，只有被设置过的域名才是一个有效的获取openid的域名，否则将获取失败。

登录微信公众平台，进入`公众号设置 > 功能设置 > 网页域名授权`按提示进行操作


## 接入流程
### 业务流程图
![业务流程图](https://food-1256333492.cos.ap-guangzhou.myqcloud.com/assets/8df52574f67f17b7623f74a9b276c441_1692237484433.png)

### 客户端JSAPI调起支付
通过JSAPI下单API成功获取预支付交易会话标识（prepay_id）后，需要通过JSAPI调起支付API来调起微信支付收银台

``` javascript
function onBridgeReady() {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": "wx2421b1c4370ecxxx",   //公众号ID，由商户传入    
          "timeStamp": "1395712654",   //时间戳，自1970年以来的秒数    
          "nonceStr": "e61463f8efa94090b1f366cccfbbb444",      //随机串    
          "package": "prepay_id=wx21201855730335ac86f8c43d1889123400",
          "signType": "RSA",     //微信签名方式：    
          "paySign": "oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==" //微信签名
      },
      function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
      });
  }
  if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
  } else {
      onBridgeReady();
  }	  
  ```

重要入参说明：

• package：JSAPI下单接口返回的prepay_id参数值，提交格式如：prepay_id=***

• signType：该接口V3版本仅支持RSA

• paySign：签名

paySign生成规则、响应详情及错误码请参见[JSAPI调起支付(https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_4.shtml)]接口文档


## 参考
* [微信商户平台指引文档](https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter1_1_1.shtml)
