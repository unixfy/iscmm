export default async function (fetch) {
    // Grab all the data from the Go511 API
    const alerts = await fetch("https://commonwebsite.go511.com/api/Alert/GetAll")
    let alertsData = await alerts.json()

    // We have to process the alerts data to remove items where the "endDate" key is in the past OR the "startDate" key is in the future
    alertsData = alertsData.filter(alert => {
        const now = new Date()
        const endDate = new Date(alert.EndDate)
        const startDate = new Date(alert.StartDate)

        if (endDate < now || startDate > now) {
            return false
        } else {
            return true
        }
    })


    // Format alerts data
    alertsData = alertsData.map(alert => {
        let returnObj = {
            type: "Alert",
            latitude: alert.Latitude,
            longitude: alert.Longitude,
            emergency: alert.IsEmergency || alert.IsMajorEvent,
            description: alert.Text,
            start: new Date(alert.StartDate),
            end: new Date(alert.EndDate),
            url: alert.MoreInformationUrl
        }

        if (alert.County.length === 1) {
            returnObj.county = alert.County[0].Name
        } else if (alert.County.length > 1) {
            returnObj.county = alert.County.map(county => county.Name).join(", ")
        }

        return returnObj
    })

    const incidents = await fetch("https://commonwebsite.go511.com/api/Incident/GetAll")
    let incidentsData = await incidents.json()

    // Format incidents data
    incidentsData = incidentsData.map(incident => {
        let returnObj = {
            type: "Incident",
            latitude: incident.Latitude,
            longitude: incident.Longitude,
            emergency: (incident.Description.toUpperCase().search("SIGALERT") >= 0),
            description: incident.Description,
            start: new Date(incident.StartDate),
            freeway: incident.RoadwayName,
            county: incident.CountyName,
            direction: incident.DirectionOfTravel,
            location: incident.Location.replace(/`/g, "")
        }

        if (incident.PlannedEndDate) {
            returnObj.end = new Date(incident.PlannedEndDate)
        }

        return returnObj
    })

    const roadwork = await fetch("https://commonwebsite.go511.com/api/RoadWork/GetAll")
    let roadworkData = await roadwork.json()

    // Format roadwork data
    roadworkData = roadworkData.map(roadwork => {
        let returnObj = {
            type: "Closure",
            latitude: roadwork.Latitude,
            longitude: roadwork.Longitude,
            emergency: false,
            description: roadwork.Description,
            direction: roadwork.DirectionOfTravel,
            start: new Date(roadwork.StartDate),
            freeway: roadwork.RoadwayName,
            county: roadwork.CountyName,
            location: roadwork.Location.replace(/`/g, ""),
            lanes: roadwork.LanesAffected.toUpperCase() !== "NOT AVAILABLE" ? roadwork.LanesAffected : ""
        }

        if (roadwork.Description.toUpperCase() === "ROADWORK") {
            returnObj.type = "Road Work"
        }

        if (roadwork.PlannedEndDate) {
            returnObj.end = new Date(roadwork.PlannedEndDate)
        }

        return returnObj
    })

    const roadcondition = await fetch("https://commonwebsite.go511.com/api/RoadCondition/GetAll")
    let roadconditionData = await roadcondition.json()

    // Format Road Condition data
    roadconditionData = roadconditionData.map(roadcondition => {
        let returnObj = {
            type: "Road Condition",
            latitude: roadcondition.Latitude,
            longitude: roadcondition.Longitude,
            emergency: false,
            description: roadcondition.Description,
            direction: roadcondition.DirectionOfTravel,
            start: new Date(roadcondition.StartDate),
            freeway: roadcondition.RoadwayName,
            location: roadcondition.Location.replace(/`/g, ""),
            lanes: roadcondition.LanesAffected.toUpperCase() !== "NOT AVAILABLE" ? roadcondition.LanesAffected : ""
        }

        if (roadcondition.PlannedEndDate) {
            returnObj.end = new Date(roadcondition.PlannedEndDate)
        }

        return returnObj
    })

    // Then return everything in one big object
    return [...alertsData, ...incidentsData, ...roadworkData, ...roadconditionData]

}