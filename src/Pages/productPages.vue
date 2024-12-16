<script>
import {nextTick} from 'vue'
import {mapState, mapActions} from 'vuex'


export default {
  data() {
    return {
      editName: "",
      editPrice: null,
      editId: null
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
  methods: {
    ...mapActions('productStore', [
      'addProduct',
      'editProduct',
      'removeProduct',
      'editBuyer',
      'toggleUsers',
      'toggleAllUsers'
    ]),
    remove(id) {
      this.stopEdit();
      this.removeProduct({id});
    },
    startEdit(id) {
      this.stopEdit();
      this.editId = id;
      const product = this.products.find(p => p.id === id);
      this.editName = product.name;
      this.editPrice = product.price;
      nextTick(() => this.$el.querySelector('#name-inp').focus());
    },
    stopEdit() {
      if (this.editId === null) {
        return;
      }
      this.editProduct({id: this.editId, name: this.editName.trim(), price: this.editPrice || 0});
      this.editId = null;
    },
    add() {
      this.addProduct({name: "", price: null, buyer: 0});
      this.startEdit(this.products[this.products.length - 1].id);
      nextTick(() => {
        const ul = this.$el.querySelector('ul');
        ul.scrollTop = ul.scrollHeight;
        this.$el.querySelector('#name-inp').focus();
      });
    },
    setBuyer(id, buyer) {
      this.editBuyer({id, buyer})
    },
    handleInputKey(e, target, focus = false) {
      if (!['Tab', 'Enter'].includes(e.code)) {
        return;
      }
      e.preventDefault();
      const el = this.$el.querySelector(target);
      focus ? el.focus() : el.click();
    }
  },
  unmounted() {
    this.stopEdit();
  },
}
</script>

<template>
  <div class="container">
    <h1>Продукты</h1>
    <ul v-if="user.length">
      <li
          class="list-item"
          v-for="{id, name, price, buyer, consumers} in products"
          :class="{editing: id === editId}"
          :key="id"
      >
        <div class="details">
          <div class="details-top">
            <div class="info">
              <p v-if="id !== editId" class="name">{{ name }}</p>
              <input
                  v-else
                  v-model="editName"
                  type="text"
                  name="name-inp"
                  id="name-inp"
                  placeholder="Введите названия..."
                  @keydown="(e) => this.handleInputKey(e, '#price-inp', true)"
              />
              <p v-if="id !== editId" class="price">{{ price }}рубликов</p>
              <input
                  v-else
                  v-model="editPrice"
                  type="number"
                  name="price-inp"
                  id="price-inp"
                  placeholder="Введите цену..."
                  @keydown="(e) => this.handleInputKey(e, '.bi-check-lg')"
              />
            </div>
            <div class="buyer-select">
              <i class="bi bi-credit-card-2-back-fill"></i>
              <select
                  name="buyer"
                  class="form-select"
                  @change="(e) => setBuyer(id, +e.target.value)"
                  :value="buyer"
              >
                <option
                    v-for="user in user"
                    :value="user.id">{{ user.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="details-bottom">
            <div class="user-list">
              <div
                  class="user-list-item user-list-select-all"
                  :class="{selected: consumers.length === user.length}"
                  @click="toggleAllUsers({id, user})"
              >
                <div class="icon">+</div>
                <p class="user-name">All</p>
              </div>
              <div
                  class="user-list-item"
                  :class="{selected: consumers.includes(user.id)}"
                  v-for="user in user"
                  @click="toggleUsers({id, user: user.id})"
              >
                <div class="icon">{{ user.name[0] }}</div>
                <p class="user-name">{{ user.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="edit-buttons">
          <i
              v-if="id !== editId"
              class="bi bi-pencil-fill i-pointer"
              @click="startEdit(id)"
          ></i>
          <i
              v-else
              class="bi bi-check-lg i-pointer"
              @click="stopEdit()"></i>
          <i class="bi bi-trash-fill i-pointer" @click="remove(id)"></i>
        </div>
      </li>
      <li class="list-btn" @click="add()" :key="-1">

        <v-btn class="bi bi-bag-plus-fill">
          Добавить новый продукт
        </v-btn>
      </li>
    </ul>
    <h4 class="info-message" v-else>Нету добавленных пользователей</h4>
    <router-link v-if="user.length"  to="/bill">
      <v-btn class="link next-btn">
        Рассчитать стоимость
      </v-btn>
    </router-link>
    <router-link v-else class="link next-btn" to="/users">
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
$input-bg: #fff;
$input-border: #ddd;
$hover-bg-color: #f1f1f1;
$icon-color: #666;
$hover-icon-color: $primary-color;
$border-radius: 8px;
$box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: $secondary-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  h1 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
    color: $text-color;
  }

  .info-message {
    text-align: center;
    font-size: 1.2rem;
    color: $text-color;
    margin: 20px 0;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 15px;
    border: 1px solid $input-border;
    border-radius: $border-radius;
    background-color: $input-bg;
    transition: box-shadow 0.3s, background-color 0.3s;

    &.editing {
      background-color: lighten($primary-color, 40%);
      box-shadow: $box-shadow;
    }

    &:hover {
      background-color: $hover-bg-color;
      box-shadow: $box-shadow;
    }

    .details {
      flex: 1;
      .details-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .info {
          flex: 1;
          margin-right: 15px;

          .name, .price {
            font-size: 1rem;
            margin-bottom: 5px;
            color: $text-color;
          }

          input[type="text"], input[type="number"] {
            width: 100%;
            padding: 8px;
            border: 1px solid $input-border;
            border-radius: $border-radius;
            font-size: 1rem;
            background: $input-bg;
          }
        }

        .buyer-select {
          display: flex;
          align-items: center;

          i {
            font-size: 1.2rem;
            margin-right: 8px;
            color: $icon-color;
          }

          .form-select {
            padding: 5px;
            border-radius: $border-radius;
            border: 1px solid $input-border;
            font-size: 1rem;
          }
        }
      }

      .details-bottom {
        margin-top: 10px;

        .user-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .user-list-item {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            border: 1px solid $input-border;
            border-radius: $border-radius;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;

            .icon {
              width: 20px;
              height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: $hover-bg-color;
              border-radius: 50%;
              margin-right: 5px;
              font-size: 0.8rem;
              font-weight: bold;
              color: $icon-color;
            }

            .user-name {
              font-size: 0.9rem;
              color: $text-color;
            }

            &.selected {
              background-color: $primary-color;
              color: white;
            }

            &.user-list-select-all {
              .icon {
                background-color: lighten($primary-color, 20%);
                color: white;
              }
            }
          }
        }
      }
    }

    .edit-buttons {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      i {
        font-size: 1.2rem;
        cursor: pointer;
        color: $icon-color;
        transition: color 0.3s;

        &:hover {
          color: $hover-icon-color;
        }
      }
    }
  }

  .list-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    margin-top: 20px;
    background-color: $primary-color;
    color: white;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s;

    i {
      margin-right: 5px;
    }

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }

  .next-btn {
    display: block;
    text-align: center;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: $primary-color;
    color: white;
    border-radius: $border-radius;
    text-decoration: none;
    transition: background-color 0.3s;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}

</style>