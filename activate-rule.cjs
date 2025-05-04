const path = require("path");

let lastFile;
let lastReported = 0;
let shouldHookExit = true;

const stats = [];
const defaultSettings = {
    skipStats: false,
    skipSlowFiles: false,
    interval: 10000,
};

const create = (context) => {
    const settings = { ...defaultSettings, ...context.settings.progress };
    if (shouldHookExit && !settings.skipStats) {
        shouldHookExit = false;
        process.on("exit", () => printStats(settings.skipSlowFiles));
    }

    const now = Date.now();
    if (now > lastReported + settings.interval) {
        lastReported = now;
        const totalCount = stats.length.toLocaleString();
        console.log(`* [${new Date().toLocaleTimeString()}] Processed ${totalCount} files...`);
    }

    if (lastFile) {
        lastFile.finish = now;
        lastFile.duration = now - lastFile.start;
        stats.push(lastFile);
    }

    lastFile = {
        name: context.getFilename(),
        start: now,
    };

    return {};
};

const SLOW_FILES_LIMIT = 10;

function printStats(skipSlowFiles = false) {
    const totalTime = stats.map((s) => s.duration).reduce((a, b) => a + b, 0);

    if (!skipSlowFiles) {
        console.log("\nESLint Stats Report");
        console.log("===================");
    }

    console.log(`\n${stats.length.toLocaleString()} files processed in ${formatDuration(totalTime)}.`);
    stats.sort((a, b) => b.duration - a.duration);
    console.log();

    if (skipSlowFiles) {
        return;
    }

    const slow = stats.slice(0, SLOW_FILES_LIMIT);
    console.log(`Slowest ${slow.length} files\n`);
    for (const file of stats.slice(0, SLOW_FILES_LIMIT)) {
        console.log(` * ${path.relative(process.cwd(), file.name)} (${file.duration} ms)`);
    }
    console.log();
}

function formatDuration(totalTime) {
    if (totalTime < 10000) {
        // Return value in milliseconds only
        return `${totalTime.toLocaleString()} ms`;
    }

    const totalSeconds = Math.floor(totalTime / 1000);
    if (totalSeconds < 60) {
        // Return value in seconds only
        return `${totalSeconds.toLocaleString()} second${totalSeconds !== 1 ? "s" : ""}`;
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format the output
    const minuteText = `${minutes.toLocaleString()} minute${minutes !== 1 ? "s" : ""}`;
    const secondText = seconds > 0 ? ` ${seconds} second${seconds !== 1 ? "s" : ""}` : "";

    return minuteText + secondText;
}

const progress = {
    name: "progress",
    meta: {
        type: "suggestion",
        messages: [],
        schema: [],
    },
    create,
};

module.exports = progress;
