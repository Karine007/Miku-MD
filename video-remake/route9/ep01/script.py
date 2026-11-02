"""
ZOMBIE OUTBREAK: ROUTE 9 - Episode 1, "Last Exit" (prequel to the gas station episode).

Beat format as in ../../gas_station/script.py:
  (scene, role, text, hold, overlay)
Roles: narrator, mom (voicemail, phone filter), radio (car radio broadcast).
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "THE LAST EXIT ON ROUTE 9")
END_TEXT = "EPISODE 2 COMING SOON"

BEATS = [
    ("garage", "narrator", "Nine fifteen PM. Your shift ran two hours late. Again.", 0.4, ("time", "9:15 PM")),
    ("missed_call", "narrator", "One missed call. Mom. She never calls after eight.", 0.4, None),
    ("voicemail", "mom", "Hi, sweetheart. It's probably nothing. The news says stay home tonight. "
                         "Call me when you see this, okay?", 1.0, None),
    ("call_failed", "narrator", "You call back. Straight to voicemail.", 0.5, None),
    ("onramp", "narrator", "Pine Hollow is two hundred miles north. You decide to drive.", 1.2, None),
    ("traffic", "narrator", "Route 9 is never busy on a Tuesday.", 0.2, None),
    ("traffic", "narrator", "Tonight, every car is going the other way.", 1.2, None),
    ("car_radio", "radio", "Reports of violent incidents across Harlan County. Drivers should avoid Route 9 "
                           "north of mile marker one-twenty.", 0.5, None),
    ("mile_marker", "narrator", "You pass mile marker one-eighteen.", 0.4, None),
    ("trooper", "narrator", "A state trooper's car sits across the shoulder. Lights on. Door open. Nobody inside.",
     1.2, None),
    ("man_road", "narrator", "Then there's a man in the road.", 0.4, None),
    ("brake", "narrator", "You brake hard. He doesn't move.", 1.0, None),
    ("man_turns", "narrator", "He turns around. Slowly. Like he's hearing a song only he can hear.", 0.5, None),
    ("man_walks", "narrator", "He walks straight into your headlights. And from the trees, two more step out.",
     0.4, None),
    ("swerve", "narrator", "You don't think. You swerve around them and floor it.", 1.2, None),
    ("mirror", "narrator", "In the mirror, they keep walking after your taillights. Long after they should have "
                           "stopped.", 0.8, None),
    ("hands", "narrator", "Your hands won't stop shaking. You turn the radio off. The silence is worse.", 1.0, None),
    ("fuel", "narrator", "Then a soft chime. The fuel light. Twelve miles left in the tank.", 0.5,
     ("count", "12", "MILES LEFT")),
    ("battery", "narrator", "No service. Thirty-one percent battery.", 0.4, None),
    ("battery", "narrator", "You type a message to Mom anyway. On my way. You hold the phone up, like that will help "
                            "it send.", 0.8, None),
    ("last_sign", "narrator", "A green sign. Last services for sixty miles.", 0.5, None),
    ("ramp", "narrator", "The exit ramp is dark. No streetlights. Just your headlights, and the trees leaning in.",
     0.8, None),
    ("station_far", "narrator", "One gas station. Lit up like a lighthouse.", 1.2, None),
    ("highway", "narrator", "Eleven forty-eight. You'll just get gas. And maybe coffee.", 0.6, ("time", "11:48 PM")),
    ("pickup_behind", "narrator", "You don't notice the pickup truck half a mile behind you.", 0.5, None),
    ("pickup_behind", "narrator", "Its headlights are off.", 2.0, None),
    ("end", None, "", 3.5, None),
]
