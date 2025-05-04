# eslint-plugin-progress

Report progress when running ESLint. Useful for large projects with thousands of files

## Features

Displays progress while running ESLint, and a summary when exiting:

Before

```bash
$ npx eslint .
# (silence for 5 minutes)
```

After

```bash
$ npx eslint .

* [11:02:06 PM] Processed 0 files...
* [11:02:16 PM] Processed 155 files...
* [11:02:26 PM] Processed 350 files...
* [11:02:36 PM] Processed 569 files...
* [11:02:46 PM] Processed 880 files...
* [11:02:56 PM] Processed 1,207 files...
* [11:03:06 PM] Processed 1,562 files...
* [11:03:16 PM] Processed 1,959 files...

ESLint Stats Report
===================

2,286 files processed in 1 minutes 30 seconds

Slowest 10 files
 * path/to/AdvancedSearchFilters.react.js (4079 ms)
 * path/to/RichTextEditor.react.js (2043 ms)
 * path/to/MessageBody.react.js (1037 ms)
 * path/to/BrowseChannelsModal.react.js (984 ms)
 * path/to/KanbanBoard.react.js (937 ms)
 * path/to/WorkspaceRetroPane.react.js (871 ms)
 * path/to/MessageStream.react.js (721 ms)
 * path/to/AppV2.react.js (652 ms)
 * path/to/OnboardingPage.react.js (536 ms)
 * path/to/ResourcesTable.react.js (364 ms)

```

## Usage

```bash
npm install https://github.com/rushi/eslint-plugin-progress
```

## Configuration

Configure in your ES Lint config

```json
// import progress from "eslint-plugin-progress";
{
    {
        settings: {
            progress: {
                skipStats: false,
                skipSlowFiles: false,
                interval: 10000,
            },
        },
        plugins: {
            progress,
        }
    },
    rules: {
        "progress/activate": ["warn"],
    }
}
```

### Known issues

It doesn’t keep the stat of the last file processed.

## Author

Original work by [Thai Pangsakulyanont](https://github.com/taskworld/eslint-plugin-progress), and extended by Rushi Vishavadia
