import {format, parseISO, parse, formatDistanceToNow} from "date-fns";

export default async function (fetch) {
    // Grab all the data from the Go511 API
    const alerts = await fetch("https://commonwebsite.go511.com/api/Alert/GetAll")
    let alertsData = await alerts.json()

    const incidents = await fetch("https://commonwebsite.go511.com/api/Incident/GetAll")
    let incidentsData = await incidents.json()

    // We have to process the alerts data to remove items where the "endDate" key is in the past OR the "startDate" key is in the future
    alertsData = alertsData.filter(alert => {
        const now = new Date()
        const endDate = new Date(alert.EndDate)
        const startDate = new Date(alert.StartDate)

        return !(endDate < now || startDate > now);
    })


    // Format alerts data
    alertsData = alertsData.map(alert => {
        let returnObj = {
            type: "Alert",
            latitude: alert.Latitude,
            longitude: alert.Longitude,
            emergency: alert.IsEmergency || alert.IsMajorEvent,
            description: alert.Text,
            end: format(parseISO(alert.EndDate), "Pp"),
            url: alert.MoreInformationUrl
        }

        if (alert.StartDate) {
            returnObj.start = format(parseISO(alert.StartDate), "Pp")
            returnObj.startDistanceToNow = formatDistanceToNow(parseISO(alert.StartDate))
        }

        if (alert.County.length === 1) {
            returnObj.county = alert.County[0].Name
        } else if (alert.County.length > 1) {
            returnObj.county = alert.County.map(county => county.Name).join(", ")
        }

        return returnObj
    })


    // Format incidents data
    incidentsData = incidentsData.map(incident => {
        let returnObj = {
            type: "Incident",
            latitude: incident.Latitude,
            longitude: incident.Longitude,
            emergency: (incident.Description.toUpperCase().search("SIGALERT") >= 0),
            description: incident.Description,
            start: format(parse(incident.StartDate, "MMM do, y hh:mm a", new Date()), "Pp"),
            startDistanceToNow: formatDistanceToNow(parse(incident.StartDate, "MMM do, y hh:mm a", new Date())),
            freeway: incident.RoadwayName,
            county: incident.CountyName,
            direction: incident.DirectionOfTravel,
            location: incident.Location.replace(/`/g, "")
        }

        if (incident.PlannedEndDate) {
            returnObj.end = format(parse(incident.PlannedEndDate, "MMM do, y hh:mm a", new Date()), "Pp")
        }

        return returnObj
    })

    const roadwork = await fetch("https://commonwebsite.go511.com/api/RoadWork/GetAll")
    let roadworkData = await roadwork.json()

    // Filter road work data to remove items where the "endDate" key is in the past OR the "startDate" key is in the future
    roadworkData = roadworkData.filter(roadwork => {
        const now = new Date()
        const endDate = new Date(roadwork.PlannedEndDate)
        const startDate = new Date(roadwork.StartDate)

        return !(endDate < now || startDate > now);
    })

    // Format roadwork data
    roadworkData = roadworkData.map(roadwork => {
        let returnObj = {
            type: "Closure",
            latitude: roadwork.Latitude,
            longitude: roadwork.Longitude,
            emergency: false,
            description: roadwork.Description,
            direction: roadwork.DirectionOfTravel,
            start: format(parseISO(roadwork.StartDate), "Pp"),
            startDistanceToNow: formatDistanceToNow(parseISO(roadwork.StartDate)),
            freeway: roadwork.RoadwayName,
            county: roadwork.CountyName,
            location: roadwork.Location.replace(/`/g, ""),
            lanes: roadwork.LanesAffected.toUpperCase() !== "NOT AVAILABLE" ? roadwork.LanesAffected : ""
        }

        if (roadwork.Description.toUpperCase() === "ROADWORK") {
            returnObj.type = "Road Work"
        }

        if (roadwork.PlannedEndDate) {
            returnObj.end = format(parseISO(roadwork.PlannedEndDate), "Pp")
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
            // road condition dates are reported in an extremely unfriendly way
            // example: 7/13/23 8:59am
            start: format(parse(roadcondition.Reported, "M/d/yy h:mma", new Date()), "Pp"),
            startDistanceToNow: formatDistanceToNow(parse(roadcondition.Reported, "M/d/yy h:mma", new Date())),
            freeway: roadcondition.RoadwayName,
            location: roadcondition.Location.replace(/`/g, ""),
            lanes: roadcondition.LanesAffected.toUpperCase() !== "NOT AVAILABLE" ? roadcondition.LanesAffected : ""
        }

        if (roadcondition.PlannedEndDate) {
            returnObj.end = format(parseISO(roadcondition.PlannedEndDate), "Pp")
        }

        return returnObj
    })

    // Then return everything in one big array
    return [...alertsData, ...incidentsData, ...roadworkData, ...roadconditionData]

}