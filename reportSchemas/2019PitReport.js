module.exports = {
    name: "2019PitReport",
    title: "2019 Pit Scouting Report",
    matchBased: false,
    teamBased: true,

    fields: [
        {
            name: "team",
            description: "Team",
            placeholder: "Ex. Red Ties",
            type: "dropdown",
            hideScoutedTeams: true
        },
        {
            name: "tournament",
            description: "What tournament is this report for?",
            type: "text",
            tournamentAutoFill: true
        },
        {
            sectionTitle: "Robot Build"
        },
        {
            name: "robotSpeed",
            description: "Robot Speed",
            postfix: "m/s",
            type: "number"
        },
        {
            name: "driveTrain",
            description: "Drive Train",
            type: "dropdown",
            options: ["Unknown", "4 Wheel Tank", "6 Wheel Tank", "West Coast", "6 Wheel with 2 Omnis", "Swerve", "Mecanum", "Swervcanum", "Levitates", "Other (Please specify in additional comments)"]
        },
        {
            name: "sturdiness",
            description: "Sturdiness",
            type: "stars"
        },
        {
            name: "aesthetics",
            description: "Aesthetics",
            type: "stars"
        },
        {
            sectionTitle: "Robot Capabilities"
        },
        {
            name: "sandstormAbility",
            description: "Sandstorm Ability",
            type: "textarea"
        },
        {
            name: "canPickUpBalls",
            description: "Can Pick Up Cargo Balls From Ground",
            type: "yes/no"
        },
        {
            name: "canPickUpHatches",
            description: "Can Pick Up Hatch Panels From Ground",
            type: "yes/no"
        },
        {
            name: "canPlaceHatchesOnRocket",
            description: "Can Place Hatch Panels on Rocket",
            type: "yes/no"
        },
        {
            name: "canPlaceBallsInRocket",
            description: "Can Place Cargo Balls in Rocket",
            type: "yes/no"
        },
        {
            name: "rocketLevelReachable",
            description: "Highest Rocket Level Reachable",
            type: "dropdown",
            options: [
                "None",
                "Level 1",
                "Level 2",
                "Level 3"
            ]
        },
        {
            name: "canPlaceHatchesInCargoShip",
            description: "Can Place Hatch Panels in Cargo Ship",
            type: "yes/no"
        },
        {
            name: "canPlaceBallsInCargoShip",
            description: "Can Place Cargo Balls in Cargo Ship",
            type: "yes/no"
        },
        {
            sectionTitle: "Additional Information"
        },
        {
            name: "greatestStrength",
            description: "Robot's Greatest Strength",
            type: "text"
        },
        {
            name: "defenceStrategy",
            description: "Defence Strategy (If Any)",
            type: "text"
        },
        {
            name: "climbLevel",
            description: "Climb Level (If Any)",
            type: "dropdown",
            options: ["Can't Climb", "Level 1", "Level 2", "Level 3"]
        },
        {
            name: "canLiftOtherRobots",
            description: "Can Carry Other Robots (Please Elaborate in Aditonal Comments if Yes)",
            type: "yes/no"
        },
        {
            name: "additionalComments",
            description: "Additional comments about their robot, team, capabilities, attributes, etc.",
            type: "textarea"
        },
        {
            name: "robotPicture",
            description: "Please take a picture of the team's robot immediately after submitting this report",
            type: "yes/no"
        }
    ]
}
