"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 4, "Channel 19".

Beat format: (scene, role, text, hold, overlay). Roles: narrator, dani (CB radio filter).
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "CHANNEL 19")
END_TEXT = "EPISODE 5 COMING SOON"

BEATS = [
    ("alone", "narrator", "Day eight. It's quiet when you're the only one breathing.", 1.2, ("time", "DAY 8")),
    ("dead_phone", "narrator", "Your phone died two days ago. You still check it.", 1.0, None),
    ("locker", "narrator", "In Ray's locker. A spare vest. A photo of a young man in a hard hat. And a CB radio.",
     1.0, None),
    ("cb", "narrator", "Truckers use channel nineteen. Ray told you that on day one.", 0.8, ("time", "CH 19")),
    ("cb_knob", "narrator", "You keep the volume low. Rule one says no lights. It says nothing about sound.", 1.0, None),
    ("cb_mic", "narrator", "You press the button, and say the only thing you can think of. Is anyone out there?",
     1.4, None),
    ("cb_wait", "narrator", "Nothing. For an hour, nothing.", 2.8, None),
    ("cb_live", "dani", "Hello? Hello! Is somebody actually there?", 0.8, None),
    ("cb_live", "dani", "I'm Dani. I'm at the Starlight Motel, mile marker one-thirty. It's me and my little brother, "
                        "Milo.", 1.0, None),
    ("map", "narrator", "Three miles north. An hour on foot. Forever in the dark.", 1.0, ("count", "3", "MILES NORTH")),
    ("cb_live", "dani", "We have a car. No gas. Please tell me you have gas.", 1.0, None),
    ("pumps_dark", "narrator", "You're sitting on top of twelve thousand gallons of it.", 1.2, None),
    ("cb_live", "dani", "Dawn is safest. They go slow when it's cold. Meet us at dawn. Day after tomorrow.", 1.0, None),
    ("napkin", "narrator", "Rule five, you write on a napkin. Move only at dawn.", 1.0,
     ("rule", "RULE 5:", "MOVE ONLY AT DAWN")),
    ("sleep_cb", "narrator", "That night, you sleep with the radio on your chest. Channel nineteen, hissing softly.",
     1.6, None),
    ("draft", "narrator", "At four AM, a cold draft wakes you.", 1.2, ("time", "DAY 9 - 4:02 AM")),
    ("storeroom", "narrator", "It's coming from the storeroom. From behind the walk-in.", 1.2, None),
    ("dock_open", "narrator", "Walk-in coolers have two doors. You only ever locked one.", 1.6, None),
    ("cooler_empty", "narrator", "The cooler is empty. Ray's crossword sits on a crate. Folded. Like he's coming back "
                                 "to finish it.", 1.4, None),
    ("footprints", "narrator", "On the loading dock, footprints. Wet. Leading out across the lot.", 1.2, None),
    ("footprints_far", "narrator", "Heading north.", 0.8, None),
    ("footprints_far", "narrator", "Toward the Starlight Motel.", 2.4, None),
    ("end", None, "", 3.5, None),
]
