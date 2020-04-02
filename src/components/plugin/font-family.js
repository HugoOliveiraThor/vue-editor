import { Mark } from "tiptap";
import { updateMark, markInputRule, removeMark } from "tiptap-commands";

export default class FontFamily extends Mark {
  get name() {
    return "fontFamily";
  }

  get schema() {
    return {
      attrs: {
        fontFamily: {
          default: "arial"
        }
      },
      content: "inline*",
      group: "block",
      draggable: false,
      parseDOM: [
        {
          style: "font-family",
          getAttrs: (mark) => ({ fontFamily: mark })
        }
      ],
      toDOM: (mark) => [
        "span",
        { style: `font-family: ${mark.attrs.fontFamily}` },
        0
      ]
    };
  }

  commands({ type }) {
    return (attrs) => {
      if (attrs.fontFamily) {
        return updateMark(type, attrs);
      }
      return removeMark(type);
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }
}