# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.5](https://github.com/eficode/tscli/compare/v0.0.4...v0.0.5) (2021-11-26)


### Features

* **app:** add and remove favorites ([5ff4f39](https://github.com/eficode/tscli/commit/5ff4f39279ea768c03999d91df8ac7e60e33feb0))
* **app:** add error handling ([6f64092](https://github.com/eficode/tscli/commit/6f64092e8b270d8a4a7e72c165b15086c290516c))
* **app:** add error handling to listing week ([7999cb0](https://github.com/eficode/tscli/commit/7999cb0423739cbc5ddcdca1f05b70cf847885b7))
* **app:** change adding hours from 'create' to 'app' ([44a3eff](https://github.com/eficode/tscli/commit/44a3eff4e9c63d6700a8531195dedb79e246c021))
* **app:** combine fetch and error handling to one function ([f41cc94](https://github.com/eficode/tscli/commit/f41cc944030e521c482a3d88335a3fa67e989179))
* **test:** add tests for phases and projects ([d94f21a](https://github.com/eficode/tscli/commit/d94f21aa1ff1e1ba1c607090c9e2a164a444b26c))
* **test:** add tests for projects and worktimes ([6f2a947](https://github.com/eficode/tscli/commit/6f2a9478e8a1e710e6d2cd1c944b418ba12edf81))


### Bug Fixes

* **app:** correct using cookies in fetch headers ([d090512](https://github.com/eficode/tscli/commit/d090512981c24589d734ca29edda29c9b5484640))
* **test:** fix adding and removing favorites ([b944708](https://github.com/eficode/tscli/commit/b944708eae57a0a56b55819405ab70a1afc0d0f9))
* **test:** test projects not found ([a5a77a8](https://github.com/eficode/tscli/commit/a5a77a8294ba72d7ae58ccf6648baa0aee78b2d8))
* **test:** update mock cookies fetched from browser ([0009e71](https://github.com/eficode/tscli/commit/0009e716c831f15777c03b4890fd8bdbd5c9dfad))

### [0.0.4](https://github.com/eficode/tscli/compare/v0.0.3...v0.0.4) (2021-11-23)


### Features

* **test:** add auth tests with mocking ([8eb7295](https://github.com/eficode/tscli/commit/8eb7295afd346434453b871473107e3b41bf0a35))
* **test:** add tests for phases ([b41bdfe](https://github.com/eficode/tscli/commit/b41bdfee3f236462a35eaae8684a63d4e58de3ca))
* **test:** add tests for phases ([4375ac6](https://github.com/eficode/tscli/commit/4375ac6a305b70c8e3aa4a9a35e5afd0aade4842))


### Bug Fixes

* **app:** remove backend as unnecessary ([2d72845](https://github.com/eficode/tscli/commit/2d7284592165895c8e820d4120f274b3d96a9260))
* **app:** remove logging ([f435fe5](https://github.com/eficode/tscli/commit/f435fe50af3e09d7cbb7a7a486557454384cd6ba))
* **ci:** fix typo in config ([282a217](https://github.com/eficode/tscli/commit/282a217f7195d3d4ac695e75adc1f58621e34311))
* **ci:** update node version ([7a108d3](https://github.com/eficode/tscli/commit/7a108d3928dac74a9f94f6a336f388bee005c7a3))
* **readme:** update readme ([9295a3f](https://github.com/eficode/tscli/commit/9295a3f83d9419695e69ad5c5aed1ceb7d57cac6))

### [0.0.3](https://github.com/eficode/tscli/compare/v0.0.2...v0.0.3) (2021-11-22)


### Features

* **app:** add collecting cookie infromation from browser ([c035eeb](https://github.com/eficode/tscli/commit/c035eeb965737b219aa7becef2e26bad78220a86))
* **app:** add reading chrome cookies ([427741a](https://github.com/eficode/tscli/commit/427741ae1c91a3df844941c21216733070781adc))
* **app:** fetch cookies from chrome and save to home directory ([4e98c6c](https://github.com/eficode/tscli/commit/4e98c6cbe98b7fe43f9eb5ff6ea99930eb8fc162))


### Bug Fixes

* **app:** added testing cookie to avoid circular referencing ([fcdae5f](https://github.com/eficode/tscli/commit/fcdae5f6a0f08e06e966806f0761364d2b9aaaf4))
* **test:** fix mocks for file reading ([cd97c39](https://github.com/eficode/tscli/commit/cd97c390aad900d75ee867b7dbe639ca7790a762))

### [0.0.2](https://github.com/eficode/tscli/compare/v0.0.1...v0.0.2) (2021-11-21)


### Features

* **api:** add PUT method for timesheets ([39069f1](https://github.com/eficode/tscli/commit/39069f16ca64327065013a3c844707c8cc909271))
* **app:** add console table printer ([7653858](https://github.com/eficode/tscli/commit/76538588fc571fbb39186339c81c057135f90ead))
* **app:** add listing current week as default command ([253c9f5](https://github.com/eficode/tscli/commit/253c9f52e837910254f69a240200c0f819ab26c4))
* **app:** add login concept to cli ([a466086](https://github.com/eficode/tscli/commit/a4660866085b6bd93af2e9819f88fcb954a8e29e))
* **app:** add updating worktime if it already exists ([e90e093](https://github.com/eficode/tscli/commit/e90e093817280d4269660510daa3021e90c6e5c4))
* **app:** start week from Monday ([2c08cc4](https://github.com/eficode/tscli/commit/2c08cc488a60e7b67c37a9eb006f7a046201d222))
* **backend:** update backend to typescript ([8133061](https://github.com/eficode/tscli/commit/81330615bc19839cb49730895f6ecc12cd343c1d))


### Bug Fixes

* **deps:** adds missing @types/node dependency ([c85b224](https://github.com/eficode/tscli/commit/c85b2240a5c13cf47af7e206c07d63e0f0bb11b7))

### 0.0.1 (2021-11-21)

### 0.0.1 (2021-11-21)
