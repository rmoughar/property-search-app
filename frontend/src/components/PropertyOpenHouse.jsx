function PropertyOpenHouse({openhouses}){
    
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
    

    
    return(
        <div>

            {openhouses.map(openhouse => (
                <div>
                    <div>date: {openhouse.OpenHouseDate}</div>

                    <div>time: {openhouse.OH_StartTime} - {openhouse.OH_EndTime}</div>

                    {getRemarks(openhouse) != '' ? (
                        <div>remarks: {getRemarks(openhouse)}</div>
                    ) : (
                        <></>
                    )}

                </div>
            ))}

            
        </div>
    )
}

export default PropertyOpenHouse;