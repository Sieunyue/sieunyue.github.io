--- 
title: 小程序直传华为云OBS
author: Sieunyue
date: 2023-11-1
description:
tags:

- javascript
- tarojs
- miniprogram

---

# 小程序直传华为云OBS

常见的文件上传方式是服务端代理上传：客户端将文件上传到业务服务器，然后业务服务器将文件上传到OSS。在这个过程中，一份数据需要在网络上传输两次，会造成网络资源的浪费、增大服务端的资源开销。
相对于服务端代理上传，客户端直传避免了业务服务器中转文件，提高了上传速度，节省了服务器资源。
特别是在小水管的情况下，使用体验提升明显。华为云OBS常用两种客户端上传方式，
一是采用POST form表单的方式，链接`https://support.huaweicloud.com/bestpractice-obs/obs_05_2000.html`,
第二种是本文使用的[通过临时URL访问OBS](https://support.huaweicloud.com/perms-cfg-obs/obs_40_0009.html)

## 环境

* Tarojs@3.6.18
* 微信小程序基础调试库@3.1.4

## 操作步骤

### 权限配置

1. 设置桶的跨域访问权限
   > 受同源安全策略的要求，不同域间的网站脚本和内容如需交互，需要配置跨域资源共享（CORS）规范。
   >
   华为云对象存储服务OBS支持CORS规范，允许跨域访问OBS中的资源，具体配置步骤请参见配置[跨域资源共享](https://support.huaweicloud.com/usermanual-obs/zh-cn_topic_0066036542.html)。
2. 配置小程序request域名白名单。

   微信小程序利用白名单机制管理跨域访问，想要实现数据上传，需要在微信小程序平台域名白名单中配置桶的访问域名。
   **本文使用Taro.request上传图片，只需要配置request合法域名即可，uploadFile域名配不配置都不影响上传**
3. [获取访问密钥(AK/SK)](https://support.huaweicloud.com/qs-obs/obs_qs_0005.html)

   而在使用其他方式访问OBS时，例如工具（OBS Browser+、obsutil、obsfs）、SDK或API，
   不需要提供华为云帐号或IAM用户登录信息，取而代之的是通过帐号或IAM用户的访问密钥（AK/SK）来进行鉴权。
   所以在使用这些方式访问OBS时，需要提前获取访问密钥（AK/SK）。
   在华为云控制台"我的凭证"页面创建用久AK/SK，并添加OBS的访问权限。

### 后端生成临时URL
[通过OBS Java SDK生成临时URL访问OBS](https://support.huaweicloud.com/sdk-java-devg-obs/obs_21_0901.html)的步骤如下：
1. 通过ObsClient.createTemporarySignature生成带签名信息的URL。
2. 使用任意HTTP库发送HTTP/HTTPS请求，访问OBS服务。

> OBS客户端支持通过访问密钥、请求方法类型、请求参数等信息生成一个在Query参数中携带鉴权信息的URL，可将该URL提供给其他用户进行临时访问。
>
> 在生成URL时，您需要指定URL的有效期来限制访客用户的访问时长。
> 如果您想授予其他用户对桶或对象临时进行其他操作的权限（例如上传或下载对象），则需要生成带对应请求的URL后（例如使用生成PUT请求的URL上传对象），将该URL提供给其他用户。

   ```java
   
   // Endpoint按实际情况填写
   String endPoint = "https://obs.cn-north-4.myhuaweicloud.com";
   String ak = "*** Provide your Access Key ***";
   String sk = "*** Provide your Secret Key ***";
   
   ObsClient obsClient = new ObsClient(ak, sk, endPoint);
   
   public String createWriteSignature(String path) {
        long expireSeconds = 60 * 5L;

        Map<String, String> headers = new HashMap<String, String>();
   
         // 重要！！！这里的contentType一定要和前端上传时候HTTP header的contentTypel类型一致，否则会报签名不匹配错误
        String contentType = "application/octet-stream";
        headers.put("Content-Type", contentType);

        TemporarySignatureRequest request = new TemporarySignatureRequest(HttpMethodEnum.PUT, expireSeconds);
   
        // 这里填你的桶名称
        request.setBucketName("my-bucket");
       
        // path为要上传的文件路径
        request.setObjectKey(path);
        request.setHeaders(headers);

        TemporarySignatureResponse response = obsClient.createTemporarySignature(request);

        return response.getSignedUrl();
    }
   ```

### 小程序内上传图片
```typescript jsx
import { Button, ButtonProps } from '@tarojs/components'
const Demo = () => {
  const [headUrl, setHeadUrl] = useState()
   
  const onUploadAvatar: ButtonProps['onChooseAvatar'] = async (e) => {
    Taro.showLoading({ title: '正在上传图片...' })
     
    const filePath = e.detail.avatarUrl.split('/').pop()
     
    // 调用后端接口获取临时URL地址
    const uploadUrl = await Taro.request('/api/**/*')
    
    const fs = Taro.getFileSystemManager()
    
    fs.readFile({
      filePath: e.detail.avatarUrl,
      position: 0,
      success(r) {
        Taro.request({
          url: uploadUrl,
          method: 'PUT',
          data: r.data,
          header: {
            // 重要！！！一定要和后端生成临时URL时填的参数一样，否则上传时会报错
            'Content-Type': 'application/octet-stream'
          }
        }).then(() => {
          Taro.hideLoading()
          setHeadUrl(uploadUrl)
        })
      }
    })
  }
  return (
    <Button openType="chooseAvatar" onChooseAvatar={onUploadAvatar}>
      <Image src={headUrl} />
    </Button>
  )
}
```
## 参考链接
* [通过临时URL访问OBS](https://support.huaweicloud.com/sdk-java-devg-obs/obs_21_0901.html)
* [小程序直传OBS](https://support.huaweicloud.com/bestpractice-obs/obs_05_2000.html)
* [配置桶允许跨域请求](https://support.huaweicloud.com/sdk-browserjs-devg-obs/obs_24_0107.html)
* [URL中携带签名](https://support.huaweicloud.com/api-obs/obs_04_0011.html)
* [签名不匹配（SignatureDoesNotMatch）如何处理](https://support.huaweicloud.com/obs_faq/obs_faq_0173.html)
