'use client'

import React, { useRef, useEffect, useState  } from 'react';

const Page: React.FC = () => {
    const matchFormRef = useRef<HTMLFormElement>(null);
    const pitFormRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        document.addEventListener('keydown', handleMatchFormKeyDown);
        return () => {
            document.removeEventListener('keydown', handleMatchFormKeyDown);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handlePitFormKeyDown);
        return () => {
            document.removeEventListener('keydown', handlePitFormKeyDown);
        };
    }, []);

    const handleMatchFormKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentInput = document.activeElement as HTMLInputElement;
            const formInputs = Array.from(matchFormRef.current?.querySelectorAll('input') || []);
            const currentIndex = formInputs.findIndex(input => input === currentInput);
            if (currentIndex !== -1 && currentIndex < formInputs.length - 1) {
                const nextInput = formInputs[currentIndex + 1];
                nextInput.focus();
            }
        }
    };

    const handlePitFormKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentInput = document.activeElement as HTMLInputElement;
            const formInputs = Array.from(pitFormRef.current?.querySelectorAll('input') || []);
            const currentIndex = formInputs.findIndex(input => input === currentInput);
            if (currentIndex !== -1 && currentIndex < formInputs.length - 1) {
                const nextInput = formInputs[currentIndex + 1];
                nextInput.focus();
            }
        }
    };

    const handleMatchClearClick = () => {
        if (matchFormRef.current) {
            matchFormRef.current.reset();
        }
    };
    
    const handlePitClearClick = () => {
        if (pitFormRef.current) {
            pitFormRef.current.reset();
        }
    };


    const [scouter_name, setScouterName] = useState("");
    const [match_number, setMatchNumber] = useState("");
    const [teamA_number, setTeamNumber] = useState("");
    const [alliance, setAlliance] = useState("");
    const [starting_position, setStartingPosition] = useState("");
    const [additional_notes_location, setAdditionalNotesLocation] = useState("");
    const [amp_notes_auton, setAutonAmpNotes] = useState("");
    const [speaker_notes_auton, setAutonSpeakerNotes] = useState("");
    const [amp_notes_teleop, setTeleopAmpNotes] = useState("");
    const [speaker_notes_teleop, setTeleopSpeakerNotes] = useState("");
    const [trap, setTrap] = useState("");
    const [harmonized, setHarmonized] = useState("");
    const [hang_or_park, setHangPark] = useState("");
    const [robot_driving, setRobotDrivingRating] = useState("");
    const [defense_capability, setDefenseCapability] = useState("");
    const [notes, setOtherNotes] = useState("");

    const handleFormSubmit = (event: React.FormEvent) => {
        const [formData, setFormData] = useState({});

        useEffect(() => {
            setFormData({
                scouter_name,
                match_number,
                teamA_number,
                alliance,
                starting_position: starting_position === '1' ? 'AMP' : starting_position === '2' ? 'Middle' : starting_position === '3' ? 'Source' : '',
                additional_notes_location: additional_notes_location === '1' ? 'None' : additional_notes_location === '2' ? 'Spike' : additional_notes_location === '3' ? 'Center line' : additional_notes_location === '4' ? 'Both' : '',
                amp_notes_auton,
                speaker_notes_auton,
                amp_notes_teleop,
                speaker_notes_teleop,
                trap: trap === '1' ? 'Yes' : trap === '2' ? 'No' : '',
                harmonized: harmonized === '1' ? 'Yes' : harmonized === '2' ? 'No' : '',
                hang_or_park: hang_or_park === '1' ? 'Hang' : hang_or_park === '2' ? 'Park' : hang_or_park === '3' ? 'None' : '',
                robot_driving: robot_driving === '1' ? 'Poor' : robot_driving === '2' ? 'Mid' : robot_driving === '3' ? 'Excellent' : '',
                defense_capability: defense_capability === '1' ? 'Did not play defense' : defense_capability === '2' ? 'Average' : defense_capability === '3' ? 'Excellent' : '',
                notes
            });
        }, [scouter_name, match_number, teamA_number, alliance, starting_position, additional_notes_location, amp_notes_auton, speaker_notes_auton, amp_notes_teleop, speaker_notes_teleop, trap, harmonized, hang_or_park, robot_driving, defense_capability, notes]);
        
        const handleFormSubmit = (event: React.FormEvent) => {
            event.preventDefault();
        
            fetch('/api/saveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });
        
            console.log(JSON.stringify(formData, null, 2));
            handlePitClearClick();
            handleMatchClearClick();
        };
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 md:px-8 xl:px-10 py-14">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white mb-12">Form Input</h1>
                <hr className="border-white w-1/2 mb-12" />
                <h1 className="text-2xl font-bold text-white mb-12">Match Scouting</h1>
                <form ref={matchFormRef} className="grid grid-cols-4 gap-4" onSubmit={handleFormSubmit}>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Scouter Name - 1</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} autoFocus onChange={e => setScouterName(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Match Number - 2</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setMatchNumber(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Team Number - 3</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setTeamNumber(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Alliance - 4</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setAlliance(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Starting Position - 5</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setStartingPosition(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Additional Notes Location - 6</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setAdditionalNotesLocation(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Auton Amp Notes - 7</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setAutonAmpNotes(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Auton Speaker Notes - 8</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setAutonSpeakerNotes(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Teleop Amp Notes - 9</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setTeleopAmpNotes(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Teleop Speaker Notes - 10</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setTeleopSpeakerNotes(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Trap? - 11</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setTrap(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Harmonized? - 12</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setHarmonized(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Hang/Park? - 13</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setHangPark(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Robot Driving Rating - 14</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setRobotDrivingRating(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Defense Capability - 15</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setDefenseCapability(e.target.value)}/>
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Other Notes</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} onChange={e => setOtherNotes(e.target.value)}/>
                    </div>
                    <div className="flex col-span-4 justify-center">
                        <button onClick={handleMatchClearClick} className="bg-red-500 text-white font-bold py-2 px-4 rounded-full mb-12">Clear</button>
                        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-12 ml-4" type="submit">Submit</button>
                    </div>
                </form>
                <hr className="border-white w-1/2 mb-12" />
                <h1 className="text-2xl font-bold text-white mb-12">Pit Scouting</h1>
                <form ref={pitFormRef} className="grid grid-cols-4 gap-4">
                <div>
                        <p className="text-white text-lg mb-6 text-center">Scouter Name - 1</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Team Number - 2</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Drivetrain Type - 3</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Under Stage? - 4</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Intake Description - 5</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Preferred Auto - 6</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Max Scoring - 7</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Shooting Location - 8</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Amp? - 9</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Trap? - 10</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Harmonize? - 11</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Hang/Park? - 12</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div>
                        <p className="text-white text-lg mb-6 text-center">Other Notes</p>
                        <input type="text" className="form-input bg-gray-200 text-black mb-12" placeholder="Enter text here" style={{ width: '300px', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div className="flex col-span-4 justify-center">
                        <button onClick={handlePitClearClick} className="bg-red-500 text-white font-bold py-2 px-4 rounded-full mb-12">Clear</button>
                        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-12 ml-4" type="submit">Submit</button>
                    </div>
                </form>
                
                <hr className="border-white w-1/2 mb-12" />
            </div>
        </main>
    );
};

export default Page;
