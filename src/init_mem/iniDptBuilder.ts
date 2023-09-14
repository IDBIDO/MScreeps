export function iniStationBuilder(roomName: string, stationName: string) {
    if (!Memory['colony'][roomName]['dpt_build']) Memory['colony'][roomName]['dpt_build'] = {};
    if (!Memory['colony'][roomName]['dpt_build'][stationName]) Memory['colony'][roomName]['dpt_build'][stationName] = {};

    let iniMem: BuildStationMemory = {
        creepDeadTick: {},
        order: [],
        creepConfig: {
            body: {
                work: 1,
                carry: 3,
                move: 1,
            },
            priority: 2,
            creepMemory: {
                role: "builder",

                working: false,
                ready: false,
                ending: false,
                dontPullMe: true,

                workStationID: stationName,
                departmentName: "dpt_build",
                roomName: roomName,
            }
        },
        buildTask: {0: [], 1: [], 2: [], 3: [], 4: []},

    }

    Memory['colony'][roomName]['dpt_build'][stationName] = iniMem;

}

export function iniDptBuilder(roomName: string) {
    Memory['colony'][roomName]['dpt_build'] = {};
    iniStationBuilder(roomName, 'internal_build');
}