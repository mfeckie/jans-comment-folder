'use babel';

import { CompositeDisposable } from 'atom';

export default {
  config: {
    autofold: {
      type: 'boolean',
      default: true
    }
  },

  activate(state) {
    atom.commands.add("atom-workspace", {"jans-comment-folder:fold-all": () => this.foldAll()});
    atom.commands.add("atom-workspace", {"jans-comment-folder:unfold-all": () => this.unfoldAll()});

    if (atom.config.get('jans-comment-folder.autofold')) {
      atom.workspace.observeTextEditors((editor) => {
        editor.displayBuffer.tokenizedBuffer.onDidTokenize(() => {
          this.foldAll(editor);
        })
      });
    }
  },

  foldables(editor) {
    const rows = Array.from({length: editor.getLastBufferRow()}, (_, n) => n);
    return rows
    .filter((row) => editor.isFoldableAtBufferRow(row) && editor.isBufferRowCommented(row));
  },
  foldAll(editor = atom.workspace.getActiveTextEditor()) {
    this.foldables(editor)
    .forEach(row => editor.foldBufferRow(row));
  },
  unfoldAll(editor = atom.workspace.getActiveTextEditor()) {
    this.foldables(editor)
    .forEach(row => editor.unfoldBufferRow(row));
  }

};
