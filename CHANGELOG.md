# Change Log

All notable changes to the "launchqtcreator" extension will be documented in this file.

## [0.1.21]

  -- Transitive dependency brace-expansion 1.1.11 is introduced via
      @vscode/vsce 2.32.0  ...  brace-expansion 1.1.11
      eslint 7.32.0  ...  brace-expansion 1.1.11
      glob 7.2.3  ...  brace-expansion 1.1.11
      tslint 5.20.1  ...  brace-expansion 1.1.11
      vscode-test 1.6.1  ...  brace-expansion 1.1.11
  
  -- Package                 Affected versions     Patched version
  -- brace-expansion (npm)   >= 1.0.0, <= 1.1.11   1.1.12

  -- A vulnerability was found in juliangruber brace-expansion up to 1.1.11/2.0.1/3.0.0/4.0.0. It has been rated as problematic.
     Affected by this issue is the function expand of the file index.js. The manipulation leads to inefficient regular expression complexity.
     The attack may be launched remotely. The complexity of an attack is rather high. The exploitation is known to be difficult.
     The exploit has been disclosed to the public and may be used. Upgrading to version 1.1.12, 2.0.2, 3.0.1 and 4.0.1 is able to address this issue.
     The name of the patch is a5b98a4f30d7813266b221435e1eaaf25a1b0ac5. It is recommended to upgrade the affected component.

==========

- Bumps the npm_and_yarn group with 1 update in the / directory: tar-fs.
- Updates tar-fs from 2.1.2 to 2.1.3
- Commits
  - See full diff in compare [view](https://github.com/mafintosh/tar-fs/commits)

## [0.1.20]

- Bumps the npm_and_yarn group with 1 update in the / directory: tar-fs.
- Updates tar-fs from 2.1.1 to 2.1.2
- Commits
- d97731b 2.1.2
- fd1634e symlink tweak from main
- See full diff in [compare](https://github.com/mafintosh/tar-fs/compare/v2.1.1...v2.1.2)

## [0.1.19]

- Extension now displays activation message to include version
- CVE-2025-22150 Moderate severity

  - undici  Version >= 6.0.0< 6.21.1 Upgrade to ~> 6.21.1
  - Defined in yarn.lock

- Impact
  - Undici fetch() uses Math.random() to choose the boundary for a multipart/form-data request. It is known that the output of Math.random() can be predicted if several of its generated values are known.
  If there is a mechanism in an app that sends multipart requests to an attacker-controlled website, they can use this to leak the necessary values. Therefore, An attacker can tamper with the requests going to the backend APIs if certain conditions are met.

  - Patches
    - This is fixed in 5.28.5; 6.21.1; 7.2.3.

    - Workarounds
      - Do not issue multipart requests to attacker controlled servers.

  - References
  
  - <https://hackerone.com/reports/2913312>
  - <https://blog.securityevaluators.com/hacking-the-javascript-lottery-80cc437e3b7f>

## [0.1.18]

- "Open in Designer" fails when executed from palette #24:
  
  - Open from Explorer context menu still works (both designer and qtcreator)
  - Open from Editor Window context menu still works (both designer and qtcreator)
  - from the command palette (both designer and qtcreator), no longer supplied a valid URI object from the active editor window.
    to ensure that the command palette still functions the extension now checks for a valid URI object and an active editor window,
    which must have a document type open that the extension allows to be opened in either designer or qtcreator

## [0.1.17]

- Sourced from cross-spawn's changelog:[url](https://github.com/moxystudio/node-cross-spawn/blob/master/CHANGELOG.md)
- 7.0.6 (2024-11-18) Bug Fixes
  - update cross-spawn version to 7.0.5 in package-lock.json (f700743)[url](https://github.com/moxystudio/node-cross-spawn/commit/f700743918d901eff92960e15a8dd68f87bd4176)
- 7.0.5 (2024-11-07) Bug Fixes
  - fix escaping bug introduced by backtracking (640d391)[url](https://github.com/moxystudio/node-cross-spawn/commit/640d391fde65388548601d95abedccc12943374f)
- 7.0.4 (2024-11-07) Bug Fixes
  - disable regexp backtracking (#160)[url](https://redirect.github.com/moxystudio/node-cross-spawn/issues/160) (5ff3a07)[url](https://github.com/moxystudio/node-cross-spawn/commit/5ff3a07d9add449021d806e45c4168203aa833ff)

## [0.1.16]

- Bumps braces from 3.0.2 to 3.0.3.
  - Commits
    - 74b2db2 3.0.3
    - 88f1429 update eslint. lint, fix unit tests.
    - 415d660 Snyk js braces 6838727 (#40)
    - 190510f fix tests, skip 1 test in test/braces.expand
    - 716eb9f readme bump
    - a5851e5 Merge pull request #37 from coderaiser/fix/vulnerability
    - 2092bd1 feature: braces: add [maxSymbols](https://github.com/micromatch/braces/issues/...)
    - 9f5b4cf fix: [vulnerability](https://security.snyk.io/vuln/SNYK-JS-BRACES-6838727)
    - 98414f9 remove funding file
    - 665ab5d update keepEscaping doc (#27)
    - Additional commits viewable in [compare view](https://github.com/micromatch/braces/compare/3.0.2...3.0.3)

## [0.1.15]

- @dependabot/npm_and_yarn/multi-7633470765:
  Bump tar and npm
  Removes [tar](https://github.com/isaacs/node-tar). It's no longer used after updating ancestor dependency [npm](https://github.com/npm/cli).
  These dependencies need to be updated together.
  - Removes `tar`
  - Updates `npm` from 9.9.3 to 10.5.2
  - [Release notes](https://github.com/npm/cli/releases)
  - [Changelog](https://github.com/npm/cli/blob/latest/CHANGELOG.md)
  - [Commits](npm/cli@v9.9.3...v10.5.2)

  ---
  updated-dependencies:
  - dependency-name: tar
    dependency-type: indirect
  - dependency-name: npm
    dependency-type: direct:production
  ...

  Signed-off-by: dependabot[bot] <support@github.com>

  Extension is now supported from Microsoft Visual Studio Code >= 1.75

## [0.1.14]

- @dependbot xml2js is vulnerable to prototype pollution #9, update to 0.5.0

## [0.1.13]

- NPM IP package incorrectly identifies some private IP addresses as public #16
- update npm ip package to minimum patched version 2.0.1

## [0.1.10]

- Bump minimist from 1.2.5 to 1.2.6

## [0.1.8]

- updated ansi-regex to common version of at least 5.0.1

## [0.1.7]

- fixed some spelling errors and markdown formatting errors in read me documents
- updated various dependencies to latest npm packages via 'npm update' (see changes in package-lock.json and package.json)
- Bump nth-check from 2.0.0 to 2.0.1, change required version of nth-check in css-select to ^2.0.1 as well
  @dependabot suggested the update (minus the css-select required version) and sited release notes for nth-check:
  v2.0.1 fixes:
  - Replace regex with hand-rolled parser for nth-expressions (#9) 9894c1d
  V2.0.1 internal:
  - chore(ci): Use GitHub Actions, Dependabot(#10) e02b4dd
  - Bump dependencies

## [0.1.6]

- Bump path-parse from 1.0.6 to 1.0.7.
  This automated pull request fixes a security vulnerability. Bumps path-parse from 1.0.6 to 1.0.7.
  @dependabot Bump path-parse from 1.0.6 to 1.0.7 [fc8dc88].

- Updated vsix package published.

## [0.1.4]

- fixed formatting issue in README.md and CHANGELOG.md

## [0.1.3]

- applied a security patch based on input
  from dependabot:
  CVE-2021-23358 (high severity)

  Vulnerable versions: >= 1.3.2, < 1.12.1
  Patched version: 1.12.1
  The package underscore from 1.13.0-0 and before 1.13.0-2, from 1.3.2 and
  before 1.12.1 are vulnerable to Arbitrary Code Execution via the template
  function, particularly when a variable property is passed as an argument
  as it is not sanitized.

- applied a security patch based on input from dependabot:
  CVE-2021-23337 (high severity)
  Vulnerable versions: < 4.17.21
  Patched version: 4.17.21
  lodash versions prior to 4.17.21 are vulnerable to Command Injection via the template function.

- Regular Expression Denial of Service (ReDoS) Affecting eslint package, versions >=1.4.0 <4.18.2
  Affected versions of this package are vulnerable to Regular Expression Denial of Service (ReDoS).
  This can cause an impact of about 10 seconds matching time for data 100k characters long.
  Affected versions of this package are vulnerable to Regular Expression Denial of Service (ReDoS).
  This can cause an impact of about 10 seconds matching time for data 100k characters long.
  (info retrieved from: <https://snyk.io/vuln/npm:eslint:20180222>)

## [0.1.1]

- creating a new vsix package that contains the updated code reflecting the latest merged pull request from dependabot: Bump lodash from 4.17.15 to 4.17.19

## [0.1.0]

- updated minimalist dependency version based on the following alert from GitHub:
- CVE-2020-7598
  high severity
  Vulnerable versions: < 0.2.1
  Patched version: 0.2.1
  minimist before 1.2.2 could be tricked into adding or modifying properties of Object.prototype using a "constructor" or "proto" payload.
- engines.vscode ^1.39.0 ==>> engines.vscode ^1.43.0 (requires vscode 1.43.0 or later)

## [0.0.9]

- a dependency was updated for a security patch (acorn 7.1.0 -> 7.1.1), so Launch QtCreator has been bumped to 0.0.9

## [0.0.8]

- fixed an issue where QtCreator failed to launch after setting the path for QtCreator
- fixed an issue where QtCreator was launched twice when opening an item in QtCreator
- fixed an issue where Qt Designer failed to launch after setting the path for Qt Designer

## [0.0.7]

- Opens QtCreator or Qt Designer with no files via user selection from a Quick Pick.
- Added context menus for opening files in QtCreator or Qt Designer (as applicable),
  from the explorer, editor title, or editor.

## [0.0.6]

- now uses progress boxes to display information about launching

## [0.0.4]

- removed -notour from LaunchQtCreator due to lack of support for this flag on Linux

## [0.0.3]

- added command to 'open in' for QtCreator: *.pro,*.ui, *.qrc, CMakeLists.txt files only
- added command to 'open in' for Qt Designer: *.ui files only
- commands are available on the selected file in the explorer window context menu
- commands are available on the open text editor window context menu
- commands are available on the open text editor title context menu

## [0.0.2]

- added a separate ts script file for some creator commands
  - get the path to QtCreator, and then launch QtCreator
  - launch QtCreator

- updated the extension to use async functions and added some
  'exception' handling to help discover where failures might be
  happening when the extension is being used

## [.0.0.1]

- added a demo image to the README.md file

## [Unreleased]

- Initial release
