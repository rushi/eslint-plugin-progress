const path = require("path");

module.exports = function createProgressReporter(options) {
    let lastFile;
    let lastReported = 0;
    let shouldHookExit = options && options.hookExit;

    let skipStats = false;
    let skipSlowFiles = false;

    const stats = [];

    const eslintPlugin = {
        rules: {
            activate: {
                create(context) {
                    const options = context.options[0] || { skipStats: false, skipSlowFiles: false };
                    skipStats = options.skipStats;
                    skipSlowFiles = options.skipSlowFiles;
                    options.interval = options.interval ? Number(options.interval) : 15000;
                    if (shouldHookExit && !skipStats) {
                        shouldHookExit = false;
                        process.on("exit", printStats);
                    }

                    const now = Date.now();
                    if (now > lastReported + options.interval) {
                        lastReported = now;
                        console.log(`* [${new Date().toLocaleTimeString()}] Processed ${stats.length} files...`);
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
                },
            },
        },
    };

    const SLOW_FILES_LIMIT = 10;

    function printStats() {
        const totalTime = stats.map((s) => s.duration).reduce((a, b) => a + b, 0);

        if (!skipSlowFiles) {
            console.log();
            console.log("ESLint Stats Report");
            console.log("===================");
            console.log();
        }

        console.log(`${stats.length} files processed in ${formatDuration(totalTime)}.`);
        stats.sort((a, b) => b.duration - a.duration);
        console.log();

        if (skipSlowFiles) {
            return;
        }

        const slow = stats.slice(0, SLOW_FILES_LIMIT);
        console.log(`## Slowest ${slow.length} files`);
        for (const file of stats.slice(0, SLOW_FILES_LIMIT)) {
            console.log(` * ${path.relative(process.cwd(), file.name)} (${file.duration} ms)`);
        }
        console.log();
    }

    function formatDuration(totalTime) {
        if (totalTime < 10000) {
            // Return value in milliseconds only
            return `${totalTime} ms`;
        }

        const totalSeconds = Math.floor(totalTime / 1000);
        if (totalSeconds < 60) {
            // Return value in seconds only
            return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""}`;
        }

        // Calculate minutes and remaining seconds
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Format the output
        const minuteText = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
        const secondText = seconds > 0 ? ` ${seconds} second${seconds !== 1 ? "s" : ""}` : "";

        return minuteText + secondText;
    }

    return {
        eslintPlugin,
        printStats,
        stats,
    };
};
