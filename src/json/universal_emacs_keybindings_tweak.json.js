// JavaScript should be written in ECMAScript 5.1.

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'Universal Emacs Keybindings Tweak',

        rules: [
          {
            description: 'Clear mark after native cut (command+x) [requires Universal Emacs Keybindings]',
            manipulators: [clearMarkAndSend({key_code: 'x', modifiers: ['command']})],
          },
          {
            description: 'Clear mark after native paste (command+v) [requires Universal Emacs Keybindings]',
            manipulators: [clearMarkAndSend({key_code: 'v', modifiers: ['command']})],
          },
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
            description: 'VS Code companion rule: change control+p/control+f to up/right arrows [for use with Universal Emacs Keybindings]',
            manipulators: [
              mapControlKeyToArrow('p', 'up_arrow'),
              mapControlKeyToArrow('f', 'right_arrow'),
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

function clearMarkAndSend(key) {
  return {
    type: 'basic',
    from: {
      key_code: key.key_code,
      modifiers: {mandatory: key.modifiers},
    },
    to: [
      key,
      {set_variable: clearMark()},
    ],
    conditions: [ifMarkActive()],
  }
}

function mapControlKeyToArrow(keyCode, arrowKeyCode) {
  return {
    type: 'basic',
    from: {
      key_code: keyCode,
      modifiers: {mandatory: ['control']},
    },
    to: [{key_code: arrowKeyCode}],
    conditions: [
      {
        type: 'frontmost_application_if',
        bundle_identifiers: ['^com\\.microsoft\\.VSCode$', '^com\\.microsoft\\.VSCodeInsiders$'],
      },
    ],
  }
}

main()
