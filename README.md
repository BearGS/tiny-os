[![](https://travis-ci.com/BearGS/tiny-os.svg?branch=master)](https://travis-ci.com/BearGS/tiny-os)

# 简介
fantasia-os 是一套基于 类rpc 协议，通过 iframe 架构轻松构建大型复杂前端系统的解决方案。

业务越来越复杂，目前使用 iframe 进行业务拆分的做法基本解决了业务耦合的问题，可以满足独立开发和发布的需求。但是目前的架构在业务解耦上做的并不彻底，使用非常不便没有统一设计，灵活性比较弱，服务不够完善也没有提供插件拓展能力。我们需要一个功能更加完善强大，使用简单透明，功能轻松可插拔的中心化调度架构。

另外，基于 FOS 架构可以让我们快速集成前端日志、度量、存储等工具，提供中心化能力供应用使用，中心化收集用户操作路径数据，应用访问数据。

# 系统架构
Fantasia-os 由三块核心功能组成：Module Plugin、App Schedule、Service Communication。
### Module Plugin
所有功能模块，以插件的方式供 Fantasia-os 使用。
### App Schedule
OS 可以根据需要调度所有注册 APP(以 iframe 或者其它方式组织，目前仅支持 iframe)。使用 LRU 算法缓存切换 APP。
### Service Communication
Fantasia-os 是以 RPC 方式通信的，具体通信协议见 FCP。每一个 OS，Module，App, Worker 在 Fantasia-os 里都是一个 Service。其中除了 Module 只能被其它服务调用之外，其它服务如 OS, App，Worker 都能调用其它服务获取自己想要的数据。当然，所有 RPC 调用都是到 OS 进行路由的，比如 App1 调用 App2 服务，请求依然会先打到 OS 再路由到 App2。
RPC 调用统一 API 即 invoke。
![image](https://user-images.githubusercontent.com/37098932/114259302-7eeb6b80-99ff-11eb-957b-3d93a14fcb82.png)


# 通信协议--FCP
Fantasia OS 通信协议 Fantasia Communication Protocol  是一个无状态的、轻量级的 类RPC 通信协议。

![image](https://user-images.githubusercontent.com/37098932/114259145-7b0b1980-99fe-11eb-8e45-65cea8466be8.png)
![image](https://user-images.githubusercontent.com/37098932/114259149-89f1cc00-99fe-11eb-8d8d-89bfdcf085ac.png)
![image](https://user-images.githubusercontent.com/37098932/114259156-983fe800-99fe-11eb-914c-2bf5d70df584.png)
![image](https://user-images.githubusercontent.com/37098932/114259160-a261e680-99fe-11eb-95f0-ff07ce153952.png)

# App 状态流转图
![image](https://user-images.githubusercontent.com/37098932/114259187-d63d0c00-99fe-11eb-9802-59440793f9ef.png)
![image](https://user-images.githubusercontent.com/37098932/114259199-e5bc5500-99fe-11eb-91c3-d8178f182bcc.png)

# OS API

---

### init ({ apps, modules, methods, values, maxAppNum, container})

- 参数：

   - payload: `Object` 。

      - apps: `Array<Object>` 。app 配置数组

      - modules: `Array<Object>` 。服务模块配置数组

      - methods: `Map` 。OS 注册方法键值对

      - values: `Map` 。OS 注册值键值对

      - maxAppNum: `Number` 。OS 允许同时加载的最大 APP 数

      - container: `HTMLElement` 。APP 加载 iframe 所在容器

- 用法：

```javascript
import { Os as os } from 'fos'

const configs = {
  apps: [
    {
      name: 'shop',
      url: 'http://localhost:8686/shop.html',
      priority: 'temporary',
    },
    {
      name: 'finance',
      url: 'http://localhost:8686/finance.html',
      priority: 'temporary',
    },
    {
      name: 'stats',
      url: 'http://localhost:8686/stats.html',
      priority: 'temporary',
    },
    {
      name: 'carts',
      url: 'http://localhost:8686/:shopId/carts.html?shopId=:shopId',
      priority: 'temporary',
    },
    {
      name: 'goods',
      url: 'http://localhost:8686/goods.html',
      priority: 'temporary',
    },
    {
      name: 'order',
      url: 'http://localhost:8686/order.html',
      priority: 'forever'
    }
  ],
  maxAppNum: 3,
  container: 'app-container',
  methods: {},
  values: {
    shopId: '150009412'
  }
}
```

### registerApp (options)

- 参数：

   - options: `Object` 。

- 用法：
用于注册 App。

```javascript
import { Os as os } from 'fos'

os.registerApp({
    name: 'orderApp',
    priority: 'forever',
})
```


### registerAll ()


### registerMethod (methodName[, callback])

- 参数：

   - methodName: `String` 。

   - callback: `Function`  | `Value` 。`Optional`

- 用法：


用于注册 OS 方法，供 OS 或 APP 使用。
```javascript
import { Os as os } from 'fos'

os.registerMethod(
    name: 'getIp',
    () => return '10.12.177.63',
)
```

### registerValue (key[, value])

- 参数：

   - key: `String` 。

   - value: `Anything` 。`Optional`

- 用法：


用于注册 OS 所需初始值，供 OS 内部使用。
```javascript
import { Os as os } from 'fos'

os.registerValue(
    name: 'shopId',
    () => return '150003421',
)

// shopId会在OS数据中心取得
os.registerApp({
    name: 'order',
    url: 'www.sample.com/:shopId/detail',
})
```

### invoke (options)

- 参数:

   - options: `Object` 。

- 用法：


RPC 调用。OS、SDK 都可以调用 OS 或 SDK 或 Module 上注册的任何方法。
```javascript
// OS.js
import { Os as os } from 'fos'

os.init({
	apps: [
    {
			name: 'orderApp',
      url: '****',
    } 
  ]
})

os.registerMethod(
    name: 'getIp',
    () => return '10.12.177.63',
)

os.invoke({
    service: 'orderApp',
    method: 'getOrderId',
}) // 152234791235920759220

// order.js
import { Sdk } from 'fos'

const sdk = new Sdk()

sdk.registerMethod(
    name: 'getOrderId',
    () => return '152234791235920759220',
)

sdk.invoke({
    service: 'OS',
    method: 'getIp',
}) // 10.12.177.63
```


### launchApp (name)

- 参数：

   - name: `String` 。

- 用法：


唤起 APP。
```javascript
import { Os as os } from 'fos'

os.launchApp('order') // 打开order APP
```

# SDK API

---

### registerMethod (methodName[, callback])

- 同 OS API。


### invoke (options)

- 同 OS API。


### onLaunchApp (callback)

- 参数：

   - callback: `Function` 。

- 用法：
当前 APP 被唤起时，会触发 callback。

```javascript
import { Os as os } from 'fos'

os.registerMethod('getMeta', () =>{
    return metaService.getMeta()
}) // 打开order APP

os.launchApp('orderApp') // 打开order APP

// orderApp
import { Sdk } from 'fos'

const sdk = new Sdk()

sdk.onLaunchApp(data => {
    sdk.invoke({
        service: 'OS',
        method: 'getMeta',
    })
        .then(meta => console.log(meta))
    console.log('orderApp: launchApp ', data) // => orderApp: launchApp orderApp
})
```

### onLoadApp (callback)

- 参数：

   - callback: `Function` 。

- 用法：
当前 APP 被加载时，会触发 callback。

```javascript
// order.js
import { Sdk } from 'fos'

const sdk = new Sdk()

sdk.onLoadApp(data => {
    console.log('orderApp: onLoadApp ', data)
}) // orderApp: launchApp orderApp
```

### onSuspendApp (callback)

- 参数：

   - callback: `Function` 。

- 用法：
当前 APP 被置入后台时，会触发 callback。

```javascript
// order.js
import { Sdk } from 'fos'

const sdk = new Sdk()

sdk.onSuspendApp(data => {
    console.log('orderApp: onSuspendApp ', data)
}) // orderApp: suspendApp orderApp
```


