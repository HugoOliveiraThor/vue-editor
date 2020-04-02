<template>
  <div id="app">
    <div style="width:100%; text-align:center">
    </div>
      <EditorSuggestion></EditorSuggestion>
    <br/>
  </div>
</template>

<script>
// import Editor from '@/components/Editor'
import EditorSuggestion from '@/components/editor-suggestion.vue'
export default {
  name: 'App',
  components: {
    // Editor,
    EditorSuggestion
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 50%;
  padding: 10px;
  height: 88vh; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
* {
  box-sizing: border-box;
}
</style>
