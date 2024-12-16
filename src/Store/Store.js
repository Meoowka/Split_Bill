import {Store} from 'vuex'
import userStore from './userStore.js';
import productStore from './productStore.js';

export const appStore = new Store({
    modules: {
        userStore,
        productStore
    }
})

