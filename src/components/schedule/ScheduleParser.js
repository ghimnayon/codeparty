export function summarizeSchedule(schedule) {
    const result = [];
    var daySummary = null;
    schedule.forEach((entry, index) => {
        const { date, dest, cost, duration } = entry;
        const durationMinutes = parseInt(duration.replace('분', ''), 10);
        const costAmount = parseInt(cost.replace('만원', ''), 10);

        if (!daySummary) {
            daySummary = {
                date: date,
                mainDest: dest,
                mainDuration: durationMinutes,
                destCount: 1,
                totalCost: costAmount
            };
        } else {
            daySummary.destCount += 1;
            daySummary.totalCost += costAmount;

            if (durationMinutes > daySummary.mainDuration ||
                (durationMinutes === daySummary.mainDuration && costAmount > daySummary.mainCost)) {
                daySummary.mainDest = dest;
                daySummary.mainDuration = durationMinutes;
            }
        }
    });

    return daySummary;
}



export function splitSchedule(data) {
    let counter = 1;
    const res = data.reduce((acc, val) => {
        if (!acc[counter]) {
            acc[counter] = [val];
        }
        else if (acc[counter].every(entry => entry.date === val.date)) {
            acc[counter].push(val);
        } else {
            counter++;
            acc[counter] = [val];
        }
        return acc;
    }, {});
    return res;
}