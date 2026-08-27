import "./PropertyOpenHouse.css"

function PropertyOpenHouse({openhouses}){
    function formatDate(date){
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        })
    }

    function formatTime(time){
        return new Date(`2026-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        })
    }

    function getRemarks(openhouse){
        let remarks;

        try{
            if(openhouse.all_data === ''){
                remarks = ''
            }else{
                const data = JSON.parse(openhouse.all_data);
                data.OpenHouseRemarks != null ? remarks = data.OpenHouseRemarks : remarks = '';
            }
        }catch(error){
            console.error("Invalid JSON:", error);
            remarks = '';
        }

        return remarks;
    }
    
    function getStatus(openhouse){
        const endTime = new Date(
            `${openhouse.OH_EndDate}T${openhouse.OH_EndTime}`
        );

        return endTime >= new Date() ? "Active" : "Expired";
    }
    
    return(
        <div>
            
            {openhouses.map((openhouse,index) => {
                const remarks = getRemarks(openhouse);
                const status = getStatus(openhouse);

                return <details 
                className="openhouse"
                key={index}>
                    <summary className="openhouse-title">
                        <div className="openhouse-title-date-info">
                            <span>{formatDate(openhouse.OpenHouseDate)},</span>

                            <span>
                                {formatTime(openhouse.OH_StartTime)} - {formatTime(openhouse.OH_EndTime)}
                            </span>
                        </div>

                        <span className={`openhouse-status-${status.toLowerCase()}`}>
                            {status}
                        </span>
                    </summary>

                    <div className="openhouse-remarks">
                        <b>Remarks:</b>
                        <span>{remarks || "N/A"}</span>
                    </div>

                </details>
            })}

            
        </div>
    )
}

export default PropertyOpenHouse;