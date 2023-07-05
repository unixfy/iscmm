// Define a base class for all classes in the library
// This is a simple implementation of the classical inheritance pattern
export class BaseClass {
    constructor(item) {
        // OSM ID
        // integer
        this.id = item.id
        // Latitude and longitude
        // integer
        this.lat = item.lat
        this.lon = item.lon

        // Tags from OSM
        // object
        this.tags = item.tags
    }
}

export class FreewayExit extends BaseClass {
    constructor(item) {
        super(item);
        // Exit number (ref)
        // array
        this.ref = item.ref
        // Shield image for the freeway that this exit is on
        // array
        this.freeway_symbol = item.freeway_symbol
        // Freeway number that this exit is on (e.g. I-405)
        // array
        this.freeway_number = item.freeway_number
        // Freeway name that this exit is on (e.g. San Diego Freeway)
        // array
        this.freeway_name = item.freeway_name
        // Freeway direction that this exit is on (e.g. North)
        // string
        this.freeway_direction = item.freeway_direction
        // Exit's destination (e.g. Santa Monica Blvd)
        // array
        this.destination = item.destination
        // The freeway or other numbered road that this exit leads to (e.g. I-10 North)
        // array
        this.destination_ref = item.destination_ref
        // Shield image for the freeway that this exit leads to
        // array
        this.destination_symbol = item.destination_symbol

        // Tags from OSM for the motorway that this exit is on
        // object
        this.motorway_tags = item.motorway_tags || {}
        // Tags from OSM for the motorway link that this exit is on
        // object
        this.motorway_link_tags = item.motorway_link_tags || {}
    }

    motorway_link_available() {
        // If the node's motorway_link_tags object has at least one key, return true
        return Object.keys(this.motorway_link_tags).length > 0
    }

    motorway_available() {
        // If the node's motorway_tags object has at least one key, return true
        return Object.keys(this.motorway_tags).length > 0
    }


}

export class TransitStation extends BaseClass {
    constructor(item) {
        super(item);

        // Station name
        // string
        this.name = item.name
        // Station operator
        // string
        this.operator = item.operator
        // Network(s) that this station is part of
        // array
        this.network = item.network
        // Routes that serve this station
        // array
        this.routes = item.routes
    }
}