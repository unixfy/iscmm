import freewaySymbolMap from './freewaySymbolMap.json'

export default async function (fetch, overpassQuery, nodeType) {
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
    const data = await response.json()

    let nodes;

    if (nodeType === 'exits') {
        // Get an array of the nodes
        // We filter out all the nodes that don't have a "ref" tag
        nodes = data.elements.filter(element => element.type === 'node').filter(node => node.tags && node.tags.ref)

        // Get an array of the ways
        // We filter out all the non highway ways
        const ways = data.elements.filter(element => element.type === 'way').filter(way => way.tags && way.tags.highway)

        // Get an array of the relations
        const relations = data.elements.filter(element => element.type === 'relation').filter(relation => relation.tags && relation.tags.route)

        // Iterate through each "way" and find which "relations" it is a part of, based the relations' "members" array
        for (const way of ways) {
            const relationsContainingWay = relations.filter(relation => relation.members.some(member => member.type === 'way' && member.ref === way.id))
            // Extract the tags from each relationsContainingWay and put them in an array
            const tagsFromRelationsContainingWay = relationsContainingWay.map(relation => relation.tags)
            // If the way is part of a relation, add the relation's tags to the way's tags
            if (relationsContainingWay.length > 0) {
                way.tags = {...way.tags, relationTags: tagsFromRelationsContainingWay}
            }
        }

        // Iterate through each "node" and find which "ways" it is a part of, based on the ways' "nodes" array
        for (const node of nodes) {
            const waysContainingNode = ways.filter(way => way.nodes.includes(node.id))
            // If the node is part of a way, add the way's tags to the node
            // We will find that one of the ways has the tag "highway" = "motorway_link"
            // and the other has the tag "highway" = "motorway"
            // We will put the tags from the "motorway_link" way on the node, at tags.motorway_link
            // and the tags from the "motorway" way on the node, at tags.motorway
            if (waysContainingNode.length > 0) {
                node.tags = node.tags || {}
                for (const way of waysContainingNode) {
                    node.tags[way.tags.highway] = way.tags
                }

                // whether tags.motorway_link exists
                node.tags['motorway_link_available'] = 'motorway_link' in node.tags
                // whether tags.motorway exists
                node.tags['motorway_available'] = 'motorway' in node.tags

                // if motorway_link_available, grab the destination tag from the motorway_link
                if (node.tags['motorway_link_available'] && node.tags.motorway_link.destination) {
                    node.tags['destination'] = node.tags.motorway_link.destination.split(';').join(' / ')
                }

                // if motorway_link available, grab the destination:ref tag from the motorway_link
                if (node.tags['motorway_link_available'] && node.tags.motorway_link['destination:ref']) {
                    node.tags['destination:ref'] = node.tags.motorway_link['destination:ref'].split(';').join(' / ')
                    // also, if the pattern "I" with a space after it is found, replace it with "I-"
                    node.tags['destination:ref'] = node.tags['destination:ref'].replace(/I /g, 'I-')
                }

                // some ref tags have multiple values separated by semicolons
                // we replace the semicolons with slashes
                node.tags['ref'] = node.tags.ref.split(';').join(' / ')

                // if motorway_available, grab the ref and name tags from the motorway
                if (node.tags['motorway_available']) {
                    if (node.tags.motorway.ref) {
                        node.tags['fwy_number'] = node.tags.motorway.ref.split(' ').join('-').split(';').join(' / ')
                    }

                    if (node.tags.motorway.name) {
                        node.tags['fwy_name'] = node.tags.motorway.name.split(';').join(' / ')
                    }

                    // if the fwy_number is in freewaySymbolMap, add the symbol to the node
                    if (node.tags['fwy_number'] in freewaySymbolMap) {
                        node.tags['fwy_symbol'] = freewaySymbolMap[node.tags['fwy_number']]
                    }
                }

            }
        }
    } else {
        nodes = data.elements.filter(element => element.type === 'node')
    }

    return nodes;
}