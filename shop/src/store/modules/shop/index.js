import axios from "axios";

const state = {
  products: [],
};
const mutations = {
  addProduct(state, payload) {
    state.products.push(payload);
  },
};
const actions = {
  storeProduct(context, payload) {
    const productItem = {
      title: payload.title,
      description: payload.description,
      price: payload.price,
    };
    // Hole den State aus einem anderen Module mit rootState
    const token = context.rootState.auth.token;
    axios
      .post(
        `https://vue-3-shp-backend-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,
        productItem
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        throw new Error(error);
      });
  },
};
const getters = {};

const shopModule = {
  state,
  mutations,
  actions,
  getters,
};

export default shopModule;