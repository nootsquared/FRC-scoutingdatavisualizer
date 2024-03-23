"use client"

import { useEffect, useState } from "react";
import raw_data from '../../app/components/results.json';
import _ from "lodash";

import { cn } from "../../lib/utils"


// This represents the number of matches that are dropped from our EPA calculations. 
// If a team has played GRACE_MATCHES + 2 total matches, the lowest GRACE_MATCHES matches are dropped 
// from the EPA calculations.
const GRACE_MATCHES = 1;

const PRECISION = 1; // Value lodash.round uses to round numbers

interface IteamData {
    team: number,
    matches_scouted: number,
    speaker: boolean,
    amp: boolean,
    climb: boolean,
    trap: boolean,
    autonomous_epa: number,
    teleop_epa: number,
    endgame_epa: number,
}

export default function PickList() {

    const [teams, setTeams] = useState<IteamData[]>([]);

    useEffect(() => {

        let seenTeams = []

        const data = raw_data.forEach((i: any) => {
                            
                if (!seenTeams.includes(i.team_number)) {
                    seenTeams.push(i.team_number)
                    
                    let auto_points: number[] = [];
                    let teleop_points: number[] = [];
                    let endgame_points: number[] = [];

                    let team_data = raw_data.filter((d: any) => d.team_number == i.team_number)
                    let team_struct = {
                        team: i.team_number,
                        matches_scouted: 0,
                        speaker: false,
                        amp: false,
                        climb: false,
                        trap: false,
                        autonomous_epa: 0,
                        teleop_epa: 0,
                        endgame_epa: 0,
                    }
                    team_data.forEach((i: any) => {

                        // Auto Line Cross Assumption: If a robot scores 2+ notes anywhere on the field in auto, they're assumed to have crossed the line.
                        auto_points.push(Number(i.speaker_notes_auton) * 5 + Number(i.amp_notes_auton) * 2 + (Number(i.speaker_notes_auton) + Number(i.amp_notes_auton) > 1 ? 2 : 0))
                        teleop_points.push(Number(i.speaker_notes_teleop) * 2 + Number(i.amp_notes_teleop) * 1)
                        let endgame_pts = 0
                        if (i.trap === "Yes") endgame_pts += 5;
                        if (i.hang_or_park === "Hang") {
                            if (i.harmonize === "Yes") {
                                endgame_pts += 5;
                            } else {
                                endgame_pts += 3;
                            }
                        } else if (i.hang_or_park === "Park") {
                            endgame_pts += 1;
                        }
                        endgame_points.push(endgame_pts)

                        if (Number(i.speaker_notes_auton) > 0 || Number(i.speaker_notes_teleop) > 0) {
                            team_struct.speaker = true
                        }
                        if (Number(i.amp_notes_auton) > 0 || Number(i.amp_notes_teleop) > 0) {
                            team_struct.amp = true
                        }
                        if (i.hang_or_park === "Hang") {
                            team_struct.climb = true
                        }
                        if (i.trap === "Yes") {
                            team_struct.trap = true
                        }
                        team_struct.matches_scouted += 1
                    })

                    team_struct.autonomous_epa = _.round(graceAvg(auto_points, GRACE_MATCHES), PRECISION)
                    team_struct.teleop_epa = _.round(graceAvg(teleop_points, GRACE_MATCHES), PRECISION)
                    team_struct.endgame_epa = _.round(graceAvg(endgame_points, GRACE_MATCHES), PRECISION)
                    
                    // let sorted = 

                    setTeams(previousData => _.sortBy([...previousData, team_struct] as IteamData[], (i: IteamData) => i.autonomous_epa + i.teleop_epa + i.endgame_epa).reverse())

                }
        })



    }, [])

    useEffect(() => {
        console.log(teams)
    }
    , [teams])

    return (
        <main className="flex min-h-screen w-screen flex-col items-center justify-center px-4 md:px-8 xl:px-10 py-14">

            <div>
                <h1 className="text-4xl font-bold text-white mb-12">226 Scouting Ranking</h1>
            </div>

            <div className="grid xl:grid-cols-1 lg:grid-cols-2 w-full gap-10 max-w-[1400px] mb-4">
                <div className="flex flex-col items-center justify-start p-4 border border-slate-900 bg-slate-900/50 rounded-xl min-h-[400px] shadow-xl shadow-black">
                    <div className="bg-white w-full h-12 text-black flex flex-row justify-evenly mb-12 sticky top-0">
                        <div className="w-1/6 h-full flex items-center justify-center">Team</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Matches</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Speaker</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Amp</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Climb</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Trap</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Auton EPA</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Teleop EPA</div>
                        <div className="w-1/6 h-full flex items-center justify-center">Endgame EPA</div>
                    </div>
                    <div className="w-full h-full overflow-auto">

                            {
                                teams.map((team) => {
                                    return <RowEntry team={team} />
                                })
                            }
                    </div>
                </div>
            </div>

        </main>
    )
}

const RowEntry = (props: {team: IteamData}) => {
    const [clicked, setClicked] = useState(false);

    return (
        <div className={cn("w-full h-20 text-white text-xl text-center flex flex-row justify-evenly items-center divide-x divide-zinc-500 mt-1 mb-1", clicked ? "bg-slate-500" : "bg-none")} onClick={() => setClicked(!clicked)} >
            <div className="w-1/6">{props.team.team}</div>
            <div className="w-1/6">{props.team.matches_scouted}</div>
            <div className={cn("w-1/6", props.team.speaker ? 'text-green-500' : 'text-red-500' )}>{props.team.speaker ? "Yes" : "No"}</div>
            <div className={cn("w-1/6", props.team.amp ? 'text-green-500' : 'text-red-500' )}>{props.team.amp ? "Yes" : "No"}</div>
            <div className={cn("w-1/6", props.team.climb ? 'text-green-500' : 'text-red-500' )}>{props.team.climb ? "Yes" : "No"}</div>
            <div className={cn("w-1/6", props.team.trap ? 'text-green-500' : 'text-red-500' )}>{props.team.trap ? "Yes" : "No"}</div>
            <div className="w-1/6">{props.team.autonomous_epa}</div>
            <div className="w-1/6">{props.team.teleop_epa}</div>
            <div className="w-1/6">{props.team.endgame_epa}</div>
        </div>
    )
}


/**
 ** Calculates the average of an array of numbers, excluding the lowest grace_num numbers in the array.
 * @param arr - The array of numbers to calculate the average from.
 * @param grace_num - The number of lowest values to exclude from the calculation.
 * @returns The average of the array, excluding the lowest grace_num numbers. */
function graceAvg(arr: number[], grace_num: number) {
    if (arr.length <= grace_num + 2) return _.mean(arr);
    return _.mean(_.orderBy(arr, [], ['desc']).slice(0, arr.length - grace_num));
}