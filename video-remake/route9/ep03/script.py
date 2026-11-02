"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 3, "There Is No Shutter".

Beat format: (scene, role, text, hold, overlay). Roles: narrator, ray.
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "THERE IS NO SHUTTER")
END_TEXT = "EPISODE 4 COMING SOON"

BEATS = [
    ("ray_dark", "narrator", "There is no shutter. And Ray knows you know.", 1.0, ("time", "DAY 4 - 3:24 AM")),
    ("confess", "ray", "Day two. You were asleep. I went out for the pickup's keys. The driver was still in the cab.",
     0.8, None),
    ("keys", "narrator", "He opens his hand. A set of truck keys.", 1.0, None),
    ("confess", "ray", "It's slow. I can feel it. Cold. Like the inside of that cooler.", 0.8, None),
    ("confess", "narrator", "You should be scared of him. You're not. Not yet.", 1.0, None),
    ("ticket4", "narrator", "Ray makes a new rule. Rule four. If you're scratched, you say so.", 1.0,
     ("rule", "RULE 4:", "IF SCRATCHED, SAY SO")),
    ("promise", "ray", "When I start forgetting your name, you lock me in the walk-in. Promise me.", 0.8, None),
    ("promise", "narrator", "You promise. You don't mean it.", 1.2, None),
    ("cards", "narrator", "Day five. Ray still plays cards. He lets you win. His hands shake when he deals.", 0.6,
     ("time", "DAY 5")),
    ("cards_tap", "narrator", "Tap, tap. Your turn.", 1.2, None),
    ("stare", "narrator", "Twice, you catch him staring at the window. Like the dark outside is saying his name.",
     1.2, None),
    ("danny", "ray", "Hey. Danny. Your turn.", 1.0, ("time", "DAY 6")),
    ("you_frozen", "narrator", "Your name isn't Danny.", 1.4, None),
    ("hands_look", "ray", "Walk-in. Now. While I can still walk there myself.", 0.8, None),
    ("into_cooler", "narrator", "He walks into the cooler on his own. You close the door. He doesn't fight it.",
     1.0, None),
    ("door_closed", "ray", "Keys are yours. Pickup's got half a tank. Don't come back for me.", 1.0, None),
    ("guard", "narrator", "You slide the bolt. Then you sit with your back against the door, like a guard.", 1.0, None),
    ("guard", "narrator", "Through the steel, Ray hums. Old songs. Then fewer words. Then just humming.", 1.4, None),
    ("fridge", "narrator", "Fourteen bottles left. Half of rule two was for Ray.", 1.0, ("count", "14", "BOTTLES LEFT")),
    ("guard_night", "narrator", "On the seventh night, the humming stops.", 2.0, ("time", "DAY 7")),
    ("taps", "narrator", "Then two soft taps on the door. Tap, tap.", 1.4, None),
    ("bolt", "narrator", "Your turn.", 1.0, None),
    ("bolt", "narrator", "You don't open it. You keep your promise.", 2.2, None),
    ("end", None, "", 3.5, None),
]
