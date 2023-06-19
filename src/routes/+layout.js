async function fetchExits(fetch) {
    // Overpass QL query to get all exits within our bounding box
    const exitsOverpassQuery = '[out:json][bbox:33.420838,-118.655301,34.342304,-117.117057];(node["highway"="motorway_junction"]["ref"];way(bn););out body;'

    // Fetch the data from Overpass API
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(exitsOverpassQuery)}`)
    const data = await response.json()

    // Get an array of the nodes
    // We filter out all the nodes that don't have a "ref" tag
    const nodes = data.elements.filter(element => element.type === 'node').filter(node => node.tags && node.tags.ref)
    // Get an array of the ways
    // We filter out all the non highway ways
    const ways = data.elements.filter(element => element.type === 'way').filter(way => way.tags && way.tags.highway)

    // Iterate through each node and find which ways it is a part of, based on the ways' "nodes" array
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

            // if motorway_available, grab the ref and name tags from the motorway
            if (node.tags['motorway_available']) {
                if (node.tags.motorway.ref) {
                    node.tags['fwy_number'] = node.tags.motorway.ref.split(' ').join('-').split(';').join(' / ')
                }

                if (node.tags.motorway.name) {
                    node.tags['fwy_name'] = node.tags.motorway.name.split(';').join(' / ')
                }
            }
        }
    }

    return nodes;
}

export async function load({fetch}) {


    return {
        streamed: {
            exits: fetchExits(fetch)
        }
    }
}