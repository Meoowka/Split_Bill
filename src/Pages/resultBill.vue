<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      result: [],
      someonePays: false,
    }
  },
  computed: {
    ...mapState('userStore', {
      user: state => state.user,
    }),
    ...mapState('productStore', {
      products: state => state.products,
    }),
  },
  created() {
    const ind = {}

    this.user.forEach(({id, name}, index) => {
      ind[id] = index;
      this.result.push({id, name, payed: 0, consumed: 0, owed: []})
    });
    if (!this.result.length) {
      return;
    }

    this.products.forEach(({buyer, consumers, price}) => {
      this.result[ind[buyer]].payed += price;

      if (consumers.length === 0) {
        return this.result[ind[buyer]].consumed += price;
      }

      const dividedPrice = price / consumers.length;
      consumers.forEach(c => this.result[ind[c]].consumed += dividedPrice);
    })

    const lenders = []
    this.result.forEach(c => {
      c.diff = c.payed - c.consumed;
      if (c.payed) {
        this.someonePays = true;
      }
      if (c.diff > 0) {
        lenders.push({id: c.id, debt: c.diff, name: c.name});
      }
    })

    this.result.forEach(c => {
      if (c.diff >= 0) {
        return;
      }
      c.diff *= -1;

      while (c.diff > 0.01) {
        const l = lenders.at(-1);
        c.owed.push({id: l.id, name: l.name});

        if (c.diff < l.debt) {
          c.owed.at(-1).sum = c.diff;
          l.debt -= c.diff;
          break;
        } else {
          c.owed.at(-1).sum = l.debt;
          c.diff -= l.debt;
          lenders.pop();
        }
      }
    })
  },
}
</script>
<template>
  <div class="container">
    <h1>Result</h1>
    <ul v-if="user.length && products.length && someonePays">
      <template v-for="{id, name, payed, owed} in result">
        <li class="list-item" v-if="payed > 0 || owed.length > 0" :key="id">
          <p v-if="payed > 0" class="payment">
            <span class="name">{{ name }}</span>
            заплатит
            <span class="money">{{ payed.toFixed(2) }} рубликов</span>
          </p>
          <p v-for="lender, index in owed" class="debt">
            <span class="name" :transparent="payed > 0 || index > 0">{{ name }}</span>
            должен
            <span class="name">{{ lender.name }}</span>
            <span class="money"> {{ lender.sum.toFixed(2) }} рубликов</span>
          </p>
        </li>
      </template>
    </ul>
    <h4
        class="info-message"
        v-else-if="user.length && products.length"
    >
      Никто ничего не платит
    </h4>
    <h4 class="info-message" v-else>Пользователи или товары не были добавлены</h4>
    <router-link
        v-if="user.length && products.length"
        to="/"
    >
      <v-btn  class="link next-btn">
        Новый чек
      </v-btn>
    </router-link>
    <router-link
        v-else-if="user.length"
        to="/products"
    >
      <v-btn class="link next-btn">
        Добавить продукт
      </v-btn>
    </router-link>
    <router-link
        v-else
        class="link next-btn"
        to="/users"
    >
      <v-btn class="link next-btn">
        Добавить пользователей
      </v-btn>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
$primary-color: #007bff;
$secondary-color: #f9f9f9;
$text-color: #333;
$info-color: #666;
$warning-color: #ff9800;
$success-color: #4caf50;
$danger-color: #f44336;
$border-radius: 8px;
$box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
$light-bg: #fff;
$hover-bg: #f1f1f1;

.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: $secondary-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  h1 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
    color: $primary-color;
  }

  .info-message {
    text-align: center;
    font-size: 1.2rem;
    color: $info-color;
    margin: 20px 0;
  }

  .list-item {
    padding: 15px;
    margin-bottom: 10px;
    border: 1px solid lighten($text-color, 60%);
    border-radius: $border-radius;
    background-color: $light-bg;
    box-shadow: $box-shadow;
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
      background-color: $hover-bg;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .payment {
      margin-bottom: 10px;
      font-size: 1.1rem;
      color: $success-color;

      .name {
        font-weight: bold;
        color: $text-color;
      }

      .money {
        font-weight: bold;
        color: $success-color;
      }
    }

    .debt {
      font-size: 1rem;
      color: $danger-color;
      display: flex;
      gap: 5px;
      align-items: baseline;

      .name {
        font-weight: bold;
        color: $text-color;

        &[transparent="true"] {
          opacity: 0.6;
        }
      }

      .money {
        font-weight: bold;
        color: $danger-color;
      }
    }
  }

  .link.next-btn {
    display: block;
    text-align: center;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;
    color: #fff;
    background-color: $primary-color;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    transition: background-color 0.3s, box-shadow 0.3s;

    &:hover {
      background-color: darken($primary-color, 10%);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

</style>