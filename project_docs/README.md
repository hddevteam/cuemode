# Project Documentation Index

This folder stores long-lived design, architecture, and governance documents for CueMode.

## Document list

| ID  | File                                                                                     | Purpose                                                       | Status | Last Updated |
| --- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ------------ |
| 0   | [`0-development.zh-CN.md`](./0-development.zh-CN.md)                                     | Chinese development guide (paired with root `DEVELOPMENT.md`) | Active | 2026-03-01   |
| 1   | [`1-presentation-mode-design.md`](./1-presentation-mode-design.md)                       | Presentation mode design document                             | Active | 2026-03-01   |
| 2   | [`2-mirror-flip-development-plan.md`](./2-mirror-flip-development-plan.md)               | Mirror flip feature development plan                          | Active | 2026-03-01   |
| 3   | [`3-selective-markdown-development-plan.md`](./3-selective-markdown-development-plan.md) | Selective markdown feature development plan                   | Active | 2026-03-01   |
| 4   | [`4-header-sizes-and-comments-feature.md`](./4-header-sizes-and-comments-feature.md)     | Header sizes and HTML comments feature notes                  | Active | 2026-03-01   |

## Naming rules

- Use numeric prefixes for reading order: `0-`, `1-`, `2-`...
- Use kebab-case file names
- Keep long-lived docs here; temporary notes should not be committed here

## Sync policy

- Root `DEVELOPMENT.md` and `project_docs/0-development.zh-CN.md` must stay synchronized.
- Run `npm run docs:check` before committing doc changes.
- Legacy development docs have been consolidated into this folder.
