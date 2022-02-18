1. 使用规范

- config.js 配置说明：

| 字段   | 说明                                                                                                      |
| ------ | --------------------------------------------------------------------------------------------------------- |
| api    | 请求接口的 baseURL ,mock 会将接口的 baseURL 去掉，再去寻找 mock 数据源                                    |
| target | 后备接口地址，如果 mock 没有数据源，则会继续请求该接口地址 ，参考 http-proxy createProxyServer 第三个参数 |

2. json 文件命名规范

文件命名以接口地址 baseurl 后，第一个斜杠前名称为准

3. json 模拟数据描述规范，基于 MockJS

- key 规范
- 规范：`[`请求方法类型:`][`接口地址`][`正则？`]`
- 第一部分为请求类型，支持 `get post delete put` 注意以冒号结尾
- 第二部分为接口地址，如果请求接口为/baseurl/user/list 则 key 应该为 `get:user/list`
- 第三部分为正则，为了动态匹配接口地址 例如删除某个用户 /baseurl/user/:userId ,则应该为 `delete:user/\\d{10}`
- value 规范

- value 规范直接参考 mockjs 即可
- 增强了在正则表达式 rule，在 key 中添加 `|regexp` 即可,例如生成一个随机电话号码：{"phone`|regexp`":"183[2-9]{4}8888"},中间 4 位数将随机生成
