var remote = require('electron').remote;
var buildEditorContextMenu = remote.require('electron-editor-context-menu');


export default class ContextMenuHelper {
  constructor( ){

  }

  //window,
  static async buildMenu(win,menuClass)
  {
    win.addEventListener('contextmenu', function(e) {
      console.log('right click')

      // Only show the context menu in text editors.
      if (!e.target.closest(menuClass)) return;

      console.log('show menu')

      var menu = buildEditorContextMenu();

      // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
      // visible selection has changed. Try to wait to show the menu until after that, otherwise the
      // visible selection will update after the menu dismisses and look weird.
      setTimeout(function() {
        menu.popup(remote.getCurrentWindow());
      }, 30);
    });

  }



}