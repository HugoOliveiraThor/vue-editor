<template>
  <div>
    <h1 style="text-align:center">EDITOR RICH TEXT - POC</h1>
    <div style="display:flex;flex-direction:column;">
      <li>
        <a href="https://tiptap.scrumpy.io/">TIPTAP</a>
      </li>
      <li>Fácil implementação</li>
      <li>Totalmente openSource</li>
      <li>Alta customização</li>
      <li>
        <a href="https://github.com/scrumpy/tiptap">GITHUB</a>
      </li>
    </div>
    <div class="editor">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="row">
          <div class="column">
            <div class="menubar">
              <select id="cars"  v-model="selected" @change="() => font(commands, selected)">
                <option value="12px">12px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
              <!-- <button
                :class="{"active":getMarkAttrs("fontSize").fontSize === "18px"}"
                @click="commands.fontSize({fontSize:"18px"})"
              >18px</button> -->
              <button-menu
                :icon="'fas fa-italic'"
                :classButton="isActive.italic()"
                @onClick="() => click(commands.italic)"
              ></button-menu>
              <button-menu
                :icon="'fas fa-bold'"
                :classButton="isActive.bold()"
                @onClick="() => click(commands.italic)"
              ></button-menu>
              <button-menu
                :icon="'fas fa-strikethrough'"
                :classButton="isActive.strike()"
                @onClick="() => click(commands.strike)"
              ></button-menu>
              <button-menu
                :icon="'fas fa-underline'"
                :classButton="isActive.underline()"
                @onClick="() => click(commands.underline)"
              ></button-menu>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >H1</button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >H2</button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <i class="fas fa-list-ul"></i>
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <i class="fas fa-list-ol"></i>
              </button>
              <button class="menubar__button" @click="commands.horizontal_rule">
                <i class="fas fa-horizontal-rule"></i>
              </button>

              <div class="row"></div>
            </div>
            <editor-content class="editor__content" :editor="editor" />
          </div>
          <div class="column">
            <div class="container-variables">
              <button
                @click="commands.mention({ id: 1, label: 'Variavel 1'})"
                style="width:20%;padding:10px;margin:5px;"
              >Variavel 1</button>
              <button
                @click="commands.mention({ id: 2, label: 'Variavel 2'})"
                style="width:20%;padding:10px;margin:5px;"
              >Variavel 2</button>
              <button
                @click="commands.mention({ id: 3, label: 'Variavel 3'})"
                style="width:20%;padding:10px;margin:5px;"
              >Variavel 3</button>
              <button
                @click="commands.mention({ id: 4, label: 'Variavel 4'})"
                style="width:20%;padding:10px;margin:5px;"
              >Variavel 4</button>
            </div>
          </div>
        </div>
      </editor-menu-bar>
    </div>

    <div class="suggestion-list" v-show="showSuggestions" ref="suggestions">
      <template v-if="hasResults">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="suggestion-list__item"
          :class="{ 'is-selected': navigatedUserIndex === index }"
          @click="selectUser(user)"
        >{{ user.name }}</div>
      </template>
      <div v-else class="suggestion-list__item is-empty">No users found</div>
    </div>
  </div>
  <!-- <div class="column">
        <div
          style="width:100%;height:200px;border:1px solid grey; display:flex;flex-direction:column"
        >
          <button style="width:20%;padding:10px;margin:5px;">Variavel 1</button>
          <button style="width:20%;padding:10px;margin:5px;">Variavel 2</button>
          <button style="width:20%;padding:10px;margin:5px;">Variavel 3</button>
          <button style="width:20%;padding:10px;margin:5px;">Variavel 4</button>
        </div>
  </div>-->
</template>

<script>
import Fuse from "fuse.js";
import tippy from "tippy.js";
import buttonMenu from "./controls/button-menu";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { FontSize } from "./plugin/font-size";
import {
  HardBreak,
  Heading,
  Mention,
  Code,
  Bold,
  Italic,
  ListItem,
  OrderedList,
  HorizontalRule,
  TodoItem,
  TodoList,
  History,
  Strike,
  BulletList,
  Underline
} from "tiptap-extensions";
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    buttonMenu
  },
  data() {
    return {
      selected:'12px',
      editor: new Editor({
        extensions: [
          new HardBreak(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Italic(),
          new Strike(),
          new History(),
          new BulletList(),
          new Underline(),
          new FontSize(),
          new HorizontalRule(),
          new Heading({ levels: [1, 2, 3] }),
          new Mention({
            // a list of all suggested items
            items: () => [
              { id: 1, name: "Variável 1" },
              { id: 2, name: "Variavel 2" },
              { id: 3, name: "Variavel 3" },
              { id: 4, name: "Variavel 4" }
            ],
            // is called when a suggestion starts
            onEnter: ({ items, query, range, command, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.renderPopup(virtualNode);
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command;
            },
            // is called when a suggestion has changed
            onChange: ({ items, query, range, virtualNode }) => {
              this.query = query;
              this.filteredUsers = items;
              this.suggestionRange = range;
              this.navigatedUserIndex = 0;
              this.renderPopup(virtualNode);
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null;
              this.filteredUsers = [];
              this.suggestionRange = null;
              this.navigatedUserIndex = 0;
              this.destroyPopup();
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              // pressing up arrow
              if (event.keyCode === 38) {
                this.upHandler();
                return true;
              }
              // pressing down arrow
              if (event.keyCode === 40) {
                this.downHandler();
                return true;
              }
              // pressing enter
              if (event.keyCode === 13) {
                this.enterHandler();
                return true;
              }
              return false;
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: (items, query) => {
              if (!query) {
                return items;
              }
              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ["name"]
              });
              return fuse.search(query);
            }
          }),
          new Code(),
          new Bold(),
          new Italic()
        ],
        content: `
          <h2>
            Vamos adicionar variaveis !!!
          </h2>
          <p>Nesse exemplo simples vamos podemos adicionar as variaveis atraves do @ dentro do texto ou ao clicar nas variaveis ao lado</p>
          <p>
          Isso é bem experimental
          </p>
          <p>Se voce quiser testar as variaveis dentro do código só é preciso usar o @ que o menu com as variaveis vai aparecer</p>
        `,
        onInit: () => {
          // editor is initialized
        }
      }),
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      insertMention: () => {},
      observer: null
    };
  },
  computed: {
    hasResults() {
      return this.filteredUsers.length;
    },
    showSuggestions() {
      return this.query || this.hasResults;
    }
  },
  methods: {
    // navigate to the previous item
    // if it's the first item, navigate to the last one
    upHandler() {
      this.navigatedUserIndex =
        (this.navigatedUserIndex + this.filteredUsers.length - 1) %
        this.filteredUsers.length;
    },
    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler() {
      this.navigatedUserIndex =
        (this.navigatedUserIndex + 1) % this.filteredUsers.length;
    },
    enterHandler() {
      const user = this.filteredUsers[this.navigatedUserIndex];
      if (user) {
        this.selectUser(user);
      }
    },
    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectUser(user) {
      this.insertMention({
        range: this.suggestionRange,
        attrs: {
          id: user.id,
          label: user.name
        }
      });
      this.editor.focus();
    },
    // renders a popup with suggestions
    // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
    renderPopup(node) {
      if (this.popup) {
        return;
      }
      this.popup = tippy(node, {
        content: this.$refs.suggestions,
        trigger: "mouseenter",
        interactive: true,
        theme: "dark",
        placement: "top-start",
        inertia: true,
        duration: [400, 200],
        showOnInit: true,
        arrow: true,
        arrowType: "round"
      });
      // we have to update tippy whenever the DOM is updated
      if (MutationObserver) {
        this.observer = new MutationObserver(() => {
          this.popup.popperInstance.scheduleUpdate();
        });
        this.observer.observe(this.$refs.suggestions, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    },
    destroyPopup() {
      if (this.popup) {
        this.popup.destroy();
        this.popup = null;
      }
      if (this.observer) {
        this.observer.disconnect();
      }
    },
    click(event) {
      event();
      console.log("event", event);
    },
    font(commands,fontSize) {
        console.log('fonteSize', fontSize)
        commands.fontSize({fontSize:fontSize})
        // console.log('Disparou', value )
    }
  }
};
</script>

<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;
.mention {
  background: rgba($color-black, 0.1);
  color: rgba($color-black, 0.6);
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}
.mention-suggestion {
  color: rgba($color-black, 0.6);
}
.suggestion-list {
  padding: 0.2rem;
  border: 2px solid rgba($color-black, 0.1);
  font-size: 0.8rem;
  font-weight: bold;
  &__no-results {
    padding: 0.2rem 0.5rem;
  }
  &__item {
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    margin-bottom: 0.2rem;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    &.is-selected,
    &:hover {
      background-color: rgba($color-white, 0.2);
    }
    &.is-empty {
      opacity: 0.5;
    }
  }
}
.tippy-tooltip.dark-theme {
  font-size: 12px;
  background-color: $color-black;
  padding: 0;
  font-size: 1rem;
  text-align: inherit;
  color: $color-white;
  border-radius: 5px;
  .tippy-backdrop {
    display: none;
  }
  .tippy-roundarrow {
    fill: $color-black;
  }
  .tippy-popper[x-placement^="top"] & .tippy-arrow {
    border-top-color: $color-black;
  }
  .tippy-popper[x-placement^="bottom"] & .tippy-arrow {
    border-bottom-color: $color-black;
  }
  .tippy-popper[x-placement^="left"] & .tippy-arrow {
    border-left-color: $color-black;
  }
  .tippy-popper[x-placement^="right"] & .tippy-arrow {
    border-right-color: $color-black;
  }
}
.menubar__button {
  font-weight: 700;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #000;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 24px;
}
.editor {
  position: relative;
  max-width: 100%;
  min-height: 50vh;
  margin: 0 auto 5rem;
  border: 1px solid lightgrey;
}
.menubar {
  border: 1px solid lightgrey;
}
.editor__content {
  border: 1px solid lightgrey;
  height: 98%;
}
.container-variables {
  width: 100%;
  height: 98%;
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
}
.suggestion-list__item.is-selected,
.suggestion-list__item:hover {
  background-color: lightgray;
}
.suggestion-list {
  font-size: 1.1rem;
}

div > li {
  font-size: 36px;
}

select  {
    height:33px;
}
</style>