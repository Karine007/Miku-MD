"""
ZOMBIE OUTBREAK: STRANDED AT A GAS STATION - original episode script.

Each beat: (scene, role, text, hold, overlay)
  scene   - scene function name in render.py
  role    - "narrator" | "radio" | None (no speech, just `hold` seconds)
  text    - spoken line
  hold    - extra seconds after the line
  overlay - optional label: ("time", "11:48 PM") | ("rule", "RULE 1:", "NO LIGHTS AFTER SUNSET")
            | ("count", "214", "SNACKS")
"""

TITLE = ("ZOMBIE", " OUTBREAK:", "STRANDED AT A GAS STATION")

BEATS = [
    ("highway", "narrator", "Eleven forty-eight PM. The last gas station for sixty miles.", 0.4, ("time", "11:48 PM")),
    ("highway", "narrator", "You only stopped for coffee.", 0.5, None),
    ("store", "narrator", "The clerk's name tag says Ray. He hasn't looked up from his crossword in ten minutes.", 0.4, None),
    ("coffee", "narrator", "The coffee machine takes three tries.", 0.6, None),
    ("radio", "radio", "This is an emergency broadcast for Harlan County. Stay indoors. Avoid contact with anyone "
                       "who appears confused or injured. Repeat. Stay indoors.", 0.4, None),
    ("store_shrug", "narrator", "Ray turns the radio off. \"Probably another drill,\" he says.", 0.5, None),
    ("window", "narrator", "Then a pickup rolls in. Nobody gets out. The driver's door just hangs open.", 0.5, None),
    ("pump_zombie", "narrator", "Someone is standing at pump four. Swaying. Staring up at the lights.", 0.6, None),
    ("horde", "narrator", "Behind him, on the highway, more shapes. Dozens. All walking toward the only lights for "
                          "sixty miles.", 0.6, None),
    ("switch", "narrator", "Ray moves faster than you'd think. He kills the canopy lights.", 0.3, None),
    ("highway_dark", "narrator", "The whole lot goes black.", 0.8, None),
    ("glass", "narrator", "Something thumps against the glass. Then it stops. In the dark, they lose interest.", 0.6, None),
    ("store_dark", "narrator", "Rule one. No lights after sunset. Not even your phone screen.", 0.8,
     ("rule", "RULE 1:", "NO LIGHTS AFTER SUNSET")),
    ("aisle", "narrator", "You take inventory.", 0.2, None),
    ("aisle", "narrator", "Two hundred fourteen snacks.", 0.3, ("count", "214", "SNACKS")),
    ("fridge", "narrator", "Forty bottles of water.", 0.3, ("count", "40", "BOTTLES OF WATER")),
    ("roller", "narrator", "And one hot dog roller that never turns off.", 0.5, ("count", "1", "HOT DOG ROLLER")),
    ("ticket", "narrator", "Rule two. Two bottles a day. Each. Ray writes it on the back of a lottery ticket.", 0.7,
     ("rule", "RULE 2:", "TWO BOTTLES A DAY")),
    ("day1", "narrator", "Day one. Chips for breakfast. Ray teaches you a card game he's clearly making up as he goes.",
     0.6, ("time", "DAY 1")),
    ("phone", "narrator", "Your phone finds one bar. One message gets through. Then the bar is gone.", 0.7, None),
    ("store_dark", "narrator", "Rule three. Someone stays awake. Always.", 0.8,
     ("rule", "RULE 3:", "SOMEONE STAYS AWAKE")),
    ("night", "narrator", "Day four. Three twenty-one AM. You wake up on your cardboard bed.", 0.4,
     ("time", "DAY 4 - 3:21 AM")),
    ("night_empty", "narrator", "Ray's blanket is empty.", 0.8, None),
    ("cooler", "narrator", "The walk-in cooler door is open a crack. It's never open.", 0.8, None),
    ("ray_back", "narrator", "Ray steps out, smiling. He says he was counting water.", 0.5, None),
    ("sleeve", "narrator", "His sleeve is wet. And red.", 0.9, None),
    ("ray_dark", "narrator", "\"Just a scratch,\" he says. \"From the shutter.\"", 0.5, None),
    ("ray_dark2", "narrator", "There is no shutter.", 1.6, None),
    ("end", None, "", 3.5, None),
]
