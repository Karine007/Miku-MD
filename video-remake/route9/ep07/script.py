"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 7, "Starlight Motel".

Beat format: (scene, role, text, hold, overlay).
Roles: narrator, dani_live (in person), milo, boone_mega (megaphone), boone.
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "STARLIGHT MOTEL")
END_TEXT = "EPISODE 8 COMING SOON"

BEATS = [
    ("hide_truck", "narrator", "You kill the engine and the headlights. You roll the truck behind the ice machine.",
     1.2, ("time", "DAY 10 - 3:58 AM")),
    ("hide_truck", "narrator", "Then you wait. Engines on the highway. Getting closer.", 1.0, None),
    ("hide_truck", "narrator", "The ice machine hums. It's the only sound at the Starlight.", 1.0, None),
    ("shed_psst", "milo", "Psst. Gas station. Over here.", 1.0, None),
    ("shed_in", "dani_live", "Get in. Quiet.", 1.0, None),
    ("shed_in", "narrator", "Dani is seventeen. Milo is nine. They've been in this shed since the knock.", 1.2, None),
    ("dani_close", "dani_live", "When the man in the vest knocked, we went out the bathroom window. He didn't follow. "
                                "He just stood there.", 1.0, None),
    ("dani_close", "dani_live", "That recording isn't us. Not anymore. They made me say it, two nights ago.", 1.0, None),
    ("you_close", "narrator", "They?", 1.0, None),
    ("dani_close", "narrator", "Dani glances at the parking lot, like it might be listening.", 0.8, None),
    ("dani_close", "dani_live", "The Linemen. Utility crews. Hard hats, floodlights, big trucks.", 0.8, None),
    ("herding", "dani_live", "They use lights like a sheepdog. They move them. Whole crowds.", 1.4, None),
    ("milo_close", "milo", "They took Mrs. Alvarez. And the man from room four. They said they were going to the dam.",
     1.0, None),
    ("dam_map", "dani_live", "Harlan Dam. The lights there never go off.", 1.0, ("count", "20", "MILES TO HARLAN DAM")),
    ("shed_dark", "narrator", "A place that's always lit. In a world where light means death.", 1.4, None),
    ("floodlights", "narrator", "Then the floodlights reach the parking lot.", 0.8, None),
    ("floodlights", "narrator", "White light. Brighter than day. It slides across every door, one by one.", 1.2, None),
    ("slats", "narrator", "Light pours through the slats. You all lie flat.", 1.6, None),
    ("boone_out", "boone_mega", "Gas station! I know you're here. Your truck's still warm.", 1.0, None),
    ("boone_out", "boone_mega", "Nobody's getting hurt tonight. We've got food. Water. Walls. Come on out.", 1.2, None),
    ("shed_scared", "narrator", "Dani shakes her head. Milo is shaking all over.", 1.0, None),
    ("trucks_crowd", "narrator", "Through the slats you count the trucks. Four. And behind each one, a crowd of the "
                                 "dead, walking calmly in its light.", 1.4, None),
    ("boone_low", "boone", "I'm looking for somebody. Older guy. Runs the station on Route 9. Name's Ray.", 1.2, None),
    ("boone_close", "boone", "He's my dad.", 1.8, None),
    ("photo_match", "narrator", "The young man from the photo in Ray's locker. Older now. Same hard hat.", 2.6, None),
    ("end", None, "", 3.5, None),
]
