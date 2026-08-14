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
            description: 'Clear mark after escape [requires Universal Emacs Keybindings]',
            manipulators: [
              {
                type: 'basic',
                from: {key_code: 'escape'},
                to: [
                  {key_code: 'escape'},
                  {set_variable: clearMark()},
                ],
                conditions: [ifMarkActive()],
              },
            ],
          },
          {
            description: 'Clear mark after control+[ [requires Universal Emacs Keybindings]',
            manipulators: [clearMarkAndSend({key_code: 'open_bracket', modifiers: ['control']})],
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

main()
