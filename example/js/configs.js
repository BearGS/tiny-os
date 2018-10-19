export default {
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
