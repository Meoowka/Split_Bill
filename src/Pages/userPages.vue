<script>
import {mapState, mapActions} from 'vuex'
import {nextTick} from "vue";

export default {
  data() {
    return {
      editName: "",
      editId: null
    }
  },
  computed: {
    ...mapState('userStore', {
      user: state => state.user,
    }),
  },
  methods: {
    ...mapActions('userStore', [
      'addUser',
      'editUser',
      'removeUser'
    ]),
    remove(id) {
      this.stopEdit();
      this.removeUser({id});
    },
    startEdit(id) {
      this.stopEdit();
      this.editId = id;
      this.editName = this.user.find(c => c.id === id).name;
      nextTick(() => this.$el.querySelector('#name-inp').focus());
    },
    stopEdit() {
      if (this.editId === null) {
        return;
      }
      this.editUser({id: this.editId, name: this.editName.trim()});
      this.editId = null;
    },
    add() {
      this.addUser({name: ""});
      this.startEdit(this.user[this.user.length - 1].id);
      nextTick(() => {
        const ul = this.$el.querySelector('ul');
        ul.scrollTop = ul.scrollHeight;
        this.$el.querySelector('#name-inp').focus();
      });
    },
    handleInputKey(e, target) {
      if (!['Tab', 'Enter'].includes(e.code)) {
        return;
      }
      e.preventDefault();
      this.$el.querySelector(target).click();
    }
  },
  unmounted() {
    this.stopEdit();
  },
}
</script>

<template>
  <div class="container">
    <h1>Пользователи</h1>
    <ul>
      <li
          class="list-item"
          v-for="{id, name} in user"
          :class="{editing: id === editId}"
          :key="id"
      >
        <div class="details">
          <div class="icon">{{ name[0] }}</div>
          <p v-if="id !== editId" class="name">{{ name }}</p>
          <input
              v-else
              v-model="editName"
              type="text"
              name="name-inp"
              id="name-inp"
              placeholder="Введите имя..."
              @keydown="(e) => this.handleInputKey(e, '.bi-check-lg')"
          />
        </div>
        <i
            v-if="id !== editId"
            class="bi bi-pencil-fill"
            @click="startEdit(id)"
        ></i>
        <i
            v-else
            class="bi bi-check-lg"
            @click="stopEdit()"
        ></i>
        <i class="bi bi-trash-fill" @click="remove(id)"></i>
      </li>
      <li class="list-btn">
        <v-btn variant="tonal" class="bi bi-person-plus-fill" @click="add()">
          Добавить пользователя
        </v-btn>
      </li>
    </ul>
    <router-link  to="/products">
      <v-btn variant="tonal" class="link next-btn" @click="add()">
        Добавить продукт
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
  width: 400px;
  margin: 20px auto;
  font-family: Arial, sans-serif;

  h1 {
    text-align: center;
    color: $text-color;
    margin-bottom: 20px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      margin-bottom: 10px;
      border-radius: $border-radius;
      background-color: $secondary-color;
      box-shadow: $box-shadow;
      transition: background-color 0.3s, transform 0.2s;

      &:hover {
        background-color: $hover-bg-color;
        transform: scale(1.02);
      }

      &.list-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        color: $primary-color;
        background-color: lighten($primary-color, 50%);
        border: 1px dashed $primary-color;
        cursor: pointer;
        border-radius: $border-radius;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: lighten($primary-color, 40%);
          color: darken($primary-color, 10%);
        }
      }

      .details {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon {
          width: 40px;
          height: 40px;
          background-color: $primary-color;
          color: white;
          font-size: 1.2em;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .name {
          font-size: 1em;
          color: $text-color;
        }
      }

      input[type="text"] {
        border: 1px solid $input-border;
        padding: 10px;
        border-radius: 4px;
        font-size: 1em;
        background-color: $input-bg;
        box-shadow: $box-shadow;

        &:focus {
          border-color: $primary-color;
          outline: none;
          background-color: lighten($input-bg, 10%);
        }
      }

      i {
        font-size: 1.2em;
        cursor: pointer;
        color: $icon-color;
        margin-left: 10px;
        transition: color 0.3s;

        &:hover {
          color: $hover-icon-color;
        }
      }
    }
  }

  .next-btn {
    display: block;
    margin: 20px auto 0;
    padding: 10px 15px;
    font-size: 1em;
    text-align: center;
    color: white;
    background-color: $primary-color;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
  .form-container {
    background-color: $secondary-color;
    padding: 20px;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;

    h2 {
      color: $text-color;
      font-size: 1.5em;
      margin-bottom: 10px;
    }

    input[type="text"],
    input[type="email"] {
      width: 100%;
      padding: 10px;
      border: 1px solid $input-border;
      border-radius: 4px;
      font-size: 1em;
      box-shadow: $box-shadow;

      &:focus {
        border-color: $primary-color;
        outline: none;
        background-color: lighten($input-bg, 10%);
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        padding: 10px 20px;
        font-size: 1em;
        border: none;
        border-radius: $border-radius;
        cursor: pointer;
        color: white;
        background-color: $primary-color;
        transition: background-color 0.3s;

        &:hover {
          background-color: darken($primary-color, 10%);
        }

        &.cancel-btn {
          background-color: #ddd;
          color: $text-color;

          &:hover {
            background-color: #bbb;
          }
        }
      }
    }
  }
}

</style>