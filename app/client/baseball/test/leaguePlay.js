// code snippet excised from CareerSpec

const teams = [1,2,3,4,5,6,7].map(() => {
    const team = new Team(game);
    team.wins = 0;
    team.losses = 0;
    team.ties = 0;
    return team;
});
let schedule = [];
const createSchedule = () => {
    for (let i = 0; i < 7; i++) {
        for (let j = i + 1; j < 7; j++) {
            schedule = schedule.concat([
                {home: i, away: j}
            ]);
        }
    }
};
[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map( _ => createSchedule());
let scheduleIndex = 0;
const getTeams = () => ({
    home: teams[schedule[scheduleIndex].home],
    away: teams[schedule[scheduleIndex].away]
});


/////

const byWins = (a, b) => {
    a = a.wins * 10000 - a.losses * 100 - a.ties;
    b = b.wins * 10000 - b.losses * 100 - b.ties;
    if (a > b) return -1;
    if (b > a) return 1;
    return 0;
};

const lpad = (s, len) => {
    if (!len) len = 2;
    s = `${s}`;
    while (s.length < len) {
        s = ` ${s}`;
    }
    return s;
};