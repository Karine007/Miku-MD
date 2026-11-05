"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 10 (finale), "Lights Out".

Beat format: (scene, role, text, hold, overlay).
Roles: narrator, boone, milo, mom (over the dam radio), mom_live (in person), radio (closing broadcast).
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "LIGHTS OUT")
END_TEXT = "THE END?"
END_SUB = "FOLLOW FOR SEASON 2"

BEATS = [
    ("countdown", "narrator", "Ten minutes to sunrise. Three choices. No good ones.", 1.6, ("time", "DAY 10 - 5:51 AM")),
    ("breaker_room", "narrator", "The dam has a breaker room. Bigger than Ray's. Same idea.", 1.4, None),
    ("boone_door", "boone", "Kill the lights, and I can't reach the gates in the dark. The timer still runs.", 1.2, None),
    ("you_think", "narrator", "So you need both. Lights off. Timer stopped.", 1.4, None),
    ("milo_radio", "milo", "Saint Agnes, this is Milo. Get everybody upstairs. Right now.", 1.0, None),
    ("milo_radio", "mom", "Who is this? Is my son with you?", 1.4, None),
    ("milo_look", "narrator", "Milo looks at you. You nod. He says yes.", 1.6, None),
    ("lever", "narrator", "Rule one.", 1.4, ("rule", "RULE 1:", "NO LIGHTS AFTER SUNSET")),
    ("lights_out", "narrator", "You pull it. Harlan Dam goes dark for the first time in ten days.", 2.2, None),
    ("drift", "narrator", "In the channel, thousands of heads tilt. Then, slowly, they start to drift apart.", 2.0, None),
    ("code", "boone", "Zero nine one one. My dad's birthday.", 1.2, None),
    ("frozen_timer", "narrator", "The timer stops with forty-two seconds left. Sunrise comes anyway. Cold, and grey, "
                                 "and quiet.", 1.8, ("time", "0:00:42")),
    ("stairs", "narrator", "One of them doesn't drift away. He climbs the maintenance stairs. Slowly. Toward you and "
                           "Boone.", 1.4, None),
    ("ray_glass", "narrator", "He stops at the glass door. Red vest. Cracked glasses. Tap. Tap.", 1.8, None),
    ("boone_glass", "boone", "Your turn, Dad.", 1.8, None),
    ("ray_leaves", "narrator", "Boone taps back twice. Ray turns around, and walks into the hills with the others. He "
                               "doesn't look back.", 2.2, None),
    ("church", "narrator", "Pine Hollow. Saint Agnes Church. Forty-one people on the steps.", 1.4,
     ("time", "PINE HOLLOW - 7:30 AM")),
    ("mom_steps", "mom_live", "You came. I told you to stay home!", 1.2, None),
    ("hug", "narrator", "You did stay home, eventually. It just took ten days.", 1.8, None),
    ("chalkboard", "narrator", "Rule seven. You write it on the church chalkboard, under the other six. Some of them "
                               "remember.", 2.0, None),
    ("hills_night", "radio", "This is an emergency broadcast for all counties. Stay indoors. Repeat. All counties.",
     2.4, None),
    ("end", None, "", 4.0, None),
]

# manual cut fixes: in batch narrator_0, move the cuts after lines 9, 10 and 11 to later pauses
# (the long pauses in "Tap. Tap." threw the syllable-based cutter off by one phrase)
CUT_SHIFT = {"narrator_0": {9: 2, 10: 1, 11: 1}}

# per-beat volume tweaks: lift Boone's quieter lines ("Kill the lights..." and the whispered code)
LINE_GAIN = {2: 1.45, 10: 1.7}
