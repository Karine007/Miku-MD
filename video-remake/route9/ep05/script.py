"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 5, "Two Taps".

Beat format: (scene, role, text, hold, overlay). Roles: narrator, dani (CB radio filter).
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "TWO TAPS")
END_TEXT = "EPISODE 6 COMING SOON"

BEATS = [
    ("dock_dark", "narrator", "Ray is out there now. Somewhere between you and the motel.", 1.2,
     ("time", "DAY 9 - 4:40 AM")),
    ("shove", "narrator", "You shove a shelf against the loading dock door. It takes everything you have.", 1.0, None),
    ("math", "narrator", "Then you do the math. Nine bottles. Sixty-one snacks. One pickup with half a tank.", 1.0,
     ("count", "9", "BOTTLES LEFT")),
    ("keys_pocket", "narrator", "The truck keys are in your pocket. They feel heavier than they should.", 1.0, None),
    ("cb_live", "dani", "Hey, gas station. Still with me? Milo wants to know your name.", 0.8, None),
    ("cb_mic", "narrator", "You tell her. Milo says it's a good name.", 1.0, None),
    ("cb_live", "dani", "Tomorrow at dawn. We'll watch for your headlights.", 0.8, None),
    ("pickup_lot", "narrator", "Headlights. Rule one just got a lot harder.", 1.4, None),
    ("timelapse", "narrator", "The day goes too fast. Night falls on the lot.", 1.4, ("time", "DAY 9 - 9:02 PM")),
    ("lot_thin", "narrator", "The crowd outside has thinned. Most of them wandered off toward the highway.", 1.0, None),
    ("lot_ray", "narrator", "Not all of them. One stands by pump four. Red vest. Glasses.", 1.2, None),
    ("ray_watch", "narrator", "Ray. Not swaying like the others. Watching.", 1.4, None),
    ("crouch", "narrator", "You get low. You hold your breath. Every rule at once.", 1.2, None),
    ("glass_ray", "narrator", "He walks to the window. Right where you played cards on day one.", 1.0, None),
    ("knuckle", "narrator", "Tap. Tap.", 1.4, None),
    ("eyes_shut", "narrator", "Your turn.", 1.2, None),
    ("eyes_shut", "narrator", "You don't move. You don't breathe.", 1.4, None),
    ("ray_leaves", "narrator", "He stands there for an hour. Then he walks away. North. Toward the motel.", 1.4, None),
    ("cb_live", "dani", "Hey. There's someone in our parking lot. He's wearing a red vest.", 0.8,
     ("time", "DAY 10 - 2:58 AM")),
    ("map", "narrator", "Three miles in one night. He's faster than the others.", 1.0, None),
    ("cb_live", "dani", "He's just standing at our door. He looks hurt. Should we let him in?", 1.0, None),
    ("grip_mic", "narrator", "You press the button so hard it hurts. Don't open the door. Whatever he does. "
                             "Don't open the door.", 1.6, None),
    ("cb_live", "dani", "He knocked. Twice.", 1.8, None),
    ("grab_keys", "narrator", "Dawn is three hours away. You can't wait for dawn.", 2.4, ("time", "3:12 AM")),
    ("end", None, "", 3.5, None),
]
