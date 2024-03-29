<template>
  <div
    :draggable="isDraggable"
    style="width: 19rem; min-height: 19rem"
    class="card m-1 border-2"
    :class="todoColor"
  >
    <TodoOptions @delete-todo="deleteTodo" @edit-todo="editTodo" @done-todo="doneTodo" />
    <template v-if="!edit">
      <div @drop="onDrop($event, id)" @dragover.prevent @dragenter.prevent class="card-body">
        <!--p>{{ id }}</p-->
        <h5 :class="doneTextStyle" class="card-title">{{ header }}</h5>
        <p :class="doneTextStyle" class="card-text">{{ text }}</p>
      </div>
      <div v-if="deadline" class="row">
        <i title="Deadline" :class="deadLineStyle" class="mb-1 bi bi-alarm col">
          &nbsp; {{ deadline }}</i
        >
      </div>
    </template>
    <template v-else>
      <div class="card-body">
        <input v-model="headerInput" type="text" class="form-control m-1" placeholder="Header" />
        <textarea
          v-model="textInput"
          class="form-control m-1"
          aria-label="With textarea"
          placeholder="Text"
        ></textarea>
        <input
          v-model="daedLineInput"
          type="text"
          class="form-control m-1"
          placeholder="yyyy-mm-dd hh:mm"
        />
        <div class="row mx-1">
          <div
            @click="changeColor($event, index)"
            role="button"
            style="height: 25px"
            class="border col"
            :class="colorStyle(color, index)"
            :key="color"
            v-for="(color, index) in colors"
          ></div>
        </div>
        <div class="row text-center justify-content-md-center">
          <i
            title="Ok"
            @click="commitEdit"
            role="button"
            class="mb-1 bi bi-check2 col col-lg-2 fs-4"
          ></i>
          <i
            title="Cancel"
            @click="cancelEdit"
            role="button"
            class="mb-1 bi bi-x col col-lg-2 fs-4"
          ></i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TodoOptions from "./TodoOptions.vue";

export default {
  name: "TodoEntry",
  components: {
    TodoOptions,
  },
  props: {
    id: Number,
    header: String,
    text: String,
    deadline: String,
    color: Number,
    edit: Boolean,
    done: Boolean,
  },
  emits: [
    "edit-todo",
    "delete-todo",
    "cancel-edit",
    "commit-edit",
    "change-color",
    "done-todo",
    "on-drop-id",
  ],
  data() {
    return {
      colors: ["light", "primary", "secondary", "success", "danger", "warning", "info"],
      textInput: this.text,
      headerInput: this.header,
      daedLineInput: this.deadline,
      deadLineOverdue: false,
    };
  },
  watch: {
    deadline: {
      handler() {
        const _this = this;
        function timeout() {
          const currentDate = Date.now();
          const deadLineDate = new Date(_this.deadline);
          if (currentDate > deadLineDate) {
            _this.deadLineOverdue = true;
          } else {
            _this.deadLineOverdue = false;
          }
          setTimeout(timeout, 1000);
        }
        timeout();
      },
      immediate: true,
    },
  },
  computed: {
    isDraggable() {
      if (this.edit) {
        return false;
      }
      return true;
    },
    doneTextStyle() {
      if (this.done) {
        return ["text-decoration-line-through"];
      }
      return [];
    },
    todoColor() {
      return ["text-bg-" + this.colors[this.color]];
    },
    deadLineStyle() {
      if (this.deadLineOverdue) {
        return ["text-danger", "bg-danger-subtle"];
      }
      return [];
    },
  },
  methods: {
    onDrop(event, id) {
      const todoId = event.dataTransfer.getData("todoId");
      this.$emit("on-drop-id", { drag: parseInt(todoId), drop: parseInt(id) });
    },
    editTodo() {
      this.$emit("edit-todo", this.id);
    },
    deleteTodo() {
      this.$emit("delete-todo", this.id);
    },
    doneTodo() {
      this.$emit("done-todo", this.id);
    },
    cancelEdit() {
      if (!this.textInput || !this.headerInput) {
        alert("Header und Text darf nicht leer sein!");
        return;
      }
      this.$emit("cancel-edit", this.id);
    },
    commitEdit() {
      if (!this.textInput || !this.headerInput) {
        alert("Header und Text darf nicht leer sein!");
        return;
      }

      if (this.daedLineInput) {
        if (this.daedLineInput.search(/\d\d\d\d-\d\d-\d\d \d\d:\d\d/) === -1) {
          alert("Datum im falschen Format!");
          return;
        }
      }

      this.$emit("commit-edit", {
        id: this.id,
        text: this.textInput,
        header: this.headerInput,
        deadline: this.daedLineInput,
      });
    },
    colorStyle(color, index) {
      let classes = ["bg-" + color];
      if (this.color === index) {
        classes.push("border-3");
        classes.push("border-" + color + "-subtle");
      }
      return classes;
    },
    changeColor(event, colorId) {
      this.$emit("change-color", { id: this.id, newColor: colorId });
    },
  },
};
</script>

<style scoped>
i:hover {
  color: black;
}
</style>
