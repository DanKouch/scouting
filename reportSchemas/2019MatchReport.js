module.exports = {
    name: "2019MatchReport",
    title: "2019 Match Scouting Report",
    matchBased: true,

    fields: [
        {
            name: "matchNumber",
            description: "Match Number",
            postfix: "#",
            placeholder: "Ex. 5",
            type: "number",
            smartMatchSocket: true
        },
        {
            name: "team",
            description: "Team",
            placeholder: "Ex. Red Ties",
            type: "dropdown",
            smartTeamSocket: true
        },
        {
            name: "tournament",
            description: "What tournament is this report for?",
            type: "text",
            tournamentAutoFill: true
        },
        {
            sectionTitle: "Sandstorm"
        },
        {
            name: "sandstormMovement",
            description: "Sandstorm Movement",
            type: "dropdown",
            options: [
                "No Movement",
                "Drove Forward",
                "Successful Navigation",
                "Unknown"
            ]
        },
        {
            name: "sandstormHatches",
            description: "# of Hatches During Sandstorm",
            type: "number"
        }
        ,
        {
            name: "sandstormBalls",
            description: "# of Balls During Sandstorm",
            type: "number"
        },
        {
            sectionTitle: "Normal Gameplay"
        },
        {
            name: "cargoShipBalls",
            description: "# of Balls in Cargo Ship",
            type: "number"
        },
        {
            name: "cargoShipBallFails",
            description: "# of Failed Cargo Ship Ball Attempts",
            subdescription: "(i.e. Dropped ball on ground or backed up A SIGNIFICANT AMOUNT)",
            type: "number"
        },
        {
            name: "rocketHatches",
            description: "# of Hatches in Rocket Ship",
            type: "number"
        },
        {
            name: "rocketHatchFails",
            description: "# of Failed Rocket Ship Hatch Attempts",
            subdescription: "(i.e. Dropped hatch on ground or backed up A SIGNIFICANT AMOUNT)",
            type: "number"
        },
        {
            name: "rocketBalls",
            description: "# of Balls in Rocket Ship",
            type: "number"
        },
        {
            name: "rocketBallFails",
            description: "# of Failed Rocket Ship Ball Attempts",
            subdescription: "(i.e. Dropped ball on ground or backed up A SIGNIFICANT AMOUNT)",
            type: "number"
        },
        {
            name: "rocketLevelReached",
            description: "Highest Rocket Level Reached",
            type: "dropdown",
            options: [
                "Level 1",
                "Level 2",
                "Level 3"
            ]
        },
        {
            sectionTitle: "Defence"
        },
        {
            name: "defence",
            description: "Defence",
            type: "stars"
        },
        {
            name: "defenceComments",
            description: "Additional comments on defence (If Applicable)",
            type: "textarea"
        },
        {
            sectionTitle: "Climbing"
        },
        {
            name: "climbLevelAttempted",
            description: "Climb Level Attempted",
            type: "dropdown",
            options: [
                "HAB Level 1",
                "HAB Level 2",
                "HAB Level 3",
                "Unknown"
            ]
        },
        {
            name: "successfullyClimbed",
            description: "Successfully Climbed",
            type: "yes/no"
        },
        {
            sectionTitle: "Additional Comments"
        },
        {
            name: "additionalComments",
            description: "Do you have anything else to add?",
            placeholder: "Additional Comments",
            type: "textarea"
        }
    ]

}