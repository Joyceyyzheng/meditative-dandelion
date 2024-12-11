import useStore from "./store"


export default function StaticUI() {

    const dayNumber = useStore(state => state.dayNumber);
    const dayPhase = useStore(state => state.dayPhase);

    return (
        <>
            {/* <div className="ui-cat">Current Day: {dayNumber}</div> */}
            <div className="progress-bar-parent">
                <div className={`checkbox ${dayNumber >= 1 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="dayOne"></div>
                <div className={`checkbox ${dayNumber >= 2 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="dayTwo"></div>
                <div className={`checkbox ${dayNumber >= 3 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="dayThree"></div>
                <div className={`checkbox ${dayNumber >= 4 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="dayFour"></div>
                <div className={`checkbox ${dayNumber >= 5 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="dayFive"></div>
                <div className={`checkbox ${dayNumber >= 6 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="daySix"></div>
                <div className={`checkbox ${dayNumber >= 7 ? (dayPhase ? 'day-checked' : 'night-checked') : dayNumber === 0 ? 'default' : ''}`} id="daySeven"></div>

            </div>
        </>
    );
}
