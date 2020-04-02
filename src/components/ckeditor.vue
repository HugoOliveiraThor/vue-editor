<template>
    <div id="app">
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    </div>
</template>

<script>
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

    export default {
        name: 'ck-editor',
        data() {
            return {
                editor: ClassicEditor,
                editorData: '<h1>Testando o H1</h1><br/><h2>Testando o H2</h2></br><p>Testando paragrafo.</p>',
                editorConfig: {
                    // The configuration of the editor.
                }
            };
        }
    }
</script>
<style scoped>
#app {
    position: relative;
    max-width: 35rem;
    margin: 0 auto 5rem;
}
</style>