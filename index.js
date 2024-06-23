
const fs = require('fs');

let logEntries = [];

function addLogEntry(timestamp, logType, severity) {
    logEntries.push({ timestamp, logType, severity });
}

function computeMeanSeverityByType(logType) {
    let entries = logEntries.filter(entry =>entry.logType.trim()===logType.trim());
    const meanSeverity = calculateMeanSeverity(entries);
    return meanSeverity.toFixed(6);
}

function computeMeanSeverityBefore(timestamp) {
    const entries = logEntries.filter(entry => entry.timestamp < timestamp);
    const meanSeverity = calculateMeanSeverity(entries);
    return meanSeverity.toFixed(6);
}

function computeMeanSeverityAfter(timestamp) {
    const entries = logEntries.filter(entry => entry.timestamp > timestamp);
    const meanSeverity = calculateMeanSeverity(entries);
    return meanSeverity.toFixed(6);
}

function computeMeanSeverityBeforeByType(logType, timestamp) {
    const entries = logEntries.filter(entry => entry.logType === logType && entry.timestamp < timestamp);
    const meanSeverity = calculateMeanSeverity(entries);
    return meanSeverity.toFixed(6);
}

function computeMeanSeverityAfterByType(logType, timestamp) {
    const entries = logEntries.filter(entry => entry.logType === logType && entry.timestamp > timestamp);
    const meanSeverity = calculateMeanSeverity(entries);
    return meanSeverity.toFixed(6);
}

function calculateMeanSeverity(entries) {
    if (entries.length === 0) return 0.0;
    const totalSeverity = entries.reduce((sum, entry) => sum + entry.severity, 0);
    return totalSeverity / entries.length;
}

function processInput(inputLines) {
    let outputLines = [];
    inputLines.forEach((line,index) => {
        let parts = line.replace(/\r/g, "").split(' ');
        const command = parts[0];
        switch (command) {
            case '1':
                const [timestamp, logType, severity] = parts[1].split(';');
                addLogEntry(Number(timestamp), logType, parseFloat(severity));
                outputLines.push('No output');
                break;
            case '2':
                const meanSeverityByType = computeMeanSeverityByType(parts[1]);
                outputLines.push(`Mean: ${meanSeverityByType}`);
                break;
            case '3':
                if (parts[1] === 'BEFORE') {
                    const meanSeverityBefore = computeMeanSeverityBefore(Number(parts[2]));
                    outputLines.push(`Mean: ${meanSeverityBefore}`);
                } else if (parts[1] === 'AFTER') {
                    const meanSeverityAfter = computeMeanSeverityAfter(Number(parts[2]));
                    outputLines.push(`Mean: ${meanSeverityAfter}`);
                }
                break;
            case '4':
                const logType2 = parts[2];
                if (parts[1] === 'BEFORE') {
                    const meanSeverityBeforeByType = computeMeanSeverityBeforeByType(logType2, Number(parts[3]));
                    outputLines.push(`Mean: ${meanSeverityBeforeByType}`);
                } else if (parts[1] === 'AFTER') {
                    const meanSeverityAfterByType = computeMeanSeverityAfterByType(logType2, Number(parts[3]));
                    outputLines.push(`Mean: ${meanSeverityAfterByType}`);
                }
                break;
            default:
                break;
        }
    });
    return outputLines;
}

function main() {
    const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
    const output = processInput(input);
    fs.writeFileSync('output.txt', output.join('\n'));
}

main();

