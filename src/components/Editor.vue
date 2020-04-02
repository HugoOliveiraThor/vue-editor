<template>
  <div class="editor">
    <editor-menu-bar 
      @onBlur="onBlur($event)" 
      @onFocus="onFocus($event)"
      :editor="editor" 
      v-slot="{ commands, isActive }"
    >
      <div class="menubar">
        <button class="menubar__button" @click="commands.mention({ id: 1, label: 'Philipp Kühn' })">
            <icon name="mention" />
            <span>Inserir variavel</span>
        </button>
        <button-menu 
          :icon="'fas fa-italic'"
          :classButton="isActive.italic()"
          @onClick="() => click(commands.italic)">
        </button-menu>
        
        <button-menu 
          :icon="'fas fa-bold'"
          :classButton="isActive.bold()"
          @onClick="() => click(commands.bold)">
        </button-menu>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <i class="fas fa-strikethrough"></i>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <i class="fas fa-underline"></i>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <i class="fas fa-code"></i>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

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

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <i class="fas fa-quote-right"></i>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <i class="fas fa-code"></i>
        </button>

        <button
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <i class="far fa-horizontal-rule"></i>
        </button>

        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <i class="fas fa-undo"></i>
        </button>

        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <i class="fas fa-redo"></i>
        </button>
        <button
          class="menubar__button"
          >
          <i class="fas fa-images">
          <input type="file" accept="image/*" @change="uploadImage($event, commands.image)" id="file-input">

          </i>
        </button>
        <button
						class="menubar__button"
						@click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
					>
						<i class="fas fa-table"></i>
				</button>
        <span v-if="isActive.table()">
						<button
							class="menubar__button"
							@click="commands.deleteTable"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.addColumnBefore"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.addColumnAfter"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.deleteColumn"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.addRowBefore"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.addRowAfter"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.deleteRow"
						>
						</button>
						<button
							class="menubar__button"
							@click="commands.toggleCellMerge"
						>
						</button>
					</span>
      </div>
    </editor-menu-bar>

    <editor-content class="editor__content" :editor="editor" />
    <div class="suggestion-list" v-show="showSuggestions" ref="suggestions">
      <template v-if="hasResults">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="suggestion-list__item"
          :class="{ 'is-selected': navigatedUserIndex === index }"
          @click="selectUser(user)"
        >
          {{ user.name }}
        </div>
      </template>
      <div v-else class="suggestion-list__item is-empty">
        No users found
      </div>
    </div>
  </div>
</template>

<script>
import buttonMenu from './controls/button-menu'
import Fuse from 'fuse.js'
import tippy from 'tippy.js'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Mention,
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Image
} from 'tiptap-extensions'
export default {
  name:'editor-tiptap',
  components: {
    EditorContent,
    EditorMenuBar,
    buttonMenu
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Table({
							resizable: true,
						}),
					new TableHeader(),
					new TableCell(),
          new TableRow(),
          new Image(),
          new Mention({
            // a list of all suggested items
            items: () => [
              { id: 1, name: 'Philipp Kühn' },
              { id: 2, name: 'Hans Pagel' },
              { id: 3, name: 'Kris Siepert' },
              { id: 4, name: 'Justin Schueler' },
            ],
            // is called when a suggestion starts
            onEnter: ({
              items, query, range, command, virtualNode,
            }) => {
              this.query = query
              this.filteredUsers = items
              this.suggestionRange = range
              this.renderPopup(virtualNode)
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command
            },
            // is called when a suggestion has changed
            onChange: ({
              items, query, range, virtualNode,
            }) => {
              this.query = query
              this.filteredUsers = items
              this.suggestionRange = range
              this.navigatedUserIndex = 0
              this.renderPopup(virtualNode)
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null
              this.filteredUsers = []
              this.suggestionRange = null
              this.navigatedUserIndex = 0
              this.destroyPopup()
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              // pressing up arrow
              if (event.keyCode === 38) {
                this.upHandler()
                return true
              }
              // pressing down arrow
              if (event.keyCode === 40) {
                this.downHandler()
                return true
              }
              // pressing enter
              if (event.keyCode === 13) {
                this.enterHandler()
                return true
              }
              return false
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: (items, query) => {
              if (!query) {
                return items
              }
              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ['name'],
              })
              return fuse.search(query)
            },
          }),
        ],
        content: `
        <h1>
            TESTANDO H1,
          </h1>
          <h2>
            TESTANDO H2,
          </h2>
          <p>
            TESTANDO PARAGRAFO.
          </p>
          <ul>
            <li>
              TESTANDO LISTA
            </li>
            <ol>
              TESTANDO LISTA ORDENADA
            </ol>
          </ul>
          <blockquote>
            TESTANDO BLOCKQUOTES 👏
            <br />
          </blockquote>
        `,
        onInit: () => {
    // editor is initialized
  },
  onUpdate: ({ getHTML }) => {
    // get new content on update
    const newContent = getHTML()
    console.log('OLA', newContent)
  },
      }),
    }
  },
  methods: {
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here')
      if (src !== null) {
        command({ src })
      }
      // console.log('image', image)
    },
    uploadImage(e, command){
        console.log('COMMAND', command)
                const image = e.target.files[0];
                this.previewImage = URL.createObjectURL(image)
                command({src:this.previewImage})
                console.log('COMMAND AFTER', command)
    },
    onUpdate: () => {},
    onFocus: () => {
      console.log('EVENT', event)
    },
    onBlur: (event) => {
      console.log('EVENT', event)
    },
    onPaste: () => {
      console.log('Adicionou algo')
    },
    onDrop: () => {},
    click(event) {
      event()
      console.log('event', event)
    },
    // MENTION CODE
    upHandler() {
      this.navigatedUserIndex = ((this.navigatedUserIndex + this.filteredUsers.length) - 1) % this.filteredUsers.length
    },
    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler() {
      this.navigatedUserIndex = (this.navigatedUserIndex + 1) % this.filteredUsers.length
    },
    enterHandler() {
      const user = this.filteredUsers[this.navigatedUserIndex]
      if (user) {
        this.selectUser(user)
      }
    },
    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
    selectUser(user) {
      this.insertMention({
        range: this.suggestionRange,
        attrs: {
          id: user.id,
          label: user.name,
        },
      })
      this.editor.focus()
    },

    // renders a popup with suggestions
    // tiptap provides a virtualNode object for using popper.js (or tippy.js) for popups
    renderPopup(node) {
      if (this.popup) {
        return
      }
      this.popup = tippy(node, {
        content: this.$refs.suggestions,
        trigger: 'mouseenter',
        interactive: true,
        theme: 'dark',
        placement: 'top-start',
        inertia: true,
        duration: [400, 200],
        showOnInit: true,
        arrow: true,
        arrowType: 'round',
      })
      // we have to update tippy whenever the DOM is updated
      if (MutationObserver) {
        this.observer = new MutationObserver(() => {
          this.popup.popperInstance.scheduleUpdate()
        })
        this.observer.observe(this.$refs.suggestions, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
    },
    destroyPopup() {
      if (this.popup) {
        this.popup.destroy()
        this.popup = null
      }
      if (this.observer) {
        this.observer.disconnect()
      }
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
<style>
.menubar__button {
  font-weight: 700;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #000;
  padding: .2rem .5rem;
  margin-right: .2rem;
  border-radius: 3px;
  cursor: pointer;
  font-size:24px;
}
.editor {
  position: relative;
  max-width: 100%;
  min-height: 50vh;
  margin: 0 auto 5rem;
  border:1px solid lightgrey;
}
.menubar {
  border: 1px solid lightgrey;
}
.editor__content table td {
  min-width: 1em;
  border: 2px solid #ddd;
  padding: 3px 5px;
  vertical-align: top;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
.is-active {
  background: grey;
}
/* #file-input{
    visibility:hidden;
} */
/* input[type="file"] {
    display: none;
} */
</style>