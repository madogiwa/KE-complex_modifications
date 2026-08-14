// JavaScript should be written in ECMAScript 5.1.

const karabiner = require('../lib/karabiner')

const terminalAndVi = [].concat(
  karabiner.bundleIdentifiers.terminal,
  karabiner.bundleIdentifiers.vi
)

// emacsKeyBindingsException without Sublime Text, VS Code, and X11.
const emacsKeyBindingsExceptionWithoutEditors = [].concat(
  karabiner.bundleIdentifiers.emacs,
  karabiner.bundleIdentifiers.remoteDesktop,
  terminalAndVi,
  karabiner.bundleIdentifiers.virtualMachine
)

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'Personal rules (@madogiwa)',
        maintainers: ['madogiwa'],
        rules: [
          {
            description: 'Control+Shift+J to turn on Japanese IME (japanese_kana)',
            manipulators: [
              basicManipulator(
                keyWithModifiers('j', ['control', 'shift']),
                [{ key_code: 'japanese_kana' }]
              ),
            ],
          },
          {
            description: 'Control+Shift+K to turn off Japanese IME (japanese_eisuu)',
            manipulators: [
              basicManipulator(
                keyWithModifiers('k', ['control', 'shift']),
                [{ key_code: 'japanese_eisuu' }]
              ),
            ],
          },
          {
            description: 'Send Escape, then japanese_eisuu, to exit Vim insert mode and turn off Japanese IME',
            manipulators: [
              basicManipulator(
                keyWithModifiers('escape'),
                [{ key_code: 'escape' }, { key_code: 'japanese_eisuu' }],
                [ifTerminalOrVi(), ifJapaneseInputSource()]
              ),
            ],
          },
          {
            description: 'Send Control+[, then japanese_eisuu, to exit Vim insert mode and turn off Japanese IME',
            manipulators: [
              basicManipulator(
                keyWithModifiers('open_bracket', ['control']),
                [
                  { key_code: 'open_bracket', modifiers: ['control'] },
                  { key_code: 'japanese_eisuu' },
                ],
                [ifTerminalOrVi(), ifJapaneseInputSource()]
              ),
            ],
          },
          {
            description: 'Control+[ to Escape',
            manipulators: [
              basicManipulator(
                keyWithModifiers('open_bracket', ['control']),
                [{ key_code: 'escape' }],
                [unlessEmacsKeyBindingsExceptionWithoutEditors()]
              ),
            ],
          },
          {
            description: 'Control+Shift+/ to Undo (Command+Shift+Z)',
            manipulators: [
              basicManipulator(
                keyWithModifiers('slash', ['control', 'shift']),
                [{ key_code: 'z', modifiers: ['command', 'shift'] }],
                [unlessEmacsKeyBindingsExceptionWithoutEditors()]
              ),
            ],
          },
        ],
      },
      null,
      '  '
    )
  )
}

function basicManipulator(from, to, conditions) {
  const manipulator = {
    type: 'basic',
    from: from,
    to: to,
  }

  if (conditions) {
    manipulator.conditions = conditions
  }

  return manipulator
}

function keyWithModifiers(keyCode, mandatoryModifiers) {
  const modifiers = {}

  if (mandatoryModifiers) {
    modifiers.mandatory = mandatoryModifiers
  }

  modifiers.optional = ['caps_lock']

  return {
    key_code: keyCode,
    modifiers: modifiers,
  }
}

function ifTerminalOrVi() {
  return {
    type: 'frontmost_application_if',
    bundle_identifiers: terminalAndVi,
  }
}

function unlessEmacsKeyBindingsExceptionWithoutEditors() {
  return {
    type: 'frontmost_application_unless',
    bundle_identifiers: emacsKeyBindingsExceptionWithoutEditors,
  }
}

function ifJapaneseInputSource() {
  return {
    type: 'input_source_if',
    input_sources: [{ language: '^ja$' }],
  }
}

main()
