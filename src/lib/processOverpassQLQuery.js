import freewaySymbolMap from './freewaySymbolMap.json'
import {FreewayExit, TransitStation} from "$lib/classes.js";

export default async function (fetch, overpassQuery, nodeType) {
    // Call the Overpass API
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
    const data = await response.json()

    let nodes = [];

    if (nodeType === 'exits') {
        // Get an array of the nodes
        // We filter out all the nodes that don't have a "ref" tag
        const nodesRaw = data.elements.filter(element => element.type === 'node').filter(node => node.tags && node.tags.ref)

        // Get an array of the ways
        // We filter out all the non highway ways
        const waysRaw = data.elements.filter(element => element.type === 'way').filter(way => way.tags && way.tags.highway)

        // Get an array of the relations
        // We filter out all the non route relations
        const relationsRaw = data.elements.filter(element => element.type === 'relation').filter(relation => relation.tags && relation.tags.route)

        // Iterate through each "way" and find which "relations" it is a part of, based the relations' "members" array
        for (const way of waysRaw) {
            const relationsContainingWay = relationsRaw.filter(relation => relation.members.some(member => member.type === 'way' && member.ref === way.id))
            // Extract the tags from each relationsContainingWay and put them in an array
            const tagsFromRelationsContainingWay = relationsContainingWay.map(relation => relation.tags)
            // If the way is part of a relation, add the relation's tags to the way's tags
            if (relationsContainingWay.length > 0) {
                way.tags = {...way.tags, relation_tags: tagsFromRelationsContainingWay}
            }
        }

        for (const node of nodesRaw) {
            // Extract the ways that contain this node
            const waysContainingNode = waysRaw.filter(way => way.nodes.includes(node.id))

            let workingNode = new FreewayExit({
                id: node.id,
                lat: node.lat,
                lon: node.lon,
                ref: node.tags.ref.split(';'),
                tags: node.tags || {}
            })

            // If the node is part of at least one way...
            if (waysContainingNode.length > 0) {
                // Iterate over each way that contains this node
                for (const way of waysContainingNode) {
                    // If the way has a tag highway = motorway, add the way's tags to the node's motorway_tags
                    if (way.tags.highway === 'motorway') {
                        workingNode.motorway_tags = way.tags
                    }

                    // If the way has a tag highway = motorway_link, add the way's tags to the node's motorway_link_tags
                    if (way.tags.highway === 'motorway_link') {
                        workingNode.motorway_link_tags = way.tags
                    }
                }

                if (workingNode.motorway_link_available()) {
                    // Handle the node's "Destination"
                    // if motorway_link_available, grab the destination tag from the motorway_link
                    if (workingNode.motorway_link_tags.destination) {
                        workingNode.destination = workingNode.motorway_link_tags.destination.split(';')
                    } else if (workingNode.motorway_link_tags["destination:street"]) {
                        workingNode.destination = workingNode.motorway_link_tags["destination:street"].split(';')
                    }

                    // Handle the node's "Destination_ref"
                    // if motorway_link available, grab the destination:ref tag from the motorway_link
                    if (workingNode.motorway_link_tags['destination:ref']) {
                        // also, if the pattern "I" with a space after it is found, replace it with "I-"
                        workingNode.destination_ref = workingNode.motorway_link_tags['destination:ref'].replace(/I /g, 'I-').split(';')

                        // Handle the node's "Destination_symbol"
                        // for each destination_ref, check if it's in the freewaySymbolMap, and if so, add the symbol to the node
                        if (workingNode.destination_ref) {
                            workingNode.destination_symbol = workingNode.destination_ref.map(number => {
                                if (number in freewaySymbolMap) {
                                    return freewaySymbolMap[number]
                                }
                            }).filter(Boolean)
                        }
                    }
                }

                if (workingNode.motorway_available()) {
                    // Handle the node's "Freeway_number"
                    if (workingNode.motorway_tags.ref) {
                        workingNode.freeway_number = workingNode.motorway_tags.ref.replace(/I /g, 'I-').split(';')
                    }

                    // Handle the node's "Freeway_name"
                    if (workingNode.motorway_tags.name) {
                        workingNode.freeway_name = workingNode.motorway_tags.name.split(';')
                    }

                    // Handle the node's "Freeway_symbol"
                    // for each freeway_number, check if it's in the freewaySymbolMap, and if so, add the symbol to the node
                    if (workingNode.freeway_number) {
                        workingNode.freeway_symbol = workingNode.freeway_number.map(number => {
                            if (number in freewaySymbolMap) {
                                return freewaySymbolMap[number]
                            }
                        }).filter(Boolean)
                    }

                    // Handle the node's "Freeway_direction"
                    if (workingNode.motorway_tags.relation_tags && workingNode.motorway_tags.relation_tags[0].direction) {
                        workingNode.freeway_direction = workingNode.motorway_tags.relation_tags[0].direction
                    }
                }

            }

            nodes.push(workingNode)
        }
    } else if (nodeType === 'transit') {
        // Get all the nodes (only those that have tags)
        // Drop nodes that don't have an "operator" or "network" tag
        const nodesRaw = data.elements
            .filter(element => element.type === 'node')
            .filter(node => node.tags && (node.tags.operator || node.tags.network))

        // Get an array of the routes
        // Node that we need to filter for relations with a tag "type" = "route' on our end due to bugginess in Overpass API
        const routesRaw = data.elements
            .filter(element => element.type === 'relation')
            .filter(relation => relation.tags && relation.tags.type === "route")

        // Iterate through each node and add the tags from all the relations returned in the query
        // We don't check that relations contain the "node" because it's not guaranteed in this case
        for (const node of nodesRaw) {
            // Iterate through routes, merging them by their "ref" tag
            const deduplicatedRoutes = Object.values(routesRaw
                .filter(route => route.tags.to)
                .reduce((acc, route) => {
                    if (!acc[route.tags.ref]) {
                        acc[route.tags.ref] = {
                            destinations: [
                                {
                                    to: route.tags.to,
                                    from: route.tags.from,
                                    // Add the "via" tag if it exists on the route
                                    ...(route.tags.via ? {via: route.tags.via} : {})
                                }
                            ],

                            // We're just going to grab a few tags
                            ref: route.tags.ref,
                            operator: route.tags.operator,
                            network: route.tags.network,
                            colour: route.tags.colour,
                            wikipedia: route.tags.wikipedia,

                            // And drop the rest raw
                            tags: route.tags || {},
                        }
                    } else {
                        // Only add destination pair if it doesn't already exist
                        if (!acc[route.tags.ref].destinations.includes({
                            to: route.tags.to,
                            from: route.tags.from,
                            ...(route.tags.via ? {via: route.tags.via} : {})
                        })) {
                            acc[route.tags.ref].destinations.push({
                                to: route.tags.to,
                                from: route.tags.from,
                                ...(route.tags.via ? {via: route.tags.via} : {})
                            })
                        }
                    }

                    return acc
                }, {}))

            let workingNode = new TransitStation({
                id: node.id,
                lat: node.lat,
                lon: node.lon,
                operator: node.tags.operator,
                name: node.tags.name,
                routes: deduplicatedRoutes || [],
                tags: node.tags || {},
            })

            if (node.tags.network) {
                workingNode.network = node.tags.network.split(';')
            }

            nodes.push(workingNode)
        }
    } else {
        nodes = data.elements.filter(element => element.type === 'node')
    }

    // Eliminate the need to keep accessing [0] index if there's just one node
    if (nodes.length === 1) {
        return nodes[0]
    }

    return nodes;
}