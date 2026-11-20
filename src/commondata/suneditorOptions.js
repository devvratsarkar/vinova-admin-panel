export const options_for_sunEditor = {
    buttonList: [
        ["undo", "redo"],
        ["font", "fontSize"],
        ["formatBlock"],
        ["removeFormat"],
        ['paragraphStyle', 'blockquote'],
        [
            "bold",
            "underline",
            "italic",
            "strike",
            "subscript",
            "superscript"
        ],
        ["fontColor", "hiliteColor"],
        ["align", "list", "lineHeight"],
        ["outdent", "indent"],
        ["table", "horizontalRule", "link", "video","image"],
        ["codeView"],
        ["preview", "print"],
        // [{ header: 'h1' }, { header: 'h2' }]
    ],
    defaultTag: "p",
    width: "100%",
    minHeight: "100px",
    showPathLabel: false,
    attributesWhitelist: {
        all: "style",
        table: "cellpadding|width|cellspacing|height|style",
        tr: "valign|style",
        td: "styleinsert|height|style",
        // img: "title|alt|src|style|height"
    }
};