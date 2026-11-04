"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 9, "Harlan Dam".

Beat format: (scene, role, text, hold, overlay).
Roles: narrator, radio (broadcast), mom (over the radio), boone, dani_live.
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "HARLAN DAM")
END_TEXT = "EPISODE 10 COMING SOON"

BEATS = [
    ("dam_top", "narrator", "Five twenty AM. Forty minutes to sunrise.", 1.8, ("time", "DAY 10 - 5:20 AM")),
    ("channel", "narrator", "Below the dam, the spillway channel fills. Thousands of them. Shoulder to shoulder. "
                            "Staring up at the lights.", 2.2, None),
    ("control_room", "narrator", "The control room still has power. And a radio that reaches farther than any CB.",
     1.2, None),
    ("dam_radio", "radio", "Pine Hollow shelter at Saint Agnes Church remains open. Survivors should keep all lights "
                           "off.", 1.0, None),
    ("you_lean", "narrator", "Pine Hollow. Not empty. A shelter. Right on the river.", 1.4, None),
    ("dam_radio", "mom", "This is Linda, at Saint Agnes. We have forty-one people here. We need water. Please. "
                         "Anybody.", 1.6, None),
    ("you_grip", "narrator", "You'd know that voice anywhere.", 2.4, None),
    ("tell_boone", "narrator", "You tell Boone. Forty-one people. Your mother. Twelve miles downstream.", 1.8, None),
    ("boone_tight", "boone", "If I don't open those gates, all of that walks back out of the channel. Toward every "
                             "town in this county.", 1.0, None),
    ("boone_tight", "boone", "Including Pine Hollow.", 1.6, None),
    ("you_lean", "narrator", "He's not wrong. That's the worst part.", 1.6, None),
    ("timer", "narrator", "The floodgates open on a timer. At sunrise. Boone set it himself.", 1.8,
     ("time", "SUNRISE 6:01 AM")),
    ("dani_door", "dani_live", "There's another way. You taught it to us. No lights, they lose interest.", 1.2, None),
    ("rule1", "narrator", "Rule one. The oldest rule you have.", 1.8, ("rule", "RULE 1:", "NO LIGHTS AFTER SUNSET")),
    ("dark_plan", "narrator", "Kill every light on the dam. Let them drift away in the dark. Back into the hills.",
     1.8, None),
    ("boone_tight", "boone", "Scattered is worse than drowned. You can't herd what you can't see.", 1.0, None),
    ("dani_door", "dani_live", "Not for the people downstream.", 1.8, None),
    ("ray_up", "narrator", "Down in the channel, one of them isn't looking at the lights. He's looking up at the "
                           "control room window.", 1.4, None),
    ("ray_zoom", "narrator", "Red vest. Cracked glasses.", 2.4, None),
    ("boone_glass", "boone", "Dad.", 2.4, None),
    ("countdown", None, "", 3.0, ("time", "0:40:00")),
    ("end", None, "", 3.5, None),
]

# per-beat volume tweaks (beat index: factor): Boone's whispered "Dad." needs lifting
LINE_GAIN = {19: 1.7}
