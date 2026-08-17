// JavaScript should be written in ECMAScript 5.1.

const karabiner = require('../lib/karabiner')

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'Universal Emacs Keybindings (Custom)',
        maintainers: ['madogiwa'],

        rules: [
          {
            description: 'Customized version of Universal Emacs Keybindings by justintanner',
            manipulators: manipulators(),
          },
        ],
      },
      null,
      '  '
    )
  )
}

function ifApp() {
  const identifiers = Array.prototype.slice.call(arguments);
  return {
    type: 'frontmost_application_if',
    bundle_identifiers: identifiers
  };
}

function unlessApp() {
  const identifiers = Array.prototype.slice.call(arguments);
  return {
    type: 'frontmost_application_unless',
    bundle_identifiers: identifiers
  };
}

function unlessEmacs() {
  const textEditors = [].concat(
    '^com\\.sublimetext\\.',
    karabiner.bundleIdentifiers.visualStudioCode,
    karabiner.bundleIdentifiers.jetbrainsIDE
  )

  return {
    type: 'frontmost_application_unless',
    bundle_identifiers: karabiner.bundleIdentifiers.emacsKeyBindingsException.filter(function(identifier) {
      return textEditors.indexOf(identifier) === -1
    }),
  };
}

function ifBrowser() {
  return {
    type: 'frontmost_application_if',
    bundle_identifiers: karabiner.bundleIdentifiers.browser,
  };
}

// Add applications here when Ctrl-Shift-B/F/N/P are assigned to application
// commands instead of extending the current selection.
function ifCtrlShiftMarkMovementUnsupported() {
  return {
    type: 'frontmost_application_if',
    bundle_identifiers: karabiner.bundleIdentifiers.visualStudioCode,
  };
}

function unlessBrowser() {
  return {
    type: 'frontmost_application_unless',
    bundle_identifiers: karabiner.bundleIdentifiers.browser,
  };
}

function ifFirefox() {
  return ifApp('^org\\.mozilla\\.firefox$');
}

function unlessFirefox() {
  return unlessApp('^org\\.mozilla\\.firefox$');
}

function ifTerminal() {
  return {
    type: 'frontmost_application_if',
    bundle_identifiers: karabiner.bundleIdentifiers.terminal,
  }
}

function unlessTerminal() {
  return {
    type: 'frontmost_application_unless',
    bundle_identifiers: karabiner.bundleIdentifiers.terminal,
  }
}

function withCtrlOrCapsLock() {
  return {mandatory: ['control'], optional: ['caps_lock']};
}

function ifCxActive() {
  return {type: 'variable_if', name: 'C-x', value: 1};
}

function ifMarkActive() {
  return {type: 'variable_if', name: 'C-spacebar', value: 1};
}

function unlessMarkActive() {
  return {type: 'variable_unless', name: 'C-spacebar', value: 1};
}

function clearMark() {
  return {name: 'C-spacebar', value: 0};
}

function setMark() {
  return {name: 'C-spacebar', value: 1};
}

function manipulators() {
  return [].concat(
    // --- Comment to prevent line combination by Prettier ---
    cx(),
    markMovementForUnsupportedApps(),
    markWordMovement(),
    controlKeys(),
    optionKeys()
  )
}

// Send Shift+arrow explicitly while the mark is active in applications that do
// not implement Ctrl-Shift-B/F/N/P as selection movement.
function markMovementForUnsupportedApps() {
  return [
    ['b', 'left_arrow'],
    ['f', 'right_arrow'],
    ['n', 'down_arrow'],
    ['p', 'up_arrow'],
  ].map(function(keys) {
    return {
      type: 'basic',
      from: {key_code: keys[0], modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: keys[1], modifiers: ['shift']}],
      conditions: [ifMarkActive(), unlessEmacs(), ifCtrlShiftMarkMovementUnsupported()],
    };
  });
}

// Extend the selection by whole words for M-b/M-f while the mark is active.
function markWordMovement() {
  return [
    ['b', 'left_arrow'],
    ['f', 'right_arrow'],
  ].map(function(keys) {
    return {
      type: 'basic',
      from: {key_code: keys[0], modifiers: {mandatory: ['option'], optional: ['shift']}},
      to: [{key_code: keys[1], modifiers: ['option', 'shift']}],
      conditions: [ifMarkActive(), unlessEmacs()],
    };
  });
}

function cx() {
  return [
    {
      type: 'basic',
      from: {key_code: 'b', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'a', modifiers: ['command', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'c', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'q', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    // Launch the dev console in most browsers with C-x/C-d
    {
      type: 'basic',
      from: {key_code: 'd', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'j', modifiers: ['command', 'option']}],
      conditions: [ifCxActive(), unlessEmacs(), ifApp('^com\\.google\\.Chrome$', '^com\\.brave\\.Browser$')]
    },
    {
      type: 'basic',
      from: {key_code: 'd', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'i', modifiers: ['command', 'option']}],
      conditions: [ifCxActive(), unlessEmacs(), ifApp('^org\\.mozilla\\.firefox$', '^com\\.apple\\.Safari$')],
    },
    // No point in opening files in browsers, better to focus the location bar.
    {
      type: 'basic',
      from: {key_code: 'f', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'l', modifiers: ['command']}],
      conditions: [ifCxActive(), ifBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'f', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'o', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'n', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'n', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessBrowser(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'n', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 't', modifiers: ['command']}],
      conditions: [ifCxActive(), ifBrowser(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'h', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'a', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'k', modifiers: {optional: ['caps_lock']}},
      to: [{key_code: 'w', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'k', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'w', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'o', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'grave_accent_and_tilde', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'p', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'f', modifiers: ['option', 'command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'q', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'q', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'r', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'r', modifiers: ['command']}],
      conditions: [ifCxActive(), ifBrowser(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 's', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 's', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'u', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'z', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'w', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 's', modifiers: ['command']}],
      conditions: [ifCxActive(), unlessEmacs(), unlessBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: '1', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'w', modifiers: ['command', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs(), unlessFirefox()],
    },
    {
      type: 'basic',
      from: {key_code: '1', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: '1', modifiers: ['option', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs(), ifFirefox()],
    },
    {
      type: 'basic',
      from: {key_code: '7', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: '7', modifiers: ['command', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs(), unlessFirefox()],
    },
    {
      type: 'basic',
      from: {key_code: '7', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: '7', modifiers: ['option', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs(), ifFirefox()],
    },
    {
      type: 'basic',
      from: {key_code: '8', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: '8', modifiers: ['command', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs(), unlessFirefox()],
    },
    {
      type: 'basic',
      from: {key_code: '8', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: '8', modifiers: ['option', 'shift']}],
      conditions: [ifCxActive(), unlessEmacs(), ifFirefox()],
    },
    // Ignore other unassigned C-x shortcuts
    {
      type: 'basic',
      from: {any: 'key_code', modifiers: {optional: ['any']}},
      conditions: [ifCxActive()],
    },
    // C-x
    {
      type: 'basic',
      from: {key_code: 'x', modifiers: withCtrlOrCapsLock()},
      to: [{set_variable: {name: 'C-x', value: 1}}],
      to_delayed_action: {
        to_if_invoked: [{set_variable: {name: 'C-x', value: 0}}],
        to_if_canceled: [{set_variable: {name: 'C-x', value: 0}}],
      },
      conditions: [unlessEmacs()],
    },
  ]
}

function controlKeys() {
  return [
    {
      type: 'basic',
      from: {key_code: 'a', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'a', modifiers: ['control']}],
      to_after_key_up: [{set_variable: clearMark()}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'a', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'a', modifiers: ['shift', 'control']}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'b', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'b', modifiers: ['control']}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'b', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'b', modifiers: ['shift', 'control']}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'd', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'delete_forward'}],
      to_after_key_up: [{set_variable: clearMark()}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'e', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'e', modifiers: ['control']}],
      to_after_key_up: [{set_variable: clearMark()}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'e', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'e', modifiers: ['shift', 'control']}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'f', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'f', modifiers: ['control']}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'f', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'f', modifiers: ['shift', 'control']}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'g', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [
        {
          set_variable: clearMark(),
        },
        {
          key_code: 'escape',
        },
      ],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'k', modifiers: withCtrlOrCapsLock()},
      to: [
        {key_code: 'right_arrow', modifiers: ['command', 'shift']},
        {key_code: 'x', modifiers: ['command']},
        {set_variable: clearMark()},
      ],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'n', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'n', modifiers: ['control']}],
      conditions: [unlessMarkActive(), unlessEmacs(), unlessBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'n', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'n', modifiers: ['shift', 'control']}],
      conditions: [ifMarkActive(), unlessEmacs(), unlessBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'n', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'down_arrow'}],
      conditions: [unlessMarkActive(), unlessEmacs(), ifBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'n', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'down_arrow', modifiers: ['shift']}],
      conditions: [ifMarkActive(), unlessEmacs(), ifBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'p', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'p', modifiers: ['control']}],
      conditions: [unlessMarkActive(), unlessEmacs(), unlessBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'p', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'p', modifiers: ['shift', 'control']}],
      conditions: [ifMarkActive(), unlessEmacs(), unlessBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'p', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'up_arrow'}],
      conditions: [unlessMarkActive(), unlessEmacs(), ifBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 'p', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'up_arrow', modifiers: ['shift']}],
      conditions: [ifMarkActive(), unlessEmacs(), ifBrowser()],
    },
    {
      type: 'basic',
      from: {key_code: 's', modifiers: withCtrlOrCapsLock()},
      to: [{key_code: 'f', modifiers: 'command'}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'v', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'page_down'}],
      to_after_key_up: [{set_variable: clearMark()}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'v', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [{key_code: 'page_down', modifiers: 'shift'}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'w', modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']}},
      to: [
        {
          key_code: 'x',
          modifiers: ['command'],
        },
        {
          set_variable: clearMark(),
        },
      ],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {
        key_code: 'y',
        modifiers: withCtrlOrCapsLock(),
      },
      to: [
        {key_code: 'v', modifiers: 'command'},
        {set_variable: clearMark()},
      ],
      conditions: [unlessEmacs(), unlessTerminal()],
    },
    {
      type: 'basic',
      from: {
        key_code: 'y',
        modifiers: withCtrlOrCapsLock(),
      },
      to: [
        {key_code: 'v', modifiers: 'command'},
        {key_code: 'y', modifiers: 'command'}, // Terminal pass-through
        {set_variable: clearMark()},
      ],
      conditions: [unlessEmacs(), ifTerminal()],
    },
    {
      type: 'basic',
      from: {
        key_code: 'slash',
        modifiers: withCtrlOrCapsLock(),
      },
      to: [{key_code: 'z', modifiers: 'command'}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {
        key_code: 'spacebar',
        modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']},
      },
      to: [{set_variable: setMark()}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {
        key_code: 'spacebar',
        modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']},
      },
      to: [{set_variable: clearMark()}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
  ]
}

function optionKeys() {
  return [
    {
      type: 'basic',
      from: {key_code: 'd', modifiers: {mandatory: ['option'], optional: ['shift']}},
      to: [{
        key_code: 'delete_or_backspace',
        modifiers: ['fn', 'option']
      }],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'b', modifiers: {mandatory: ['option'], optional: ['shift']}},
      to: [{
        key_code: 'left_arrow',
        modifiers: ['option']
      }],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'f', modifiers: {mandatory: ['option'], optional: ['shift']}},
      to: [{key_code: 'right_arrow', modifiers: ['option']}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'v', modifiers: {mandatory: ['option'], optional: ['shift']}},
      to: [{key_code: 'page_up'}],
      to_after_key_up: [{set_variable: clearMark()}],
      conditions: [unlessMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'v', modifiers: {mandatory: ['option'], optional: ['shift']}},
      to: [{key_code: 'page_up', modifiers: 'shift'}],
      conditions: [ifMarkActive(), unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'w', modifiers: {mandatory: ['option'], optional: ['any']}},
      to: [
        {
          key_code: 'c',
          modifiers: ['command'],
        },
        {
          set_variable: clearMark(),
        },
      ],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'comma', modifiers: {mandatory: ['option', 'shift']}},
      to: [{key_code: 'home'}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'period', modifiers: {mandatory: ['option', 'shift']}},
      to: [{key_code: 'end'}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'y', modifiers: {mandatory: ['option'], optional: ['any']}},
      to: [{key_code: 'v', modifiers: ['command']}],
      conditions: [unlessEmacs()],
    },
    {
      type: 'basic',
      from: {key_code: 'delete_or_backspace', modifiers: {mandatory: ['option'], optional: ['any']}},
      to: [{key_code: 'z', modifiers: ['command']}],
      conditions: [unlessEmacs()],
    },
  ]
}

main()
