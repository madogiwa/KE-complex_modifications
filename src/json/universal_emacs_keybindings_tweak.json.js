// JavaScript should be written in ECMAScript 5.1.

const karabiner = require('../lib/karabiner')

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'Universal Emacs Keybindings Tweak',

        rules: [
          {
            description: 'Clear mark only when escape is pressed while mark is set [requires Universal Emacs Keybindings]',
            manipulators: [
              {
                type: 'basic',
                from: {key_code: 'escape'},
                to: [{set_variable: clearMark()}],
                conditions: [ifMarkActive()],
              },
            ],
          },
          {
            description: 'VS Code: Control+B/F/N/P to Left/Right/Down/Up when mark is not set [place above Universal Emacs Keybindings]',
            manipulators: [
              mapControlKeyToArrow('b', 'left_arrow', [], vsCodeIdentifiers()),
              mapControlKeyToArrow('f', 'right_arrow', [], vsCodeIdentifiers()),
              mapControlKeyToArrow('n', 'down_arrow', [], vsCodeIdentifiers()),
              mapControlKeyToArrow('p', 'up_arrow', [], vsCodeIdentifiers()),
            ],
          },
          {
            description: 'Browsers: Control+B/F to Left/Right when mark is not set [place above Universal Emacs Keybindings]',
            manipulators: [
              mapControlKeyToArrow('b', 'left_arrow', [], karabiner.bundleIdentifiers.browser),
              mapControlKeyToArrow('f', 'right_arrow', [], karabiner.bundleIdentifiers.browser),
            ],
          },
          {
            description: 'Browsers: Control+A/E to Command+Left/Right when mark is not set [place above Universal Emacs Keybindings]',
            manipulators: [
              mapControlKeyToArrow('a', 'left_arrow', ['command'], karabiner.bundleIdentifiers.browser),
              mapControlKeyToArrow('e', 'right_arrow', ['command'], karabiner.bundleIdentifiers.browser),
            ],
          },
        ],
      },
      null,
      '  '
    )
  )
}

function ifMarkActive() {
  return {type: 'variable_if', name: 'C-spacebar', value: 1}
}

function clearMark() {
  return {name: 'C-spacebar', value: 0}
}

function vsCodeIdentifiers() {
  return ['^com\\.microsoft\\.VSCode$', '^com\\.microsoft\\.VSCodeInsiders$']
}

// Only override ordinary movement. The base rules handle mark selection and
// C-x commands, even when these optional tweaks are placed above them.
function mapControlKeyToArrow(keyCode, arrowKeyCode, toModifiers, bundleIdentifiers) {
  return {
    type: 'basic',
    from: {
      key_code: keyCode,
      modifiers: {mandatory: ['control'], optional: ['caps_lock', 'shift']},
    },
    to: [{key_code: arrowKeyCode, modifiers: toModifiers}],
    conditions: [
      {type: 'variable_unless', name: 'C-spacebar', value: 1},
      {type: 'variable_unless', name: 'C-x', value: 1},
      {
        type: 'frontmost_application_if',
        bundle_identifiers: bundleIdentifiers,
      },
    ],
  }
}

main()
