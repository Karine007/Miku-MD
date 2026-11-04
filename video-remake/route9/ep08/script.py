"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 8, "The Linemen".

Beat format: (scene, role, text, hold, overlay). Roles: narrator, boone (direct, outdoor air).
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "THE LINEMEN")
END_TEXT = "EPISODE 9 COMING SOON"

BEATS = [
    ("step_out", "narrator", "You make Dani promise to stay hidden. Then you step out into the light.", 1.6,
     ("time", "DAY 10 - 4:10 AM")),
    ("boone_meet", "narrator", "Boone is younger than you expected. Tired eyes. A rifle he doesn't point.", 1.2, None),
    ("boone_talk", "boone", "Where's my father?", 1.4, None),
    ("tell_all", "narrator", "You tell him everything. The keys. The scratch. The walk-in. The two taps.", 2.0, None),
    ("boone_away", "boone", "Two taps. He did that when I was a kid. Your turn.", 1.6, None),
    ("boone_away", "narrator", "For a moment, nobody says anything. The floodlights hum.", 1.8, None),
    ("boone_talk", "boone", "Then he's out here. And if he's out here, he's coming to the dam with the rest of them.",
     1.0, None),
    ("you_ask", "narrator", "The rest of them?", 1.2, None),
    ("herd_wide", "boone", "Every one in the county. We walk them to Harlan Dam. Lights on the whole way. They follow "
                           "like it's church.", 1.2, None),
    ("spillway", "boone", "At sunrise, we open the floodgates. The spillway takes them all. Downriver. Gone.", 1.4, None),
    ("river_you", "narrator", "Downriver. You know that river. You grew up on it.", 1.2, None),
    ("river_map", "narrator", "Twelve miles downstream from Harlan Dam is Pine Hollow. Where your mom lives.", 1.6,
     ("count", "12", "MILES TO PINE HOLLOW")),
    ("boone_shrug", "boone", "Pine Hollow got evacuated on day one. It's empty. I checked the list myself.", 1.2, None),
    ("you_doubt", "narrator", "He believes it. You want to believe it.", 2.0, None),
    ("rule6", "narrator", "Rule six. Not every light is safe. Especially the ones that want you to follow.", 1.4,
     ("rule", "RULE 6:", "NOT EVERY LIGHT IS SAFE")),
    ("boone_offer", "boone", "Ride with me. Whatever's left of my dad, you're the last one who saw him.", 1.2, None),
    ("mirror_pickup", "narrator", "You take the seat. In the side mirror, your pickup follows, headlights off. Dani was "
                                  "never good at staying hidden.", 1.4, None),
    ("parade", "narrator", "All around the convoy, hundreds of them walk in the light. Calm. Like a parade.", 1.6, None),
    ("parade", "narrator", "The trucks crawl. The dead keep pace. Nobody honks. Nobody talks.", 1.4, None),
    ("red_vest", "narrator", "And somewhere in that parade, a red vest.", 2.2, None),
    ("dam_far", "narrator", "Harlan Dam rises out of the dark. Lit up like a stadium.", 3.2, ("time", "HARLAN DAM")),
    ("end", None, "", 3.5, None),
]
